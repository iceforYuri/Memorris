---
title: c++ 对象数组与指针
published: 2025-03-28
discription: 
category: 指南
tags: [C++面向对象]
---
*请求出错: SOCKSHTTPSConnectionPool(host='animechan.io', port=443): Max retries exceeded with url: /api/v1/quotes/random (Caused by NewConnectionError('<urllib3.contrib.socks.SOCKSHTTPSConnection object at 0x0000021E558E2E10>: Failed to establish a new connection: [WinError 10061] 由于目标计算机积极拒绝，无法连接。'))*——*未知*

# C++ 对象数组

数组是具有一定顺序关系的若干相同类型变量的集合体，组成数组的变量称为该数组的元素

数组属于构造类型

## 数组参数

* 数组元素作实参，与单个变量做参数一样
* 数组名作参数，实际上是指针做参数
  * 形、实参数都是数组名，类型要一样，传送的是数组首地址
  * 形参是指针，实参是数组名，类型相同，传送的也是数组首地址

# C++ 指针

取地址&、解引用*

## void类型指针

```cpp
void *pv;// 用于记录一个地址，类型未知（不关心）
int i;
pv = &i;// 记录 i 的地址
*pv = 0;// error
pv = pv + 1; // error

int *pint = (int *)pv;
```

void指针的值（地址）可以赋值给任何类型的指针变量，但需要类型强制转换

## 指向常量的指针

```cpp
const  Type * ptr;
```

不能**通过指针来修改所指对象的值**，但指针本身可以改变，**可以指向另外的对象**

```cpp
const char *name1 = "John"; // 指向常量的指针
char s[] = "abc";
name1 = s;     // 正确，name1本身的值可以改变
*name1 ='1';   // 错误，试图修改常量
name1[2] ='3'; // 错误，试图修改常量
```

## 指针类型的常量

```cpp
Type * const ptr;
```

指针的值（地址值）不能被改变，但是**可以修改指针指向对象的值**

## 指向类成员（非静态）的指针

* 通过指向成员的指针来访问类的公有成员
* 指向成员**变量**的指针
  * 声明：`类型说明符 类名::*指针名；`
  * 赋值/初始化：`指针名 = &类名::数据成员名；`
  * 访问数据成员：`对象名 .* 类成员指针名` 或  `对象指针名—>*类成员指针名`
* 指向成员**函数**的指针
  * 声明：`类型说明符 (类名::*指针名)(参数表)；`
  * 赋值/初始化：` 指针名 = 类名::函数成员名；`
  * 访问成员函数：`(对象名.* 类成员指针名)(参数表) ` 或 `(对象指针名—>*类成员指针名)(参数表)`

```cpp
class CA
{
public:
    int x;
    int y;
    void f(int i);
    void g(int i);
    ...
};
void CA::f(int i)
{
    x = i;
}
void CA::g(int i)
{
    y = i;
}
int main()
{
    int  CA::*pData = &CA::x;
    void (CA::*pFunc)(int) = CA::f;
}
```

这样就像是在对象类的外面额外补充了有关当前类的变量

## 指向类的静态成员的指针

对类的静态成员的访问不依赖于对象

可以用普通的指针来指向和访问静态成员

```cpp
int *count = &Point::countP;
```

即在声明过程中不必为指针变量加上有关类的类型
