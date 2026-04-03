---
name: Warcraft UI Library Overview
description: React component library using real Warcraft 3 .blp textures and .mdx models via WebGL. Migrated from hardcoded app to importable npm package.
type: project
---

Library: @sektant1/warcraft-ui (npm, GitHub Packages)

Architecture: Single shared WebGL canvas (fullscreen, pointer-events:none) overlaid on DOM. Components register themselves with the Renderer, which reads their DOM rects via getBoundingClientRect() each frame and draws WebGL quads on top. Two modes: singleton (auto-created) or explicit WarcraftRenderer provider.

Key subsystems:
- **TextureManager**: loads .blp (via war3-model's decodeBLP) and .png, uploads to WebGL textures
- **QuadBatcher**: batched quad drawing with texture atlas support
- **BlendManager**: manages BLEND/ADD blend modes
- **NineSlice**: 9-slice border rendering from 8-cell horizontal atlas strips
- **Renderer**: orchestrates per-frame rendering of all registered components
- **singleton.ts**: auto-creates canvas + renderer when no WarcraftRenderer provider exists

Component categories:
- Glue buttons (menu screen buttons with nine-slice borders)
- ESC menu controls (checkboxes, radios, sliders, edit boxes, option buttons)
- 3D models (hero portraits, items, workers, time indicator — use war3-model .mdx)
- HUD elements (top/bottom HUD, resource counters, stat bars, loading bars)
- Tooltips, menu panels, cursor overlay

**Current status**: Some components work, but many have buggy/broken textures. Renderer and component registration may need rework.

**Why:** User wants this to be a polished, importable library — not a hardcoded demo app. Texture bugs and renderer issues are the main blocker.
**How to apply:** Focus on fixing texture rendering correctness. Investigate each component's texture registration and the renderer's drawing logic.
