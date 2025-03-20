---
title: c++ 构造函数与析构函数
published: 2025-03-01
discription: 构造函数与析构函数是C++中的重要概念，本文将详细介绍构造函数与析构函数的概念、作用、调用时机、特点、注意事项等内容。
category: 指南
tags: [C++面向对象]
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

## 拷贝构造函数

拷贝构造函数是一种特殊的构造函数，其形参为本类的对象引用

当用类的一个对象去初始化（创建）该类的另一个对象时系统自动调用拷贝构造函数实现拷贝赋值

* 若函数的参数是类对象，调用函数时，系统自动调用拷贝构造函数，将实参赋对象的值复制一份，作为函数调用的形参
* 当函数的返回值是类对象时，用return 语句返回对象时，系统自动调用拷贝构造函数，复制一份对象的拷贝，作为返回值
* 缺省拷贝构造函数：
  * 如果程序员没有为类声明拷贝初始化构造函数，则编译器自己生成一个拷贝构造函数
  * 这个构造函数执行的功能是：用作为初始值的对象的每个数据成员的值，初始化将要建立的对象的对应数据成员
  * 在某些情况下，缺省拷贝构造函数可能是不正确的，例如存在指针的情况
    这里就会提及浅拷贝和深拷贝


### 浅拷贝（Shallow Copy）

浅拷贝只复制对象的成员变量值，**不复制**成员变量所指向的动态内存内容。对于指针类型的成员变量，浅拷贝 **只复制指针本身** ，而不复制指针指向的数据。

如果不自定义拷贝构造函数，编译器提供的默认拷贝构造函数会执行浅拷贝：

```cpp
// 编译器默认生成的浅拷贝（伪代码）
matrix::matrix(const matrix& other)
{
    rows = other.rows;
    lines = other.lines;
    matri = other.matri;  // 只复制指针，不复制内容
}
```

### 深拷贝（Deep Copy）

深拷贝不仅复制对象的成员变量值，还**递归复制**成员变量所指向的动态内存内容。对于指针类型的成员变量，深拷贝会**分配新内存**并复制指针指向的数据。

```cpp
matrix(const matrix &m)
{
    this->rows = m.rows;
    this->lines = m.lines;
    matri = new int *[rows];  // 分配新内存
    for (int i = 0; i < rows; i++)
    {
        matri[i] = new int[lines];  // 为每行分配新内存
    }
    for (int i = 0; i < rows; i++)
    {
        for (int j = 0; j < lines; j++)
        {
            matri[i][j] = m.matri[i][j];  // 复制数据内容
        }
    }
}
```



### 浅拷贝导致的问题

考虑以下场景：

```cpp
void demonstrateShallowCopyProblem()
{
    // 假设使用浅拷贝
    matrix A(2, 2);
    A.matrixinput();  // 输入一些值
  
    {
        matrix B = A;  // 浅拷贝
        // B离开作用域，析构函数释放matri指向的内存
    }
  
    // 此时A.matri指向的内存已被释放
    A.matrixoutput();  // 危险操作！访问已释放的内存
}
```

这会导致：

* A.matri成为悬挂指针
* 访问已释放的内存

## 组合类构造函数

* 构造函数调用顺序：先调用内嵌对象的构造函数（按**内嵌时的声明顺序**，先声明者先构造）。然后执行本类的构造函数。（析构函数的调用顺序相反）
  ```cpp
  class Example {
  private:
      int a;
      int b;

  public:
      // b会先于a被初始化，因为声明顺序是这样的
      Example() : b(10), a(b) {}  // 危险!
  };
  ```
* 若调用默认构造函数（即无形参的），则内嵌对象的初始化也将调用相应的默认构造函数；如果子对象没有默认构造函数，则组合类的默认构造函数也不会自动生成:
  ```cpp
  class NonDefault {
  public:
      NonDefault(int x) {}  // 没有默认构造函数
  };

  class Container {
      NonDefault member;  // 需要初始化

  public:
      // 编译错误，除非显式提供初始化
      Container() {}  // 错误

      // 正确方式
      Container() : member(0) {}
  };
  ```








# 类的析构函数

析构函数在每次删除对象时进行/每次离开对应作用域时释放

```
Line::~Line(void)
{
    cout << "Object is being deleted" << endl;
}
```

析构函数的名称与类的名称是完全相同的，只是在前面加了个波浪号（~）作为前缀，它不会返回任何值，也不能带有任何参数。析构函数有助于在跳出程序（比如关闭文件、释放内存等）前释放资源。
