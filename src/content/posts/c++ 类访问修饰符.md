---
title: c++ 类访问修饰符
published: 2025-03-01
discription: 构造函数与析构函数是C++中的重要概念，本文将详细介绍构造函数与析构函数的概念、作用、调用时机、特点、注意事项等内容。
categories: C++面向对象
tags: [指南]
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

# C++友元

类的友元函数是定义在类外部，但有权访问类的所有私有（private）成员和保护（protected）成员。

尽管友元函数的原型有在类的定义中出现过，但是友元函数并不是成员函数。

## 友元函数

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
