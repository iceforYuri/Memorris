---
title: java与vscode配置
published: 2025-06-30
description: Java配置注意事项，使用VSCode作为IDE。
category: 指南
tags: [java]
---
# 调试中的编译

在 VS Code 中按下 F5，默认会触发“启动调试”任务，而不是构建（build）任务。对于 Java 项目，F5 通常会调用 `launch.json` 中配置的调试启动项。如果没有 `launch.json`，VS Code 会自动推断并生成一个临时的调试配置，自动编译并运行你的主类。

但是我遇到了使用F5后java程序并没有编译的情况，理论上会生成对应的.class文件，但实际上什么都没有发生，目前没想明白
