import { curriculumRegistry } from '@/engine/curriculum/registry';
import { CurriculumTopic } from '@/engine/curriculum/types';

export interface ResolvedPracticeScope {
  effectiveTopicId: string;
  targetSkillId?: string;
}

/**
 * Resolves a safe practice scope for any topic in the curriculum.
 * Ensures topics with 0 direct registered skills seamlessly fall back
 * to valid syllabus lineage, preventing delivery-time NO_ELIGIBLE_PROBLEM errors.
 */
export function resolveTopicPracticeScope(
  courseId: string,
  topic: CurriculumTopic
): ResolvedPracticeScope {
  const directSkills = curriculumRegistry.getSkillsByTopic(topic.id);
  if (directSkills.length > 0) {
    return {
      effectiveTopicId: topic.id,
      targetSkillId: directSkills.length === 1 ? directSkills[0].id : undefined
    };
  }

  // Fallback for 0-skill topics:
  // 1. Check if another topic in the course has the same canonicalTopicId and has skills
  if (topic.canonicalTopicId) {
    const matched = curriculumRegistry
      .getTopicsByCourse(courseId)
      .find((t) => t.canonicalTopicId === topic.canonicalTopicId && t.id !== topic.id);
    if (matched) {
      const matchedSkills = curriculumRegistry.getSkillsByTopic(matched.id);
      if (matchedSkills.length > 0) {
        return {
          effectiveTopicId: matched.id,
          targetSkillId: matchedSkills[0].id
        };
      }
    }
  }

  // 2. Check for skills in the same unit
  const unitSkills = curriculumRegistry
    .getTopicsByUnit(topic.unitId)
    .flatMap((t) => curriculumRegistry.getSkillsByTopic(t.id));
  if (unitSkills.length > 0) {
    const parent = curriculumRegistry.getSkillById(unitSkills[0].id)?.parentTopicId || topic.id;
    return {
      effectiveTopicId: parent,
      targetSkillId: unitSkills[0].id
    };
  }

  // 3. Fallback to first skill in the course
  const courseSkills = curriculumRegistry.getSkillsByCourse(courseId);
  if (courseSkills.length > 0) {
    const parent = curriculumRegistry.getSkillById(courseSkills[0].id)?.parentTopicId || topic.id;
    return {
      effectiveTopicId: parent,
      targetSkillId: courseSkills[0].id
    };
  }

  return { effectiveTopicId: topic.id };
}
