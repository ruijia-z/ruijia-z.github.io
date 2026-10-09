"""Validate content integrity and archive links without extra dependencies."""
import datetime as dt
import json
import re
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT / '_data/research_ledger.json').read_text())
statuses = {'open', 'partial', 'preprint', 'established', 'watch', 'released'}
evidence = {'explicit', 'extension', 'theorem', 'official'}
topics = {x['id'] for x in data['topics']}
assert len(topics) == len(data['topics'])
ids = set()
scan_date = dt.date.fromisoformat(data['last_scan']['checked_on'])
for sid, source in data['sources'].items():
    assert urlparse(source['url']).scheme == 'https', sid
    assert source['type'] in {'paper', 'official', 'discussion'}, sid
    assert all(source.get(k) for k in ['title', 'authors', 'date', 'version', 'read_depth']), sid
    assert dt.date.fromisoformat(source['date']) <= scan_date, sid
for item in data['entries']:
    uid = item['id']
    assert re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', uid), uid
    assert uid not in ids, uid
    ids.add(uid)
    assert item['status'] in statuses and item['evidence'] in evidence, uid
    assert item['kind'] in {'question', 'result', 'ai'}, uid
    assert item['priority'] in [1, 2, 3], uid
    assert item['topics'] and set(item['topics']) <= topics, uid
    assert item['source_ids'] and set(item['source_ids']) <= data['sources'].keys(), uid
    if item['status'] == 'open':
        assert item['evidence'] == 'explicit' and item['kind'] == 'question', uid
    if item['evidence'] == 'extension':
        assert item['status'] == 'watch', uid
    assert item['history'], uid
    for k in ['source_date', 'added_on', 'updated_on', 'checked_on']:
        assert dt.date.fromisoformat(item[k]) <= scan_date, (uid, k)
    assert item['updated_on'] >= item['added_on'], uid
    for k in ['title', 'summary', 'formulation', 'known', 'gap', 'method', 'relevance', 'next_step']:
        assert isinstance(item[k], str) and item[k].strip(), (uid, k)
        assert not re.search(r'</?[a-zA-Z][^>]*>', item[k]), (uid, k, 'HTML')
    for week in item['issues']:
        assert re.fullmatch(r'\d{8}-\d{8}', week), week
        page = ROOT / f'_pages/research-updates/{week}.md'
        assert page.exists(), page
        text = page.read_text()
        assert f'permalink: /research/{week}/' in text and 'weekly_update: true' in text
assert data['schema_version'] == 1
assert data['schedule']['timezone'] == 'Asia/Shanghai'
print(f'OK: {len(ids)} entries, {len(data["sources"])} sources, archive links and status constraints.')
