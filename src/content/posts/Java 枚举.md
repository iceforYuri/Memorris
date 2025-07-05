---
title: Java 枚举
published: 2025-07-04
description: java enum 枚举类的使用方法
category: 指南
tags: [java]
---
# 枚举(enum)

Java枚举是一个特殊的类，一般表示一组常量，通过 `.` 对其进行访问

```java
enum Season{
    SPRING,SUMMER,AUTUMN,WINTER;
}

public class Main {
    public static void main(String[] args) {
        // Create a new instance of the MyClass class
        Season season = Season.SPRING;
        // Print the value of the instance
        System.out.println("The current season is: " + season);
    }
}
```

# 枚举类的实例化

```java
Season season = Season.SPRING;
```

这句话只是创建了一个针对 `Season.SPRING` 的**引用**，也就是不论我们给多少个变量赋值为 `Season.SPRING<span> </span>`在内存中都只有一个Season.SPRING的实例，其他都是指向它的引用。

关于枚举实例化的时间，通过以下程序进行验证：

```java
enum Season {
    SPRING, SUMMER, AUTUMN, WINTER;
  
    Season() {
        System.out.println("Creating enum constant: " + this.name());
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println("Main method started");
    }
}
```

此时输出：

```
Main method started
```

当我们没有引用任何的枚举常量时，枚举类并没有被实例化。

此时在枚举类中添加打印方法继续测试：

```java
enum Season {
    SPRING, SUMMER, AUTUMN, WINTER;
  
    Season() {
        System.out.println("Creating enum constant: " + this.name());
    }
}

public class Main {
    public static void main(String[] args) {

        // 直接使用枚举常量
        Season season = Season.SPRING;
        System.out.println("Main method started");
        // 不需要显式使用枚举常量，就能看到构造函数的输出
    }
}
```

JVM会在首次引用枚举常量时，依次为所有的枚举常量进行实例化，顺序为我们声明的顺序

枚举类中的成员变量为每个创建的实例私有，方法为所有实例共有，与普通的类并无区别。

# values(),ordinal(),valueOf()方法

enum 定义的枚举类默认继承了 `java.lang.Enum()` 类，这个类中包含了三种默认的方法：

* values()：返回枚举类中的值,返回为一个数组
* ordinal()：方法可以找到每个枚举常量的索引，就像数组的索引一样,顺序与声明顺序相同
* valueOf()：方法返回指定字符串值的枚举常量

# 枚举类成员

枚举跟普通类一样可以有自己的变量，方法和构造函数，但是**构造函数**只能使用**private**访问修饰符，所以外部无法调用。构造函数用于给枚举赋初值。

```java
public enum Color{
    RED(255,0,0);
    private int r,g,b;
    private Color(int r, int g, int b)
    {
	this.r = r;
	this.g = g;
	this.b = b;
    }
}
```
