#!/bin/bash
: > raw.jsonl
while IFS='|' read -r cat q; do
  gh api -X GET search/repositories -f q="$q" -f sort=stars -f order=desc -f per_page=25 \
    --jq ".items[] | {cat:\"$cat\", query:\"$q\", full_name, html_url, description, stars:.stargazers_count, forks:.forks_count, pushed_at, created_at, language, license:(.license.spdx_id // \"NONE\"), open_issues:.open_issues_count, archived, topics}" >> raw.jsonl 2>>err.log
  sleep 2.3
done < queries.txt
echo done
