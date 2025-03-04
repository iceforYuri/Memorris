---
title: c++ 文件和流
published: 2025-03-02
discription: 
category: 指南
tags: [C++高级]
---
*Agh, it penetrates my brain!*——*Yu Yu Hakusho*


# C++ **文件和流**

## 打开文件

**ofstream** 和 **fstream** 对象都可以用来打开文件进行写操作，如果只需要打开文件进行读操作，则使用 **ifstream** 对象。

```cpp
void open(const char *filename, ios::openmode mode);
```

下面是 open() 函数的标准语法，open() 函数是 fstream、ifstream 和 ofstream 对象的一个成员。

| 模式标志   | 描述                                                                   |
| ---------- | ---------------------------------------------------------------------- |
| ios::app   | 追加模式。所有写入都追加到文件末尾。                                   |
| ios::ate   | 文件打开后定位到文件末尾。                                             |
| ios::in    | 打开文件用于读取。                                                     |
| ios::out   | 打开文件用于写入。                                                     |
| ios::trunc | 如果该文件已经存在，其内容将在打开文件之前被截断，即把文件长度设为 0。 |

以上模式也可以多个同时使用：

```cpp
ofstream outfile;
outfile.open("file.dat", ios::out | ios::trunc );
```


## 关闭文件

```cpp
void close();
```

## 写入/读取文件

```cpp
#include <fstream>
#include <iostream>


   char data[100];
// 以写模式打开文件
   ofstream outfile;
   outfile.open("afile.dat");
   cin.getline(data, 100);
// 向文件写入用户输入的数据
   outfile << data << endl;

// 以读模式打开文件
   ifstream infile; 
   infile.open("afile.dat"); 
```



## 文件位置指针

文件位置指针是一个整数值，指定了从文件的起始位置到指针所在位置的字节数。

**istream** 和 **ostream** 都提供了用于重新定位文件位置指针的成员函数。这些成员函数包括关于 istream 的  **seekg** （"seek get"）和关于 ostream 的  **seekp** （"seek put"）。

seekg 和 seekp 的参数通常是一个长整型。第二个参数可以用于指定查找方向。查找方向可以是  **ios::beg** （默认的，从流的开头开始定位），也可以是  **ios::cur** （从流的当前位置开始定位），也可以是  **ios::end** （从流的末尾开始定位）。

```cpp
// 定位到 fileObject 的第 n 个字节（假设是 ios::beg）
fileObject.seekg( n );
 
// 把文件的读指针从 fileObject 当前位置向后移 n 个字节
fileObject.seekg( n, ios::cur );
 
// 把文件的读指针从 fileObject 末尾往回移 n 个字节
fileObject.seekg( n, ios::end );
 
// 定位到 fileObject 的末尾
fileObject.seekg( 0, ios::end );
```
