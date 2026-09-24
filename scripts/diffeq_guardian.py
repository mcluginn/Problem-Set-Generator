import json
import os
import hashlib
import re

WORKSPACE_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASELINE_FILE = os.path.join(WORKSPACE_ROOT, "scripts", "diffeq_baseline.json")

def extract_diffeq_dataset():
    data = {}
    
    # 1. Course in courses.ts
    courses_path = os.path.join(WORKSPACE_ROOT, "src", "engine", "curriculum", "courses.ts")
    with open(courses_path, "r", encoding="utf-8") as f:
        courses_txt = f.read()
    c_match = re.search(r"\{\s*id:\s*['\"]COURSE-GEN0107['\"].*?\n  \}", courses_txt, re.DOTALL)
    data["course"] = c_match.group(0).strip() if c_match else ""
    
    # 2. Units in coverage.ts
    cov_path = os.path.join(WORKSPACE_ROOT, "src", "engine", "curriculum", "coverage.ts")
    with open(cov_path, "r", encoding="utf-8") as f:
        cov_txt = f.read()
    
    units = []
    for m in re.finditer(r"\{\s*id:\s*['\"](UNIT-GEN0107-[^'\"]+)['\"].*?\n  \}", cov_txt, re.DOTALL):
        units.append(m.group(0).strip())
    data["units"] = sorted(units)
    
    # 3. Topics in coverage.ts (associated with COURSE-GEN0107)
    topics = []
    for m in re.finditer(r"\{\s*id:\s*['\"](CURR-GEN0107-[^'\"]+)['\"].*?courseId:\s*['\"]COURSE-GEN0107['\"].*?\n  \}", cov_txt, re.DOTALL):
        topics.append(m.group(0).strip())
    data["topics"] = sorted(topics)
    
    # 4. Skills in skills.ts
    skills_path = os.path.join(WORKSPACE_ROOT, "src", "engine", "curriculum", "skills.ts")
    with open(skills_path, "r", encoding="utf-8") as f:
        skills_txt = f.read()
    skills = []
    for m in re.finditer(r"\{\s*id:\s*['\"](SKILL-GEN0107-[^'\"]+)['\"].*?parentCourseId:\s*['\"]COURSE-GEN0107['\"].*?\n  \}", skills_txt, re.DOTALL):
        skills.append(m.group(0).strip())
    data["skills"] = sorted(skills)
    
    # 5. Families in problemFamilies.ts
    fam_path = os.path.join(WORKSPACE_ROOT, "src", "engine", "content", "problemFamilies.ts")
    with open(fam_path, "r", encoding="utf-8") as f:
        fam_txt = f.read()
    families = []
    for m in re.finditer(r"['\"](FAM-GEN0107-[^'\"]+)['\"]:\s*\{.*?courseId:\s*['\"]COURSE-GEN0107['\"].*?\n  \}", fam_txt, re.DOTALL):
        families.append(m.group(0).strip())
    data["families"] = sorted(families)
    
    # 6. Entire standalone files dedicated to Differential Equations
    for rel_path in [
        ["src", "engine", "content", "archetypeRegistry.ts"],
        ["src", "engine", "content", "conceptRegistry.ts"],
        ["src", "engine", "content", "conceptValidator.ts"]
    ]:
        p = os.path.join(WORKSPACE_ROOT, *rel_path)
        if os.path.exists(p):
            with open(p, "rb") as f:
                data["/".join(rel_path)] = hashlib.sha256(f.read()).hexdigest()
                
    # 7. ODE validator in domainValidators.ts
    dom_path = os.path.join(WORKSPACE_ROOT, "src", "engine", "content", "domainValidators.ts")
    with open(dom_path, "r", encoding="utf-8") as f:
        dom_txt = f.read()
    m_ode = re.search(r"public static validateODE\(.*?return \{.*?valid:.*?status:.*?\};\s*\}", dom_txt, re.DOTALL)
    data["validateODE"] = m_ode.group(0).strip() if m_ode else ""
    
    # 8. All test files dedicated to Differential Equations
    for rel_test in [
        ["tests", "content", "ode-content.test.ts"],
        ["tests", "integration", "castro-application-diversity.test.ts"],
        ["tests", "integration", "castro-diversity-archetypes.test.ts"],
        ["tests", "integration", "de-concept-alignment.test.ts"]
    ]:
        p = os.path.join(WORKSPACE_ROOT, *rel_test)
        if os.path.exists(p):
            with open(p, "rb") as f:
                data["/".join(rel_test)] = hashlib.sha256(f.read()).hexdigest()
    
    return data

def save_baseline():
    dataset = extract_diffeq_dataset()
    with open(BASELINE_FILE, "w", encoding="utf-8") as f:
        json.dump(dataset, f, indent=2)
    print(f"Differential Equations baseline captured to {BASELINE_FILE}")
    print(f"  - Course: {bool(dataset['course'])}")
    print(f"  - Units: {len(dataset['units'])}")
    print(f"  - Topics: {len(dataset['topics'])}")
    print(f"  - Skills: {len(dataset['skills'])}")
    print(f"  - Families: {len(dataset['families'])}")

def verify():
    if not os.path.exists(BASELINE_FILE):
        save_baseline()
    with open(BASELINE_FILE, "r", encoding="utf-8") as f:
        baseline = json.load(f)
    current = extract_diffeq_dataset()
    
    diffs = []
    for key in baseline:
        if baseline[key] != current.get(key):
            diffs.append(key)
            
    if diffs:
        print(f"CRITICAL FAILURE: Differential Equations dataset has {len(diffs)} differences!")
        for d in diffs:
            print(f"  - Discrepancy in: {d}")
        exit(1)
    else:
        print("SUCCESS: ZERO changes to Differential Equations. 100% IMMUTABLE & VERIFIED.")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "verify":
        verify()
    else:
        save_baseline()
        verify()
