---
title: c++ 类访问修饰符（作用域）
published: 2025-03-01
discription: 构造函数与析构函数是C++中的重要概念，本文将详细介绍构造函数与析构函数的概念、作用、调用时机、特点、注意事项等内容。
category: 指南
tags: [C++面向对象]
---
*Because of the existence of love - sacrifice is born. As well as hate. Then one comprehends... one knows PAIN.*——*Naruto*

**protected（受保护）** 成员变量或函数与私有成员十分相似，但有一点不同，protected（受保护）成员在派生类（即子类）中是可访问的。

## 继承中的特点

1. **public 继承：** 基类 public 成员，protected 成员，private 成员的访问属性在派生类中分别变成：public, protected, private
2. **protected 继承：** 基类 public 成员，protected 成员，private 成员的访问属性在派生类中分别变成：protected, protected, private
3. **private 继承：** 基类 public 成员，protected 成员，private 成员的访问属性在派生类中分别变成：private, private, private

无论哪种形式，有两点不被改变

1. private 成员只能被本类成员（类内）和友元访问，不能被派生类访问；
2. protected 成员可以被派生类访问。

# C++静态

在类中使用static声明，在衍生作用域中可以使用

```cpp
class A
{
public:
    static void f();
    static void g();
    void h();

private:
    static int s;
    int x;
};
void A::f()
{
    cout << s;
    g();
    cout << x; // 错误，在静态函数中的只能访问静态成员变量
    h();       // 错误，在静态函数中的只能调用静态成员函数
    A a;       //  a 是一个实例化的对象，
    a.h();     //  可以访问 a 的非静态成员
  
}
```



# C++友元

类的友元函数是定义在类外部，但有权访问类的所有私有（private）成员和保护（protected）成员。

尽管友元函数的原型有在类的定义中出现过，但是友元函数并不是成员函数。

为了确保数据的完整性，及数据封装与隐藏的原则，建议尽量不使用或少使用友元

## 友元函数

友元函数相对于一个外部函数在类中被声明，但是可以在外部调用访问类中的元素

如果要声明函数为一个类的友元，需要在类定义中该函数原型前使用关键字  **friend** ，如下所示：

```
class Box
{
   double width;
public:
   double length;
   friend void printWidth( Box box );
   void setWidth( double wid );
};
// 请注意：printWidth() 不是任何类的成员函数
void printWidth( Box box )
{
   /* 因为 printWidth() 是 Box 的友元，它可以直接访问该类的任何成员 */
   cout << "Width of box : " << box.width <<endl;
}

```

友元函数可通过对象名访问private 和protected 成员

## 友元类

友元类同理，也是在一个对象中声明该类

```cpp
class A;
class B
{
public:
    void Set(A &a, int i);
    void Display(A &a);

private:
    ...
};
Class A
{
    friend class B;

private:
    void Display();

private:
    int x;
}
void B::set(As a, int i)
{
    a.x = 1;
}
void B::Display(A &a)
{
    a.Display();
}
```

# C++常量类型

常类型的变量（对象）必须进行初始化，在程序中不能被更新，常量不能作为左值

* 常量引用：被引用的对象不能被更新
  * ```cpp
    const  类型说明符 &引用名
    ```
* 常量对象：必须进行初始化,不能被更新
  * 同时作为赋值对象被赋值也必须声明为常量
* 常量数组：数组元素不能被更新
* 常量指针

## const修饰

const 数据类型 == 数据类型 const

### 指针

`const int *p1 = &a;`  指针指向的内容不能修改
`int * const p2 = &a;`  指针指向的地址不能修改
`const int * const p3 = &a; `  指针指向的地址和内容都不能修改

## 用const 修饰的对象成员

* 常成员函数 `类型说明符 函数名（参数表）const;`
  * 常成员函数不能更新对象的数据成员
  * 常成员函数中，不能调用非常量成员函数
  * const 关键字可以被用于参与对重载函数的区分
* 使用常量对象时，只能调用其常成员函数
* 常数据成员
