---
title: 文字高亮验证
published: 2026-06-16
description: Obsidian 式 ==高亮== 语法与 B2 高亮色的验证页，逐项对照预期效果。
tags: [Demo, Markdown, Validation]
category: Examples
draft: false
---

> 访问路径：`/posts/highlight-validation/`  
> **方案对比页（B2 / B3 并排 + 色相滑块）：** [`/highlight-compare/`](/highlight-compare/)  
> 语法：`==被高亮文字==`（Obsidian 双等号）。样式：**B2** — `calc(var(--hue) + 210)` 对比色淡底（`--text-highlight-bg`）。

## 1. 基础

| 项 | 源码 | 预期 |
|----|------|------|
| 句中高亮 | `This is ==highlighted text== in a sentence.` | 仅「highlighted text」有淡色底 |
| 中文 | `从 Obsidian 复制 ==重点内容== 应保留高亮。` | 从 Obsidian 复制 ==重点内容== 应保留高亮。 |
| 整段 | `==整句都被高亮==` | ==整句都被高亮== |

This is ==highlighted text== in a sentence.

从 Obsidian 复制 ==重点内容== 应保留高亮。

==整句都被高亮==

---

## 2. 嵌套格式

| 项 | 预期 |
|----|------|
| 加粗 + 高亮 | `**==bold highlight==**` → 加粗且带底 |
| 高亮 + 加粗 | `==**bold inside**==` → 高亮块内加粗 |
| 斜体 + 高亮 | `*==italic highlight==*` |

**==bold highlight==**

==**bold inside highlight**==

*==italic highlight==*

---

## 3. 与行内 code 区分

高亮：圆角淡底、继承正文字体。行内 code：等宽字体、灰底。

并排对比：`==高亮==` 与 `` `inline code` `` 应一眼可区分。

Use ==highlight== next to `` `inline code` `` in one line.

反引号内应为字面量（无高亮）：`==not highlighted==`

---

## 4. 围栏代码块（不应高亮）

下面块内 `==` 须原样显示，无 `<mark>`：

```markdown
This is ==highlighted text== in a sentence.
**==bold highlight==**
```

```text
==equals in plain code block==
```

---

## 5. 数学公式

行内：`$a == b$`（等号在公式内，不是高亮语法）

块级：

$$
x == y \quad \text{when } z = 0
$$

若上式显示异常，记录并反馈（插件顺序：`remarkMath` 在高亮之前）。

---

## 6. 与其他扩展共存

:::tip
Admonition 内也可 ==高亮提示==，不应破坏边框与标题。
:::

The answer is :spoiler[==hidden highlight==] — 悬停后应看到高亮文字。

> 引用块里 ==高亮== 与正文样式一致。

- 列表项中的 ==高亮==
- 第二项 `` `code` `` 与 ==mark== 混排

---

## 7. 链接与高亮

带链接的句子：[==链接文字==](https://example.com) — 链接样式（虚线下划线）与高亮底应叠加，不互相覆盖。

---

## 8. 手动回归清单

在浏览器中逐项勾选：

- [ ] **浅色主题**：高亮可读，底色不过亮/过暗
- [ ] **深色主题**：高亮可读，与背景对比足够
- [ ] **改色相**：Navbar 调整 `--hue` 后，高亮底色随之变化（与链接/按钮同色系）
- [ ] **Pagefind 搜索**：搜「highlighted」或「重点」；结果列表里的 `<mark>` 仍是**关键词样式**（透明底 + 主题色字），不是正文高亮的大块淡底

---

## 9. 源码速查

```markdown
==普通高亮==
**==加粗高亮==**
==**高亮内加粗**== 
`==not highlighted==`
```
