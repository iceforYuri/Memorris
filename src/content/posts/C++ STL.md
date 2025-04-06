---
title: C++ STL
published: 2025-04-04
discription: 
category: 指南
tags: [C++资源库]
---
*We are Partners. If you are a Witch, then I am a Warlock.*——*Code Geass: Lelouch of the Rebellion*

# STL初步介绍

STL标准模板库（Standard Template Library，STL）是一套功能强大的 C++ 模板类和函数的集合，它提供了一系列通用的、可复用的算法和数据结构。

STL 的设计基于泛型编程，这意味着使用模板可以编写出独立于任何特定数据类型的代码。

STL 分为多个组件，包括容器（Containers）、迭代器（Iterators）、算法（Algorithms）、函数对象（Function Objects）和适配器（Adapters）等。

| 组件                         | 描述                                                                                                                                                             |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 容器（Containers）           | 容器是 STL 中最基本的组件之一，提供了各种数据结构，包括向量（vector）、链表（list）、队列（queue）、栈（stack）、集合（set）、映射（map）等                      |
| 算法（Algorithms）           | STL 提供了大量的算法，用于对容器中的元素进行各种操作，包括排序、搜索、复制、移动、变换等。这些算法在使用时不需要关心容器的具体类型，只需要指定要操作的范围即可。 |
| 迭代器（iterators）          | 迭代器用于遍历容器中的元素，允许以统一的方式访问容器中的元素，而不用关心容器的内部实现细节                                                                       |
| 函数对象（Function Objects） | 函数对象是可以像函数一样调用的对象，可以用于算法中的各种操作                                                                                                     |
| 适配器（Adapters）           | 适配器用于将一种容器或迭代器适配成另一种容器或迭代器，包括栈适配器（stack adapter）、队列适配器（queue adapter）和优先队列适配器（priority queue adapter）等。   |

## 容器

容器是用来存储数据的序列，它们提供了不同的存储方式和访问模式。

| 类型               | 容器                        | 描述                                                                     |
| ------------------ | --------------------------- | ------------------------------------------------------------------------ |
| **序列容器** | `std::vector`             | 动态数组，支持快速随机访问。                                             |
|                    | `std::deque`              | 双端队列，支持快速插入和删除。                                           |
|                    | `std::list`               | 链表，支持快速插入和删除，但不支持随机访问。                             |
| **关联容器** | `std::set`                | 集合，不允许重复元素。                                                   |
|                    | `std::multiset`           | 多重集合，允许多个元素具有相同的键。                                     |
|                    | `std::map`                | 映射，每个键映射到一个值。                                               |
|                    | `std::multimap`           | 多重映射，存储键值对，键是唯一的，但值可以重复，允许一个键映射到多个值。 |
| **无序容器** | `std::unordered_set`      | 无序集合。                                                               |
|                    | `std::unordered_multiset` | 无序多重集合。                                                           |
|                    | `std::unordered_map`      | 无序映射。                                                               |
|                    | `std::unordered_multimap` | 无序多重映射。                                                           |

### vector 的 capacity 和 size 属性区别

**size** 是当前 vector 容器真实占用的大小，也就是容器当前拥有多少个容器。

**capacity** 是指在发生 realloc 前能允许的最大元素数，即预分配的内存空间。

当然，这两个属性分别对应两个方法：**resize()** 和 **reserve()**。

使用 **resize()** 容器内的对象内存空间是真正存在的。

使用 **reserve()** 仅仅只是修改了 capacity 的值，容器内的对象并没有真实的内存空间(空间是"野"的)。

此时切记使用 **[ ]** 操作符访问容器内的对象，很可能出现数组越界的问题。

# C++ 导入标准库

## 1、使用 #include 包含头文件

```cpp
#include <iostream>  // 导入输入输出流库
#include <vector>    // 导入向量容器库
#include <cmath>     // 导入数学函数库
```

## 2、使用模块导入标准库（C++20/C++23）

导入整个库：

```cpp
import std; // 导入整个标准库（C++23 特性）

int main() {
    std::cout << "Hello, C++23 Modules!\n"; // 使用 std::cout 输出
    return 0;
}
```

或导入特定部分：

```cpp
import std.core;      // 导入核心库
import std.iostream;  // 导入输入输出流库

int main() {
    std::cout << "Hello, C++23 Modules!\n";
    return 0;
}
```

以下是一些编译器的支持情况和使用方法

| 编译器               | 支持情况                        | 编译命令示例                                                      |
| -------------------- | ------------------------------- | ----------------------------------------------------------------- |
| GCC                  | 需要启用 C++23 标准和模块支持。 | `g++ -std=c++23 -fmodules-ts -o program main.cpp`               |
| Clang                | 需要启用 C++23 标准和模块支持。 | `clang++ -std=c++23 -fmodules -o program main.cpp`              |
| MSVC (Visual Studio) | 需要启用 C++23 标准和模块支持。 | `cl /std:c++23 /experimental:module /EHsc /Fe:program main.cpp` |



## 注意事项

* **命名空间** ：C++标准库中的函数和类通常位于 `std` （standard库）命名空间中。因此，在使用这些函数和类时，通常需要加上 `std::`前缀，或者使用 `using namespace std;`来避免重复输入 `std::`。
* **头文件保护** ：在编写自己的头文件时，通常需要使用头文件保护（Header Guards）来防止重复包含。标准库头文件已经包含了这些保护机制，因此我们不需要担心重复包含的问题。
  * ```cpp
    #ifndef MYHEADER_H
    #define MYHEADER_H
    或
    // myheader.h
    #pragma once
    ```
* **兼容性** ：C++标准库在不同的编译器和平台上可能会有一些差异。因此，在编写跨平台的代码时，需要注意这些差异，并确保代码在不同环境下都能正常工作。

# C++ 标准库


* **标准函数库：** 这个库是由通用的、独立的、不属于任何类的函数组成的。函数库继承自 C 语言。
  * **独立函数** ：这些函数不属于任何类，直接调用
  * **过程式编程风格** ：遵循C语言的编程范式
  * **主要头文件** ：大多数以 `<c`开头，如 `<cmath>`, `<cstdio>`, `<cstring>`等
* **面向对象类库：** 这个库是类及其相关函数的集合。
  * **类和对象** ：通过类和对象来组织数据和功能
  * **封装、继承、多态** ：利用OOP的核心特性
  * **命名空间组织** ：全部位于 `std`命名空间中
