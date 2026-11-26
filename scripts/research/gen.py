import json,glob,re,datetime
CHECK='2026-11-26'
TODAY=datetime.date(2026,11,26)
meta=json.load(open('meta.json'))
trees={json.load(open(f))['name'].lower():json.load(open(f)) for f in glob.glob('trees/*.json')}
cat={l.split()[1].lower():l.split()[0] for l in open('curated.txt') if l.strip()}
# verified licence overrides (read LICENSE file directly)
LIC={'nodemailer/nodemailer':'MIT','nodemailer/mailparser':'MIT','postalsys/imapflow':'MIT','postalsys/postal-mime':'MIT','postalsys/mailauth':'MIT',
 'postalsys/emailengine':'Commercial (EmailEngine Licence v3.0)','dakheera47/job-ops':'Commons Clause (no selling)','rishilahoti/ashby-job-scraper':'MIT + Commons Clause',
 'wodsuz/easyapplyjobsbot':'CC BY-NC-style (non-commercial)','alpharomercoma/ts-jobspy':'MIT','remoteintech/remote-jobs':'ISC (+MIT, OFL)',
 'n8n-io/n8n':'Sustainable Use License','elie222/inbox-zero':'AGPL-3.0 + additional terms','forwardemail/forwardemail.net':'MPL-2.0 + BSL-1.1',
 'stalwartlabs/stalwart':'AGPL-3.0 / SEL dual','notifuse/notifuse':'BSL-1.1 (+AGPL SDK)','rustmailer/rustmailer':'Custom proprietary-style',
 'laudspeaker/laudspeaker':'MIT + ee/ commercial','paulledemon/email-automation':'AGPL-3.0 + extra clauses','lakshay1509/neatmail':'Elastic-2.0',
 'mastra-ai/mastra':'Apache-2.0 + ee/ commercial','vercel/ai':'Apache-2.0','activepieces/activepieces':'MIT + ee/ commercial','meilisearch/meilisearch':'MIT + BSL EE',
 'posthog/posthog':'MIT + ee/ commercial','cloudflare/queues-web-crawler':'Apache-2.0','mirza-rizvi/resolvehq':'Source-available (internal use)'}
def lic(n):
    return LIC.get(n, meta[n]['license'] if meta[n]['license'] not in ('NOASSERTION',None) else 'NONE')
def lic_score(l):
    u=l.upper()
    if any(x in u for x in ['COMMONS','ELASTIC','BSL','SUSTAINABLE','COMMERCIAL','PROPRIETARY','SOURCE-AVAILABLE','NON-COMMERCIAL']): return 2
    if u.startswith('AGPL') or 'AGPL' in u.split()[0]: return 4
    if u.startswith('GPL'): return 6
    if u.startswith(('LGPL','MPL')): return 10
    if u in ('NONE',''): return 0
    if 'EE/' in u or '+ EE' in u: return 12
    return 15
def age(n):
    t=trees.get(n,{}); d=t.get('last_commit') or meta[n]['pushed_at']
    return (TODAY-datetime.date.fromisoformat(d[:10])).days, d[:10]
def maint(n):
    if meta[n]['archived']: return 0
    a,_=age(n)
    return 15 if a<=30 else 12 if a<=90 else 9 if a<=180 else 6 if a<=365 else 3 if a<=730 else 1
def docs(n):
    t=trees.get(n,{}); s=0; k=t.get('tests',0)
    s+= 0 if k==0 else 2 if k<10 else 4 if k<50 else 5
    s+= 2 if t.get('ci') else 0
    s+= 1 if (t.get('contributing') or t.get('docs')) else 0
    s+= 1 if t.get('security') else 0
    s+= 1 if t.get('changelog') else 0
    return min(s,10)
def comm(n):
    s=meta[n]['stars']; return 5 if s>=20000 else 4 if s>=5000 else 3 if s>=1000 else 2 if s>=200 else 1 if s>=50 else 0
FLAGS=[('next"','Next.js'),('hono','Hono'),('fastapi','FastAPI'),('django','Django'),('flask','Flask'),('streamlit','Streamlit'),('react"','React'),('svelte','Svelte'),('prisma','Prisma'),('drizzle','Drizzle'),('selenium','Selenium'),('undetected','undetected-chromedriver'),('playwright','Playwright'),('puppeteer','Puppeteer'),('langchain','LangChain'),('openai','OpenAI SDK'),('anthropic','Anthropic SDK'),('googleapis','googleapis'),('nodemailer','Nodemailer'),('postal-mime','postal-mime'),('supabase','Supabase'),('wrangler','Wrangler'),('pdf','PDF libs')]
DBF=[('postgres','Postgres'),('sqlite','SQLite'),('d1','Cloudflare D1'),('mysql','MySQL'),('mongo','MongoDB'),('redis','Redis'),('supabase','Supabase')]
def stack(n):
    t=trees.get(n,{}); b=(t.get('pkg_json','')+t.get('requirements','')+t.get('pyproject','')).lower()
    fw=[v for k,v in FLAGS if k in b]
    db=[v for k,v in DBF if re.search(r'\b'+k,b)]
    dep=[]
    if t.get('docker'): dep.append('Docker')
    if t.get('wrangler'): dep.append('Cloudflare Workers (wrangler config)')
    return fw,db,dep
def load(fn):
    out={}
    for l in open(fn):
        if l.startswith('#') or not l.strip(): continue
        p=l.rstrip('\n').split('|')
        out[p[0].lower()]=dict(rel=int(p[1]),cq=int(p[2]),sec=int(p[3]),cf=int(p[4]),dec=p[5],purpose=p[6],data=p[7],secn=p[8],reuse=p[9],lim=p[10])
    return out
J={}
for f in ['judg_job.txt','judg_email.txt','judg_other.txt']: J.update(load(f))
def rows(c):
    R=[]
    for n,cc in cat.items():
        if cc not in c or n not in meta: continue
        j=J[n]; m=meta[n]; L=lic(n)
        sc=dict(rel=j['rel'],cq=j['cq'],mt=maint(n),li=lic_score(L),sec=j['sec'],dt=docs(n),cf=j['cf'],cm=comm(n))
        R.append((sum(sc.values()),n,sc,L))
    R.sort(key=lambda x:(-x[0],x[1]))
    return R
METH=open('methodology.md').read()
def render(title,intro,c,fname):
    R=rows(c); out=[f'# {title}\n',f'> Metrics checked on **{CHECK}** via the GitHub REST search API and shallow, blob-less git clones of each repository. Stars/forks/issues change daily; re-run `scripts/research/` (see methodology) to refresh.\n',intro,'\n',METH,'\n## Ranked results\n',
      '| # | Repository | Score | Rel /20 | Code /15 | Maint /15 | Licence /15 | Sec /10 | Docs+Tests /10 | CF /10 | Adopt /5 | Decision |','|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|']
    for i,(s,n,sc,L) in enumerate(R,1):
        m=meta[n]; out.append(f"| {i} | [{m['full_name']}]({m['html_url']}) | **{s}** | {sc['rel']} | {sc['cq']} | {sc['mt']} | {sc['li']} | {sc['sec']} | {sc['dt']} | {sc['cf']} | {sc['cm']} | {J[n]['dec']} |")
    out.append(f'\n**Total repositories evaluated in this report: {len(R)}.**\n')
    out.append('\n## Repository details\n')
    for i,(s,n,sc,L) in enumerate(R,1):
        m=meta[n]; t=trees.get(n,{}); j=J[n]; fw,db,dep=stack(n); a,lc=age(n)
        arch=' — **ARCHIVED**' if m['archived'] else ''
        out+= [f"### {i}. [{m['full_name']}]({m['html_url']}) — {s}/100{arch}\n",
         f"- **Purpose:** {j['purpose']}",
         f"- **GitHub description:** {(m['description'] or '—').replace('|','/')}",
         f"- **Stars / forks / open issues+PRs:** {m['stars']:,} / {m['forks']:,} / {m['open_issues']:,} (checked {CHECK})",
         f"- **Last commit on default branch:** {lc} ({a} days before check) · created {m['created_at'][:10]}",
         f"- **Primary language / detected stack:** {m['language'] or '—'} / {', '.join(fw) or '—'}",
         f"- **Licence:** {L} — commercial reuse: {'permitted with notice' if sc['li']>=12 else 'copyleft obligations' if sc['li']>=4 else 'restricted / not permitted' }",
         f"- **Database / hosting signals:** {', '.join(db) or 'none detected'}; deploy: {', '.join(dep) or 'library / local'}",
         f"- **Data sources & integrations:** {j['data']}",
         f"- **Engineering signals:** {t.get('nfiles','?')} files · {t.get('tests',0)} test files · {len(t.get('ci',[]))} CI workflows · SECURITY.md: {'yes' if t.get('security') else 'no'} · CONTRIBUTING: {'yes' if t.get('contributing') else 'no'} · lockfile: {'yes' if t.get('lockfile') else 'no'} · dependency bot: {'yes' if t.get('dependabot') else 'no'}",
         f"- **Security & privacy:** {j['secn']}",
         f"- **Cloudflare Workers compatibility ({sc['cf']}/10):** {'native / already targets Workers' if sc['cf']>=9 else 'adaptable (port logic to Web-standard TS)' if sc['cf']>=5 else 'not compatible as-is; logic must be re-implemented'}",
         f"- **Worth reusing:** {j['reuse']}",
         f"- **Limitations / reasons not to reuse:** {j['lim']}",
         f"- **Decision:** **{j['dec']}**\n"]
    open(f'../../docs/research/{fname}','w').write('\n'.join(out))
    return R
r1=render('Job-Search & Recruitment Repository Research','Scope: LinkedIn-related discovery, AI job agents, aggregators, remote boards, career-page crawlers, Greenhouse/Lever/Ashby/Workday integrations, matching, resume tailoring, cover letters, auto-apply bots (evaluated as anti-patterns), trackers, recruiter discovery, alerts, Playwright workflows, MCP job tools and job-feed APIs.',['job'],'job-search-repositories.md')
r2=render('Email, Gmail & Communication Repository Research','Scope: Gmail API, Google OAuth 2.0, sending, scheduling/queues, reply detection, threads, parsing/classification, IMAP/SMTP, attachments, templates, AI email agents, follow-ups, deliverability/bounces, tracking, campaigns (evaluated as anti-patterns for 1:1 applications), inbox management and Cloudflare email.',['email'],'email-automation-repositories.md')
r3=render('AI, Browser Automation, Parsing, Search & Analytics Repository Research','Supporting projects for LLM orchestration, structured extraction, resume/document parsing, browser automation (user-authorised only), crawling, search and product analytics.',['ai'],'ai-and-automation-repositories.md')
r4=render('Cloudflare Infrastructure References','Reference repositories for Workers, D1, R2, Queues, Durable Objects, auth and API tooling. Pricing facts used by `docs/architecture/cloudflare-cost-analysis.md` are listed in the appendix below.',['cf'],'cloudflare-references.md')
json.dump({'job':[(s,n) for s,n,_,_ in r1],'email':[(s,n) for s,n,_,_ in r2],'ai':[(s,n) for s,n,_,_ in r3],'cf':[(s,n) for s,n,_,_ in r4]},open('ranks.json','w'),indent=0)
print(len(r1),len(r2),len(r3),len(r4))
for k,r in [('job',r1),('email',r2)]:
    print(k,[ (s,n) for s,n,_,_ in r[:15]])
