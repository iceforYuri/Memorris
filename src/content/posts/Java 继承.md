---
title: Java 多态与继承
published: 2025-07-03
description: java 多态
category: 指南
tags: [Java]
---
# 继承

## 继承类型

面向对象编程中继承分为四种情况：

单继承：

```java
class A{
	...
}
class B extends{
	...
}
```

多重继承：

```
class A{
	...
}
class B extends A{
	...
}
class C extends B{
	...
}
```

不同类继承同一个类：

```
class A{
	...
class B extends A{
	...
} 
class C extends A{
	...
}
```

多继承：（ **java不支持** ）

```
class A{
	...
}
class B{
	...
}
class C extends A,B{
	...
}
```

## 继承的特性

* 子类拥有父类非 `private`的属性和方法
* 子类可以对父类进行扩展
* 子类可以重写父类的方法
* 子类并不会继承父类的 **构造方法** ，但是子类的构造方法中必须通过 `super()`函数来调用父类的构造方法。
  * 当父类的构造函数为无参类型时可以省略，但是若为有参类型，子类的构造方法必须在第一行用 `super(参数)`函数来先行调用父类的构造函数。

# 重写

## 方法的重写规则

* 参数列表与被重写方法的参数列表必须完全相同
* 返回类型与被重写方法的返回类型可以不同，但是必须是父类返回值的派生类

```java
class Animal {
    Animal getAnimal() {
        return new Animal();
    }
}

class Dog extends Animal {
    @Override
    Dog getAnimal() { // 返回类型是Animal的子类，这是允许的
        return new Dog();
    }
}
```

* 访问权限不能比父类中被重写的方法的访问权限更低。例如：如果父类的一个方法被声明为 public，那么在子类中重写该方法就不能声明为 protected。
* 父类的成员方法只能被它的子类重写
* 声明为final的方法不能被重写
* 声明为static的方法不能被重写，但是能够被再次声明
* 子类和父类在同一个包中，那么子类可以重写父类的所有方法，除了声明为private和final的方法
* 子类和父类不在同一个包中，那么子类只能够重写父类的声明为public和protected的非final方法
* 构造方法不能被重写

## Super关键字

### 调用父类的构造函数

在子类的构造函数中，可以使用 `super()` 调用父类的构造函数。这样做的好处是能够复用父类构造函数中的初始化逻辑，确保父类的成员变量得到正确的初始化。

注意事项：

* `super()`方法必须是子类构造函数的第一条语句，否则会编译错误
* 如果子类的构造函数中没有显式的调用super()方法，java编译器会自动在子类构造函数的第一行插入一个无参的super()调用，前提是父类有无参的构造函数。若父类没有无参的构造函数，且子类构造函数中没有显式调用父类的其他构造函数，编译会报错。

```java
class Parent {
    private int value;

    // 父类的有参构造函数
    public Parent(int value) {
        this.value = value;
        System.out.println("Parent class constructor with value: " + value);
    }
}

class Child extends Parent {
    public Child(int value) {
        // 调用父类的有参构造函数
        super(value);
        System.out.println("Child class constructor");
    }
}

public class Main {
    public static void main(String[] args) {
        Child child = new Child(10);
    }
}
```

# 重载(overload)

重载是在 **一个类里面** ，方法名字相同，而参数不同，返回类型可以相同也可以不同。需要注意的是不能仅以返回值类型的不同来重载一个方法，方法重载的关键点是有一个独一无二的参数列表。

重载规则：

* 被重载的方法必须改变参数列表(参数个数或类型不一样，传入顺序不同也算一种重载)；
* 被重载的方法可以改变返回类型；
* 被重载的方法可以改变访问修饰符；
* 方法能够在同一个类中或者在一个子类中被重载。
* 无法以返回值类型作为重载函数的区分标准。

```java
public class Overloading {
   public int test(){
       System.out.println("test1");
       return 1;
   }

   public void test(int a){
       System.out.println("test2");
   }   

   //以下两个参数类型顺序不同
   public String test(int a,String s){
       System.out.println("test3");
       return "returntest3";
   }   

   public String test(String s,int a){
       System.out.println("test4");
       return "returntest4";
   }   

   public static void main(String[] args){
       Overloading o = new Overloading();
       System.out.println(o.test());
       o.test(1);
       System.out.println(o.test(1,"test3"));
       System.out.println(o.test("test4",1));
   }
}
```

# 重写和重载的区别

| 区别点   | 重载方法 | 重写方法                                       |
| -------- | -------- | ---------------------------------------------- |
| 参数列表 | 必须修改 | 一定不能修改                                   |
| 返回类型 | 可以修改 | 一定不能修改                                   |
| 异常     | 可以修改 | 可以减少或删除，一定不能抛出新的或者更广的异常 |
| 访问     | 可以修改 | 一定不能做更严格的限制（可以降低限制）         |

# java多态

多态是Java面向对象编程的三大核心特征之一。

* 基本定义：**多态(Polymorphism)指的是同一个行为或操作可以在不同的对象上有不同的表现形式**

java的多态主要由以下三种方式实现：

1. 重写(override)
2. 重载(overloading)
3. 接口实现(Interface Implementation)

java多态存在的三个必要条件：

1. 继承
2. 重写
3. 父类引用指向子类对象 `Parent p = new Child()`

## 父类引用指向子类对象

已知定义：

```java
abstract class Animal {  
  abstract void eat();  
}

class Cat extends Animal { 
  @Override 
  public void eat() {  
      System.out.println("吃鱼");  
  }  
}  

class Dog extends Animal {  
  @Override
  public void eat() {  
      System.out.println("吃骨头");  
  }  
  public void work() {  
      System.out.println("看家");  
  }  
}
```

虽然Cat和Dog都是Animal的子类，但是都对eat()进行了重写，同时Dog类还有自己的独有的行为。

此时我们可以写一个父类的函数，对这些重写的对象进行统一的处理：

```java
public class Test {
    public static void main(String[] args) {
      Cat c = new Cat();
      Dog d = new Dog();
      Eat(c);
      Eat(d);
  }  
  /*
  public static void Eat(Cat c) {  
      c.eat();  
  }
  public static void Eat(Dog d) {  
      d.eat();  
  }  
  */
  public static void Eat(Animal a) {  
      a.eat();  
  }

}
```

虽然在 `Eat()`函数中所有类型被声明为Animal类型，但是因为Animal类型本身拥有 `eat()`方法，所以编译器不会报错，同时JVM虚拟机在运行时会找到对象实际类型的方法，若传入对象为c，则找到Cat类的 `eat()`方法。
