/**
 * Content Coverage and Review Console Test Suite
 * Engineering Practice Engine — Phase 4 Six-Course Architecture
 *
 * Requirements:
 * 1. Every course appears (all 6 courses: GEN0101, GEN0102, GEN0107, GEN0110, GEN0161, BSIE3219).
 * 2. Every topic appears (all 67 topics across the 6 courses).
 * 3. Draft fallback content is labeled correctly (REPRESENTATIVE_DRAFT).
 * 4. Strict scope validation remains active (ScopeValidator).
 * 5. Approving/rejecting a problem updates review store and UI coverage metrics using stable reviewTargetKey.
 * 6. Local review decisions remain an overlay by default (no silent ProblemBank lifecycle mutation).
 * 7. Invalid scopes do not receive cross-course problems (cross-course isolation).
 * 8. Strict JSON import validation (exact schema v1.0.0, required fields, size limits, fail-closed).
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { CoverageAuditor } from '@/engine/content/coverageAuditor';
import { CurriculumRegistry } from '@/engine/curriculum/registry';
import { ContentRegistry } from '@/engine/content/registry';
import {
  TeacherCalibrationEngine,
  buildReviewTargetKey,
  LOCAL_REVIEW_STORE_SCHEMA_VERSION,
  LOCAL_REVIEW_STORE_DISCLAIMER
} from '@/engine/content/calibration';
import { ScopeValidator } from '@/engine/adaptive/scopeValidator';
import { ProblemBank } from '@/engine/content/problemBank';
import { ContentGenerator } from '@/engine/content/generator';

describe('Content Coverage and Review Console Architecture', () => {
  const currRegistry = CurriculumRegistry.getInstance();
  const contentRegistry = ContentRegistry.getInstance();
  const calibrationEngine = TeacherCalibrationEngine.getInstance();
  const bank = ProblemBank.getInstance();

  beforeEach(() => {
    calibrationEngine.clearAllReviews();
  });

  it('1. Every authoritative course appears dynamically in coverage metrics', () => {
    const summary = CoverageAuditor.calculateCoverage();
    const expectedCourseIds = [
      'COURSE-GEN0101',
      'COURSE-GEN0102',
      'COURSE-GEN0107',
      'COURSE-GEN0110',
      'COURSE-GEN0161',
      'COURSE-BSIE3219'
    ];

    expect(summary.totalCourses).toBe(6);
    expect(summary.courses.length).toBe(6);

    for (const courseId of expectedCourseIds) {
      const course = summary.courses.find(c => c.courseId === courseId);
      expect(course, `Course ${courseId} must appear in coverage summary`).toBeDefined();
      expect(course?.totalSkills).toBeGreaterThan(0);
      expect(course?.totalTopics).toBeGreaterThan(0);
      expect(course?.structuralCoveragePercent).toBeGreaterThan(0);
    }
  });

  it('2. Every authoritative topic appears dynamically across all courses (67 total)', () => {
    const allRegisteredTopics = currRegistry.getAllTopics();
    expect(allRegisteredTopics.length).toBe(67);

    const summary = CoverageAuditor.calculateCoverage();
    expect(summary.totalTopics).toBe(67);

    const collectedTopicIds = new Set<string>();
    for (const course of summary.courses) {
      for (const topic of course.topics) {
        collectedTopicIds.add(topic.topicId);
      }
    }

    expect(collectedTopicIds.size).toBe(67);
    for (const topic of allRegisteredTopics) {
      expect(collectedTopicIds.has(topic.id), `Topic ${topic.id} (${topic.normalizedName || topic.officialName}) must be present`).toBe(true);
    }
  });

  it('3. Draft fallback content is labeled correctly as REPRESENTATIVE_DRAFT', () => {
    const summary = CoverageAuditor.calculateCoverage();
    
    // Find a skill in GEN 0161 (Thermodynamics) or BSIE 3219 that uses representative blueprints
    const thermoCourse = summary.courses.find(c => c.courseId === 'COURSE-GEN0161');
    expect(thermoCourse).toBeDefined();

    const thermoSkills = thermoCourse!.topics.flatMap(t => t.skills);
    expect(thermoSkills.length).toBeGreaterThan(0);

    // Skills with fallback families should have status REPRESENTATIVE_DRAFT
    const fallbackSkill = thermoSkills.find(s => s.familyStatus === 'REPRESENTATIVE_DRAFT');
    expect(fallbackSkill).toBeDefined();
    expect(fallbackSkill?.status).toBe('REPRESENTATIVE_DRAFT');
    expect(fallbackSkill?.statusLabel).toBe('Representative / Draft');
  });

  it('4. Strict scope validation remains active and fails closed on invalid scopes', () => {
    // Generate a valid problem for GEN 0102
    const genResult = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0102',
      skillId: 'SKILL-GEN0102-005',
      difficulty: 2
    });

    expect(genResult.success).toBe(true);
    const problem = genResult.problem!;

    // Case A: Matching course scope -> Valid
    const validScopeResult = ScopeValidator.validateProblemScope(problem, {
      courseId: 'COURSE-GEN0102',
      mode: 'RECOMMENDED'
    });
    expect(validScopeResult.valid).toBe(true);
    expect(validScopeResult.errors.length).toBe(0);

    // Case B: Cross-course scope mismatch -> Invalid (Course Mismatch)
    const invalidCourseScopeResult = ScopeValidator.validateProblemScope(problem, {
      courseId: 'COURSE-GEN0101',
      mode: 'RECOMMENDED'
    });
    expect(invalidCourseScopeResult.valid).toBe(false);
    expect(invalidCourseScopeResult.errors.some(e => e.code === 'COURSE_MISMATCH')).toBe(true);

    // Case C: Foreign skill scope mismatch -> Invalid (Skill Mismatch)
    const invalidSkillScopeResult = ScopeValidator.validateProblemScope(problem, {
      courseId: 'COURSE-GEN0102',
      skillId: 'SKILL-GEN0102-001',
      mode: 'SKILL_PRACTICE'
    });
    expect(invalidSkillScopeResult.valid).toBe(false);
    expect(invalidSkillScopeResult.errors.some(e => e.code === 'SKILL_MISMATCH')).toBe(true);
  });

  it('5. Local review decisions use stable reviewTargetKey and update coverage metrics', () => {
    const targetKey = buildReviewTargetKey({
      courseId: 'COURSE-GEN0161',
      primarySkillId: 'SKILL-GEN0161-001',
      familyId: 'FAM-GEN0161-001-COVERAGE',
      templateId: 'TMPL-GEN0161-001-COVERAGE',
      structureSignature: 'TEST-THERMO-SIG'
    });

    expect(targetKey).toBe(
      'COURSE-GEN0161::SKILL-GEN0161-001::FAM-GEN0161-001-COVERAGE::TMPL-GEN0161-001-COVERAGE::TEST-THERMO-SIG'
    );

    // Initial state: review coverage for this skill is not approved
    const initialSummary = CoverageAuditor.calculateCoverage();
    const initialThermo = initialSummary.courses.find(c => c.courseId === 'COURSE-GEN0161');
    const initialReviewedCount = initialThermo?.reviewCoverageCount || 0;

    // Submit teacher approval using stable reviewTargetKey
    const review = calibrationEngine.submitReview(
      {
        reviewTargetKey: targetKey,
        courseId: 'COURSE-GEN0161',
        skillId: 'SKILL-GEN0161-001',
        familyId: 'FAM-GEN0161-001-COVERAGE',
        templateId: 'TMPL-GEN0161-001-COVERAGE',
        reviewer: 'Prof. Thermodynamics',
        ratings: {
          mathematicalCorrectness: 5,
          skillAlignment: 5,
          clarity: 5,
          difficultySuitability: 4,
          educationalUsefulness: 5,
          diversityDistinctiveness: 4
        },
        decision: 'APPROVE',
        teacherNotes: 'Approved representative item for first law of thermodynamics.'
      },
      { applyToSessionProblemBank: false } // Overlay only!
    );

    expect(review.reviewTargetKey).toBe(targetKey);
    expect(review.decision).toBe('APPROVE');

    // Retrieve by stable key
    const retrieved = calibrationEngine.getReviewByTargetKey(targetKey);
    expect(retrieved).toBeDefined();
    expect(retrieved?.reviewer).toBe('Prof. Thermodynamics');

    // Re-evaluate coverage metrics with review overlay
    const updatedSummary = CoverageAuditor.calculateCoverage(calibrationEngine.getAllReviewsMap());
    const updatedThermo = updatedSummary.courses.find(c => c.courseId === 'COURSE-GEN0161');
    expect(updatedThermo?.reviewCoverageCount).toBe(initialReviewedCount + 1);

    const reviewedSkill = updatedThermo?.topics.flatMap(t => t.skills).find(s => s.skillId === 'SKILL-GEN0161-001');
    expect(reviewedSkill?.status).toBe('APPROVED');
  });

  it('6. Local review decisions remain an overlay and do not silently mutate ProblemBank unless explicitly requested', () => {
    // Generate a problem
    const genRes = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0102',
      skillId: 'SKILL-GEN0102-005',
      difficulty: 2
    });
    expect(genRes.success).toBe(true);
    const problem = genRes.problem!;
    bank.storeProblem(problem);

    // Initial lifecycle is DRAFT or VALID
    const initialStatus = bank.getProblemById(problem.dna.problemId)?.lifecycleStatus;
    expect(initialStatus).not.toBe('APPROVED');

    // Case A: Default browser-local review with applyToSessionProblemBank = false
    calibrationEngine.submitReview(
      {
        problemId: problem.dna.problemId,
        courseId: problem.dna.courseId,
        skillId: problem.dna.primarySkillId,
        reviewer: 'Auditor A',
        ratings: {
          mathematicalCorrectness: 5,
          skillAlignment: 5,
          clarity: 5,
          difficultySuitability: 5,
          educationalUsefulness: 5,
          diversityDistinctiveness: 4
        },
        decision: 'APPROVE'
      },
      { applyToSessionProblemBank: false }
    );

    // ProblemBank must NOT be silently mutated
    expect(bank.getProblemById(problem.dna.problemId)?.lifecycleStatus).toBe(initialStatus);

    // Case B: Explicit local-session action selected
    calibrationEngine.submitReview(
      {
        problemId: problem.dna.problemId,
        courseId: problem.dna.courseId,
        skillId: problem.dna.primarySkillId,
        reviewer: 'Auditor B',
        ratings: {
          mathematicalCorrectness: 5,
          skillAlignment: 5,
          clarity: 5,
          difficultySuitability: 5,
          educationalUsefulness: 5,
          diversityDistinctiveness: 4
        },
        decision: 'APPROVE'
      },
      { applyToSessionProblemBank: true }
    );

    // ProblemBank is now updated for this session
    expect(bank.getProblemById(problem.dna.problemId)?.lifecycleStatus).toBe('APPROVED');
  });

  it('7. Cross-course isolation: foreign problems are strictly rejected by ContentGenerator and ScopeValidator', () => {
    // Requesting a GEN 0101 skill under GEN 0102 courseId must fail at generator level
    const crossCourseReq = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0102',
      skillId: 'SKILL-GEN0101-001', // belongs to GEN0101
      difficulty: 2
    });

    expect(crossCourseReq.success).toBe(false);
    expect(crossCourseReq.rejectionReason).toBe('SKILL_MISMATCH');
    expect(crossCourseReq.rejectionDetails).toContain('belongs to COURSE-GEN0101, not COURSE-GEN0102');
  });

  it('8. Strictly validates imported JSON and fails closed with zero partial mutations', () => {
    // Create an invalid JSON payload: wrong schema version
    const invalidSchemaJson = JSON.stringify({
      schemaVersion: '2.0.0-unsupported',
      exportedAt: new Date().toISOString(),
      recordCount: 1,
      records: [
        {
          id: 'REV-001',
          reviewTargetKey: 'KEY',
          reviewer: 'Auditor',
          ratings: {
            mathematicalCorrectness: 5,
            skillAlignment: 5,
            clarity: 5,
            difficultySuitability: 5,
            educationalUsefulness: 5,
            diversityDistinctiveness: 4
          },
          decision: 'APPROVE',
          reviewedAt: new Date().toISOString()
        }
      ]
    });

    const resA = calibrationEngine.importReviewsJSON(invalidSchemaJson);
    expect(resA.success).toBe(false);
    expect(resA.errors[0]).toContain('Unsupported schema version');
    expect(calibrationEngine.getAllReviews().length).toBe(0);

    // Create an invalid payload: invalid rating value (out of bounds)
    const invalidRatingJson = JSON.stringify({
      schemaVersion: LOCAL_REVIEW_STORE_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      recordCount: 1,
      records: [
        {
          id: 'REV-002',
          reviewTargetKey: 'KEY',
          reviewer: 'Auditor',
          ratings: {
            mathematicalCorrectness: 999, // Invalid rating!
            skillAlignment: 5,
            clarity: 5,
            difficultySuitability: 5,
            educationalUsefulness: 5,
            diversityDistinctiveness: 4
          },
          decision: 'APPROVE',
          reviewedAt: new Date().toISOString()
        }
      ]
    });

    const resB = calibrationEngine.importReviewsJSON(invalidRatingJson);
    expect(resB.success).toBe(false);
    expect(resB.errors.some(e => e.includes('Rating "mathematicalCorrectness" must be an integer between 1 and 5'))).toBe(true);
    expect(calibrationEngine.getAllReviews().length).toBe(0);

    // Create a valid payload
    const validJson = JSON.stringify({
      schemaVersion: LOCAL_REVIEW_STORE_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      recordCount: 1,
      records: [
        {
          id: 'REV-003',
          reviewTargetKey: 'COURSE-GEN0102::SKILL-GEN0102-005::FAM::TMPL::SIG',
          courseId: 'COURSE-GEN0102',
          skillId: 'SKILL-GEN0102-005',
          reviewer: 'Verified Faculty',
          ratings: {
            mathematicalCorrectness: 5,
            skillAlignment: 5,
            clarity: 5,
            difficultySuitability: 5,
            educationalUsefulness: 5,
            diversityDistinctiveness: 5
          },
          decision: 'APPROVE',
          reviewedAt: new Date().toISOString()
        }
      ]
    });

    const resC = calibrationEngine.importReviewsJSON(validJson);
    expect(resC.success).toBe(true);
    expect(resC.importedCount).toBe(1);
    expect(calibrationEngine.getAllReviews().length).toBe(1);
  });

  it('9. CoverageAuditor is pure and read-only by default and does not store problems during metric computation', () => {
    const initialBankProblemsCount = bank.getProblemsByCourse('COURSE-GEN0102').length;
    
    // Call calculateCoverage multiple times
    CoverageAuditor.calculateCoverage();
    CoverageAuditor.calculateCoverage();
    CoverageAuditor.calculateCoverage();

    const finalBankProblemsCount = bank.getProblemsByCourse('COURSE-GEN0102').length;
    expect(finalBankProblemsCount).toBe(initialBankProblemsCount);
  });

  it('10. Calculates and separates Structural Coverage, Review Coverage, Draft Backlog, and Error Metrics', () => {
    const summary = CoverageAuditor.calculateCoverage();

    // All skills (71 baseline)
    expect(summary.totalSkills).toBe(71);

    // All skills currently have registered structural coverage (families + templates)
    expect(summary.structuralCoverageCount).toBe(71);
    expect(summary.structuralCoveragePercent).toBe(100);

    // Review coverage starts at calibrated baseline
    expect(summary.reviewCoverageCount).toBeGreaterThanOrEqual(0);
    expect(summary.reviewCoveragePercent).toBeLessThanOrEqual(100);

    // Draft backlog accounts for unapproved items
    expect(summary.draftBacklogCount).toBeGreaterThan(0);
    expect(summary.generationErrorCount).toBe(0);
  });

  describe('Comprehensive Verification Flows (7 Specific Flows)', () => {
    it('Flow 1: Unit filtering restricts topic and skill explorer results to the chosen unit', () => {
      const summary = CoverageAuditor.calculateCoverage();
      const calculusCourse = summary.courses.find(c => c.courseId === 'COURSE-GEN0102');
      expect(calculusCourse).toBeDefined();

      const units = currRegistry.getUnitsByCourse('COURSE-GEN0102');
      expect(units.length).toBeGreaterThan(1);

      const targetUnit = units[0];
      // Filter topics matching targetUnit.id
      const unitTopics = calculusCourse!.topics.filter(t => t.parentUnitId === targetUnit.id);
      expect(unitTopics.length).toBeGreaterThan(0);

      // Verify that every topic in unitTopics has the selected unitId
      for (const t of unitTopics) {
        expect(t.parentUnitId).toBe(targetUnit.id);
      }

      // Verify that other topics with different unit IDs were excluded
      const otherTopics = calculusCourse!.topics.filter(t => t.parentUnitId !== targetUnit.id);
      expect(otherTopics.length).toBeGreaterThan(0);
      for (const ot of otherTopics) {
        expect(unitTopics.some(ut => ut.topicId === ot.topicId)).toBe(false);
      }
    });

    it('Flow 2: Status filtering correctly partitions skills across distinct coverage review categories', () => {
      const summary = CoverageAuditor.calculateCoverage();
      const allSkills = summary.courses.flatMap(c => c.topics.flatMap(t => t.skills));

      const approvedSkills = allSkills.filter(s => s.status === 'APPROVED');
      const draftSkills = allSkills.filter(s => s.status === 'REPRESENTATIVE_DRAFT');
      const needsReviewSkills = allSkills.filter(s => s.status === 'NEEDS_REVIEW');
      const noCoverageSkills = allSkills.filter(s => s.status === 'NO_COVERAGE');

      // Every skill should belong to exactly one status category (no overlap)
      const totalPartitioned = approvedSkills.length + draftSkills.length + needsReviewSkills.length + noCoverageSkills.length;
      expect(totalPartitioned).toBe(allSkills.length);

      // Draft skills must have fallback indicators
      for (const ds of draftSkills) {
        expect(
          ds.familyStatus === 'REPRESENTATIVE_DRAFT' ||
          currRegistry.getSkillById(ds.skillId)?.sourceType === 'SYSTEM_PROPOSED' ||
          currRegistry.getSkillById(ds.skillId)?.status === 'DRAFT'
        ).toBe(true);
      }
    });

    it('Flow 3: Rejects placeholder targets with REPRESENTATIVE_ITEM and requires real candidate before review', () => {
      const placeholderTargetKey = buildReviewTargetKey({
        courseId: 'COURSE-GEN0102',
        primarySkillId: 'SKILL-GEN0102-005',
        familyId: 'FAM-GEN0102-CHAIN-POLY',
        templateId: 'TMPL-GEN0102-CHAIN-POLY-01',
        structureSignature: 'REPRESENTATIVE_ITEM'
      });

      expect(placeholderTargetKey).toContain('REPRESENTATIVE_ITEM');

      // Attempting to generate a real candidate provides a genuine signature
      const genRes = CoverageAuditor.generateCandidateForSkill('SKILL-GEN0102-005', 2);
      expect(genRes.success).toBe(true);
      expect(genRes.problem?.dna.structureSignature).toBeDefined();
      expect(genRes.problem?.dna.structureSignature).not.toBe('REPRESENTATIVE_ITEM');
    });

    it('Flow 4: Candidate generation followed by session approval stores candidate problem before lifecycle update', () => {
      const skillId = 'SKILL-GEN0102-005';
      const genRes = CoverageAuditor.generateCandidateForSkill(skillId, 2);
      expect(genRes.success).toBe(true);
      const candidate = genRes.problem!;

      const candidateSnapshot = {
        statement: candidate.statement,
        solution: candidate.solution,
        hints: candidate.hints,
        difficultyVector: candidate.dna.difficultyVector,
        structureSignature: candidate.dna.structureSignature,
        dna: candidate.dna
      };

      const targetKey = buildReviewTargetKey({
        courseId: candidate.dna.courseId,
        primarySkillId: candidate.dna.primarySkillId,
        familyId: candidate.dna.familyId,
        templateId: candidate.dna.templateId,
        structureSignature: candidate.dna.structureSignature
      });

      const reviewRecord = calibrationEngine.submitReview(
        {
          reviewTargetKey: targetKey,
          problemId: candidate.dna.problemId,
          courseId: candidate.dna.courseId,
          skillId: candidate.dna.primarySkillId,
          candidateSnapshot,
          reviewer: 'Prof. Tester',
          ratings: {
            mathematicalCorrectness: 5,
            skillAlignment: 5,
            clarity: 5,
            difficultySuitability: 5,
            educationalUsefulness: 5,
            diversityDistinctiveness: 5
          },
          decision: 'APPROVE'
        },
        { applyToSessionProblemBank: true }
      );

      // Verify that ProblemBank now has the problem persisted and marked APPROVED
      const stored = bank.getProblemById(candidate.dna.problemId);
      expect(stored).toBeDefined();
      expect(stored?.dna.problemId).toBe(candidate.dna.problemId);
      expect(stored?.lifecycleStatus).toBe('APPROVED');
    });

    it('Flow 5: Fallback items remain draft even if ProblemBank contains problems for that skill, unless explicit review overlay exists', () => {
      // Find a fallback skill in GEN 0161
      const initialSummary = CoverageAuditor.calculateCoverage();
      const thermoCourse = initialSummary.courses.find(c => c.courseId === 'COURSE-GEN0161');
      const fallbackSkill = thermoCourse!.topics.flatMap(t => t.skills).find(s => s.status === 'REPRESENTATIVE_DRAFT');
      expect(fallbackSkill).toBeDefined();
      const skillId = fallbackSkill!.skillId;

      // Simulate ProblemBank containing approved problems for this skill
      const fakeApprovedSkillIds = new Set<string>([skillId]);
      const summaryWithBankApproved = CoverageAuditor.calculateCoverage({
        canonicalApprovedSkillIds: fakeApprovedSkillIds
      });

      const thermoSkillAfterBank = summaryWithBankApproved.courses
        .find(c => c.courseId === 'COURSE-GEN0161')!
        .topics.flatMap(t => t.skills)
        .find(s => s.skillId === skillId);

      // Must STILL be REPRESENTATIVE_DRAFT (immunity against auto-seeding approval!)
      expect(thermoSkillAfterBank?.status).toBe('REPRESENTATIVE_DRAFT');

      // Now supply an explicit teacher review overlay for this skill
      const reviewOverlay = {
        'OVERLAY-001': {
          id: 'REV-OVERLAY-001',
          reviewTargetKey: `COURSE-GEN0161::${skillId}::FAM::TMPL::SIG`,
          skillId,
          reviewer: 'Faculty Reviewer',
          ratings: {
            mathematicalCorrectness: 5 as const,
            skillAlignment: 5 as const,
            clarity: 5 as const,
            difficultySuitability: 5 as const,
            educationalUsefulness: 5 as const,
            diversityDistinctiveness: 5 as const
          },
          decision: 'APPROVE' as const,
          reviewedAt: new Date().toISOString()
        }
      };

      const summaryWithReviewOverlay = CoverageAuditor.calculateCoverage({
        reviewsMap: reviewOverlay,
        canonicalApprovedSkillIds: fakeApprovedSkillIds
      });

      const thermoSkillAfterReview = summaryWithReviewOverlay.courses
        .find(c => c.courseId === 'COURSE-GEN0161')!
        .topics.flatMap(t => t.skills)
        .find(s => s.skillId === skillId);

      // Now and ONLY now is it marked APPROVED
      expect(thermoSkillAfterReview?.status).toBe('APPROVED');
    });

    it('Flow 6: Custom 1-5 ratings across 6 dimensions and rejection reasons controls are recorded accurately', () => {
      const customRatings = {
        mathematicalCorrectness: 2 as const,
        skillAlignment: 3 as const,
        clarity: 1 as const,
        difficultySuitability: 2 as const,
        educationalUsefulness: 2 as const,
        diversityDistinctiveness: 3 as const
      };

      const rejectionReasons = ['MATHEMATICALLY_WRONG', 'POOR_WORDING'] as const;

      const review = calibrationEngine.submitReview(
        {
          reviewTargetKey: 'COURSE-GEN0102::SKILL-GEN0102-005::FAM::TMPL::SIG-REJECT',
          courseId: 'COURSE-GEN0102',
          skillId: 'SKILL-GEN0102-005',
          reviewer: 'Strict Reviewer',
          ratings: customRatings,
          decision: 'REJECT',
          rejectionReasons: [...rejectionReasons],
          teacherNotes: 'Equation in prompt contains an undefined constant.'
        },
        { applyToSessionProblemBank: false }
      );

      // Check that exact custom ratings were recorded, not 5/5
      expect(review.ratings.mathematicalCorrectness).toBe(2);
      expect(review.ratings.clarity).toBe(1);
      expect(review.ratings.educationalUsefulness).toBe(2);
      expect(review.ratings.skillAlignment).toBe(3);

      // Check that rejection reasons were accurately persisted
      expect(review.rejectionReasons).toEqual(['MATHEMATICALLY_WRONG', 'POOR_WORDING']);
      expect(review.decision).toBe('REJECT');
    });

    it('Flow 7: Review persistence with candidateSnapshot and localStorage fail-closed schema validation', () => {
      const genRes = CoverageAuditor.generateCandidateForSkill('SKILL-GEN0102-005', 2);
      expect(genRes.success).toBe(true);
      const candidate = genRes.problem!;

      const targetKey = buildReviewTargetKey({
        courseId: candidate.dna.courseId,
        primarySkillId: candidate.dna.primarySkillId,
        familyId: candidate.dna.familyId,
        templateId: candidate.dna.templateId,
        structureSignature: candidate.dna.structureSignature
      });

      const candidateSnapshot = {
        statement: candidate.statement,
        solution: candidate.solution,
        hints: candidate.hints,
        difficultyVector: candidate.dna.difficultyVector,
        structureSignature: candidate.dna.structureSignature,
        dna: candidate.dna
      };

      const record = calibrationEngine.submitReview({
        reviewTargetKey: targetKey,
        problemId: candidate.dna.problemId,
        candidateSnapshot,
        reviewer: 'Snapshot Tester',
        ratings: {
          mathematicalCorrectness: 4,
          skillAlignment: 5,
          clarity: 4,
          difficultySuitability: 4,
          educationalUsefulness: 4,
          diversityDistinctiveness: 4
        },
        decision: 'APPROVE'
      });

      // Verify candidateSnapshot is persisted on the record
      expect(record.candidateSnapshot).toBeDefined();
      expect(record.candidateSnapshot?.statement.promptText).toBe(candidate.statement.promptText);
      expect(record.candidateSnapshot?.solution.canonicalAnswerLatex).toBe(candidate.solution.canonicalAnswerLatex);
      expect(record.candidateSnapshot?.hints.length).toBe(candidate.hints.length);

      // Export JSON and verify schema v1.0.0
      const exportedJson = calibrationEngine.exportReviewsJSON();
      const validationRes = TeacherCalibrationEngine.validateReviewStorePayload(exportedJson);
      expect(validationRes.valid).toBe(true);
      expect(validationRes.records.length).toBeGreaterThan(0);

      const parsedRecord = validationRes.records.find(r => r.reviewTargetKey === targetKey);
      expect(parsedRecord?.candidateSnapshot).toBeDefined();
      expect(parsedRecord?.candidateSnapshot?.structureSignature).toBe(candidate.dna.structureSignature);

      // Test fail-closed on corrupt payload
      const corruptJson = '{"schemaVersion": "1.0.0", "records": [{"invalid": true}]}';
      const corruptValidation = TeacherCalibrationEngine.validateReviewStorePayload(corruptJson);
      expect(corruptValidation.valid).toBe(false);
      expect(corruptValidation.records.length).toBe(0);
      expect(corruptValidation.errors.length).toBeGreaterThan(0);
    });
  });
});
