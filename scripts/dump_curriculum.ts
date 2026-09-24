import * as fs from 'fs';
import * as path from 'path';
import { AUTHORITATIVE_SKILLS } from '../src/engine/curriculum/skills';
import { AUTHORITATIVE_TOPICS } from '../src/engine/curriculum/coverage';

const outPath = path.resolve(__dirname, 'curriculum_dump.json');

const data = {
  skills: AUTHORITATIVE_SKILLS.map(s => ({
    id: s.id,
    courseId: s.parentCourseId,
    topicId: s.parentTopicId,
    name: s.canonicalName
  })),
  topics: AUTHORITATIVE_TOPICS.map(t => ({
    id: t.id,
    courseId: t.courseId,
    unitId: t.unitId,
    name: t.officialName
  }))
};

fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf-8');
console.log(`Successfully dumped ${data.skills.length} skills and ${data.topics.length} topics to ${outPath}`);
