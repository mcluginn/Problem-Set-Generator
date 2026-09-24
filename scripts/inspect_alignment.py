import json

curr = json.load(open('scripts/curriculum_dump.json', encoding='utf-8'))
bank = json.load(open('src/engine/content/master_bank_780.json', encoding='utf-8'))

# Group clusters by course
clusters_by_course = {}
for p in bank:
    cid = p['courseId']
    clusters_by_course.setdefault(cid, {})
    if p['clusterId'] not in clusters_by_course[cid]:
        clusters_by_course[cid][p['clusterId']] = {
            'unitId': p['unitId'],
            'topic': p['topic']
        }

# Group syllabus topics and skills by course
skills_by_course = {}
for s in curr['skills']:
    skills_by_course.setdefault(s['courseId'], []).append(s)

topics_by_course = {}
for t in curr['topics']:
    topics_by_course.setdefault(t['courseId'], []).append(t)

for cid in sorted(clusters_by_course.keys()):
    print(f"\n==========================================")
    print(f"COURSE: {cid}")
    print(f"==========================================")
    print(f"Syllabus Topics ({len(topics_by_course.get(cid, []))}):")
    for t in topics_by_course.get(cid, []):
        print(f"  {t['id']} ({t['unitId']}): {t['name']}")
    
    print(f"\nSyllabus Skills ({len(skills_by_course.get(cid, []))}):")
    for s in skills_by_course.get(cid, []):
        print(f"  {s['id']} (Topic: {s['topicId']}): {s['name']}")
        
    print(f"\n780 Bank Clusters ({len(clusters_by_course[cid])}):")
    for clid, info in sorted(clusters_by_course[cid].items()):
        print(f"  {clid} [{info['unitId']}]: {info['topic']}")
