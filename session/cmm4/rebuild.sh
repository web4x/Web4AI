#!/bin/bash
# Rebuild all .md files in session/cmm4/ to .html and reload Chrome
DIR="$(cd "$(dirname "$0")" && pwd)"

# Convert each .md file to .html
for mdfile in "$DIR"/*.md; do
  [ -f "$mdfile" ] || continue
  htmlfile="${mdfile%.md}.html"
  basename="${mdfile##*/}"
  python3 -c "
import os, re
with open('$mdfile') as f:
    md = f.read()
# Convert .md links to .html for browser viewing
md = re.sub(r'\]\(([^)]+)\.md\)', r'](\1.html)', md)
title = '$basename'.replace('.md','').replace('-',' ').title()
page = '''<!DOCTYPE html>
<html>
<head>
<meta charset=\"utf-8\">
<title>''' + title + ''' — CMM4 Journey</title>
<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/github-markdown-body/5.2.3/github-markdown.min.css\">
<style>
  body { max-width: 880px; margin: 40px auto; padding: 0 20px; background: #ffffff; color: #1f2328; }
  .markdown-body { padding: 45px; background: #ffffff; border-radius: 6px; color: #1f2328; }
  .markdown-body h1, .markdown-body h2 { border-bottom: 1px solid #d1d9e0; padding-bottom: .3em; }
  .markdown-body code { background: #eff1f3; padding: 0.2em 0.4em; border-radius: 6px; }
  .markdown-body pre { background: #f6f8fa; padding: 16px; border-radius: 6px; overflow: auto; }
  .markdown-body pre code { background: transparent; padding: 0; }
  .markdown-body blockquote { color: #656d76; border-left: 4px solid #d1d9e0; padding: 0 1em; }
  .markdown-body strong { color: #1f2328; }
  .markdown-body a { color: #0969da; }
  .markdown-body table { border-collapse: collapse; width: 100%; }
  .markdown-body th, .markdown-body td { border: 1px solid #d1d9e0; padding: 8px 12px; }
  .markdown-body th { background: #f6f8fa; font-weight: 600; }
  .markdown-body tr:nth-child(even) { background: #f6f8fa; }
</style>
</head>
<body class=\"markdown-body\">
<div id=\"content\"></div>
<script src=\"https://cdn.jsdelivr.net/npm/marked/marked.min.js\"></script>
<script>
document.getElementById(\"content\").innerHTML = marked.parse(''' + repr(md) + ''');
</script>
</body>
</html>'''
with open('$htmlfile', 'w') as f:
    f.write(page)
print('  Built: $basename -> ' + os.path.basename('$htmlfile'))
"
done
echo "HTML rebuilt ($(ls "$DIR"/*.md | wc -l | tr -d ' ') files)"

# Reload any CMM4 tabs in Chrome
osascript <<EOF
set baseURL to "file://${DIR}/"
tell application "Google Chrome"
    set reloaded to 0
    repeat with w in windows
        repeat with t in tabs of w
            if URL of t starts with baseURL then
                tell t to reload
                set reloaded to reloaded + 1
            end if
        end repeat
    end repeat
    if reloaded = 0 then
        open location (baseURL & "cmm4-story.html")
    end if
    activate
end tell
EOF

echo "Browser refreshed"
