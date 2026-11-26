#!/bin/bash
n="$1"; R=$(pwd); d="$R/trees/${n//\//__}.json"
[ -s "$d" ] && grep -q last_commit "$d" && exit 0
tmp=$(mktemp -d)
if timeout 150 git clone -q --depth 1 --filter=blob:none --no-checkout "https://github.com/$n" "$tmp/r" 2>/dev/null; then
  cd "$tmp/r"
  git ls-tree -r --name-only HEAD > files.txt
  last=$(git log -1 --format=%cI)
  grep -qx package.json files.txt && timeout 30 git show HEAD:package.json > pkg.txt 2>/dev/null
  grep -qx requirements.txt files.txt && timeout 30 git show HEAD:requirements.txt > req.txt 2>/dev/null
  grep -qx pyproject.toml files.txt && timeout 30 git show HEAD:pyproject.toml > py.txt 2>/dev/null
  python3 "$R/inspect.py" "$d" "$n" "$last"
else echo "{\"name\":\"$n\",\"error\":\"clone failed\"}" > "$d"; fi
rm -rf "$tmp"
