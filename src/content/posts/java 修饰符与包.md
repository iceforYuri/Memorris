---
title: Java 修饰符与包
published: 2025-07-01
description: Java 中的修饰符和包是组织代码和控制访问权限的重要工具。修饰符可以分为访问修饰符（如 public、private、protected）和非访问修饰符（如 static、final、abstract）。包则用于将相关类组织在一起，避免命名冲突，并提供更好的代码结构。
category: 指南
tags: [Java]
---
# Java中的包

包(packet)类似C++中的命名空间，用来组织类、接口和子包的机制，可以避免类名冲突，并且有助于更好地管理项目结构

包的作用：

1. **命名空间管理** ：避免类名冲突。
2. **访问控制** ：可以控制类和接口的访问级别。
3. **代码组织** ：使代码结构更加清晰和有条理。

## 创建包

Java 包本质上就是一个文件夹（目录），你可以：

1. **手动创建目录结构** ：比如使用命令行或文件管理器
2. **使用 IDE（如 IntelliJ IDEA、Eclipse）自动生成包结构**

创建一个包 `com.example.utils`，那么文件夹结构如下：

```css
src/
└── com/
    └── example/
        └── utils/
            └── MyUtil.java

```

## 声明包

在Java中，通过 `package`关键字来声明一个类所属的包。**包声明语句必须出现在java源文件的第一行。**（跟引入头文件类似）

```java
package com.example.utils;

public class MyUtil {
    public static void sayHello() {
        System.out.println("Hello from MyUtil");
    }
}

```

* `package` 是 Java 的关键字
* **必须是 Java 文件的第一条语句** （除注释外）
* 包名建议全小写，通常用组织域名反写 + 项目模块名，例如：`com.company.project.module`

### 包命名约定

通常，Java 包名使用小写字母，并且使用反向域名的方式来命名，例如：

* `com.example.myapp`
* `org.apache.commons`
* `net.sf.hibernate`

这种命名约定有助于确保包名的唯一性，避免与其他开发者创建的包发生冲突。

## 编译与运行

我们使用对于路径的编译语句：

```bash
javac com/example/utils/MyUtil.java
```

但是对于运行部分，必须加上完整类名（全限定名）并从 `src/` 的外层目录运行：

```
java com.example.utils.MyUtil
```

## 引入包

引入包和引入头文件一致，使用 `import`关键字，可以选择引入包中的某个类，也可以选择引入包中的全部类。

```
import 包名.类名; // 导入一个特定的类
import 包名.*;  // 导入整个包中的所有类
```

如果在一个包中，一个类想要使用本包中的另一个类，那么该包名可以省略。

假如需要引入一个特定的类：

```
import com.example.utils.MyUtil;
```

也可以使用通配符 `*` 来引入整个包或包的子包：

```
import com.example.utils.*;
```

# 访问修饰符

访问修饰符可以调整类，变量，方法和构造方法的访问权限。Java中有四种不同的访问权限：

* **default(默认)** ：在同一包内可见，不使用任何修饰符。
  * 使用范围：类，接口，变量，方法
* **private** ：在同一类内可见。
  * 使用范围：不能修饰外部类。
* **public** ：对所有类可见。
  * 使用范围：类，接口，变量，方法
* **protected** ：对同一包内的类和**不同包**的子类可见。
  * 使用范围：子类可以访问调用，但是不能修饰外部类

注释：上述所指的 **子类** ，是指由父类继承而来的子类。

```java
// 文件名：ParentClass.java (在 com.example.parentpackage 包中)
package com.example.parentpackage;

public class ParentClass {
    protected int myVariable; // 受保护的变量

    protected void myMethod() { // 受保护的方法
        // ...
    }
}

// 文件名：ChildClass.java (在 com.example.childpackage 包中)	//不同包的子类
package com.example.childpackage;

import com.example.parentpackage.ParentClass;

public class ChildClass extends ParentClass {
    public void test() {
        this.myVariable = 20;  // 可以访问，因为是子类
        this.myMethod();       // 可以访问，因为是子类
    }
}

// 文件名：AnotherClass.java (在 com.example.childpackage 包中，非子类)	//不同包的非子类
 package com.example.childpackage;

 import com.example.parentpackage.ParentClass;

public class AnotherClass {
     public void test(){
          ParentClass obj = new ParentClass();
          // obj.myVariable = 10; // 错误！无法访问，因为不同包且非子类
          // obj.myMethod();     // 错误！无法访问，因为不同包且非子类
     }
}

// 文件名：OtherClass.java (在 com.example.parentpackage 包中)	//同一包的非子类
package com.example.parentpackage;

public class OtherClass {
    public void test() {
        ParentClass obj = new ParentClass();
        obj.myVariable = 10;  // 可以访问，因为在同一个包中
        obj.myMethod();       // 可以访问，因为在同一个包中
    }
}

```

**总结**

| 访问修饰符    | 同一个类 | 同一个包 | 不同包的子类 | 不同包的非子类 |
| ------------- | -------- | -------- | ------------ | -------------- |
| `public`    | ✓       | ✓       | ✓           | ✓             |
| `protected` | ✓       | ✓       | ✓           | ✕             |
| `default`   | ✓       | ✓       | ✕           | ✕             |
| `private`   | ✓       | ✕       | ✕           | ✕             |

### 访问控制和继承

请注意以下方法继承的规则：

* 父类中声明为 public 的方法在子类中也必须为 public。
* 父类中声明为 protected 的方法在子类中要么声明为 protected，要么声明为 public，不能声明为 private。
* 父类中声明为 private 的方法，不能够被子类继承。

## 相比于C++

| C++ 修饰符    | 可访问者         |
| ------------- | ---------------- |
| `private`   | 只有当前类成员   |
| `protected` | 当前类及其子类   |
| `public`    | 所有代码都可访问 |

但  **C++ 没有包的概念** ，所以它的访问控制完全 **不依赖于文件结构或命名空间**

| 方面             | Java 包（Package）            | C++ 命名空间（namespace）      |
| ---------------- | ----------------------------- | ------------------------------ |
| 组织代码         | 是 Java 的核心结构，强制使用  | 可选，仅用于逻辑分组           |
| 避免命名冲突     | ✔，通过包名区分              | ✔，通过命名空间名区分         |
| 影响访问权限     | ✔（默认和 protected 依赖包） | ✘，访问权限只与类中声明有关   |
| 编译和路径关联   | ✔ 包名必须与目录结构一致     | ✘ 命名空间不影响文件路径      |
| 能否定义访问范围 | ✔，包+访问修饰符组合控制权限 | ✘，无法限制命名空间之间的访问 |

如果对于C++来理解Java，那么Java中包的概念可以被定义为：

* **命名空间 + 访问控制边界 + 模块目录结构**
* 它不仅仅是为了逻辑分类，更是 **权限的一部分**

| 特点                    | Java                               | C++                                    |
| ----------------------- | ---------------------------------- | -------------------------------------- |
| 是否有包（Package）机制 | 有，语言内建支持，和权限控制强相关 | 没有包机制，使用命名空间和文件组织代码 |
| 默认访问控制            | 默认权限仅限包内可见               | 默认类成员是 `private`，自由度更高   |
| 权限修饰符与结构关系    | 与包结构强绑定                     | 与命名空间或文件无关                   |
| 设计哲学                | 更注重模块化、安全性、清晰边界     | 更注重灵活性、底层控制                 |

# 非访问修饰符

## static静态修饰符

static 关键字用于修饰**变量**或**方法**

* **静态变量：**
  static 关键字用来声明独立于对象的静态变量，无论一个类实例化多少对象，它的静态变量只有一份拷贝。 静态变量也被称为类变量。局部变量不能被声明为 static 变量。
* **静态方法：**
  static 关键字用来声明独立于对象的静态方法。静态方法不能使用类的非静态变量，只能访问其他静态成员。静态方法从参数列表得到数据，然后计算这些数据

```java
public class MathUtil {
    public static final double PI = 3.14159;  // 静态常量

    public static int add(int a, int b) {    // 静态方法
        return a + b;
    }

    static class Helper {                     // 静态内部类
        void help() { System.out.println("Helping"); }
    }
}

```

## final修饰符

`final` 是 Java 的非访问修饰符，用于 **声明不可变或不可更改的内容** 。

类似C中的 `const`

### final类

final 类不能被继承，没有类能够继承 final 类的任何特性。

### final变量

final修饰符声明的变量必须要显式的初始化，并且该变量在初始化后无法被修改，其效果类似于c语言中的const关键字。

final修饰符常于static修饰符一起使用来创建类常量。

```java
public class Example {
    final int x = 10;

    void test() {
        // x = 20; // 编译错误：已赋值的 final 变量不可再改
    }
}

```

### final方法

final修饰符修饰方法的主要限制在于：

防止final修饰的方法在被子类继承时 **重写** 。

```java
class Parent {
    public final void sayHello() {
        System.out.println("Hello");
    }
}

class Child extends Parent {
    // 编译错误：无法重写 final 方法
    // public void sayHello() { ... } ❌
}

```

## abstract修饰符

`abstract`修饰符可以用来修饰 **类** 、**方法**

等同与c++中的 `virtual`

### abstract方法

`abstract` 方法是 **没有方法体（实现）**的**方法声明** ，用来在抽象类中定义“应该由子类实现的行为”。

```java
public abstract void doSomething();  // 没有 {}
```

### abstract类

只要含有至少一个abstract方法，就一定要声明为abstract类，当然没有abstract方法时，也可以声明为abstract类。

abstract类的不能用来实例化对象，它唯一的目的就是为了将来对该类进行扩充。所以abstract类也不能被final修饰。

```java
abstract class Caravan{
   private double price;
   private String model;
   private String year;
   public abstract void goFast(); //抽象方法
   public abstract void changeColor();
}
```

任何继承抽象类的子类必须实现父类的所有抽象方法，除非该子类也是抽象类。
