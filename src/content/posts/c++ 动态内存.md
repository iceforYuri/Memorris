---
title: c++ 动态内存
published: 2025-03-03
discription: 程序运行时根据需要动态分配和释放的内存空间。
categories: 指南
tags: [C++高级]
---
*Humming and the nightly news share a very tight connection indeed.*——*Soul Eater*


C++ 程序中的内存分为两个部分：

* **栈：** 在函数内部声明的所有变量都将占用栈内存。
* **堆：** 这是程序中未使用的内存，在程序运行时可用于动态分配内存。


# new 和 delete 运算符

对应`malloc()`和`free()`

new分配内存通用语法：`new <data-type>;`

**data-type** 可以是包括数组在内的任意内置的数据类型，也可以是包括类或结构在内的用户自定义的任何数据类型。

```cpp
elementtype* pvalue = NULL;
pvalue = new elementtype;
```
