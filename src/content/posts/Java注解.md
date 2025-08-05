---
title: Java注解
published: 2025-08-02
description: Java注解是Java 5引入的一个特性，它允许开发者在代码中添加元数据，这些元数据可以在编译时、类加载时或运行时被读取。注解本身并不影响程序的逻辑，但可以被用来提供信息给编译器或框架。常见的注解包括`@Override`、`@Deprecated`和自定义注解等。
category: 指南
tags: [Java]
---
Java注解与标签是两种东西，我们需要先对其分类

# Java文档注释

Java 支持三种注释方式：

* 单行注释
* 多行注释
* 文档注释

前两种分别是 **//** 和 **/* */**，第三种被称作文档注释，它以 **/**** 开始，以 ***/** 结束。

前两种注释内容可以参考：[Java 注释](https://www.runoob.com/java/java-comments.html)

文档注释允许你在程序中嵌入关于程序的信息。

你可以使用 javadoc 工具软件来生成信息，并输出到 HTML 文件中。

文档注释，使你更加方便的记录你的程序信息。

## 文档注释

在开始的 **/**** 之后，第一行或几行是关于类、变量和方法的主要描述。

之后，你可以包含一个或多个各种各样的 **@** 标签。每一个 **@** 标签必须在一个新行的开始或者在一行的开始紧跟星号 *****。

多个相同类型的标签应该放成一组。例如，如果你有三个 **@see** 标签，可以将它们一个接一个的放在一起。

下面是一个类的稳定注释的实例：

```java
/*** 这个类绘制一个条形图
* @author runoob
* @version 1.2
*/
```

# Java注解

注解本质上是一种特殊的接口。你可以像定义接口一样定义一个注解。

在 Java 的世界里，**注解**就像是给代码贴上的“标签”。它们本身不是代码逻辑的一部分（比如不会改变方法的执行方式），但它们提供了关于代码的 **元数据（Metadata）** 。这些元数据可以在编译时、类加载时乃至运行时被读取和处理，从而实现各种强大的功能。


## 什么我们需要注解？

在注解出现之前，我们通常通过 XML 配置文件或者继承的方式来为代码添加元信息。但这两种方式都有各自的局限性：

* **XML 配置：** 配置和代码是分离的，需要来回切换文件才能理解代码的完整上下文。（不够直观，不够同步）
* **继承：** 继承关系通常是用于实现多态和代码复用的，如果仅仅为了传递元信息而引入继承，会导致类体系的臃肿和设计上的不合理。

## 注解的工作原理：从定义到解析

**场景：** 假设我们正在开发一个Web应用，我们希望标记出哪些方法是“控制器层”的方法，并且记录它们的URL路径。

**需求：** 定义一个注解，用于标记Web控制器方法，包含一个表示URL路径的属性。

```java
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 自定义注解：用于标记关键业务操作的方法
 */
@Target(ElementType.METHOD) // 标记这个注解只能应用于方法上
@Retention(RetentionPolicy.RUNTIME) // 标记这个注解在运行时也可用，以便我们通过反射来读取它
public @interface BusinessOperation {

    /**
     * 业务操作的名称
     * 注解的'value'属性，如果只有一个属性且名称为value，使用时可以省略'value='
     */
    String value() default "未知业务操作";

    /**
     * 负责该业务操作的人员
     */
    String owner() default "团队负责人";
}
```

方法：

* 使用 `@interface` 关键字定义注解。
* 注解的属性看起来像方法，但没有方法体。
* 可以为属性设置默认值。
* 需要使用元注解来定义注解的“生命周期”和“作用目标”。

对照：


* `public @interface BusinessOperation`：这是定义注解的标准语法。`@interface` 关键字是它的标志。
* `String value() default "未知业务操作";`：定义了一个名为 `value` 的属性，类型是 `String`，默认值是 `"未知业务操作"`。当注解只有一个属性，并且其名称为 `value` 时，在使用注解时可以省略 `value=`，直接提供值。
* `String owner() default "团队负责人";`：定义了另一个名为 `owner` 的属性，类型为 `String`，默认值是 `"团队负责人"`。
* `@Target(ElementType.METHOD)`：这是一个 **元注解（Meta-Annotation）** 。它指明了 `BusinessOperation` 注解可以作用在哪些 Java 元素上。`ElementType.METHOD` 表示它只能用于方法。常用的 `ElementType` 还包括：
  * `TYPE`：用于类、接口、枚举或注解声明。
  * `FIELD`：用于字段（包括枚举常量）。
  * `PARAMETER`：用于方法参数。
  * `CONSTRUCTOR`：用于构造器。
  * `LOCAL_VARIABLE`：用于局部变量。
* `@Retention(RetentionPolicy.RUNTIME)`：这是另一个 **元注解** 。它定义了 `BusinessOperation` 注解的生命周期（即注解信息保留到哪个阶段）。
  * `RetentionPolicy.SOURCE`：注解只保留在源代码中，编译时会被丢弃，不会出现在 `.class` 文件中。通常用于编译时的代码生成或检查，例如 `@Override`。
  * `RetentionPolicy.CLASS`：注解在编译后的字节码文件（`.class` 文件）中存在，但在 JVM 加载类时会被丢弃。默认值就是 `CLASS`。通常用于编译后处理工具。
  * `RetentionPolicy.RUNTIME`：注解在运行时也可用，可以通过反射机制获取到。这是最常用的策略，因为大多数框架都需要在运行时读取注解信息。我们的 `BusinessOperation` 需要在程序运行时被识别并处理，所以必须选择 `RUNTIME`。


**使用注解：为代码贴上标签**

一旦注解被定义，就可以像这样在代码中使用了：

在这里我们编写一个简单的业务逻辑类，并用 `BusinessOperation` 注解标记其关键方法。然后，模拟一个“日志/监控”组件来解析这些注解并打印相关信息。

```java
import java.lang.reflect.Method; // 导入反射相关的类

// 假设我们上面已经定义好了 BusinessOperation 注解

/**
 * 业务服务类，其中包含一些需要监控的关键业务操作
 */
class OrderService {

    @BusinessOperation(value = "创建订单", owner = "张三")
    public void createOrder(String orderId) {
        System.out.println("订单 " + orderId + " 正在创建...");
        // 模拟业务逻辑
    }

    @BusinessOperation(value = "支付订单", owner = "李四")
    public void payOrder(String orderId) {
        System.out.println("订单 " + orderId + " 正在支付...");
        // 模拟业务逻辑
    }

    @BusinessOperation(value = "取消订单") // 使用默认的 owner
    public void cancelOrder(String orderId) {
        System.out.println("订单 " + orderId + " 正在取消...");
        // 模拟业务逻辑
    }

    public void generateReport() { // 普通方法，没有被注解标记
        System.out.println("生成日常报告。");
    }
}

/**
 * 模拟一个操作监控器，用于解析 BusinessOperation 注解
 */
public class OperationMonitor {

    public static void main(String[] args) {
        monitorBusinessOperations(OrderService.class);
    }

    public static void monitorBusinessOperations(Class<?> clazz) {
        System.out.println("--- 扫描并监控业务操作：" + clazz.getSimpleName() + " ---");

        // 获取类的所有公共方法
        // 注意：getMethods() 返回所有公共方法，包括从父类继承的。
        // 如果只想获取当前类自身声明的方法（包括非公共的），可以使用 clazz.getDeclaredMethods()。
        Method[] methods = clazz.getMethods();

        for (Method method : methods) {
            // 检查当前方法是否被 BusinessOperation 注解标记
            if (method.isAnnotationPresent(BusinessOperation.class)) {
                // 如果有，获取 BusinessOperation 注解的实例
                BusinessOperation annotation = method.getAnnotation(BusinessOperation.class);

                // 从注解实例中获取属性值
                String operationName = annotation.value();
                String owner = annotation.owner();

                System.out.println("  发现关键业务操作：[" + operationName + "]");
                System.out.println("    方法名：" + method.getName());
                System.out.println("    负责人：" + owner);
                System.out.println("  -------------------------");

                // 在实际的监控系统中，这里可能会：
                // 1. 将操作信息注册到监控中心
                // 2. 动态生成代理类，在方法执行前后插入日志或性能统计代码（AOP）
                // 3. 执行权限检查等
            }
        }
        System.out.println("--- 业务操作扫描完毕 ---");
    }
}
```


**代码对照：**

* `OrderService` 类中，我们用 `@BusinessOperation` 标记了 `createOrder`、`payOrder` 和 `cancelOrder` 方法，并为它们指定了不同的 `value` 和 `owner` 属性。`cancelOrder` 演示了如何使用属性的默认值。
* `OperationMonitor.monitorBusinessOperations(Class<?> clazz)` 方法模拟了一个框架或工具的行为。
  * 它通过 `clazz.getMethods()` 获取了 `OrderService` 类的所有公共方法。
  * 在循环中，`method.isAnnotationPresent(BusinessOperation.class)` 检查每个方法是否带有 `BusinessOperation` 注解。
  * 如果存在，`method.getAnnotation(BusinessOperation.class)` 会获取到这个注解的实例，然后我们就可以像调用普通对象的方法一样，调用 `annotation.value()` 和 `annotation.owner()` 来获取注解中定义的属性值。

## 总而言之

注解就相当于给已有的对象添加了额外的属性，这个属性可以类似我们手写的注释、序号等，但依附于当前对象，我们可以通过别的渠道来查看该对象的额外信息
