# 🍥 Memorris

บล็อกส่วนตัวที่ปรับแต่งจาก [Fuwari](https://github.com/saicaca/fuwari) สร้างด้วย [Astro](https://astro.build)

[**🖥️ ตัวอย่างการใช้งานจริง**](https://blog.memorris.dpdns.org/)&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;
[**📦 เทมเพลต Fuwari**](https://github.com/saicaca/fuwari)&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;
[**📦 เวอร์ชันเก่าสำหรับ Hexo**](https://github.com/saicaca/hexo-theme-vivia)

🌏 README:
[**English**](README.md) /
[**中文**](README.zh-CN.md) /
[**日本語**](README.ja-JP.md) /
[**한국어**](README.ko.md) /
[**Español**](README.es.md)

> เวอร์ชันของ README: `2026-03-11`

![ภาพตัวอย่าง](./image/README/1781606389145.png)

## ✨ คุณสมบัติ

สืบทอดจาก Fuwari:

- [x] สร้างด้วย [Astro](https://astro.build) และ [Tailwind CSS](https://tailwindcss.com)
- [x] อนิเมชันและการเปลี่ยนหน้าอย่างลื่นไหล (Swup)
- [x] โหมดสว่าง / โหมดมืด
- [x] ปรับแต่งสีธีมและแบนเนอร์ได้
- [x] Responsive design
- [x] ค้นหาด้วย [Pagefind](https://pagefind.app/)
- [x] สารบัญ (TOC)
- [x] สูตรคณิตศาสตร์ KaTeX
- [x] RSS feed
- [ ] การแสดงความคิดเห็น

## 🔧 การปรับแต่งจาก upstream

ฟอร์กนี้เพิ่ม TOC ที่ปรับปรุงแล้ว การเพิ่มประสิทธิภาพ และ UI หน้า archive

> รายละเอียดเต็มดูที่ [README.md](README.md) หรือ [README.zh-CN.md](README.zh-CN.md)

## 🚀 วิธีใช้งาน

1. Clone repository นี้แล้วรัน `pnpm install`
2. แก้ไข `src/config.ts` และ `astro.config.mjs`
3. รัน `pnpm new-post <filename>` เพื่อสร้างโพสต์ใน `src/content/posts/`
4. พัฒนาแบบ local: `pnpm dev`
5. Build และ preview: `pnpm build` / `pnpm preview`
6. Deploy ตาม [คู่มือ Astro](https://docs.astro.build/en/guides/deploy/)

## ⚙️ Frontmatter ของโพสต์

```yaml
---
title: โพสต์แรกของฉัน
published: 2023-09-09
description: นี่คือโพสต์แรกของเว็บบล็อก Astro อันใหม่ของฉัน
image: ./cover.jpg
tags: [Foo, Bar]
category: Front-end
draft: false
lang: jp
---
```

## 🧞 คำสั่ง

| คำสั่ง | ผลลัพธ์ |
|:-------|:--------|
| `pnpm install` | ติดตั้ง dependencies |
| `pnpm dev` | เปิดเซิร์ฟเวอร์ที่ `localhost:4321` |
| `pnpm build` | Build ไปยัง `./dist/` |
| `pnpm preview` | ดูตัวอย่าง build แบบ local |
| `pnpm new-post <filename>` | สร้างโพสต์ใหม่ |
| `pnpm format` | จัดรูปแบบโค้ดด้วย Biome |
| `pnpm lint` | ตรวจสอบและแก้ไขด้วย Biome |

## 🙏 ขอบคุณ

โปรเจกต์นี้เป็น fork ของ [saicaca/fuwari](https://github.com/saicaca/fuwari)
