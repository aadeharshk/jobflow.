import json,sys,re,os
d,name,last=sys.argv[1:4]
files=open('files.txt').read().split('\n')
low=[f.lower() for f in files]
def has(p): return any(re.search(p,f) for f in low)
def rd(p,n): return open(p,errors='ignore').read()[:n] if os.path.exists(p) else ''
json.dump(dict(name=name,last_commit=last,nfiles=len(files),
 tests=sum(1 for f in low if re.search(r'(^|/)(tests?|__tests__|spec|e2e)/|\.(test|spec)\.[jt]sx?$|(^|/)test_[^/]+\.py$|_test\.(go|py|rs)$',f)),
 ci=[f for f in files if f.startswith('.github/workflows/')][:12],
 security=has(r'(^|/)security\.md$'), contributing=has(r'(^|/)contributing\.md$'), coc=has(r'code_of_conduct'),
 docker=has(r'dockerfile|docker-compose|compose\.ya?ml'), wrangler=has(r'wrangler\.(toml|jsonc?)$'),
 tsconfig=has(r'(^|/)tsconfig\.json$'), lockfile=has(r'(package-lock\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lockb?|poetry\.lock|uv\.lock|cargo\.lock|go\.sum)$'),
 dependabot=has(r'\.github/dependabot\.ya?ml|renovate\.json'), docs=has(r'^docs/'), changelog=has(r'(^|/)changelog'),
 pkg_json=rd('pkg.txt',20000), requirements=rd('req.txt',5000), pyproject=rd('py.txt',8000)),open(d,'w'))
