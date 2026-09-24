import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WORKSPACE_ROOT = path.dirname(__dirname);
const BASELINE_FILE = path.join(WORKSPACE_ROOT, 'scripts', 'diffeq_baseline.json');

function extractDiffeqDataset() {
  const data = {};

  // 1. Course in courses.ts
  const coursesPath = path.join(WORKSPACE_ROOT, 'src', 'engine', 'curriculum', 'courses.ts');
  const coursesTxt = fs.readFileSync(coursesPath, 'utf-8');
  const cMatch = coursesTxt.match(/\{\s*id:\s*['"]COURSE-GEN0107['"].*?\n  \}/s);
  data['course'] = cMatch ? cMatch[0].trim() : '';

  // 2. Units in coverage.ts
  const covPath = path.join(WORKSPACE_ROOT, 'src', 'engine', 'curriculum', 'coverage.ts');
  const covTxt = fs.readFileSync(covPath, 'utf-8');

  const units = [];
  const unitRegex = /\{\s*id:\s*['"](UNIT-GEN0107-[^'"]+)['"].*?\n  \}/gs;
  let m;
  while ((m = unitRegex.exec(covTxt)) !== null) {
    units.push(m[0].trim());
  }
  data['units'] = units.sort();

  // 3. Topics in coverage.ts (associated with COURSE-GEN0107)
  const topics = [];
  const topicRegex = /\{\s*id:\s*['"](CURR-GEN0107-[^'"]+)['"].*?courseId:\s*['"]COURSE-GEN0107['"].*?\n  \}/gs;
  while ((m = topicRegex.exec(covTxt)) !== null) {
    topics.push(m[0].trim());
  }
  data['topics'] = topics.sort();

  // 4. Skills in skills.ts
  const skillsPath = path.join(WORKSPACE_ROOT, 'src', 'engine', 'curriculum', 'skills.ts');
  const skillsTxt = fs.readFileSync(skillsPath, 'utf-8');
  const skills = [];
  const skillRegex = /\{\s*id:\s*['"](SKILL-GEN0107-[^'"]+)['"].*?parentCourseId:\s*['"]COURSE-GEN0107['"].*?\n  \}/gs;
  while ((m = skillRegex.exec(skillsTxt)) !== null) {
    skills.push(m[0].trim());
  }
  data['skills'] = skills.sort();

  // 5. Families in problemFamilies.ts
  const famPath = path.join(WORKSPACE_ROOT, 'src', 'engine', 'content', 'problemFamilies.ts');
  const famTxt = fs.readFileSync(famPath, 'utf-8');
  const families = [];
  const famRegex = /['"](FAM-GEN0107-[^'"]+)['"]:\s*\{.*?courseId:\s*['"]COURSE-GEN0107['"].*?\n  \}/gs;
  while ((m = famRegex.exec(famTxt)) !== null) {
    families.push(m[0].trim());
  }
  data['families'] = families.sort();

  // 6. Standalone files
  for (const relPath of [
    ['src', 'engine', 'content', 'archetypeRegistry.ts'],
    ['src', 'engine', 'content', 'conceptRegistry.ts'],
    ['src', 'engine', 'content', 'conceptValidator.ts']
  ]) {
    const p = path.join(WORKSPACE_ROOT, ...relPath);
    if (fs.existsSync(p)) {
      data[relPath.join('/')] = crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
    }
  }

  // 7. ODE validator in domainValidators.ts
  const domPath = path.join(WORKSPACE_ROOT, 'src', 'engine', 'content', 'domainValidators.ts');
  const domTxt = fs.readFileSync(domPath, 'utf-8');
  const mOde = domTxt.match(/public static validateODE\(.*?return \{.*?valid:.*?status:.*?\};\s*\}/s);
  data['validateODE'] = mOde ? mOde[0].trim() : '';

  // 8. Test files
  for (const relTest of [
    ['tests', 'content', 'ode-content.test.ts'],
    ['tests', 'integration', 'castro-application-diversity.test.ts'],
    ['tests', 'integration', 'castro-diversity-archetypes.test.ts'],
    ['tests', 'integration', 'de-concept-alignment.test.ts']
  ]) {
    const p = path.join(WORKSPACE_ROOT, ...relTest);
    if (fs.existsSync(p)) {
      data[relTest.join('/')] = crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
    }
  }

  return data;
}

export function verify() {
  if (!fs.existsSync(BASELINE_FILE)) {
    console.error(`Baseline file missing at ${BASELINE_FILE}`);
    process.exit(1);
  }
  const baseline = JSON.parse(fs.readFileSync(BASELINE_FILE, 'utf-8'));
  const current = extractDiffeqDataset();

  const diffs = [];
  for (const key of Object.keys(baseline)) {
    if (JSON.stringify(baseline[key]) !== JSON.stringify(current[key])) {
      diffs.push(key);
    }
  }

  if (diffs.length > 0) {
    console.error(`CRITICAL FAILURE: Differential Equations dataset has ${diffs.length} differences!`);
    for (const d of diffs) {
      console.error(`  - Discrepancy in: ${d}`);
    }
    process.exit(1);
  } else {
    console.log('SUCCESS: ZERO changes to Differential Equations. 100% IMMUTABLE & VERIFIED.');
  }
}

if (process.argv[2] === 'verify' || !process.argv[2]) {
  verify();
}
