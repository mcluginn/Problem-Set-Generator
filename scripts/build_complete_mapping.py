import json

bank = json.load(open('src/engine/content/master_bank_780.json', encoding='utf-8'))
curr = json.load(open('scripts/curriculum_dump.json', encoding='utf-8'))

# Collect all 260 distinct clusters
clusters = {}
for p in bank:
    cid = p['courseId']
    clid = p['clusterId']
    if clid not in clusters:
        clusters[clid] = {
            'clusterId': clid,
            'courseId': cid,
            'unitId': p['unitId'],
            'topic': p['topic']
        }

print(f"Total clusters to map: {len(clusters)}")

# Let's inspect cluster prefixes and topics
by_course = {}
for clid, info in sorted(clusters.items()):
    by_course.setdefault(info['courseId'], []).append(info)

for cid, cls in by_course.items():
    print(f"\n{cid}: {len(cls)} clusters")
    for c in cls:
        print(f"  {c['clusterId']}: [{c['unitId']}] {c['topic']}")
