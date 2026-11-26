import json,subprocess,time
names=[l.split()[1] for l in open('curated.txt') if l.strip()]
out={}
batch=[]
def run(b):
    q=' '.join('repo:'+n for n in b)
    r=subprocess.run(['gh','api','-X','GET','search/repositories','-f','q='+q,'-f','per_page=100'],capture_output=True,text=True)
    if r.returncode: print('ERR',r.stderr[:200]); return
    for it in json.loads(r.stdout)['items']:
        out[it['full_name'].lower()]=dict(full_name=it['full_name'],html_url=it['html_url'],description=it['description'],stars=it['stargazers_count'],forks=it['forks_count'],pushed_at=it['pushed_at'],created_at=it['created_at'],language=it['language'],license=(it['license'] or {}).get('spdx_id','NONE'),open_issues=it['open_issues_count'],archived=it['archived'],topics=it.get('topics',[]),default_branch=it['default_branch'],size_kb=it['size'])
for n in names:
    batch.append(n)
    if len(' '.join('repo:'+x for x in batch))>230:
        last=batch.pop(); run(batch); batch=[last]; time.sleep(2.2)
if batch: run(batch)
json.dump(out,open('meta.json','w'),indent=1)
missing=[n for n in names if n.lower() not in out]
print(len(out),'missing:',missing)
