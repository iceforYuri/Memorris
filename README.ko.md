# 🍥 Memorris

[Fuwari](https://github.com/saicaca/fuwari)를 기반으로 커스터마이징한 개인 블로그입니다. [Astro](https://astro.build)로 구축되었습니다.

[**🖥️ 라이브 데모**](https://blog.memorris.dpdns.org/)&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;
[**📦 업스트림 Fuwari**](https://github.com/saicaca/fuwari)&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;
[**📦 구 Hexo 버전**](https://github.com/saicaca/hexo-theme-vivia)

🌏 README:
[**English**](README.md) /
[**中文**](README.zh-CN.md) /
[**日本語**](README.ja-JP.md) /
[**Español**](README.es.md) /
[**ไทย**](README.th.md)

> README 버전: `2026-03-11`

![Preview Image](./image/README/1781606389145.png)

## ✨ 특징

Fuwari에서 상속:

- [x] [Astro](https://astro.build) 및 [Tailwind CSS](https://tailwindcss.com)로 구축
- [x] 부드러운 애니메이션 및 페이지 전환 (Swup)
- [x] 라이트 / 다크 모드
- [x] 사용자 정의 가능한 테마 색상 및 배너
- [x] 반응형 디자인
- [x] [Pagefind](https://pagefind.app/) 검색
- [x] 목차 (TOC)
- [x] KaTeX 수식
- [x] RSS 피드
- [ ] 댓글

## 🔧 업스트림 대비 커스터마이징

이 포크에는 TOC 강화, 성능 최적화, 아카이브 페이지 UI 개선 등이 추가되어 있습니다.

> 자세한 내용은 [README.md](README.md) 또는 [README.zh-CN.md](README.zh-CN.md)를 참고하세요.

## 🚀 사용 방법

1. 이 저장소를 클론하고 `pnpm install`로 의존성을 설치합니다.
2. `src/config.ts`와 `astro.config.mjs`를 편집해 사이트를 설정합니다.
3. `pnpm new-post <filename>`으로 `src/content/posts/`에 게시물을 작성합니다.
4. 로컬 개발: `pnpm dev`
5. 빌드 및 미리보기: `pnpm build` / `pnpm preview`
6. [Astro 배포 가이드](https://docs.astro.build/en/guides/deploy/)에 따라 배포합니다.

## ⚙️ 게시물 Frontmatter

```yaml
---
title: 내 첫 블로그 게시물
published: 2023-09-09
description: 내 새로운 Astro 블로그의 첫 번째 게시물입니다!
image: ./cover.jpg
tags: [Foo, Bar]
category: Front-end
draft: false
lang: jp
---
```

## 🧞 명령어

| 명령어 | 동작 |
|:-------|:-----|
| `pnpm install` | 의존성 설치 |
| `pnpm dev` | `localhost:4321`에서 개발 서버 시작 |
| `pnpm build` | `./dist/`에 사이트 빌드 |
| `pnpm preview` | 로컬에서 빌드 미리보기 |
| `pnpm new-post <filename>` | 새 게시물 작성 |
| `pnpm format` | Biome으로 코드 포맷 |
| `pnpm lint` | Biome으로 검사 및 자동 수정 |

## 🙏 감사의 말

이 프로젝트는 [saicaca/fuwari](https://github.com/saicaca/fuwari)의 포크입니다.
