---
title: Java 抽象类
published: 2025-07-04
description: java 继承
category: 指南
tags: [java]
---
# 抽象类

抽象类是用关键字 `abstract` 修饰的类。

```java
public abstract class Animal{
    //成员变量
    String name;
    //构造方法
    public Animal(String name){
        this.name = name;
    }
    //成员方法
    public void sleep(){
        System.out.println(name + " is sleeping");
    }
    //抽象方法
    public abstract void eat();
}
```

`abstract`类具有以下特征：

1. 不能直接实例化
2. **可以**包含抽象方法
3. 其余特性与普通的类一致

所以我们我们仅仅只需在两种情况下声明一个 `abstract`类：

* 我们不希望编写的类被实例化，希望它仅仅作为基类，被子类继承
* 对于类的某些方法还不确定实现方法，需要声明一个抽象方法

相较之下，抽象类 `abstract`更类似c++中的纯虚函数

此时需要创建子类作为示例，但是用他的父类(抽象类)来声明实例，用子类作为构造

```java
abstract class Animal {  
    static String name = "动物";  //静态变量
    abstract void eat();  
  }
  
class Cat extends Animal { 
    @Override 
    public void eat() {  
        System.out.println("吃鱼");  
    }  
  }  

public class Test {
    public static void main(String[] args) {
      System.out.println(Animal.name);  //抽象类也可以访问静态变量、静态方法
      Animal a = new Cat();  //抽象类可以引用子类对象
      a.eat();  
      Cat c = (Cat)a;  
      c.eat();   
    }
 }  


```

# 抽象方法

抽象方法是使用 `abstract`关键字修饰的成员方法

继承抽象类的子类必须实现( **重写** )所有的抽象方法，除非子类也是抽象类。




# 接口


| 特性               | 接口 (Interface)                                                   | 抽象类 (Abstract Class)                                                                    |
| ------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| **类型**     | 完全抽象的蓝图/契约                                                | 包含抽象方法和具体方法的类                                                                 |
| **方法**     | 只能有抽象方法、default方法、static方法、private方法               | 可以有抽象方法，也可以有具体实现的方法                                                     |
| **变量**     | 只能有 `public static final`常量                                 | 可以有各种类型的变量，包括实例变量、静态变量                                               |
| **构造器**   | 不能有构造器                                                       | 可以有构造器 (但不能直接实例化)                                                            |
| **继承**     | 类通过 `implements`实现接口，可以实现多个接口                    | 类通过 `extends`继承抽象类，只能继承一个抽象类                                           |
| **设计理念** | 定义行为规范（What）                                               | 定义一个类的骨架和部分实现（What & How）                                                   |
| **使用场景** | 当你需要定义一个通用的行为规范，不关心具体实现；需要多重行为组合时 | 当你需要定义一个类层次结构，并希望在基类中提供一些通用实现，同时强制子类实现某些特定行为时 |


**思考：** 当你面临一个设计问题时，是选择接口还是抽象类？这通常取决于你想要表达的 **关系** 。

* 如果你想表达“ **能做什么** ”（能力、行为），那么接口是更好的选择。比如“能飞的”、“能跑的”、“能存储的”。
* 如果你想表达“ **是什么** ”（分类、骨架），那么抽象类可能更合适。比如“动物”、“交通工具”，它们有一些共同的属性和行为，但又有一些子类必须实现的特有行为。
