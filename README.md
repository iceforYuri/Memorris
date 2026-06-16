# 🍥 Memorris

Personal blog customized from [Fuwari](https://github.com/saicaca/fuwari), built with [Astro](https://astro.build).

[**🖥️ Live Demo**](https://blog.memorris.dpdns.org/)&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;
[**📦 Upstream Fuwari**](https://github.com/saicaca/fuwari)&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;
[**📦 Old Hexo Version**](https://github.com/saicaca/hexo-theme-vivia)

🌏 README in
[**中文**](README.zh-CN.md) /
[**日本語**](README.ja-JP.md) /
[**한국어**](README.ko.md) /
[**Español**](README.es.md) /
[**ไทย**](README.th.md)

> README version: `2026-03-11`

![Preview Image](./image/README/1781606389145.png)

## ✨ Features

Inherited from Fuwari:

- [X] Built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com)
- [X] Smooth animations and page transitions (Swup)
- [X] Light / dark mode
- [X] Customizable theme colors & banner
- [X] Responsive design
- [X] Search with [Pagefind](https://pagefind.app/)
- [X] Table of contents (TOC)
- [X] KaTeX math formulas
- [X] [Markdown extended features](#-markdown-extended-syntax)
- [X] RSS feed
- [ ] Comments

## 🔧 Customizations over Upstream

Additional enhancements in this fork:

### Table of Contents (TOC)

- Left-side grouped TOC with expandable / collapsible sections
- Scroll progress tracking with themed dashed indicator
- Auto-hide when pinned to top to avoid covering content
- Fixed TOC sidebar behavior on non-post pages
- **KaTeX formula headings** render correctly in the TOC
- Integrated with Swup page transitions

![TOC preview](./image/README/1781607282363.png)

### Performance

- Image lazy loading, `decoding="async"`, and `fetchpriority` control
- First-screen optimizations for `PostCard`, `Layout`, `Navbar`, and `Profile`
- Theme switching logic extracted to `setting-utils.ts`

### Archive Pages

- **RollingCountCard**: animated rolling count for categories / tags
- **Tag cloud**: font size, opacity, and weight mapped by post count, with stable hash-based colors
- **Categories page**: all categories expanded by default (`forceExpand`)
- **StaggerReveal**: staggered list entrance animations with `prefers-reduced-motion` support

<p align="center">
  <img src="./image/README/1781607819957.png" alt="Tag cloud" width="49%" />
  <img src="./image/README/1781607863903.png" alt="Categories page" width="49%" />
</p>

## 🚀 Getting Started

1. Clone this repository and install dependencies:

   ```bash
   pnpm install
   ```

   Install [pnpm](https://pnpm.io) with `npm install -g pnpm` if needed.
2. Edit `src/config.ts` for site title, navigation, profile, etc.; edit `site` in `astro.config.mjs` for your deployment domain.
3. Run `pnpm new-post <filename>` to create a new post in `src/content/posts/`.
4. Local development:

   ```bash
   pnpm dev
   ```

5. Build and preview:

   ```bash
   pnpm build
   pnpm preview
   ```

6. Deploy following the [Astro deployment guides](https://docs.astro.build/en/guides/deploy/).

## ⚙️ Site Configuration

TOC options in `src/config.ts` under `siteConfig.toc`:

```ts
toc: {
  enable: true,   // Show TOC on post pages
  depth: 6,       // Maximum heading depth shown in TOC
}
```

## 📝 Frontmatter of Posts

```yaml
---
title: My First Blog Post
published: 2023-09-09
description: This is the first post of my new Astro blog.
image: ./cover.jpg
tags: [Foo, Bar]
category: Front-end
draft: false
lang: jp      # Set only if the post's language differs from the site's language in `config.ts`
---
```

## 🧩 Markdown Extended Syntax

In addition to GitHub Flavored Markdown, this project supports:

- Admonitions (note, tip, important, caution, warning)
- GitHub repository cards
- Enhanced code blocks via Expressive Code

## ⚡ Commands

All commands are run from the project root:

| Command                      | Action                                                   |
| :--------------------------- | :------------------------------------------------------- |
| `pnpm install`             | Installs dependencies                                    |
| `pnpm dev`                 | Starts local dev server at `localhost:4321`            |
| `pnpm build`               | Builds the site to `./dist/` (includes Pagefind index) |
| `pnpm preview`             | Previews the built site locally                          |
| `pnpm new-post <filename>` | Creates a new post                                       |
| `pnpm format`              | Formats code with Biome                                  |
| `pnpm lint`                | Lints and auto-fixes with Biome                          |
| `pnpm astro ...`           | Runs CLI commands like `astro add`, `astro check`    |
| `pnpm astro --help`        | Shows Astro CLI help                                     |

## 🙏 Acknowledgments

This project is a fork of [saicaca/fuwari](https://github.com/saicaca/fuwari). Thanks to the upstream authors for their open-source work.
