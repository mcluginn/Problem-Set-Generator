import zipfile
import xml.etree.ElementTree as ET
import re
import json
import os

DOCX_PATH = r"Engineering Practice Engine - Golden Master Problem Bank (540 Perfectly Aligned Problems).docx"
ALL_540_OUT = r"src/engine/content/golden_master_all_540.json"
NON_DIFFEQ_OUT = r"src/engine/content/golden_master_non_diffeq_510.json"

def extract_docx_paragraphs(path):
    with zipfile.ZipFile(path) as z:
        with z.open('word/document.xml') as f:
            tree = ET.parse(f)
            root = tree.getroot()

    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    paragraphs = []
    for p in root.iter(f"{{{ns['w']}}}p"):
        texts = [t.text for t in p.iter(f"{{{ns['w']}}}t") if t.text]
        if texts:
            paragraphs.append("".join(texts))
    return paragraphs

def parse_golden_master():
    paragraphs = extract_docx_paragraphs(DOCX_PATH)
    print(f"Total paragraphs in docx: {len(paragraphs)}")
    
    problem_starts = []
    for i, p in enumerate(paragraphs):
        p_clean = p.strip()
        if p_clean.startswith('[') and ']' in p_clean:
            id_part = p_clean[p_clean.find('[')+1:p_clean.find(']')]
            if re.match(r'^[A-Za-z0-9_\-]+-L[123]-\d+$', id_part):
                problem_starts.append((i, id_part, p_clean))

    print(f"Found {len(problem_starts)} problem headers")
    if len(problem_starts) != 540:
        raise ValueError(f"Expected 540 problems, found {len(problem_starts)}")

    parsed_problems = []

    for idx, (p_idx, pid, header_text) in enumerate(problem_starts):
        end_idx = problem_starts[idx + 1][0] if idx + 1 < len(problem_starts) else len(paragraphs)
        chunk = paragraphs[p_idx:end_idx]
        
        # Parse header
        # e.g. [GEN0102-U1-LIM-L1-001] · GEN 0102 · Calculus 1 · LEVEL 1: FOUNDATIONAL (EASY)
        header_content = header_text[header_text.find(']')+1:].strip()
        header_content = re.sub(r'^[·•\-–—\|\s]+', '', header_content)
        
        level_match = re.search(r'LEVEL\s*([123]):\s*(.*)$', header_content, re.IGNORECASE)
        level = int(re.search(r'-L([123])-\d+$', pid).group(1))
        level_qualifier = level_match.group(2).strip() if level_match else f"LEVEL {level}"
        
        pre_level = header_content[:level_match.start()].strip() if level_match else header_content
        parts = [p.strip() for p in re.split(r'[·•\-–—\|]', pre_level) if p.strip()]
        course_code_raw = parts[0] if len(parts) > 0 else pid.split('-')[0]
        course_name_raw = parts[1] if len(parts) > 1 else ""
        
        cluster_id = re.sub(r'-L[123]-\d+$', '', pid)
        # Unit ID
        m_unit = re.match(r'^([A-Za-z0-9]+)-(U\d+)', cluster_id)
        unit_code = m_unit.group(2) if m_unit else "U1"
        
        # Course ID resolution from canonical cluster prefix
        prefix = cluster_id.split('-')[0]
        course_id_map = {
            'GEN0101': 'COURSE-GEN0101',
            'GEN0102': 'COURSE-GEN0102',
            'GEN0107': 'COURSE-GEN0107',
            'GEN0110': 'COURSE-GEN0110',
            'GEN0161': 'COURSE-GEN0161',
            'CTR0301': 'COURSE-CTR0301',
            'BSIE3219': 'COURSE-BSIE3219'
        }
        course_id = course_id_map.get(prefix, f"COURSE-{prefix}")
        unit_id = f"{prefix}-{unit_code}"
        
        full_text = "\n".join(chunk[1:])
        
        # 1. Structural Progression
        structural_progression = ""
        m_struct = re.search(r'Structural Progression Architecture:\s*(.*?)(?=\nProblem Statement|\nStep-by-Step|$)', full_text, re.DOTALL)
        if m_struct:
            structural_progression = m_struct.group(1).strip()
            
        # 2. Problem Statement
        problem_topic = ""
        problem_statement = ""
        m_stmt = re.search(r'Problem Statement\s*(?:\((.*?)\))?:\s*(.*?)(?=\nStep-by-Step|\nDeterministic Canonical Answer|$)', full_text, re.DOTALL)
        if m_stmt:
            problem_topic = m_stmt.group(1).strip() if m_stmt.group(1) else ""
            problem_statement = m_stmt.group(2).strip()
            
        # 3. Step-by-Step Derivation
        derivation_steps = []
        m_deriv = re.search(r'Step-by-Step Analytical Derivation:\s*(.*?)(?=\nDeterministic Canonical Answer|Deterministic Canonical Answer|$)', full_text, re.DOTALL)
        if m_deriv:
            deriv_text = m_deriv.group(1).strip()
            step_matches = re.findall(r'(?:[•·\*\-]?\s*Step\s*\d+:.*?)(?=(?:[•·\*\-]?\s*Step\s*\d+:|$))', deriv_text, re.DOTALL)
            if step_matches:
                derivation_steps = [s.strip() for s in step_matches if s.strip()]
            else:
                derivation_steps = [deriv_text]
                
        # 4. Canonical Answer
        canonical_answer = ""
        m_ans = re.search(r'Deterministic Canonical Answer:\s*(.*?)(?=Accepted Equivalent Representations:|$)', full_text, re.DOTALL)
        if m_ans:
            canonical_answer = m_ans.group(1).strip()
            
        # 5. Accepted Equivalents
        accepted_equivalents = []
        m_equiv = re.search(r'Accepted Equivalent Representations:\s*(.*?)(?=Socratic Scaffolding & Misconception Alert:|$)', full_text, re.DOTALL)
        if m_equiv:
            equiv_raw = m_equiv.group(1).strip()
            accepted_equivalents = [e.strip() for e in re.split(r'[,;]', equiv_raw) if e.strip()]
            
        # 6. Hints & Common Mistake
        recognition_hint = ""
        m_rec = re.search(r'\[Recognition Hint:\s*(.*?)\]', full_text, re.DOTALL)
        if m_rec:
            recognition_hint = m_rec.group(1).strip()
            
        setup_hint = ""
        m_set = re.search(r'\[Setup Hint:\s*(.*?)\]', full_text, re.DOTALL)
        if m_set:
            setup_hint = m_set.group(1).strip()
            
        common_mistake = ""
        m_mis = re.search(r'\[Common Mistake:\s*(.*?)\]', full_text, re.DOTALL)
        if m_mis:
            common_mistake = m_mis.group(1).strip()
            
        prob = {
            "id": pid,
            "courseId": course_id,
            "courseCode": course_code_raw,
            "courseName": course_name_raw,
            "unitId": unit_id,
            "unitCode": unit_code,
            "clusterId": cluster_id,
            "skillId": cluster_id,
            "difficulty": level,
            "difficultyLabel": level_qualifier,
            "structuralProgression": structural_progression,
            "topic": problem_topic,
            "statement": problem_statement,
            "derivationSteps": derivation_steps,
            "canonicalAnswer": canonical_answer,
            "acceptedEquivalents": accepted_equivalents,
            "recognitionHint": recognition_hint,
            "setupHint": setup_hint,
            "commonMistake": common_mistake
        }
        parsed_problems.append(prob)

    return parsed_problems

def main():
    problems = parse_golden_master()
    print(f"Successfully parsed {len(problems)} total problems.")
    
    # Save all 540
    os.makedirs(os.path.dirname(ALL_540_OUT), exist_ok=True)
    with open(ALL_540_OUT, 'w', encoding='utf-8') as f:
        json.dump(problems, f, indent=2, ensure_ascii=False)
    print(f"Saved complete 540 problem bank to {ALL_540_OUT}")
    
    # Filter out Differential Equations (GEN0107) to enforce strict freeze
    non_diffeq = [p for p in problems if p['courseId'] != 'COURSE-GEN0107']
    diffeq_omitted = [p for p in problems if p['courseId'] == 'COURSE-GEN0107']
    
    print(f"Total non-DiffEq problems: {len(non_diffeq)}")
    print(f"Total DiffEq problems omitted (preserved as immutable): {len(diffeq_omitted)}")
    
    if len(non_diffeq) != 510:
        raise ValueError(f"Expected 510 non-DiffEq problems, got {len(non_diffeq)}")
    if len(diffeq_omitted) != 30:
        raise ValueError(f"Expected 30 omitted DiffEq problems, got {len(diffeq_omitted)}")
        
    with open(NON_DIFFEQ_OUT, 'w', encoding='utf-8') as f:
        json.dump(non_diffeq, f, indent=2, ensure_ascii=False)
    print(f"Saved non-DiffEq 510 problem bank to {NON_DIFFEQ_OUT}")

if __name__ == "__main__":
    main()
