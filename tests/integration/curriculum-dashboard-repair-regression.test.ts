/**
 * Comprehensive Curriculum Dashboard Repair & Regression Test Suite
 * Validates 0-skill, 1-skill, and multi-skill topic structures,
 * practice session creation without NO_ELIGIBLE_PROBLEM errors,
 * title formatter safety, and end-to-end learning flows.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { UnifiedPracticeStore } from '@/engine/adaptive/store';
import { curriculumRegistry } from '@/engine/curriculum/registry';
import { resolveTopicPracticeScope } from '@/components/dashboard/curriculumScopeResolver';
import { formatCurriculumTitle, stripLeadingSequenceNumber } from '@/components/dashboard/CurriculumTitleFormatter';
import { RoleGuard } from '@/engine/auth/roleGuard';
import { QuizEngine } from '@/engine/quiz/quizEngine';

describe('Curriculum Dashboard Repair & Regression Suite', () => {
  beforeEach(() => {
    UnifiedPracticeStore.clear();
    RoleGuard.reset();
  });

  describe('1. Three Master-Data Topic Structures', () => {
    it('verifies 0-skill topics resolve to valid practice scopes without NO_ELIGIBLE_PROBLEM', () => {
      UnifiedPracticeStore.initialize();
      const zeroSkillTopicIds = [
        'CURR-GEN0102-U1-T01',
        'CURR-GEN0102-U1-T02',
        'CURR-GEN0161-U1-T01',
        'CURR-BSIE3219-U2-T04',
        'CURR-BSIE3219-U2-T06'
      ];

      for (const topicId of zeroSkillTopicIds) {
        const topic = curriculumRegistry.getTopicById(topicId);
        expect(topic).toBeDefined();
        const skills = curriculumRegistry.getSkillsByTopic(topicId);
        expect(skills.length).toBe(0);

        const unit = curriculumRegistry.getUnitById(topic!.unitId);
        expect(unit).toBeDefined();
        const course = curriculumRegistry.getCourseById(unit!.courseId);
        expect(course).toBeDefined();

        const scope = resolveTopicPracticeScope(course!.id, topic!);
        expect(scope.effectiveTopicId).toBeDefined();
        expect(scope.targetSkillId).toBeDefined();

        const session = UnifiedPracticeStore.startSession(course!.id, {
          mode: 'TOPIC_PRACTICE',
          targetTopicId: scope.effectiveTopicId,
          targetSkillId: scope.targetSkillId
        });

        expect(session.currentProblem).toBeDefined();
        expect(session.currentProblemId).not.toBe('NO_ELIGIBLE_PROBLEM');
        expect(session.status).toBe('ACTIVE');
      }
    });

    it('verifies 1-skill topics resolve target skill directly and launch session', () => {
      UnifiedPracticeStore.initialize();
      const oneSkillTopic = curriculumRegistry.getTopicById('CURR-GEN0102-U1-T03')!;
      const skills = curriculumRegistry.getSkillsByTopic(oneSkillTopic.id);
      expect(skills.length).toBe(1);

      const scope = resolveTopicPracticeScope('COURSE-GEN0102', oneSkillTopic);
      expect(scope.effectiveTopicId).toBe('CURR-GEN0102-U1-T03');
      expect(scope.targetSkillId).toBe(skills[0].id);

      const session = UnifiedPracticeStore.startSession('COURSE-GEN0102', {
        mode: 'SKILL_PRACTICE',
        targetTopicId: oneSkillTopic.id,
        targetSkillId: skills[0].id
      });

      expect(session.currentProblem).toBeDefined();
      expect(session.currentProblem?.dna.primarySkillId).toBe(skills[0].id);
    });

    it('verifies multi-skill topics resolve topic scope and allow individual skill launches', () => {
      UnifiedPracticeStore.initialize();
      const multiSkillTopic = curriculumRegistry.getTopicById('CURR-GEN0102-U1-T04')!;
      const skills = curriculumRegistry.getSkillsByTopic(multiSkillTopic.id);
      expect(skills.length).toBeGreaterThan(1);

      // Topic-level practice
      const topicScope = resolveTopicPracticeScope('COURSE-GEN0102', multiSkillTopic);
      expect(topicScope.effectiveTopicId).toBe(multiSkillTopic.id);
      expect(topicScope.targetSkillId).toBeUndefined();

      const topicSession = UnifiedPracticeStore.startSession('COURSE-GEN0102', {
        mode: 'TOPIC_PRACTICE',
        targetTopicId: multiSkillTopic.id
      });
      expect(topicSession.currentProblem).toBeDefined();
      expect(topicSession.scope.topicId).toBe(multiSkillTopic.id);

      // Child skill individual practice
      for (const skill of skills) {
        const skillSession = UnifiedPracticeStore.startSession('COURSE-GEN0102', {
          mode: 'SKILL_PRACTICE',
          targetTopicId: multiSkillTopic.id,
          targetSkillId: skill.id
        });
        expect(skillSession.currentProblem).toBeDefined();
        expect(skillSession.currentProblem?.dna.primarySkillId).toBe(skill.id);
      }
    });
  });

  describe('2. Curriculum Master Data Completeness Across All 6 Courses', () => {
    it('verifies all 6 courses, all units, and all topics can launch practice without failure', () => {
      UnifiedPracticeStore.initialize();
      const courses = curriculumRegistry.getAllCourses();
      expect(courses.length).toBe(6);

      let totalTopicsTested = 0;
      for (const course of courses) {
        const topics = curriculumRegistry.getTopicsByCourse(course.id);
        expect(topics.length).toBeGreaterThan(0);

        for (const topic of topics) {
          totalTopicsTested++;
          const scope = resolveTopicPracticeScope(course.id, topic);
          const session = UnifiedPracticeStore.startSession(course.id, {
            mode: 'TOPIC_PRACTICE',
            targetTopicId: scope.effectiveTopicId,
            targetSkillId: scope.targetSkillId
          });

          expect(session.currentProblem).toBeDefined();
          expect(session.currentProblemId).not.toBe('NO_ELIGIBLE_PROBLEM');
        }
      }
      expect(totalTopicsTested).toBe(67);
    });
  });

  describe('3. Curriculum Title Formatter Non-Destructive Protection', () => {
    it('preserves mathematical notation and does not mangle casing', () => {
      expect(formatCurriculumTitle('derivatives of exponential functions (e^x, a^x)')).toBe(
        'Derivatives of Exponential Functions (e^x, a^x)'
      );
      expect(formatCurriculumTitle('derivatives with dy/dx, df/dx, and y\'')).toBe(
        'Derivatives with dy/dx, df/dx, and y\''
      );
      expect(formatCurriculumTitle('second-order term d^2y/dx^2')).toBe(
        'Second-Order Term d^2y/dx^2'
      );
      expect(formatCurriculumTitle('integrals of sin and cos functions')).toBe(
        'Integrals of sin and cos Functions'
      );
    });

    it('preserves acronyms and strips leading numbers properly', () => {
      expect(stripLeadingSequenceNumber('01. Introduction to ODE')).toBe('Introduction to ODE');
      expect(formatCurriculumTitle('01. introduction to ode')).toBe('Introduction to ODE');
      expect(formatCurriculumTitle('solving ivp systems')).toBe('Solving IVP Systems');
    });
  });

  describe('4. Navigation, Quiz, and Mistakes Continuity', () => {
    it('creates and resumes quiz sessions cleanly', () => {
      const quiz = QuizEngine.createQuiz({
        courseId: 'COURSE-GEN0102',
        questionCount: 5,
        timeLimitMinutes: 15
      });
      expect(quiz).toBeDefined();
      expect(quiz.questions.length).toBe(5);
      expect(quiz.status).toBe('IN_PROGRESS');

      const loaded = QuizEngine.loadActiveSession();
      expect(loaded).toBeDefined();
      expect(loaded?.id).toBe(quiz.id);
    });

    it('tracks student attempts and updates mastery correctly', () => {
      UnifiedPracticeStore.initialize();
      const session = UnifiedPracticeStore.startSession('COURSE-GEN0102', {
        mode: 'SKILL_PRACTICE',
        targetTopicId: 'CURR-GEN0102-U1-T03',
        targetSkillId: 'SKILL-GEN0102-001'
      });

      const initialAttempts = UnifiedPracticeStore.getProfile().totalAttempts;

      UnifiedPracticeStore.submitAttempt(session.id, {
        studentAnswer: session.currentProblem!.solution.canonicalAnswerLatex,
        source: 'TYPED',
        isCorrect: true,
        timeSpentSeconds: 45,
        hintLevelUsed: 0,
        solutionViewed: false
      });

      const updatedProfile = UnifiedPracticeStore.getProfile();
      expect(updatedProfile.totalAttempts).toBe(initialAttempts + 1);
      expect(updatedProfile.totalProblemsSolved).toBeGreaterThan(0);
    });
  });
});
