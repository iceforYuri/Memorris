---
title: c++ 多态
published: 2025-03-01
discription: 
category: 指南
tags: [C++面向对象]
---
*People say love can be developed, but in the end the only person they love is themselves, that's why you choose to love someone who can please you the most.*——*Nana*

当类之间存在层次结构，并且类之间是通过继承关联时，就会用到多态。

# 虚函数

* 在基类中声明一个函数为虚函数，使用关键字 `virtual`。
* 派生类可以重写（override）这个虚函数。
* 调用虚函数时，会根据对象的实际类型来决定调用哪个版本的函数。

虚函数实际上是作为继承类的一个备用声明，继承类可以改写并调用该函数，不过是新的声明

```cpp
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

## 纯虚函数

纯虚函数是没有实现的虚函数，在基类中用 **= 0** 来声明。

```
class Shape {
public:
    virtual int area() = 0;  // 纯虚函数，强制子类实现此方法
};
```

# 动态绑定

在一个多态的场景下，基类指针可以指向派生类对象，当通过基类指针调用一个虚函数时，实际调用的是派生类中重写的那个函数

官方文档如下：

* 也称为晚期绑定（Late Binding），在运行时确定函数调用的具体实现。
* 需要使用指向基类的指针或引用来调用虚函数，编译器在运行时根据对象的实际类型来决定调用哪个函数。

```
// 函数接受基类引用
void letAnimalMakeSound(const Animal& animal) {
    // 动态绑定: 根据实际对象类型调用相应的函数
    animal.makeSound();
}

int main()
{
    std::cout << "\n通过基类引用调用 (动态绑定):" << std::endl;
    letAnimalMakeSound(animal);  // 输出: 动物发出声音
    letAnimalMakeSound(dog);     // 输出: 汪汪汪!  (动态绑定!)
    letAnimalMakeSound(cat);     // 输出: 喵喵喵~  (动态绑定!)
  
    std::cout << "\n通过基类指针调用 (动态绑定):" << std::endl;
    Animal* animalPtr = &animal;
    animalPtr->makeSound();      // 输出: 动物发出声音
}
```
