import json

curr = json.load(open('scripts/curriculum_dump.json', encoding='utf-8'))
bank = json.load(open('src/engine/content/master_bank_780.json', encoding='utf-8'))

# Collect clusters
clusters_by_course = {}
for p in bank:
    cid = p['courseId']
    clusters_by_course.setdefault(cid, {})
    if p['clusterId'] not in clusters_by_course[cid]:
        clusters_by_course[cid][p['clusterId']] = {
            'unitId': p['unitId'],
            'topic': p['topic']
        }

# Group skills by course
skills_by_course = {}
for s in curr['skills']:
    skills_by_course.setdefault(s['courseId'], []).append(s)

# Group topics by course
topics_by_course = {}
for t in curr['topics']:
    topics_by_course.setdefault(t['courseId'], []).append(t)

for cid in ['COURSE-BSIE3219', 'COURSE-GEN0101', 'COURSE-GEN0102', 'COURSE-GEN0110']:
    print(f"\n=== {cid} ===")
    print(f"Skills ({len(skills_by_course.get(cid, []))}):")
    for s in skills_by_course.get(cid, []):
        print(f"  {s['id']}: {s['name'][:65]} ({s['topicId']})")
    print(f"Clusters ({len(clusters_by_course.get(cid, []))}):")
    for clid, info in sorted(clusters_by_course.get(cid, {}).items()):
        print(f"  {clid} [{info['unitId']}]: {info['topic'][:65]}")
