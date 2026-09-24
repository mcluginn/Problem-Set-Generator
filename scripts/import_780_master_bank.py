import zipfile
import xml.etree.ElementTree as ET
import re
import json
import os
import sys

# Ensure project root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from scripts.math_normalizer import (
    normalize_pure_math,
    normalize_text_with_inline_math,
    normalize_step_text,
    extract_canonical_expression
)

DOCX_PATH = "Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx"
OUTPUT_JSON_PATH = os.path.join("src", "engine", "content", "master_bank_780.json")

def parse_docx(docx_path):
    if not os.path.exists(docx_path):
        raise FileNotFoundError(f"Authoritative file not found: {docx_path}")

    with zipfile.ZipFile(docx_path) as z:
        xml_content = z.read("word/document.xml")

    tree = ET.fromstring(xml_content)
    namespaces = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}

    paras = []
    for p in tree.iterfind(".//w:p", namespaces):
        texts = [t.text for t in p.iterfind(".//w:t", namespaces) if t.text]
        if texts:
            paras.append("".join(texts))

    problem_blocks = []
    current_block = []

    for p in paras:
        if re.match(r"^\[[A-Za-z0-9\-]+\]", p):
            if current_block:
                problem_blocks.append(current_block)
            current_block = [p]
        elif current_block:
            current_block.append(p)

    if current_block:
        problem_blocks.append(current_block)

    print(f"Total problem blocks detected: {len(problem_blocks)}")
    return problem_blocks

def parse_problem_block(block, idx):
    header_line = block[0]
    parts = [part.strip() for part in re.split(r'[\u2022\u00b7\u25cf\uff65\u25aa\u25fe\u00ad\ufffd]+', header_line)]

    id_match = re.match(r"^\[([A-Za-z0-9\-]+)\]", parts[0])
    if not id_match:
        raise ValueError(f"Block {idx}: Cannot extract ID from '{header_line}'")
    prob_id = id_match.group(1)

    course_code = parts[1] if len(parts) > 1 else ""
    course_name = parts[2] if len(parts) > 2 else ""
    level_str = parts[3] if len(parts) > 3 else ""

    tokens = prob_id.split("-")
    course_prefix = tokens[0]
    unit_code = tokens[1] if len(tokens) > 1 else "U1"
    cluster_id = "-".join(tokens[:3]) if len(tokens) >= 4 else prob_id
    level_token = tokens[3] if len(tokens) > 3 else "L1"

    diff = 1
    diff_label = "Level 1: Foundational / Easy"
    if level_token == "L2" or "LEVEL 2" in level_str or "INTERMEDIATE" in level_str:
        diff = 2
        diff_label = "Level 2: Intermediate / Medium"
    elif level_token == "L3" or "LEVEL 3" in level_str or "ADVANCED" in level_str:
        diff = 3
        diff_label = "Level 3: Advanced & Applied / Hard"

    # Map courseId
    course_id = f"COURSE-{course_prefix}"
    if course_prefix == "GEN0110":
        course_code = "GEN 0110 / 0110L"
        course_name = "Physics 2 for Engineers"
    elif course_prefix == "GEN0102":
        course_code = "GEN 0102"
        course_name = "Calculus 1"
    elif course_prefix == "GEN0101":
        course_code = "GEN 0101"
        course_name = "Mathematics for Engineers"
    elif course_prefix == "GEN0161":
        course_code = "GEN 0161"
        course_name = "Thermodynamics"
    elif course_prefix == "BSIE3219":
        course_code = "BSIE 3219"
        course_name = "IE Special Topics 1"

    unit_id = f"{course_prefix}-{unit_code}"

    # Extract fields from remaining lines
    structural_progression = ""
    statement = ""
    topic_title = ""
    derivation_lines = []
    in_derivation = False
    canonical_answer = ""
    accepted_equivalents = []
    recognition_hint = ""
    setup_hint = ""
    common_mistake = ""

    for line in block[1:]:
        line = line.strip()
        if not line:
            continue

        if line.startswith("Structural Progression Architecture:"):
            structural_progression = line.split("Structural Progression Architecture:", 1)[1].strip()
            in_derivation = False
        elif line.startswith("Problem Statement"):
            in_derivation = False
            topic_match = re.search(r"Problem Statement\s*\((.*?)\)\s*:\s*(.*)", line)
            if topic_match:
                topic_title = topic_match.group(1).strip()
                statement = topic_match.group(2).strip()
            else:
                prob_part = re.sub(r"^Problem Statement\s*:\s*", "", line)
                statement = prob_part.strip()
        elif line.startswith("Step-by-Step Analytical Derivation:"):
            in_derivation = True
        elif in_derivation and ("Deterministic Canonical Answer" in line):
            in_derivation = False
            # Parse answer, equivalents, hints from this line or section
            line_after = re.split(r"Deterministic Canonical Answer(?::|\s)", line, maxsplit=1)
            after_ans = line_after[1].strip() if len(line_after) > 1 else ""

            if "Accepted Equivalent Representations:" in after_ans:
                ans_part, rest = after_ans.split("Accepted Equivalent Representations:", 1)
                canonical_answer = ans_part.strip()

                if "Socratic Scaffolding & Misconception Alert:" in rest:
                    equiv_part, scaffold_part = rest.split("Socratic Scaffolding & Misconception Alert:", 1)
                    accepted_equivalents = [e.strip() for e in re.split(r"[,;]+", equiv_part) if e.strip()]

                    rec_m = re.search(r"\[Recognition Hint:\s*(.*?)\]", scaffold_part)
                    if rec_m:
                        recognition_hint = rec_m.group(1).strip()
                    set_m = re.search(r"\[Setup Hint:\s*(.*?)\]", scaffold_part)
                    if set_m:
                        setup_hint = set_m.group(1).strip()
                    mis_m = re.search(r"\[Common Mistake:\s*(.*?)\]", scaffold_part)
                    if mis_m:
                        common_mistake = mis_m.group(1).strip()
                else:
                    accepted_equivalents = [e.strip() for e in re.split(r"[,;]+", rest) if e.strip()]
            else:
                canonical_answer = after_ans.strip()
        elif in_derivation:
            derivation_lines.append(line)
        else:
            # Check for standalone hint or answer lines
            if "Deterministic Canonical Answer:" in line:
                canonical_answer = line.split("Deterministic Canonical Answer:", 1)[1].strip()
            elif "Accepted Equivalent Representations:" in line:
                equiv_part = line.split("Accepted Equivalent Representations:", 1)[1].strip()
                accepted_equivalents = [e.strip() for e in re.split(r"[,;]+", equiv_part) if e.strip()]
            elif "[Recognition Hint:" in line:
                rec_m = re.search(r"\[Recognition Hint:\s*(.*?)\]", line)
                if rec_m:
                    recognition_hint = rec_m.group(1).strip()
            elif "[Setup Hint:" in line:
                set_m = re.search(r"\[Setup Hint:\s*(.*?)\]", line)
                if set_m:
                    setup_hint = set_m.group(1).strip()
            elif "[Common Mistake:" in line:
                mis_m = re.search(r"\[Common Mistake:\s*(.*?)\]", line)
                if mis_m:
                    common_mistake = mis_m.group(1).strip()

    # Parse derivation steps
    full_deriv_text = " ".join(derivation_lines)
    raw_steps = [s.strip() for s in re.split(r'(?:[\u2022\u00b7\u25cf\ufffd\*\-]\s*)?Step\s*\d+:\s*', full_deriv_text) if s.strip()]

    # If steps didn't split into >= 2, decompose by numbered sub-steps or statements
    if len(raw_steps) < 2:
        sub = [s.strip() for s in re.split(r'(?=\b\d+\)\s*)|(?=[A-Z]_\d+\s*=|\bC\s*=)', full_deriv_text) if s.strip()]
        if len(sub) >= 2:
            raw_steps = sub
        else:
            raw_steps = [s.strip() for s in re.split(r'(?<=\.)\s+(?=[A-Z])', full_deriv_text) if s.strip()]

    steps = raw_steps if len(raw_steps) >= 2 else [l for l in derivation_lines if l.strip()]

    # Structural Family ID: uniquely identifies the underlying structural reasoning family
    # Within a cluster, Level 1, Level 2, Level 3 represent distinct structural progressions
    family_id = f"FAM-{cluster_id}-{level_token}"

    # Semantic mathematical normalization preserving original raw source
    clean_intro, expr_latex = extract_canonical_expression(statement)
    if expr_latex:
        statement_normalized = f"{clean_intro}\n\\[ {expr_latex} \\]"
        expression_latex = expr_latex
    else:
        statement_normalized = normalize_text_with_inline_math(statement)
        expression_latex = ""

    canonical_answer_latex = normalize_pure_math(canonical_answer)
    derivation_steps_normalized = [normalize_step_text(s) for s in steps]
    recognition_hint_normalized = normalize_text_with_inline_math(recognition_hint)
    setup_hint_normalized = normalize_text_with_inline_math(setup_hint)
    common_mistake_normalized = normalize_text_with_inline_math(common_mistake)

    return {
        "id": prob_id,
        "masterProblemId": prob_id,
        "courseId": course_id,
        "courseCode": course_code or course_prefix,
        "courseName": course_name,
        "unitId": unit_id,
        "unitCode": unit_code,
        "clusterId": cluster_id,
        "skillClusterId": cluster_id,
        "problemFamilyId": family_id,
        "skillId": cluster_id,
        "difficulty": diff,
        "difficultyLabel": diff_label,
        "structuralProgression": structural_progression,
        "topic": topic_title or cluster_id,
        "statement": statement,
        "statementNormalized": statement_normalized,
        "expressionLatex": expression_latex,
        "derivationSteps": steps,
        "derivationStepsNormalized": derivation_steps_normalized,
        "canonicalAnswer": canonical_answer,
        "canonicalAnswerLatex": canonical_answer_latex,
        "acceptedEquivalents": accepted_equivalents,
        "recognitionHint": recognition_hint,
        "recognitionHintNormalized": recognition_hint_normalized,
        "setupHint": setup_hint,
        "setupHintNormalized": setup_hint_normalized,
        "commonMistake": common_mistake,
        "commonMistakeNormalized": common_mistake_normalized
    }

def main():
    print(f"Reading {DOCX_PATH}...")
    blocks = parse_docx(DOCX_PATH)
    if len(blocks) != 780:
        raise ValueError(f"Expected exactly 780 problem blocks, found {len(blocks)}")

    parsed_problems = []
    seen_ids = set()
    clusters = {}
    course_counts = {}

    for idx, b in enumerate(blocks):
        prob = parse_problem_block(b, idx)

        # Integrity validations
        if prob["id"] in seen_ids:
            raise ValueError(f"Duplicate problem ID found: {prob['id']}")
        seen_ids.add(prob["id"])

        if not prob["canonicalAnswer"]:
            raise ValueError(f"Missing canonical answer for {prob['id']}")

        if not prob["statement"]:
            raise ValueError(f"Missing statement for {prob['id']}")

        if len(prob["derivationSteps"]) < 2:
            raise ValueError(f"Problem {prob['id']} has fewer than 2 derivation steps ({len(prob['derivationSteps'])})")

        cluster_id = prob["clusterId"]
        clusters.setdefault(cluster_id, []).append(prob["difficulty"])
        course_counts[prob["courseCode"]] = course_counts.get(prob["courseCode"], 0) + 1

        parsed_problems.append(prob)

    print("\n--- 780 BANK INGESTION SUMMARY ---")
    print(f"Total problems parsed & validated: {len(parsed_problems)}")
    print(f"Total distinct clusters: {len(clusters)}")
    if len(clusters) != 260:
        raise ValueError(f"Expected 260 clusters, found {len(clusters)}")

    # Verify every cluster has exactly difficulty 1, 2, 3
    invalid_clusters = {cid: diffs for cid, diffs in clusters.items() if sorted(diffs) != [1, 2, 3]}
    if invalid_clusters:
        raise ValueError(f"Clusters with invalid difficulty distribution: {invalid_clusters}")
    print("All 260 clusters have exact [Level 1, Level 2, Level 3] progression.")

    print("\nCourse distribution:")
    for c, cnt in sorted(course_counts.items()):
        print(f"  {c}: {cnt} problems ({cnt // 3} clusters)")

    # Save to JSON
    os.makedirs(os.path.dirname(OUTPUT_JSON_PATH), exist_ok=True)
    with open(OUTPUT_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(parsed_problems, f, indent=2, ensure_ascii=False)

    print(f"\nSuccessfully wrote {len(parsed_problems)} problems to {OUTPUT_JSON_PATH}")

if __name__ == "__main__":
    main()
