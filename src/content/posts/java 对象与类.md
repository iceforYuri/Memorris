---
title: java 对象与类
published: 2025-06-30
description: Java中类与对象的关系，主要与C++区分开来
category: 指南
tags: [java]
---
# 类(Class)

定义对象的**蓝图（框架）**，包括属性和方法。就像是一个自定义的数据类型，你仅仅进行定义，没有创建实际的变量。

```java
public class Name{

}
```

# 类的组成

## 1.成员变量

定义：用于存储对象状态的数据。它声明在类中、方法体之外，每个**对象**都会拥有自己的一份副本。

```css
[访问控制修饰符] 数据类型 变量名 [= 初始值]
```

* **访问修饰符:** 如 `public`, `private`, `protected`, `默认 (package-private)`，控制成员变量的访问权限。
* **数据类型:** 如 `int`, `float`, `String`, `boolean`, 以及自定义的类类型等。
* **变量名:** 遵循 Java 变量命名规则。
* **初始值 (可选):** 在声明时为变量赋初始值。如果没有显式赋值，则会使用默认值（例如，数值类型默认为 0，布尔类型默认为 false，引用类型默认为 null）

以Car类为例：

```java
public class Car {
    public String color;       // 颜色
    private int speed;         // 速度
    protected String model;   // 型号
    boolean isRunning = false; // 是否正在运行
}

```

## 2.构造方法

与C++中类一致，用于创建对象并初始化对象的成员变量

```java
[访问修饰符] 类名(参数列表) 
{
 // 方法体 
}
```

* 没有返回值
* 每个类**至少**有一个构造方法(多个构造方法涉及方法的重载)
* 若没有显示指定构造方法，编译器会自动生成一个无参默认构造方法
* 构造方法的访问修饰符决定了哪些类可以创建该类的实例。

| 访问修饰符    | 构造方法访问级别                       |
| ------------- | -------------------------------------- |
| `public`    | 任何类都可以创建该类的实例             |
| `protected` | 同一个包中的类和子类可以创建该类的实例 |
| `private`   | 只能在该类内部创建该类的实例           |
| 默认          | 只有同一个包中的类可以创建该类的实例   |

这里其实与C++一致

```java
public class Car {
    public String color;
    private int speed;

    // 默认构造方法
    public Car() {
        this.color = "white";
        this.speed = 0;
    }

    // 带参数的构造方法
    public Car(String color, int speed) {
        this.color = color;
        this.speed = speed;
    }
}

```

## 3.成员方法

定义：定义对象的行为，可以执行特定的操作

```
[访问修饰符] [static] [返回类型] 方法名(参数列表) [throws 异常列表] 
{ 
    // 方法体 
}
```

`static` (可选): 表示静态方法，属于类本身，而不是类的实例。通过static声明的方法，无需创建对象实例就可以直接使用，反之，未用static声明的方法。只能由创建后的实例调用。

就拿`System.in/System.out`为例：`static` 关键字意味着 `in` 这个变量属于 `System` 类本身，而不是 `System` 类的某个对象。因此，你可以直接通过类名 `System` 来访问它，比如 `System.in`，而不需要先创建一个 `System` 类的实例。这使得它可以在程序启动时就立即可用。

```java
// 调用实况
Car myCar = new Car();
Car.main(args); // 调用 Car 类的 main 方法
//

//类成员声明
class Car {
    public static void main(String[] args) {
        System.out.println("This is a car");
    }

    public void display() {
        System.out.println("This is a car");
    }
}
```

## 4.静态成员

定义：使用 `static` 关键字修饰的成员变量和方法。它们属于类本身，而不是类的实例。

* **特点:**
  * 可以通过类名直接访问，无需创建对象。
  * 所有该类的实例共享**同一个**静态成员的副本。
  * 静态方法不能直接访问非静态成员（实例变量和方法），因为静态方法不属于任何特定的对象。

```java
public class Car {
    public static int carCount = 0; // 静态变量，用于记录创建的汽车数量

    public Car() {
      carCount++; // 每次创建对象，静态变量加一
    }
    public static int getCarCount() {
      return carCount; // 静态方法，可以访问静态变量
    }
}

```

## 5.内部类

定义：在类内部定义的类。

* **分类:**
  * **成员内部类:** 与类的成员变量类似，在类中直接定义。
  * **静态内部类:** 使用 `static` 关键字修饰的内部类。
  * **局部内部类:** 在方法或代码块中定义的类。
  * **匿名内部类:** 在创建对象时定义的没有名字的类。
* **特点:**
  * 内部类可以访问外部类的所有成员，包括私有成员。
  * 声明内部类的外部类也可以访问内部类的的所有成员，包括私有成员。
  * 就是都可以通过成员对象访问

```java
public class HelloWorld {
    private class Car{
        private static String car = "This is a car";
    }
    public static void main(String[] args) {
        System.out.println("Hello World"); // 输出 Hello World
        System.out.println(Car.car);
    }
}
```

# 对象

对象的是类的实例，是创建的实际变量，分配实际内存空间后的实例，具有状态和行为。

```java
Car myCar = new Car();
```

若自定义了构造方法，则可以在括号中传入对应参数，应用于实例的初始化

```java
class Car {
    public String color;
    public static int myCarCount = 0;
    public Car(String color){
        this.color = color;
        myCarCount++;		//静态变量直接访问，在类中
    }
    public void changeColor(String color){
        this.color = color;
    }
} 

```

可以通过this关键字来表示创建后的实例，每个实例中的this都互不影响，只表示自己实例中的值

这里再次重申，对于类中的静态变量(static修饰)来说，并不能通过this来访问，静态变量不属于任何实例，所有该类的实例共享一个静态变量。

测试程序：

```java
public class HelloWorld {
    public static void main(String[] args) {
        Car myCar = new Car("Blue");
        System.out.println("my car's color is " + myCar.color);
        myCar.changeColor("green");
        System.out.println("my car's color is " + myCar.color);
        System.out.println("I have " + Car.myCarCount + " cars");
    }
}
```
