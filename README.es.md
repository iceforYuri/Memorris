# 🍥 Memorris

Blog personalizado a partir de [Fuwari](https://github.com/saicaca/fuwari), construido con [Astro](https://astro.build).

[**🖥️ Demostración en vivo**](https://blog.memorris.dpdns.org/)&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;
[**📦 Plantilla Fuwari**](https://github.com/saicaca/fuwari)&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;
[**📦 Versión antigua de Hexo**](https://github.com/saicaca/hexo-theme-vivia)

🌏 README en
[**English**](README.md) /
[**中文**](README.zh-CN.md) /
[**日本語**](README.ja-JP.md) /
[**한국어**](README.ko.md) /
[**ไทย**](README.th.md)

> Versión del README: `2026-03-11`

![Vista previa](./image/README/1781606389145.png)

## ✨ Características

Heredadas de Fuwari:

- [x] Construido con [Astro](https://astro.build) y [Tailwind CSS](https://tailwindcss.com)
- [x] Animaciones suaves y transiciones de página (Swup)
- [x] Modo claro / oscuro
- [x] Colores del tema y banner personalizables
- [x] Diseño responsivo
- [x] Búsqueda con [Pagefind](https://pagefind.app/)
- [x] Tabla de contenidos (TOC)
- [x] Fórmulas matemáticas KaTeX
- [x] Feed RSS
- [ ] Comentarios

## 🔧 Personalizaciones respecto al upstream

Mejoras adicionales en este fork:

### TOC

- Agrupación lateral, indicador de progreso, soporte de fórmulas KaTeX

![TOC preview](./image/README/1781607282363.png)

### Rendimiento

- Carga diferida de imágenes, optimización de componentes principales

### Páginas de archivo

- Nube de etiquetas por frecuencia, contador animado, categorías expandidas por defecto

<p align="center">
  <img src="./image/README/1781607819957.png" alt="Nube de etiquetas" width="49%" />
  <img src="./image/README/1781607863903.png" alt="Página de categorías" width="49%" />
</p>

> Para la documentación completa del fork, consulta [README.md](README.md) o [README.zh-CN.md](README.zh-CN.md).

## 🚀 Cómo usar

1. Clona este repositorio e instala dependencias con `pnpm install`.
2. Edita `src/config.ts` y `astro.config.mjs` para personalizar el sitio.
3. Ejecuta `pnpm new-post <filename>` para crear entradas en `src/content/posts/`.
4. Desarrollo local: `pnpm dev`
5. Compilar y previsualizar: `pnpm build` y `pnpm preview`
6. Despliega siguiendo las [guías de Astro](https://docs.astro.build/en/guides/deploy/).

## ⚙️ Cabecera de las entradas

```yaml
---
title: Mi primer post
published: 2023-09-09
description: Primera entrada de mi blog con Astro.
image: ./cover.jpg
tags: [Foo, Bar]
category: Front-end
draft: false
lang: jp
---
```

## 🧞 Comandos

| Comando | Acción |
|:--------|:-------|
| `pnpm install` | Instala dependencias |
| `pnpm dev` | Inicia el servidor local en `localhost:4321` |
| `pnpm build` | Compila el sitio en `./dist/` |
| `pnpm preview` | Previsualiza el build localmente |
| `pnpm new-post <filename>` | Crea una nueva entrada |
| `pnpm format` | Formatea el código con Biome |
| `pnpm lint` | Analiza y corrige con Biome |

## 🙏 Agradecimientos

Este proyecto es un fork de [saicaca/fuwari](https://github.com/saicaca/fuwari).
