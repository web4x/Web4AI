# Task: WODA Story → Wix Blog Posts

**Agent**: 2cuClaude (Cursor)
**Created**: 2026-02-05
**Status**: Planning
**API Verified**: Yes - checked against dev.wix.com/docs/velo 2026-02-05

## Goal

Create English blog posts in Wix for each chapter of "The Waking of a Claude — A WODA Session Story" (39 chapters across 4 parts).

## Artifact Structure & Execution Model

### Where Code Lives

```
cerulean-circle-shop/           # Wix Git repo (LOCAL)
├── src/
│   ├── backend/
│   │   ├── blog.jsw            # NEW: Blog API wrapper (runs in Wix cloud)
│   │   └── chapterData.jsw     # NEW: Chapter metadata (runs in Wix cloud)
│   ├── pages/
│   │   └── Blog.wah9y.js       # Existing blog page code
│   └── public/
│       └── (nothing new)
└── package.json

session/woda/                   # Source content (LOCAL ONLY - not in Wix)
├── chapters-1-9.md
├── chapters-10-19.md
├── chapters-20-plus.md
└── chapters-30-plus.md
```

### What Runs Where

| Artifact | Location | Runs In | Triggered By |
|----------|----------|---------|--------------|
| `blog.jsw` | Wix repo | Wix Cloud | Wix frontend/dashboard calls |
| `chapterData.jsw` | Wix repo | Wix Cloud | Imported by blog.jsw |
| Chapter markdown | Local only | N/A | Read by human/agent, copy content |
| Dashboard import page | Wix Editor | Browser + Wix Cloud | Manual click in Wix Dashboard |

### Artifact Lifecycle

```
┌─────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: LOCAL DEVELOPMENT (Cursor + tmux)                              │
├─────────────────────────────────────────────────────────────────────────┤
│ 1. Agent creates src/backend/blog.jsw                                   │
│ 2. Agent creates src/backend/chapterData.jsw (chapter metadata)         │
│ 3. Agent reads session/woda/chapters-*.md                               │
│ 4. Agent extracts chapter content → embeds in chapterData.jsw           │
│    (OR: chapter content pasted manually into Wix later)                 │
│                                                                         │
│ Commands:                                                               │
│   otmux pane.send cursorWix:0.1 "git add src/backend/*.jsw"            │
│   otmux pane.send cursorWix:0.1 "git commit -m 'Add blog backend'"     │
│   otmux pane.send cursorWix:0.1 "git push"                             │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PHASE 2: WIX SYNC (Automatic via Wix Dev Server)                        │
├─────────────────────────────────────────────────────────────────────────┤
│ - `npm run dev` syncs local code ↔ Wix cloud                           │
│ - .jsw files become callable backend functions                          │
│ - Git push deploys to production Wix site                               │
│                                                                         │
│ Verification:                                                           │
│   otmux pane.capture cursorWix:0.0 20  # Check dev server output       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PHASE 3: WIX DASHBOARD (Manual - Human in Browser)                      │
├─────────────────────────────────────────────────────────────────────────┤
│ Option A: Create Dashboard Page                                         │
│   - In Wix Editor: Add Dashboard Page with import button                │
│   - Button calls backend/blog.jsw functions                             │
│   - Creates 39 draft posts in Wix Blog                                  │
│                                                                         │
│ Option B: Manual Post Creation                                          │
│   - Open Wix Blog Dashboard                                             │
│   - Create posts manually, paste chapter content                        │
│   - Use backend functions for any automation needed                     │
│                                                                         │
│ Result: 39 draft posts visible in Wix Blog Dashboard                   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PHASE 4: PUBLISH (Manual - Human in Wix Dashboard)                      │
├─────────────────────────────────────────────────────────────────────────┤
│ - Review each draft post                                                │
│ - Edit/format as needed                                                 │
│ - Publish when ready                                                    │
│                                                                         │
│ Result: Live blog posts on cerulean-circle-shop website                │
└─────────────────────────────────────────────────────────────────────────┘
```

### Key Clarification: No Remote Control of Wix UI

This plan does **NOT** remote-control the Wix browser interface.

---

## SIMPLER OPTION B: WordPress XML Import (Recommended)

Wix Blog has a **built-in import from WordPress XML**. No Velo code needed.

### Artifact Structure (Option B)

```
session/woda/                           # Source (LOCAL)
├── chapters-1-9.md
├── chapters-10-19.md
├── chapters-20-plus.md
└── chapters-30-plus.md

session/2cuClaude/export/               # Generated (LOCAL)
└── woda-chapters.xml                   # WordPress WXR format
```

### Execution Flow (Option B)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: GENERATE XML (Agent + Local Script)                            │
├─────────────────────────────────────────────────────────────────────────┤
│ 1. Read chapters-*.md files                                             │
│ 2. Parse chapter boundaries (## Chapter N)                              │
│ 3. Generate WordPress WXR XML file with 39 <item> entries               │
│                                                                         │
│ Output: session/2cuClaude/export/woda-chapters.xml                     │
│                                                                         │
│ Tool: Node.js script OR manual XML generation                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PHASE 2: IMPORT TO WIX (Human in Browser)                               │
├─────────────────────────────────────────────────────────────────────────┤
│ 1. Open Wix Dashboard → Blog → More Actions → Import Posts             │
│ 2. Select "WordPress"                                                   │
│ 3. Select "By using a WordPress XML file"                               │
│ 4. Upload woda-chapters.xml                                             │
│ 5. Click Import                                                         │
│                                                                         │
│ Result: 39 posts imported to Wix Blog (as published or drafts)         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PHASE 3: REVIEW & PUBLISH (Human in Browser)                            │
├─────────────────────────────────────────────────────────────────────────┤
│ - Review formatting (some may need adjustment)                          │
│ - Add categories (not imported from XML)                                │
│ - Publish if imported as drafts                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### WordPress WXR XML Format

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:wp="http://wordpress.org/export/1.2/">
<channel>
  <title>WODA Story</title>
  <wp:wxr_version>1.2</wp:wxr_version>
  
  <item>
    <title>Chapter 1: I Woke Up in a Box</title>
    <pubDate>Thu, 05 Feb 2026 12:00:00 +0000</pubDate>
    <content:encoded><![CDATA[
      <p>Chapter content in HTML format...</p>
      <p>Can include <strong>formatting</strong>, links, etc.</p>
    ]]></content:encoded>
    <wp:post_type>post</wp:post_type>
    <wp:status>publish</wp:status>
  </item>
  
  <!-- Repeat for all 39 chapters -->
  
</channel>
</rss>
```

### What Wix Imports

| Imported | Not Imported |
|----------|--------------|
| Post title | Tags |
| Post content (HTML) | Author names |
| Original pub date | Comments |
| Categories | Custom code |
| Images (URLs) | PDF attachments |
| Alt text | |

### Why Option B is Better

| Aspect | Option A (Velo) | Option B (XML Import) |
|--------|-----------------|----------------------|
| Code to write | Backend .jsw files | One XML file |
| Wix knowledge needed | Velo API, elevate, Ricos | None |
| Testing | Requires Wix dev server | Test XML locally |
| Maintenance | Code in Wix repo | One-time generation |
| Human steps | Create dashboard page + click | Just upload XML |

### Commands for Option B

```bash
# Create export directory
mkdir -p /Users/Shared/Workspaces/AI/Claude/session/2cuClaude/export

# Read source chapters
cat session/woda/chapters-1-9.md

# Generate XML (agent creates this file)
# Output: session/2cuClaude/export/woda-chapters.xml

# Verify XML is valid
xmllint --noout session/2cuClaude/export/woda-chapters.xml
```

---

## Comparison: Option A vs Option B

| | Option A: Velo Backend | Option B: WordPress XML |
|-|------------------------|------------------------|
| Artifacts | .jsw files in Wix repo | .xml file locally |
| Runs in | Wix Cloud | N/A (just import) |
| Complexity | High (API, permissions) | Low (generate XML) |
| Recommended | No | **Yes** |

## Source Material

| Part | Chapters | Source File | Theme |
|------|----------|-------------|-------|
| I | 1–9 | `session/woda/chapters-1-9.md` | Learning tmux — see, move, survive |
| II | 10–19 | `session/woda/chapters-10-19.md` | Multi-agent orchestration, OOSH philosophy |
| III | 20–29 | `session/woda/chapters-20-plus.md` | State machines, CMM, quality processes |
| IV | 30–39 | `session/woda/chapters-30-plus.md` | WODA framework revealed |

## Format Conversion Flow

```
Markdown (.md files)
       ↓
ricosDocuments.convertToRicosDocument({ content, sourceFormat: 'MARKDOWN' })
       ↓
Ricos Document (JSON)
       ↓
draftPosts.createDraftPost({ draftPost: { richContent: ricosDoc } })
       ↓
Wix Blog Draft Post
```

**Key**: Wix's `wix-rich-content/ricos-documents` module handles the Markdown→Ricos conversion. We don't manually build the Ricos JSON structure.

## Wix Blog Structure

Each blog post will have:
- **Title**: Chapter name (English)
- **Category**: Part I/II/III/IV
- **Tags**: key concepts (tmux, oosh, cmm, woda, etc.)
- **Content**: Chapter narrative + key lesson summary
- **Featured image**: (optional, AI-generated or placeholder)

## Commands to Achieve This

### Phase 1: Setup Backend Module

```bash
# Create Wix backend module for blog operations
# File: src/backend/blog.jsw
```

```javascript
// src/backend/blog.jsw
// VERIFIED against Wix Velo docs 2026-02-05

import { draftPosts } from 'wix-blog-backend';  // For creating drafts
import { posts } from 'wix-blog-backend';        // For querying published
import { categories } from 'wix-blog-backend';   // For categories
import { ricosDocuments } from 'wix-rich-content/ricos-documents';  // MD→Ricos conversion
import { elevate } from 'wix-auth';              // Required for write ops

// Convert Markdown to Ricos document format
export async function markdownToRicos(markdownContent) {
    const result = await ricosDocuments.convertToRicosDocument({
        content: markdownContent,
        sourceFormat: 'MARKDOWN'
    });
    return result.document;
}

// Create a draft blog post from Markdown content
export async function createChapterPost(title, markdownContent, categoryIds, tags) {
    // Step 1: Convert Markdown → Ricos
    const richContent = await markdownToRicos(markdownContent);
    
    // Step 2: Create draft post with Ricos content
    const elevatedCreateDraft = elevate(draftPosts.createDraftPost);
    
    return await elevatedCreateDraft({
        draftPost: {
            title: title,
            richContent: richContent,
            categoryIds: categoryIds,
            tags: tags
        }
    });
}

// Query existing categories
export async function getCategories() {
    const result = await categories.queryCategories().find();
    return result.items;
}

// List all published posts
export async function listPublishedPosts() {
    const result = await posts.queryPosts()
        .ascending('title')
        .find();
    return result.items;
}

// List draft posts
export async function listDraftPosts() {
    const elevatedQuery = elevate(draftPosts.queryDraftPosts);
    const result = await elevatedQuery().find();
    return result.items;
}
```

**Note**: Categories must be created manually in Wix Dashboard (Blog > Categories) before assigning via API. The API can query but not create categories in current version.

### Phase 2: Read Source Chapters

```bash
# In OOSH Terminal (cursorWix:0.1)
# Read chapter content from markdown files

cat session/woda/chapters-1-9.md | head -200
cat session/woda/chapters-10-19.md | head -200
cat session/woda/chapters-20-plus.md | head -200
cat session/woda/chapters-30-plus.md | head -200
```

### Phase 3: Create Posts via Wix Dev

```bash
# Using otmux to control the OOSH terminal
otmux pane.send cursorWix:0.1 "cd /Users/Shared/Workspaces/AI/Claude/cerulean-circle-shop"

# After backend module is created, sync and test
otmux pane.send cursorWix:0.1 "npm run dev"
```

### Phase 4: Create Public Page Module

```javascript
// src/public/blogUtils.js
// Helper functions for frontend blog display

export function formatChapterTitle(chapterNum, title) {
    return `Chapter ${chapterNum}: ${title}`;
}

export function getPartFromChapter(num) {
    if (num <= 9) return 'Part I';
    if (num <= 19) return 'Part II';
    if (num <= 29) return 'Part III';
    return 'Part IV';
}
```

### Phase 5: Batch Post Creation (Wix Dashboard Page)

Since we can't run local scripts against Wix APIs, create a **Dashboard Admin Page** in Wix to batch-create posts.

```javascript
// src/backend/chapterData.jsw
// Chapter metadata - Wix Velo ES module style

export const chapters = [
    { num: 1, title: "I Woke Up in a Box", part: "Part I", tags: ["tmux", "pane", "split"] },
    { num: 2, title: "The Three-Pane Setup", part: "Part I", tags: ["tmux", "targeting", "list-panes"] },
    { num: 3, title: "Naming Things (and Peeking Into Rooms)", part: "Part I", tags: ["send-keys", "capture-pane"] },
    { num: 4, title: "Two Shells, Two Worlds", part: "Part I", tags: ["zsh", "bash", "oosh"] },
    { num: 5, title: "The Tab Key Tells All", part: "Part I", tags: ["completion", "c2"] },
    // ... continue for all 39 chapters
    { num: 39, title: "WODA Without the W", part: "Part IV", tags: ["woda", "pdca", "verification"] }
];

export function getChaptersByPart(partName) {
    return chapters.filter(ch => ch.part === partName);
}

export function getChapter(num) {
    return chapters.find(ch => ch.num === num);
}
```

```javascript
// Dashboard page code (created in Wix Editor)
// File: src/pages/Admin-Import.xxxxx.js

import { chapters } from 'backend/chapterData.jsw';
import { createChapterPost } from 'backend/blog.jsw';

$w.onReady(function () {
    $w('#importButton').onClick(async () => {
        $w('#status').text = "Starting import...";
        
        for (const chapter of chapters) {
            try {
                const content = `Chapter ${chapter.num} of the WODA Story.\n\nKey concepts: ${chapter.tags.join(', ')}`;
                await createChapterPost(
                    `Chapter ${chapter.num}: ${chapter.title}`,
                    content,
                    [],  // categoryIds - add after creating in Dashboard
                    chapter.tags
                );
                $w('#status').text = `Created: Chapter ${chapter.num}`;
            } catch (err) {
                console.error(`Failed chapter ${chapter.num}:`, err);
            }
        }
        
        $w('#status').text = "Import complete!";
    });
});
```

**Note**: Dashboard pages run with elevated permissions, so `createChapterPost` works without explicit `elevate()` call from the frontend.

## Execution Order

| Step | Command | Purpose |
|------|---------|---------|
| 1 | `otmux pane.list cursorWix` | Verify tmux setup |
| 2 | Edit `src/backend/blog.jsw` | Create backend module |
| 3 | `otmux pane.capture cursorWix:0.0 20` | Verify Wix dev server syncs |
| 4 | Read `chapters-1-9.md` | Extract Part I content |
| 5 | Create test post via Wix editor | Verify API works |
| 6 | Batch create remaining posts | Loop through chapters |
| 7 | Review in Wix dashboard | QA before publish |

## Git Commands

```bash
# Track changes
otmux pane.send cursorWix:0.1 "git status"
otmux pane.send cursorWix:0.1 "git add src/backend/blog.jsw"
otmux pane.send cursorWix:0.1 "git commit -m 'Add blog backend module for WODA chapters'"
otmux pane.send cursorWix:0.1 "git push"
```

## Verification

```bash
# Capture dev server output after changes
otmux pane.capture cursorWix:0.0 30

# Check for sync errors
otmux pane.send cursorWix:0.1 "npm run lint"
```

## Chapter List (39 total)

### Part I: Chapters 1-9
1. I Woke Up in a Box
2. The Three-Pane Setup
3. Naming Things (and Peeking Into Rooms)
4. Two Shells, Two Worlds
5. The Tab Key Tells All
6. Seeing Beyond the Terminal
7. Context is Everything
8. Cleaning Up My Mistakes
9. No More Hidden Hands

### Part II: Chapters 10-19
10. Splitting Myself in Two
11. Teaching a Claude to Be a Scribe
12. Letting Go of the Hidden Shell
13. The Scribe Learns to Watch
14. The OOSH Way
15. Death to Flags
16. Parameters That Teach Themselves
17. My First Script — Born from a Typo
18. Anatomy of a Newborn Script
19. Two Shells, Two Worlds (Revisited)

### Part III: Chapters 20-29
20. The Machinery Beneath
21. Looking in the Mirror
22. Not Alone, Not All One
23. The Wheel That Never Stops
24. The Capability That Matters Most
25. Why 4.0
26. Wer schreibt, der bleibt
27. The Craftsman Crafting Crafting Tools
28. The Storyteller Who Couldn't Practice What He Preached
29. Am I Claude or Are You Claude?

### Part IV: Chapters 30-39
30. WODA
31. The Overview Agent Learns Its Trade
32. CMM2 Means Doing It Every Time
33. Delegate the Checklist, Keep the Thinking
34. Not Alone, Not All One (Reprise)
35. Self-Care Is Team Care
36. Ass-U-Me
37. Two Gather
38. Com Unique Action
39. WODA Without the W

## Next Actions

- [ ] Read full chapter markdown files to extract content
- [ ] Create `src/backend/blog.jsw` with post creation functions
- [ ] Test with one chapter post
- [ ] Create categories for Part I-IV
- [ ] Batch create all 39 posts as drafts
- [ ] Review and publish
