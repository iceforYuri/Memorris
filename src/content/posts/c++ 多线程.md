---
title: c++ 多线程
published: 2025-03-21
discription: 多线程编程是现代编程中不可或缺的一部分。C++11引入了对多线程的原生支持，使得编写并发程序变得更加简单和高效。本文将介绍C++中的多线程基础知识，包括线程的创建、管理和同步等内容。
category: 指南
tags: [C++高级]
---
*People only find me interesting because they can't tell whether I'm serious or not.*——*Hunter x Hunter*

# C++ 多线程

一般情况下，两种类型的多任务处理：**基于进程和基于线程**

* 基于进程的多任务处理是程序的并发执行。
* 基于线程的多任务处理是同一程序的片段的并发执行。

## 线程

* 线程是程序执行中的单一顺序控制流，多个线程可以在同一个进程中独立运行。
* 线程共享进程的地址空间、文件描述符、堆和全局变量等资源，但每个线程有自己的栈、寄存器和程序计数器。

## 并发 (Concurrency) 与并行 (Parallelism)

* **并发** ：多个任务在时间片段内交替执行，表现出同时进行的效果。
* **并行** ：多个任务在多个处理器或处理器核上同时执行。

其中std提供了几个多线程的核心组件：

* std::thread: 用于创建和管理线程
* std::mutex: 用于线程之间的互斥，防止多个线程同时访问共享资源
* std::lock_guard 和 std::unique lock: 用于管理锁的获取和释放
* std::condition_variable: 用于线程间的条件变量，协调线程间的等待和通知
* std::future和 std::promise: 用于实现线程间的值传递和任务同步

## 创建线程

C++ 11 之后添加了新的标准线程库 **std::thread**，**std::thread** **在 `<thread>`** 头文件中声明

```cpp
#include<thread>
std::thread thread_object(callable, args...);
```

* **`callable`** ：可调用对象，可以是函数指针、函数对象、Lambda 表达式等。
* **`args...`** ：传递给 `callable` 的参数列表。

### 使用函数指针

通过函数指针创建线程，这是最基本的方式：

```cpp
int main() {
    std::thread t1(printMessage, 5); // 创建线程，传递函数指针和参数
    t1.join(); // 等待线程完成
    return 0;
}
```

### 使用 Lambda 表达式

Lambda 表达式可以直接内联定义线程执行的代码：

```cpp
int main() {
    std::thread t3([](int count) {
        for (int i = 0; i < count; ++i) {
            std::cout << "Hello from thread (lambda)!\n";
        }
    }, 5); // 创建线程，传递 Lambda 表达式和参数
    t3.join(); // 等待线程完成
    return 0;
}
```
