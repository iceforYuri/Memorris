---
title: c++ 预处理器
published: 2025-03-21
discription: C++ 预处理器是一个在编译之前对源代码进行处理的工具。它可以用于宏定义、条件编译、文件包含等操作。预处理器的主要作用是将源代码转换为编译器可以理解的格式。
category: 指南
tags: [C++高级]
---
*There isn't anything that's evil to everyone. Even the worst evil saves something. On the other hand, even the greatest good hurts someone. The phrase "There are no absolutes in this world" means there isn't any absolute good or absolute evil.*——*Hanamonogatari*

# C++ 预处理器

预处理器是一些指令，指示编译器在实际编译之前所需完成的预处理

所有的预处理器指令都是以井号（#）开头，只有空格字符可以出现在预处理指令之前

# 主要预处理

## #include 文件包含

```cpp
#include <iostream>    // 从标准库位置查找头文件
#include "myheader.h"  // 从当前目录或指定的包含路径查找头文件
```

## #define 预处理（#undefine同理）

我们一般将#define预处理成为宏，主要用于创建符号常量

```cpp
#define macro-name replacement-text 
```

该文件中后续出现的所有宏都将会在程序编译之前被替换为 replacement-text

### 预处理情况

但是预处理之所以称作预处理，是因为它真的会在源文件编译后进行预处理：

假设源代码文件已经存在，接下来使用 -E 选项进行编译，并把结果重定向到 test.p

之前在源文件中定义的 `#define PI 3.14159`在编译的输出中已经被更改为

```cpp
$ gcc -E test.cpp > test.p

...
int main ()
{
 
    cout << "Value of PI :" << 3.14159 << endl; 

    return 0;
}

```

### 参数宏

`#define`同样可以定义一个类似函数可以传参的宏：

```
#define MIN(a,b) (a<b ? a : b)
```

## #if/#elif/#else/#endif/#ifdef 条件编译

有几个指令可以用来有选择地对部分程序源代码进行编译。这个过程被称为条件编译

使用以下示例进行说明展示：

```cpp
#include <iostream>
using namespace std;
#define DEBUG
 
#define MIN(a,b) (((a)<(b)) ? a : b)
 
int main ()
{
   int i, j;
   i = 100;
   j = 30;
#ifdef DEBUG
   cerr <<"Trace: Inside main function" << endl;
#endif
 
#if 0
   /* 这是注释部分 */
   cout << MKSTR(HELLO C++) << endl;
#endif
 
   cout <<"The minimum is " << MIN(i, j) << endl;
 
#ifdef DEBUG
   cerr <<"Trace: Coming out of main function" << endl;
#endif
    return 0;
}
```

如果在指令 #ifdef DEBUG 之前已经定义了符号常量 DEBUG，则会对程序中的 **cerr** 语句进行编译。您可以使用 #if 0 语句注释掉程序的一部分

上述代码被执行编译时，会产生如下结果：

```
Trace: Inside main function
The minimum is 30
Trace: Coming out of main function
```

## 预定义宏

C++ 提供了下表所示的一些预定义宏：

| 宏             | 描述                                                                             |
| -------------- | -------------------------------------------------------------------------------- |
| __LINE__ | 这会在程序编译时包含当前行号。                                                   |
| __FILE__ | 这会在程序编译时包含当前文件名。                                                 |
| __DATE__ | 这会包含一个形式为 month/day/year 的字符串，它表示把源文件转换为目标代码的日期。 |
| __TIME__ | 这会包含一个形式为 hour:minute:second 的字符串，它表示程序被编译的时间。         |

```cpp
#include <iostream>
using namespace std;
 
int main ()
{
    cout << "Value of __LINE__ : " << __LINE__ << endl;
    cout << "Value of __FILE__ : " << __FILE__ << endl;
    cout << "Value of __DATE__ : " << __DATE__ << endl;
    cout << "Value of __TIME__ : " << __TIME__ << endl;
 
    return 0;
}
```

结果为：

```cpp
Value of __LINE__ : 6
Value of __FILE__ : test.cpp
Value of __DATE__ : Feb 28 2011
Value of __TIME__ : 18:52:48
```

# 特殊预处理运算符

## # 和 ## 运算符

这里的#运算符并不是引用头文件的那个#，而是作为参数宏的一种运算过程：

## `#` 运算符（字符串化运算符）

### `#` 运算符将宏参数转换为字符串字面量（添加双引号）

```cpp
#define STRINGIFY(x) #x

// 使用示例
const char* str = STRINGIFY(Hello World);  // 等价于 "Hello World"
```

当宏展开时，`#x` 会变成 `"Hello World"`，即参数被转换为带引号的字符串

### `##` 运算符（标记连接运算符）

`##` 运算符将两个标记（token）连接成一个新的标记

```cpp
#define CONCAT(a, b) a ## b

// 使用示例
int CONCAT(var, 1) = 10;  // 等价于 int var1 = 10;
```

当宏展开时，`a ## b` 会变成 `var1`，即两个参数被连接成一个标识符
