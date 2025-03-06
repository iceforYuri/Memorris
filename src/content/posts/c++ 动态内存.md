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

对应 `malloc()`和 `free()`

### new的使用

new分配内存通用语法：`new <data-type>;`

**data-type** 可以是包括数组在内的任意内置的数据类型，也可以是包括类或结构在内的用户自定义的任何数据类型。

```cpp
elementtype* pvalue = NULL;
pvalue = new elementtype;
```

相对于malloc而言，其主要的优点是，new 不只是分配了内存，它还创建了对象。

### delete的使用

和 `free()`一样，用来释放分配到的指针空间

```cpp
delete pvalue;        // 释放 pvalue 所指向的内存
```

# 数组的动态内存分配

稍微与 `malloc`和 `free`有一些区别

{% notel red 一维数组 %}

```cpp
// 动态分配,数组长度为 m
int *array=new int [m];
 
//释放内存
delete [] array;
```

{% endnotel %}

而二维数组的模式也与普通的c一样

```cpp
int **array;
// 假定数组第一维长度为 m， 第二维长度为 n
// 动态分配空间
array = new int *[m];
for( int i=0; i<m; i++ )
{
    array[i] = new int [n];
}
//释放
for( int i=0; i<m; i++ )
{
    delete [] array[i];
}
delete [] array;
```


# 对象的动态内存分配

由于new和delete涵盖所有类别，在使用时对于类和类型都是一样的，但是如果对象中出现构造函数和析构函数时，分配内存和释放内存时就会执行这些函数：

```cpp
#include <iostream>
using namespace std;
 
class Box
{
   public:
      Box() { 
         cout << "调用构造函数！" <<endl; 
      }
      ~Box() { 
         cout << "调用析构函数！" <<endl; 
      }
};
 
int main( )
{
   Box* myBoxArray = new Box[4];
 
   delete [] myBoxArray; // 删除数组
   return 0;
}
```

调用四次的结果如下：

```
调用构造函数！
调用构造函数！
调用构造函数！
调用构造函数！
调用析构函数！
调用析构函数！
调用析构函数！
调用析构函数！
```
