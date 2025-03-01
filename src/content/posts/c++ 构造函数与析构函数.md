---
title: c++ 构造函数与析构函数
published: 2025-03-01
discription: 构造函数与析构函数是C++中的重要概念，本文将详细介绍构造函数与析构函数的概念、作用、调用时机、特点、注意事项等内容。
categories: C++面向对象
tags: [指南]
---
*To live is to undertake a journey - no, to undertake a journey is to live. To face the wind or to follow it, all journeys lead to the gates of death... The light in which all journeys are taken is deceptive - not hopeful, but sorrowful. And the struggle never ends. Everywhere on the earth is fleeting life. We are blown by the wind. The words we write in the sand disappear and finally, when we are swallowed by the sea we do not hear the waves. The humblest of creatures must face these dreadful barriers. No-not barriers, but challenges rather...*——*The Heroic Legend of Arslan*

# 类的构造函数

类的**构造函数**是类的一种特殊的成员函数，它会在每次创建类的新对象时执行。

构造函数的名称与类的名称是完全相同的，并且不会返回任何类型，也不会返回 void，相当于对当前对象中的元素初始化

```
class Line
{
   public:
      void setLength( double len );
      double getLength( void );
      Line();  // 这是构造函数
 
   private:
      double length;
};
 
// 成员函数定义，包括构造函数
Line::Line(void)
{
    cout << "Object is being created" << endl;
}
```

非常类似全局类函数定义

```
void Line::setLength( double len )
{
    length = len;
}
 
double Line::getLength( void )
{
    return length;
}
```

当我们在声明该类对象时就一同初始化其中的变量

```
int main( )
{
   Line line;
 
   // 设置长度
   line.setLength(6.0); 
   cout << "Length of line : " << line.getLength() <<endl;
 }
```

## 基类构造函数（初始化列表）

当我们看到这种在函数定义时的：声明定义时，相当于在主函数中提前声明

```
Line::Line( double len): length(len)
{
    cout << "Object is being created, length = " << len << endl;
}
```

上述代码等同于

```
Line::Line( double len)
{
    length = len;
    cout << "Object is being created, length = " << len << endl;
}
```

而这样的基类构造函数也有一个额外特征：当变量在类中提前被声明为const类型时，使用基类构造函数（初始构造）仍可以在声明该类对象时为const类型变量赋值

# 类的析构函数

析构函数在每次删除对象时进行

```
Line::~Line(void)
{
    cout << "Object is being deleted" << endl;
}
```

析构函数的名称与类的名称是完全相同的，只是在前面加了个波浪号（~）作为前缀，它不会返回任何值，也不能带有任何参数。析构函数有助于在跳出程序（比如关闭文件、释放内存等）前释放资源。
