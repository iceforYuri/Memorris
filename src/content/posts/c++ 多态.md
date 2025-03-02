---
title: c++ 多态
published: 2025-03-01
discription: 
categories: C++面向对象
tags: [指南]
---
*People say love can be developed, but in the end the only person they love is themselves, that's why you choose to love someone who can please you the most.*——*Nana*

当类之间存在层次结构，并且类之间是通过继承关联时，就会用到多态。

# 虚函数

* 在基类中声明一个函数为虚函数，使用关键字 `virtual`。
* 派生类可以重写（override）这个虚函数。
* 调用虚函数时，会根据对象的实际类型来决定调用哪个版本的函数。

虚函数实际上是作为继承类的一个备用声明，继承类可以改写并调用该函数，不过是新的声明

```
// 基类 Animal
class Animal {
public:
    // 虚函数 sound，为不同的动物发声提供接口
    virtual void sound() const {
        cout << "Animal makes a sound" << endl;
    }
   
    // 虚析构函数确保子类对象被正确析构
    virtual ~Animal() {
        cout << "Animal destroyed" << endl;
    }
};

// 派生类 Dog，继承自 Animal
class Dog : public Animal {
public:
    // 重写 sound 方法
    void sound() const override {
        cout << "Dog barks" << endl;
    }
   
    ~Dog() {
        cout << "Dog destroyed" << endl;
    }
};
```

不过需要注意的是，当析构函数被虚化后，继承类的析构将要递归析构

```
animalPtr = new Dog();
animalPtr->sound();  // 调用 Dog 的 sound 方法
delete animalPtr;    // 释放内存，调用 Dog 和 Animal 的析构函数
#结果如下
Dog barks
Dog destroyed
Animal destroyed
```
