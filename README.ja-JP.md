# 🍥 Memorris

[Fuwari](https://github.com/saicaca/fuwari) をベースにカスタマイズした個人ブログ。[Astro](https://astro.build) で構築。

[**🖥️ ライブデモ**](https://blog.memorris.dpdns.org/)&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;
[**📦 上流テンプレート Fuwari**](https://github.com/saicaca/fuwari)&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;
[**📦 旧 Hexo バージョン**](https://github.com/saicaca/hexo-theme-vivia)

🌏 README：
[**English**](README.md) /
[**中文**](README.zh-CN.md) /
[**한국어**](README.ko.md) /
[**Español**](README.es.md) /
[**ไทย**](README.th.md)

> README バージョン：`2026-03-11`

![Preview Image](./image/README/1781606389145.png)

## ✨ 特徴

Fuwari から継承：

- [x] [Astro](https://astro.build) 及び [Tailwind CSS](https://tailwindcss.com) で構築
- [x] スムーズなアニメーションとページ遷移（Swup）
- [x] ライト / ダークテーマ対応
- [x] カスタマイズ可能なテーマカラーとバナー
- [x] レスポンシブデザイン
- [x] [Pagefind](https://pagefind.app/) による検索
- [x] 目次（TOC）
- [x] KaTeX 数式
- [x] RSS フィード
- [ ] コメント機能

## 🔧 上流からのカスタマイズ

このフォークでは TOC の強化、パフォーマンス最適化、アーカイブページの UI 改善などを追加しています。

> 詳細は [README.md](README.md) または [README.zh-CN.md](README.zh-CN.md) を参照してください。

## 🚀 使用方法

1. このリポジトリをクローンし、`pnpm install` で依存関係をインストール。
2. `src/config.ts` と `astro.config.mjs` を編集してカスタマイズ。
3. `pnpm new-post <filename>` で記事を作成し、`src/content/posts/` で編集。
4. ローカル開発：`pnpm dev`
5. ビルドとプレビュー：`pnpm build` / `pnpm preview`
6. [Astro デプロイガイド](https://docs.astro.build/ja/guides/deploy/)に従ってデプロイ。

## ⚙️ 記事のフロントマター

```yaml
---
title: My First Blog Post
published: 2023-09-09
description: This is the first post of my new Astro blog.
image: ./cover.jpg
tags: [Foo, Bar]
category: Front-end
draft: false
lang: jp
---
```

## 🧞 コマンド

| コマンド | 操作 |
|:---------|:-----|
| `pnpm install` | 依存関係のインストール |
| `pnpm dev` | `localhost:4321` で開発サーバー起動 |
| `pnpm build` | `./dist/` にビルド |
| `pnpm preview` | ローカルでプレビュー |
| `pnpm new-post <filename>` | 新しい投稿を作成 |
| `pnpm format` | Biome でコード整形 |
| `pnpm lint` | Biome でチェック・自動修正 |

## 🙏 謝辞

本プロジェクトは [saicaca/fuwari](https://github.com/saicaca/fuwari) のフォークです。
