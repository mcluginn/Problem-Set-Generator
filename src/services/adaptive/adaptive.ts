/**
 * Adaptive "Next Best Problem" Recommendation Engine
 * Recommends optimal educational practice based on mastery, misconceptions, and structural diversity.
 * Engineering Practice Engine — Phase 6 Adaptive Learning Loop
 */

import { RepresentationType } from '../../engine/generation/types';
import { ConceptMasteryRecord, INITIAL_CURRICULUM, MistakeRecord } from '../database/types';
import { AdaptiveSelector } from '../../engine/adaptive/selector';
import { UnifiedPracticeStore } from '../../engine/adaptive/store';

export interface AdaptiveRecommendation {
  concept: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  representationType: RepresentationType;
  remediationMisconception?: string;
  reason: string;
  currentMasteryPercentage: number;
  confidence?: number;
}

export class AdaptiveEngine {
  /**
   * Evaluates the student's mastery profile to determine the next best pedagogical practice.
   */
  public static selectNextBestProblem(
    masteryMap: Record<string, ConceptMasteryRecord>,
    mistakes: MistakeRecord[] = [],
    selectedConcept?: string
  ): AdaptiveRecommendation {
    // 1. If user specifically selected a concept, tailor difficulty and representation within it
    if (selectedConcept && selectedConcept !== 'Adaptive') {
      const record = masteryMap[selectedConcept];
      const mastery = record?.masteryPercentage ?? 50;
      const attempts = record?.totalAttempts ?? 0;
      const confidence = Math.min(1.0, attempts / 10);
      const recentMistake = mistakes.find((m) => m.concept === selectedConcept && !m.resolved);

      let diff: 'Easy' | 'Medium' | 'Hard' = 'Medium';
      if (mastery < 45) diff = 'Easy';
      else if (mastery >= 75) diff = 'Hard';

      return {
        concept: selectedConcept,
        difficulty: diff,
        representationType: mastery > 70 ? 'Kinematics' : 'Symbolic',
        remediationMisconception: recentMistake?.misconceptionCode,
        reason: recentMistake
          ? `Targeted remediation on ${selectedConcept} to reinforce ${recentMistake.misconceptionName}.`
          : `Practicing ${selectedConcept} at ${diff} difficulty (Current Mastery: ${mastery}%, Confidence: ${(confidence * 100).toFixed(0)}%).`,
        currentMasteryPercentage: mastery,
        confidence,
      };
    }

    // 2. Priority 1: Unresolved Misconceptions
    const activeMistake = mistakes.find((m) => !m.resolved && m.occurredCount >= 1);
    if (activeMistake) {
      const record = masteryMap[activeMistake.concept];
      const conceptMastery = record?.masteryPercentage ?? 50;
      const attempts = record?.totalAttempts ?? 1;
      const confidence = Math.min(1.0, attempts / 10);
      return {
        concept: activeMistake.concept,
        difficulty: conceptMastery < 50 ? 'Easy' : 'Medium',
        representationType: 'Symbolic',
        remediationMisconception: activeMistake.misconceptionCode,
        reason: `Targeted Remediation: You recently encountered "${activeMistake.misconceptionName}" on ${activeMistake.concept}. Practice problem targeted to solidify this rule.`,
        currentMasteryPercentage: conceptMastery,
        confidence,
      };
    }

    // 3. Priority 2: Lowest Mastery with Satisfied Prerequisites (< 75%)
    const eligibleConcepts = INITIAL_CURRICULUM.map((c) => {
      const record = masteryMap[c.name];
      const attempts = record?.totalAttempts ?? 0;
      return {
        concept: c.name,
        prerequisites: c.prerequisites,
        mastery: record?.masteryPercentage ?? 0,
        attempts,
        confidence: Math.min(1.0, attempts / 10),
      };
    }).sort((a, b) => a.mastery - b.mastery);

    // Pick the concept with the lowest mastery whose prerequisites are reasonably satisfied (> 50%)
    for (const item of eligibleConcepts) {
      if (item.mastery >= 75) continue; // Handled by application transfer or challenge mode

      const prereqsMet = item.prerequisites.every((prereqId) => {
        const prereqConcept = INITIAL_CURRICULUM.find((c) => c.id === prereqId);
        if (!prereqConcept) return true;
        const prereqMastery = masteryMap[prereqConcept.name]?.masteryPercentage ?? 0;
        return prereqMastery >= 50;
      });

      if (prereqsMet) {
        let diff: 'Easy' | 'Medium' | 'Hard' = 'Medium';
        if (item.mastery < 50) diff = 'Easy';
        else if (item.mastery >= 65) diff = 'Hard';

        return {
          concept: item.concept,
          difficulty: diff,
          representationType: item.mastery > 60 ? 'Kinematics' : 'Symbolic',
          reason: `Recommended Growth Area: ${item.concept} (Mastery: ${item.mastery}%, Prerequisites Satisfied).`,
          currentMasteryPercentage: item.mastery,
          confidence: item.confidence,
        };
      }
    }

    // 4. Priority 3: Application Transfer for Strong Symbolic Mastery (>= 75%)
    for (const concept of INITIAL_CURRICULUM) {
      const record = masteryMap[concept.name];
      if (record && record.masteryPercentage >= 75 && (concept.name === 'Chain Rule' || concept.name === 'Basic Applications of Derivatives')) {
        return {
          concept: concept.name,
          difficulty: 'Medium',
          representationType: 'Kinematics',
          reason: `Application Transfer: Strong symbolic proficiency demonstrated in ${concept.name} (${record.masteryPercentage}%). Advancing to engineering kinematics modeling.`,
          currentMasteryPercentage: record.masteryPercentage,
          confidence: Math.min(1.0, (record.totalAttempts || 10) / 10),
        };
      }
    }

    // 5. Priority 4: Challenge & Applications if high mastery across all topics
    const defaultConcept = 'Chain Rule';
    const chainMastery = masteryMap[defaultConcept]?.masteryPercentage ?? 75;
    return {
      concept: defaultConcept,
      difficulty: 'Hard',
      representationType: 'Kinematics',
      reason: `Challenge Mode: High overall mastery achieved across foundational concepts. Advancing to engineering application modeling.`,
      currentMasteryPercentage: chainMastery,
      confidence: 1.0,
    };
  }

  /**
   * Six-Course Adaptive Next Best Problem Selector bridge.
   */
  public static selectNextBestProblemForCourse(
    studentId: string,
    courseId: string
  ) {
    return AdaptiveSelector.selectNextBestProblem(studentId, courseId);
  }
}
