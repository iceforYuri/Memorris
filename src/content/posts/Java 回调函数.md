---
title: Java 回调函数
published: 2025-07-10
description: 回调是一种编程模式，允许函数作为参数传递给另一个函数，并在特定事件发生时被调用。Java 中的回调通常通过接口或匿名类实现。
category: 指南
tags: [Java]
---
# 回调

> 在 Java 中，“回调”是指 **把一个对象（通常是接口实现或 Lambda 表达式）作为参数传入另一个方法，在某个时机由该方法** “ **反过来调用你传进来的方法** ”——这就叫回调。

```java
// File: goback.java
// Description: 这是一个简单的Java程序，演示了如何使用回调接口
interface Callback {
    void onSuccess(String result);
}

class HttpClient {
    public void sendRequest(String url, Callback callback) {
        // 模拟发送请求
        System.out.println("请求发送中...");
        // 假设返回结果后
        callback.onSuccess("返回结果：OK");
    }
}

public class goback {
    public static void main(String[] args) {
        HttpClient client = new HttpClient();
        client.sendRequest("http://example.com", new Callback() {
            @Override
            public void onSuccess(String result) {
                System.out.println("我收到回调了！结果是：" + result);
            }
        });
    }
}

```

该代码运行结果为：

```
请求发送中...
我收到回调了！结果是：返回结果：OK
```

`sendRequest` 发出后程序**不会立刻拿到结果，但此时如果等待 `callback`的返回，**主程序就不会阻塞** ，而是等回调“回来找你”。**

### 原理

JVM 的执行顺序是： **先完成所有参数的初始化，然后才开始执行函数体** 。

`new Callback() { ... }` 这一段代码，它确实是一个**初始化**操作。但仅仅是 **创建了一个对象** ，而 **不是调用了对象里的方法** 。

可以这样类比：

假设你准备一份文件（`Callback` 对象）交给你的同事（`HttpClient`），并告诉他：“等你忙完了，就按照这份文件上的指示去做。”

1. **参数初始化阶段** ：你 **写好了这份文件** （`new Callback() { ... }`），并把它**交给**了同事。到这里，`sendRequest` 的参数已经准备好，`sendRequest` 函数可以开始执行了。
2. **函数执行阶段** ：你的同事拿到了文件，开始处理他自己的主要任务（`sendRequest` 方法里的其他代码，比如 `System.println("请求发送中...")`）。
3. **回调阶段** ：当他处理完自己的任务后， **他才会打开你给他的文件** ，并按照里面的指示（`callback.onSuccess(...)`）去执行。

在真实场景中等价于：

```java
public void sendRequest(String url, Callback callback) {
    // 异步请求发送中（比如开一个线程）
    new Thread(() -> {
        try {
            Thread.sleep(2000); // 模拟网络延迟
            callback.onSuccess("异步结果：OK");
        } catch (Exception e) { }
    }).start();
}

```

这样，就可以在执行函数中规定一个位置调用传入的函数的参数，从而在需要的地方实现回调的效果

| 项目                         | 含义                                           |
| ---------------------------- | ---------------------------------------------- |
| **回调接口**           | 定义了“我以后要怎么通知你”                   |
| **传入回调对象**       | 告诉执行者“做完了找我”                       |
| **调用 callback 方法** | 事件发生 → 执行你的逻辑                       |
| **等待过程**           | 在异步场景中，回调机制可以“非阻塞地等待结果” |
