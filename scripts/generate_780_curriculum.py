import json
import os
import re

DATA_PATH = r"src/engine/content/master_bank_780.json"
OUT_PATH = r"src/engine/curriculum/goldenMasterRegistry.ts"

with open(DATA_PATH, "r", encoding="utf-8") as f:
    problems = json.load(f)

# Group by cluster
clusters = {}
for p in problems:
    cid = p['clusterId']
    if cid not in clusters:
        clusters[cid] = {
            "id": cid,
            "courseId": p['courseId'],
            "courseCode": p['courseCode'],
            "courseName": p['courseName'],
            "unitId": p['unitId'],
            "unitCode": p['unitCode'],
            "topic": p['topic'],
            "structuralProgression": p['structuralProgression'],
            "statement": p['statement']
        }

print(f"Loaded {len(clusters)} clusters across 5 courses from 780 master bank.")

# Group by course and unit
units_map = {}
for cid, c in clusters.items():
    uid = c['unitId']
    course_id = c['courseId']
    if uid not in units_map:
        units_map[uid] = {
            "id": uid,
            "courseId": course_id,
            "unitCode": c['unitCode'],
            "clusters": []
        }
    units_map[uid]["clusters"].append(c)

# Friendly unit names
unit_names = {
    "GEN0102-U1": "Limits & Continuity",
    "GEN0102-U2": "Differentiation & Transcendental Applications",
    "GEN0102-U3": "Integral Calculus & Definite Integral Applications",
    "GEN0101-U1": "Algebraic Foundations, Factorization & Systems",
    "GEN0101-U2": "Trigonometry & Oblique Triangles",
    "GEN0101-U3": "Exponentials, Logarithms & Conics",
    "GEN0101-U4": "Numerical Analysis & Applied Methods",
    "GEN0110-U1": "Electrostatics & Charge Mechanics",
    "GEN0110-U2": "Circuits, Electromagnetism, Optics & Waves",
    "GEN0110-U3": "Modern Physics & Quantum Phenomena",
    "GEN0161-U1": "Thermodynamic Laws, Pure Substances & Steam",
    "GEN0161-U2": "Power Cycles, Heat Transfer, HVAC & Fluid Mechanics",
    "CTR0301-U1": "Automatic Control Systems, Transfer Functions & Stability",
    "BSIE3219-U1": "Engineering Economics & Capital Budgeting",
    "BSIE3219-U2": "Engineering Mechanics & Dynamics",
    "BSIE3219-U3": "Operations Research, Optimization & Industrial Sizing",
    "BSIE3219-U4": "Machine Design, Materials, Ergonomics & Systems Engineering"
}

# Generate TypeScript code
ts_lines = [
    "/**",
    " * Course Coverage Master Problem Bank (780 Calibrated Problems) Curriculum Registry",
    " * Automatically generated from authoritative 780 problems across 260 clusters.",
    " * Differential Equations (COURSE-GEN0107) is strictly preserved untouched in its original files.",
    " */",
    "",
    "import { CurriculumUnit, CurriculumTopic, LearningSkill } from './types';",
    "",
    "export const LEGACY_SKILL_TO_CLUSTER_MAP: Record<string, string> = {",
    "  'SKILL-GEN0102-001': 'GEN0102-U1-LIM',",
    "  'SKILL-GEN0102-002': 'GEN0102-U1-DIFF',",
    "  'SKILL-GEN0102-003': 'GEN0102-U1-DIFF',",
    "  'SKILL-GEN0102-004': 'GEN0102-U1-DIFF',",
    "  'SKILL-GEN0102-005': 'GEN0102-U1-DIFF',",
    "  'SKILL-GEN0102-006': 'GEN0102-U2-INV',",
    "  'SKILL-GEN0102-007': 'GEN0102-U2-LOG',",
    "  'SKILL-GEN0102-008': 'GEN0102-U2-LOG',",
    "  'SKILL-GEN0102-009': 'GEN0102-U2-IMP',",
    "  'SKILL-GEN0102-010': 'GEN0102-U2-IMP',",
    "  'SKILL-GEN0102-011': 'GEN0102-U1-DIFF',",
    "  'SKILL-GEN0102-012': 'GEN0102-U3-CRV',",
    "  'SKILL-GEN0102-013': 'GEN0102-U3-CRV',",
    "  'SKILL-GEN0102-014': 'GEN0102-U3-OPT',",
    "  'SKILL-GEN0102-015': 'GEN0102-U3-RATE'",
    "};",
    "",
    "export const GOLDEN_MASTER_NON_DIFFEQ_UNITS: CurriculumUnit[] = ["
]

for uid in sorted(units_map.keys()):
    u = units_map[uid]
    seq_match = re.search(r'U(\d+)', uid)
    seq = int(seq_match.group(1)) if seq_match else 1
    period = "PRELIM" if seq == 1 else "MIDTERM" if seq == 2 else "FINAL"
    name = unit_names.get(uid, f"Unit {seq}")
    ts_lines.append("  {")
    ts_lines.append(f"    id: {json.dumps(uid)},")
    ts_lines.append(f"    courseId: {json.dumps(u['courseId'])},")
    ts_lines.append(f"    sequence: {seq},")
    ts_lines.append(f"    period: {json.dumps(period)},")
    ts_lines.append(f"    officialName: {json.dumps(name)},")
    ts_lines.append(f"    normalizedName: {json.dumps(name)},")
    ts_lines.append(f"    totalHours: 18,")
    ts_lines.append(f"    learningOutcomesSummary: {json.dumps(f'Covers authoritative competencies for {name}')},")
    ts_lines.append("    sourceReference: {")
    ts_lines.append("      syllabusId: 'MASTER-BANK-780',")
    ts_lines.append("      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',")
    ts_lines.append(f"      rawTextExtract: {json.dumps(name)}")
    ts_lines.append("    }")
    ts_lines.append("  },")

ts_lines.append("];")
ts_lines.append("")
ts_lines.append("export const GOLDEN_MASTER_NON_DIFFEQ_TOPICS: CurriculumTopic[] = [")

for uid in sorted(units_map.keys()):
    u = units_map[uid]
    for idx, c in enumerate(u['clusters']):
        topic_name = c['topic'] or c['id']
        ts_lines.append("  {")
        ts_lines.append(f"    id: {json.dumps(c['id'])},")
        ts_lines.append(f"    unitId: {json.dumps(c['unitId'])},")
        ts_lines.append(f"    courseId: {json.dumps(c['courseId'])},")
        ts_lines.append(f"    sequence: {idx + 1},")
        ts_lines.append(f"    officialName: {json.dumps(topic_name)},")
        ts_lines.append(f"    normalizedName: {json.dumps(topic_name)},")
        ts_lines.append(f"    hours: 3,")
        ts_lines.append("    period: 'PRELIM',")
        ts_lines.append("    subtopics: [],")
        ts_lines.append("    sourceReference: {")
        ts_lines.append("      syllabusId: 'MASTER-BANK-780',")
        ts_lines.append("      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',")
        ts_lines.append(f"      rawTextExtract: {json.dumps(topic_name)}")
        ts_lines.append("    }")
        ts_lines.append("  },")

ts_lines.append("];")
ts_lines.append("")
ts_lines.append("export const GOLDEN_MASTER_NON_DIFFEQ_SKILLS: LearningSkill[] = [")

for cid in sorted(clusters.keys()):
    c = clusters[cid]
    canonical_name = c['topic'] or cid
    desc = c['structuralProgression'] or f"Demonstrate mastery of {canonical_name} across foundational, intermediate, and advanced levels."
    ts_lines.append("  {")
    ts_lines.append(f"    id: {json.dumps(cid)},")
    ts_lines.append(f"    canonicalName: {json.dumps(canonical_name)},")
    ts_lines.append(f"    description: {json.dumps(desc)},")
    ts_lines.append("    skillType: 'CALCULATION',")
    ts_lines.append("    dominantCompetency: 'APPLY',")
    ts_lines.append("    sourceType: 'SYLLABUS_EXPLICIT',")
    ts_lines.append("    role: 'PRIMARY',")
    ts_lines.append(f"    parentCourseId: {json.dumps(c['courseId'])},")
    ts_lines.append(f"    parentTopicId: {json.dumps(cid)},")
    ts_lines.append("    parentSubtopicIds: [],")
    ts_lines.append("    prerequisiteSkillIds: [],")
    ts_lines.append("    masteryEvidence: [")
    ts_lines.append(f"      {json.dumps(f'Correctly solves qualitative progression problems for {canonical_name}.')}")
    ts_lines.append("    ],")
    ts_lines.append("    evidenceTypes: ['DIRECT_CALCULATION'],")
    ts_lines.append("    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],")
    ts_lines.append("    status: 'APPROVED',")
    ts_lines.append("    sourceReferences: [{")
    ts_lines.append("      syllabusId: 'MASTER-BANK-780',")
    ts_lines.append("      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',")
    ts_lines.append(f"      rawTextExtract: {json.dumps(canonical_name)}")
    ts_lines.append("    }]")
    ts_lines.append("  },")

ts_lines.append("];")

with open(OUT_PATH, "w", encoding="utf-8") as f:
    f.write("\n".join(ts_lines) + "\n")

print(f"Generated {OUT_PATH} with {len(units_map)} units, {len(clusters)} topics, and {len(clusters)} skills.")
