---
title: c++ 模板
published: 2025-03-21
discription: C++ 模板是 C++ 的一个重要特性，它允许程序员编写通用的代码，以便在不同的数据类型上工作。模板可以用于函数和类，使得代码更加灵活和可重用。
category: 指南
tags: [C++高级]
---
*In my family; Father, Mother, and Grandmother all hated each other. I was the trash can into which they dumped their hatred. That's why I only thought about beautiful and warm things, fun things. But after I met you, I understood. No matter how many beautiful stories I made, they were all lies. Because the person telling the stories, me, was an ugly and dirty creature.*——*Bungaku Shoujo*

# C++ 模板

模板是创建泛型类或函数的蓝图或公式

这里需先提及一下泛型编程：

## 泛型编程

泛型编程是一种以独立于任何特定类型的方式编写代码的编程方法。它允许程序员编写可以处理不同数据类型的通用代码，提高了代码的可重用性和灵活性。

例如，一个泛型的排序函数可以对整数数组、字符串数组等不同类型的数组进行排序，而**不需要为每种类型都编写一个单独的排序函数**。

## 函数模板

泛型模板定义如下：

```cpp
template <typename type> ret-type func-name(parameter list)
{
   // 函数的主体
}
```

type 是函数所使用的数据类型的占位符名称，这个名称可以在函数定义中使用

```cpp
template <typename T>
inline T const& Max (T const& a, T const& b) 
{ 
    return a < b ? b:a; 
} 
```

这样的话我们就可以对每一种类型都使用这样的函数：

```cpp
int main ()
{
 
    int i = 39;
    int j = 20;
    cout << "Max(i, j): " << Max(i, j) << endl; 
 
    double f1 = 13.5; 
    double f2 = 20.7; 
    cout << "Max(f1, f2): " << Max(f1, f2) << endl; 
 
    string s1 = "Hello"; 
    string s2 = "World"; 
    cout << "Max(s1, s2): " << Max(s1, s2) << endl; 
 
    return 0;
}
```

## 类模板

正如我们定义函数模板一样，我们也可以定义类模板

```cpp
template <class type> 
class class-name {
.
}

```

不过因为类声明并不包含数据类型，所以这里的type理论上是在这个类中使用的全部可以使用的通用数据类型（代表一个具体类型，在模板实例化时被替换为实际类型）

```cpp
template <class T>
class Stack { 
  private: 
    vector<T> elems;     // 元素 
 
  public: 
    void push(T const&);  // 入栈
    void pop();               // 出栈
    T top() const;            // 返回栈顶元素
    bool empty() const{       // 如果为空则返回真。
        return elems.empty(); 
    } 
}; 
```
