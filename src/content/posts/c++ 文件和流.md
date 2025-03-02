---
title: c++ 文件和流
published: 2025-03-02
discription: 
categories: 指南
tags: [C++高级]
---
*Agh, it penetrates my brain!*——*Yu Yu Hakusho*


# C++ **文件和流**

## 打开文件

**ofstream** 和 **fstream** 对象都可以用来打开文件进行写操作，如果只需要打开文件进行读操作，则使用 **ifstream** 对象。

下面是 open() 函数的标准语法，open() 函数是 fstream、ifstream 和 ofstream 对象的一个成员。

| 模式标志   | 描述                                                                   |
| ---------- | ---------------------------------------------------------------------- |
| ios::app   | 追加模式。所有写入都追加到文件末尾。                                   |
| ios::ate   | 文件打开后定位到文件末尾。                                             |
| ios::in    | 打开文件用于读取。                                                     |
| ios::out   | 打开文件用于写入。                                                     |
| ios::trunc | 如果该文件已经存在，其内容将在打开文件之前被截断，即把文件长度设为 0。 |

以上模式也可以多个同时使用：

```
ofstream outfile;
outfile.open("file.dat", ios::out | ios::trunc );
```
