---
title: c++ 多线/进程
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

# 创建线程

C++ 11 之后添加了新的标准线程库 **std::thread**，**std::thread** **在 `<thread>`** 头文件中声明

```cpp
#include<thread>
std::thread thread_object(callable, args...);
```

* **`callable`** ：可调用对象，可以是函数指针、函数对象、Lambda 表达式等。
* **`args...`** ：传递给 `callable` 的参数列表。

## 使用函数指针

通过函数指针创建线程，这是最基本的方式：

```cpp
int main() {
    std::thread t1(printMessage, 5); // 创建线程，传递函数指针和参数
    t1.join(); // 等待线程完成
    return 0;
}
```

## 使用函数对象

通过类中的 `operator()` 方法定义函数对象来创建线程：

```cpp
#include <iostream>
#include <thread>

class PrintTask {
public:
    void operator()(int count) const {
        for (int i = 0; i < count; ++i) {
            std::cout << "Hello from thread (function object)!\n";
        }
    }
};

int main() {
    std::thread t2(PrintTask(), 5); // 创建线程，传递函数对象和参数
    t2.join(); // 等待线程完成
    return 0;
}
```

这时候就有可能会问了，为什么传递对象函数是类的名称？如果类中有多个函数怎么办？

但实际上的**C++生命周期**是这样的：

1. 当你传递 `PrintTask()` 这个临时对象时，`std::thread` 的构造函数会**复制**这个对象，并在新线程中执行它的 `operator()`。
2. `std::thread` 构造函数的第一个参数是可调用对象，后面的参数 `5` 则被作为该可调用对象的参数，传递给它的 `operator()` 函数。

所以，这行代码的实际含义是：**“创建一个线程，并让它执行一个新创建的 `PrintTask` 对象的 `operator()`，同时将参数 `5` 传递给它。**“

**如果类中有多个函数怎么办？**这里有两种解决方法

**方法一：使用 `std::thread` 传入成员函数指针**

如果你想调用类中的某个特定的非静态成员函数，你需要提供**成员函数指针**和 **对象实例** 。

成员函数指针：

```cpp
&<类名>::<函数名>
```

具体示例如下：

```cpp
#include <iostream>
#include <thread>

class MyTask {
public:
    void doTaskA(int count) {
        for (int i = 0; i < count; ++i) {
            std::cout << "Task A running...\n";
        }
    }
  
    void doTaskB(int count) {
        for (int i = 0; i < count; ++i) {
            std::cout << "Task B running...\n";
        }
    }
};

int main() {
    MyTask myTask;
  
    // 线程 t1 调用 myTask 对象的 doTaskA 成员函数
    // 语法：thread(成员函数指针, 对象实例, 参数)
    std::thread t1(&MyTask::doTaskA, &myTask, 5); 
  
    // 线程 t2 调用 myTask 对象的 doTaskB 成员函数
    std::thread t2(&MyTask::doTaskB, &myTask, 3);
  
    t1.join();
    t2.join();
  
    return 0;
}
```

**方法二：使用 Lambda 表达式**

Lambda 表达式是现代 C++ 中最灵活、最常用的方法。它可以捕获对象，然后在新的线程中调用对象的任意成员函数。

```cpp
#include <iostream>
#include <thread>

class MyTask {
public:
    void doTaskA() {
        std::cout << "Task A running from lambda!\n";
    }
  
    void doTaskB(int value) {
        std::cout << "Task B running with value: " << value << " from lambda!\n";
    }
};

int main() {
    MyTask myTask;
  
    // 使用 Lambda 表达式调用 doTaskA
    std::thread t1([&myTask] {
        myTask.doTaskA();
    });
  
    // 使用 Lambda 表达式调用 doTaskB
    int x = 100;
    std::thread t2([&myTask, x] {
        myTask.doTaskB(x);
    });
  
    t1.join();
    t2.join();
  
    return 0;
}
```

## Lambda 表达式

Lambda 表达式是一种 **匿名函数** （没有名字的函数），允许你 **内联地** （inline）定义和使用一个小型函数对象。

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

### 语法结构

一个 Lambda 表达式通常由以下几个部分组成：

```cpp
[capture_list](parameter_list) -> return_type { function_body }
```

1. **`[capture_list]` - 捕获列表（Capture List）**
   * 这是 Lambda 表达式最独特的部分。它决定了 Lambda 可以访问其所在作用域中的哪些外部变量。
   * **`[]`** ：不捕获任何外部变量。
   * **`[var]`** ：以**值**的方式捕获变量 `var`。在 Lambda 内部，`var` 是一个副本，修改它不会影响外部的 `var`。
   * **`[&var]`** ：以**引用**的方式捕获变量 `var`。在 Lambda 内部修改 `var` 会影响外部的 `var`。
   * **`[=]`** ：以**值**的方式捕获所有外部变量。
   * **`[&]`** ：以**引用**的方式捕获所有外部变量。
2. **`(parameter_list)` - 参数列表（Parameter List）**
   * 这部分和普通函数的参数列表一样，定义了 Lambda 表达式接收哪些参数。如果 Lambda 不需要参数，可以省略这个括号。
3. **`-> return_type` - 返回类型（Return Type）**
   * 告诉编译器 Lambda 返回什么类型的值。
   * 在很多情况下，编译器可以根据 `function_body` 中的 `return` 语句自动推断返回类型，所以这部分通常可以省略。
4. **`{ function_body }` - 函数体（Function Body）**
   * 包含了 Lambda 表达式要执行的具体代码。

### 捕获列表

#### 值捕获：`[=]` 或 `[var]`

```cpp
#include <iostream>

int main() {
    int external_var = 10;
  
    // 值捕获：将 external_var 的值复制到 Lambda 内部
    auto lambda_func = [=]() {
        // external_var 在这里是外部变量的一个副本
        std::cout << "在 Lambda 内部，external_var 的值为：" << external_var << std::endl;
        // 注意：默认情况下，值捕获的变量在 Lambda 内部是 const 的，无法修改
    };
  
    external_var = 20; // 在 Lambda 定义之后，修改外部变量
  
    lambda_func(); // 调用 Lambda 
  
    // 输出会是：在 Lambda 内部，external_var 的值为：10
    // 因为 Lambda 捕获的是 external_var=10 时的那个值，而不是它后来的值
    return 0;
}
```

当 Lambda 被创建时，`external_var` 的值 `10` 被复制并存入了 Lambda 对象。之后无论你如何修改外部的 `external_var`，都不会影响 Lambda 内部的副本。

#### 引用捕获：`[&]` 或 `[&var]`

捕获外部变量的引用（地址）

```cpp
#include <iostream>

int main() {
    int external_var = 10;
  
    // 引用捕获：将 external_var 的引用带入 Lambda
    auto lambda_func = [&]() {
        // external_var 在这里就是外部变量本身
        std::cout << "在 Lambda 内部（修改前），external_var 的值为：" << external_var << std::endl;
        external_var = 50; // 在 Lambda 内部直接修改外部变量
        std::cout << "在 Lambda 内部（修改后），external_var 的值为：" << external_var << std::endl;
    };
  
    std::cout << "在调用 Lambda 前，external_var 的值为：" << external_var << std::endl;
  
    lambda_func();
  
    std::cout << "在调用 Lambda 后，external_var 的值为：" << external_var << std::endl;
  
    // 输出会是：
    // 在调用 Lambda 前，external_var 的值为：10
    // 在 Lambda 内部（修改前），external_var 的值为：10
    // 在 Lambda 内部（修改后），external_var 的值为：50
    // 在调用 Lambda 后，external_var 的值为：50
  
    return 0;
}
```

当 Lambda 被调用时，它通过引用直接访问并修改了外部的 `external_var`。所以，Lambda 内部的修改会影响外部变量

### 参数列表

#### 不捕获外部变量

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

struct Person {
    std::string name;
    int age;
};

int main() {
    std::vector<Person> people = {
        {"Alice", 30},
        {"Bob", 25},
        {"Charlie", 35}
    };

    // 使用 Lambda 表达式作为排序的比较器
    std::sort(people.begin(), people.end(), [](const Person& a, const Person& b) {
        return a.age < b.age;
    });

    for (const auto& p : people) {
        std::cout << p.name << " is " << p.age << " years old.\n";
    }

    return 0;
}
```

* 这里的 `[](const Person& a, const Person& b) { ... }` 就是一个 Lambda 表达式。
* 它没有捕获任何外部变量（捕获列表是空的 `[]`），接收两个 `const Person&` 类型的参数，并根据年龄返回一个布尔值，`std::sort` 用这个返回值来决定排序顺序。

它没有捕获任何外部变量（捕获列表是空的 `[]`），接收两个 `const Person&` 类型的参数，并根据年龄返回一个布尔值，`std::sort` 用这个返回值来决定排序顺序

#### 捕获外部变量

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

struct Person {
    std::string name;
    int age;
};

int main() {
    std::vector<Person> people = {
        {"Alice", 30},
        {"Bob", 25},
        {"Charlie", 35}
    };
  
    int min_age = 30;

    // 使用 Lambda 表达式并捕获外部变量 min_age
    auto it = std::find_if(people.begin(), people.end(), [min_age](const Person& p) {
        return p.age > min_age;
    });
  
    if (it != people.end()) {
        std::cout << "First person older than " << min_age << " is " << it->name << ".\n";
    }

    return 0;
}
```

`std::find_if` 这个算法的内部实现，会像一个循环一样，遍历 `people` 容器中的每一个元素，并把每个元素作为参数传递给你的 Lambda 表达式

也可以通过自定义函数理解一下：

```cpp
// 外部函数
void processImages(const std::vector<Image>& images, std::function<void(const Image&)> filter) {
    for (const auto& img : images) {
        filter(img); // **就是这里！**
    }
}

int main() {
    std::vector<Image> myImages(3);
    int brightness_value = 10;
  
    // 创建 Lambda 并将它“包裹”成一个 std::function 对象
    auto my_filter = [brightness_value](const Image& img) {
        img.applyBrightness(brightness_value);
    };
  
    // 调用外部函数，将 my_filter 作为参数传入
    processImages(myImages, my_filter);
  
    return 0;
}
```

当调用 `processImages(myImages, my_filter)` 时，程序做了两件事：

* 把 `myImages` 传给 `processImages` 的 `images` 参数。
* 把 `my_filter` 这个 Lambda 对象传给 `processImages` 的 `filter` 参数。由于 `std::function` 可以接受任何 **可调用对象** ，所以这个传递是成功的。

# 线程管理

之前使用thread进行线程创建的完整流程如下：

```cpp
#include <iostream>
#include <thread>
#include <chrono>

// 普通函数作为线程任务
void printNumbers() {
    for (int i = 0; i < 5; ++i) {
        std::cout << "Number: " << i << std::endl;
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    }
}

// Lambda 表达式作为线程任务
void printLetters() {
    auto lambda_task = []() {
        for (char c = 'A'; c <= 'E'; ++c) {
            std::cout << "Letter: " << c << std::endl;
            std::this_thread::sleep_for(std::chrono::milliseconds(100));
        }
    };
    lambda_task(); // 在当前线程中调用 Lambda，或者...
}

int main() {
    // 创建并启动线程 t1，执行 printNumbers 函数
    std::thread t1(printNumbers);
  
    // 创建并启动线程 t2，执行一个 Lambda 表达式
    // 注意：这里的 Lambda 表达式必须是可调用的，不能只是一个定义
    std::thread t2([]() {
        for (char c = 'A'; c <= 'E'; ++c) {
            std::cout << "Letter: " << c << std::endl;
            std::this_thread::sleep_for(std::chrono::milliseconds(100));
        }
    });

    // 线程启动后，main 函数和这两个新线程会并发执行
    // 它们的输出可能会交错出现

    std::cout << "Main thread is waiting for child threads." << std::endl;

    // ... 接下来是等待线程完成的代码
    t1.join();
    t2.join();
  
    std::cout << "All threads have finished." << std::endl;

    return 0;
}
```

现在我们要进行后续的处理

## 线程的同步与等待

线程启动后，它们和 `main` 线程是独立运行的。但是，在某些情况下，我们需要协调它们的执行，比如在 `main` 函数结束前，确保所有子线程都已经完成它们的任务。

### RAII原则

（Resource Acquisition Is Initialization，资源获取即初始化）

**RAII**不只是一个编程技巧，它是一种设计哲学。它的核心思想是：将资源的生命周期与对象的生命周期绑定在一起

传统修改资源的做法是：

1. **获取资源** ：`mutex.lock()`
2. **使用资源** ：...
3. **释放资源** ：`mutex.unlock()`

在不使用RAII的情况下，代码可能长这样：

```cpp
void deposit(Account& account, double amount) {
    account.mutex.lock(); // 获取锁
    account.balance += amount;
    // 假设这里有一个操作可能会抛出异常
    // throw std::runtime_error("Something went wrong");
    account.mutex.unlock(); // 释放锁
}
```

这种模式看似简单，但它有一个致命的缺陷：如果在使用资源的过程中，发生了异常，或者函数提前返回了，那么 `mutex.unlock()`这行代码可能永远不会被执行！资源就会一直被占用，导致程序行为异常甚至崩溃。

为解决这个问题，RAII的思想如下：

1. **在对象的构造函数中获取资源** ：当一个对象被创建时，它的构造函数会自动执行。我们可以在这里调用 `mutex.lock()`。
2. **在对象的析构函数中释放资源** ：当这个对象离开作用域（无论是正常结束、函数返回还是异常抛出），它的析构函数都会被自动调用。我们可以在这里调用 `mutex.unlock()`。

这样一来，无论发生什么，只要对象生命周期结束，资源就一定会被释放。

#### 利用**RAII**原则来重构代码

先需要知道这个函数：

* **`std::lock_guard`** ：在构造时自动上锁，在析构时自动解锁。它非常简单，不能手动解锁或推迟上锁。适用于简单的独占锁场景。

代码示例

```cpp
#include <iostream>
#include <mutex>
#include <thread>

class Account {
public:
    std::mutex mutex;
    double balance = 0.0;
};

void deposit_safe(Account& account, double amount) {
    // 1. 创建 std::lock_guard 对象
    //    在构造函数中，它会自动调用 account.mutex.lock()
    std::lock_guard<std::mutex> lock(account.mutex);

    // 2. 正常进行业务逻辑
    account.balance += amount;

    // 3. 当函数结束，lock对象离开作用域
    //    它的析构函数会自动调用 account.mutex.unlock()
} // lock对象在这里被销毁
```

* **`std::lock_guard<std::mutex> lock(account.mutex);`** 这一行是整个方案的核心。当这行代码执行时，`lock`对象被创建，它的构造函数会立即调用 `account.mutex.lock()`来获取锁。
* 此后，无论函数体中发生了什么（正常执行、`return`、或者抛出异常），当 `deposit_safe`函数执行结束，Account 类的作用域结束， `lock`对象都会被销毁。

总而言之：为被被保护的资源（对象）添加一个与之绑定的锁（通过类规定），进入操作函数的作用域时构造并设置 `mutex.lock()` ，任意退出时都会调用 `mutex.unlock()`进行释放

**将资源的生命周期与一个局部（栈上）对象的生命周期绑定。** 在对象的**构造函数**中获取资源（如 `mutex.lock()`），并在**析构函数**中释放资源（如 `mutex.unlock()`）。这样一来，无论代码如何退出（正常返回或异常抛出），C++的析构机制都能保证资源得到自动、安全的释放。

### `join()`

阻塞调用线程（例如 `main` 线程），直到被 `join` 的线程执行完毕。

```cpp
// ... 接下来是等待线程完成的代码
    t1.join();
    t2.join();
```

如果在一个 `std::thread` 对象被销毁（例如，超出作用域）之前没有调用 `join()` 或 `detach()`，程序会因 `std::terminate` 而异常终止。这被称为  **线程的 RAII 原则** ，`std::thread` 对象必须在析构前被管理

### `detach()`

将线程与 `std::thread` 对象分离，使其成为一个**后台线程（daemon thread）**

一旦分离，这个线程的生命周期就不再由 `std::thread` 对象控制，它会独立地在后台运行，直到任务完成或整个程序结束。在此期间无法被 `join`

```cpp
#include <iostream>
#include <thread>
#include <chrono>

void background_task() {
    std::cout << "Background task started..." << std::endl;
    std::this_thread::sleep_for(std::chrono::seconds(2));
    std::cout << "Background task finished." << std::endl;
}

int main() {
    std::thread t(background_task);
  
    // 将线程 t 分离，使其在后台独立运行
    t.detach();

    // main 函数继续执行，不会等待 t 完成
    std::cout << "Main thread continues and will not wait for the background task." << std::endl;
  
    // 为了确保 main 线程不会在后台线程之前退出，这里稍微等待一下
    // 实际应用中需要更严谨的同步机制
    std::this_thread::sleep_for(std::chrono::seconds(1));

    return 0;
}
```

# 同步（Synchronization）机制

## 互斥锁（`std::mutex`）

**`std::mutex` 的核心思想是：**

* **上锁（`lock()`）：** 在访问共享数据之前，线程必须先“上锁”，获得互斥锁的所有权。
* **解锁（`unlock()`）：** 访问完毕后，线程必须“解锁”，释放所有权。

**`std::unique_lock` 和 `std::lock_guard`：RAII 风格的锁**

直接使用 `lock()` 和 `unlock()` 有一个很大的风险：如果线程在 `lock()` 和 `unlock()` 之间抛出异常，`unlock()` 就永远不会被调用，导致互斥锁永远处于锁定状态（死锁）。

此事在上文中亦有记载

为了解决这个问题，C++ 引入了**资源获取即初始化（RAII）**的理念。`std::lock_guard` 和 `std::unique_lock` 就是遵循这个原则的工具。

* **`std::lock_guard`** ：在构造时自动上锁，在析构时自动解锁。它非常简单，不能手动解锁或推迟上锁。适用于简单的独占锁场景。
* **`std::unique_lock`** ：功能更强大，提供了更多的灵活性，比如可以手动解锁、推迟上锁等。

`std::unique_lock`是 `std::lock_guard`的升级版。它同样遵循RAII原则，在析构时自动释放锁，但它提供了更多的控制能力。

```cpp
#include <iostream>
#include <mutex>
#include <thread>

std::mutex shared_mutex;
int shared_data = 0;

void try_to_access_resource() {
    // 尝试非阻塞地获取锁
    // std::try_to_lock 是一个特殊的参数，告诉 unique_lock 不要阻塞
    std::unique_lock<std::mutex> lock(shared_mutex, std::try_to_lock);

    // lock.owns_lock() 返回一个布尔值，告诉你是否成功获取了锁
    if (lock.owns_lock()) {
        std::cout << "线程 " << std::this_thread::get_id() << ": 成功获取锁，正在修改数据..." << std::endl;
        shared_data++;
    } else {
        std::cout << "线程 " << std::this_thread::get_id() << ": 无法立即获取锁，执行备用操作或返回。" << std::endl;
    }
} // lock对象在这里被销毁，如果它持有锁，则会自动释放

int main() {
    std::thread t1(try_to_access_resource);
    std::thread t2(try_to_access_resource);

    t1.join();
    t2.join();

    return 0;
}
```

* 我们使用 `std::unique_lock`，并且在构造函数中传入了一个额外的参数 `std::try_to_lock`。这个参数告诉 `unique_lock`：“只尝试一次，如果锁被占用，不要等待，立即返回。”
* `unique_lock`内部会调用 `shared_mutex.try_lock()`，这是一个非阻塞的尝试获取锁的方法。
* 随后，我们通过 `lock.owns_lock()`来检查是否成功获取了锁。根据检查结果，我们可以执行不同的分支逻辑。
* 最关键的是，无论 `lock.owns_lock()`的结果是 `true`还是 `false`，当 `lock`对象离开作用域时，它的析构函数都会被调用。**如果它成功获取了锁，析构函数就会释放锁；如果它没有获取锁，析构函数什么也不做。** 这样，即使在有条件判断的情况下，我们依然保证了资源的正确释放。

## 条件变量（`std::condition_variable`）

互斥锁解决了共享数据的独占访问问题，但它无法解决线程间的**协作**问题

条件变量的目的是：允许线程在满足特定条件时被 **唤醒** ，或者在条件不满足时 **进入休眠** 。

这里引入一个函数：

**`std::condition_variable` 的核心思想是：**

* **等待（`wait()`）：** 线程在等待某个条件满足时，会调用 `wait()`。`wait()` 会自动释放互斥锁并使线程进入休眠。
* **通知（`notify_one()` / `notify_all()`）：** 当某个线程改变了条件，它会调用 `notify_one()` 来唤醒一个正在等待的线程，或者调用 `notify_all()` 唤醒所有等待的线程。

示例：一个简单的生产者/消费者队列

```cpp
#include <iostream>
#include <thread>
#include <queue>
#include <mutex>
#include <condition_variable>

std::queue<int> data_queue;
std::mutex queue_mutex;
std::condition_variable condition;

void producer() {
    for (int i = 0; i < 10; ++i) {
        // 生产者生产数据
        {
            std::lock_guard<std::mutex> lock(queue_mutex);
            data_queue.push(i);
            std::cout << "Produced: " << i << std::endl;
        }
        // 通知一个等待中的消费者
        condition.notify_one();
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    }
}

void consumer() {
    for (int i = 0; i < 10; ++i) {
        std::unique_lock<std::mutex> lock(queue_mutex);
  
        // 消费者在队列为空时等待
        condition.wait(lock, [] {
            return !data_queue.empty();
        });
  
        // 当被唤醒且条件满足时，取出数据
        int data = data_queue.front();
        data_queue.pop();
        std::cout << "Consumed: " << data << std::endl;
    }
}

int main() {
    std::thread prod_thread(producer);
    std::thread cons_thread(consumer);

    prod_thread.join();
    cons_thread.join();

    return 0;
}
```

对于生产者：

* 它使用 `std::lock_guard` 来保证对 `data_queue` 的安全访问。
* 在添加数据后，它调用 `condition.notify_one()` 来唤醒一个（或多个，具体取决于系统）等待中的消费者线程。

对于消费者：

* 它使用 `std::unique_lock`，因为它需要更灵活的操作（在 `wait` 中自动解锁）。
* **`condition.wait(lock, [] { return !data_queue.empty(); });`** 这行代码是核心。它做了三件事：
  1. 检查 Lambda 表达式（`!data_queue.empty()`）。如果条件为 `true`，`wait` 直接返回，线程继续执行。
  2. 如果条件为 `false`，`wait` 会**自动释放** `lock` 的所有权，并使当前线程进入休眠。
  3. 当线程被 `notify_one()` 唤醒后，它会**重新获取** `lock`，并再次检查条件。如果条件仍然为 `false`，它会再次进入休眠。

# 异步（async）编程

## `std::async`：异步执行任务

创建线程是繁琐的：需要手动创建 `std::thread`，然后使用锁和条件变量来同步结果

**`std::async`** 的出现就是为了解决这个问题。它能让你像调用普通函数一样，异步地启动一个任务，并自动为你处理线程创建、销毁和结果同步的细节。

**核心思想：**

* **简化异步调用：** 你只需提供一个可调用对象（函数、Lambda 等）和参数，`std::async` 就会在后台执行它。
* **返回 `std::future`：** 它返回一个 `std::future` 对象，这个对象就像一个“承诺”或“占位符”，你可以在稍后通过它来获取任务的结果。

基本语法：

```cpp
std::future<ReturnType> fut = std::async(policy, function, args...);
```

* **`ReturnType`** ：这是你传入的函数的返回值类型。
* **`fut`** ：`std::future` 对象，你可以通过它来获取异步任务的结果。
* **`policy`** ：这是 `std::async`最灵活的部分，它决定了任务的执行方式（我们稍后会详细讲）。
* **`function`** ：你想异步执行的函数。
* **`args...`** ：传递给函数的参数。

`std::async` 的第一个参数是执行策略，通常使用默认的 `std::launch::async | std::launch::deferred` 即可。

```cpp
#include <iostream>
#include <vector>
#include <numeric>
#include <future>
#include <thread>
#include <chrono>

// 耗时计算任务
long long calculate_sum(const std::vector<int>& data) {
    long long sum = 0;
    // 模拟耗时操作
    std::this_thread::sleep_for(std::chrono::seconds(2));
    for (int value : data) {
        sum += value;
    }
    return sum;
}

int main() {
    std::vector<int> numbers(100000, 1); // 一个大数组，所有元素都是1
  
    // 1. 使用 std::async 异步启动任务
    // 它返回一个 std::future 对象，用于获取结果
    std::future<long long> future_sum = std::async(std::launch::async, calculate_sum, numbers);

    // 2. 在主线程中继续做其他事情...
    std::cout << "Main thread is busy doing other things..." << std::endl;
    std::this_thread::sleep_for(std::chrono::seconds(1));

    // 3. 在需要时等待并获取结果
    // future_sum.get() 会阻塞当前线程，直到异步任务完成
    std::cout << "Waiting for the result..." << std::endl;
    long long result = future_sum.get();

    std::cout << "The sum is: " << result << std::endl;

    return 0;
}
```

* `std::future<long long> future_sum = std::async(...)`：这行代码是核心。它启动了一个新线程（如果策略允许），执行 `calculate_sum` 函数，并将 `numbers` 向量作为参数传入。它立即返回一个 `std::future` 对象，这个对象的模板参数 `<long long>` 指明了异步任务的返回值类型。
* `future_sum.get()`：当你调用 `get()` 时，如果异步任务还没有完成，主线程会在这里 **阻塞** ，直到任务完成并返回结果。`get()` 只能被调用一次。

### `std::async` 的执行策略（`std::launch`）

`std::async`的强大之处在于它的执行策略，这决定了任务是在新线程中立即执行，还是延迟执行。

1. **`std::launch::async`** ：

   * **含义** ：**强制**在新线程中执行任务。
   * **效果** ：`std::async`一调用，任务就会在新线程中立即开始执行。这最接近于我们手动创建 `std::thread`的效果。
2. **`std::launch::deferred`** ：

   * **含义** ：**延迟**执行任务。
   * **效果** ：`std::async`会立即返回一个 `future`对象，但任务函数并不会被执行。只有当 **第一次调用 `future.get()`或 `future.wait()`时** ，任务才会在**调用者的线程**中同步执行。这相当于把任务的执行推迟到需要结果的那一刻。
3. **`std::launch::async | std::launch::deferred`** （默认策略）：

   * **含义** ：这是 `std::async`默认的行为。
   * **效果** ：运行时环境**自己决定**是以 `std::launch::async`（新线程）方式执行，还是以 `std::launch::deferred`（延迟）方式执行。编译器会根据当前的系统负载、可用的线程资源等因素来做出最优的决策。

## `std::future`：异步结果的占位符

`std::future` 的作用就是作为异步任务和主线程之间的桥梁。它封装了异步任务的返回值，让你可以在合适的时候安全地获取它。

除了 `get()`，`std::future` 还提供了一些其他有用的方法：

* **`wait()`** ：阻塞当前线程，直到异步任务完成，但**不获取**返回值。
* **`wait_for()`** ：需要传入等待时长，等待时间后，检查任务是否完成。它通常用于**非阻塞**地检查任务状态。
* **`valid()`** ：检查 `future` 对象是否与某个共享状态（异步任务）关联。

`wait_for()`的例子

```cpp
#include <iostream>
#include <vector>
#include <numeric>
#include <future>
#include <thread>
#include <chrono>

long long long_running_task(int value) {
    std::this_thread::sleep_for(std::chrono::seconds(5));
    return static_cast<long long>(value) * 2;
}

int main() {
    // 异步启动一个耗时任务
    std::future<long long> future_result = std::async(long_running_task, 100);

    // 在一个循环中非阻塞地等待
    while (true) {
        // 等待1秒，检查任务是否完成
        auto status = future_result.wait_for(std::chrono::seconds(1));

        if (status == std::future_status::ready) {
            std::cout << "Task is ready! Getting result..." << std::endl;
            long long result = future_result.get();
            std::cout << "Result: " << result << std::endl;
            break;
        } else if (status == std::future_status::timeout) {
            std::cout << "Task still running, waiting longer..." << std::endl;
        } else if (status == std::future_status::deferred) {
            std::cout << "Task is deferred, calling it now..." << std::endl;
            long long result = future_result.get();
            std::cout << "Result: " << result << std::endl;
            break;
        }
    }

    return 0;
}
```

## `std::packaged_task` 和 `std::promise`

在某些更复杂的场景中，你可能需要手动控制异步任务的生命周期和结果传递

* **`std::packaged_task`** ：它封装了一个可调用对象，并提供一个 `std::future` 来获取它的结果。你可以把它想象成一个可以被“包装”起来的任务，然后手动放入一个线程中执行。
* **`std::promise`** ：它提供了一个更底层的方式来设置 `std::future` 的值。你可以用一个 `std::promise` 对象来创建一个 `std::future`，然后在另一个线程中通过 `promise` 对象设置结果，`future` 对象就可以获取到这个结果。

```cpp
#include <iostream>
#include <thread>
#include <future>
#include <utility> // For std::move

// 一个简单的函数，用来计算两个整数的乘积
int multiply(int a, int b) {
    std::cout << "Task thread: Calculating " << a << " * " << b << std::endl;
    std::this_thread::sleep_for(std::chrono::seconds(2)); // 模拟耗时操作
    return a * b;
}

int main() {
    // 1. 创建一个 packaged_task 对象，封装 multiply 函数
    // 模板参数是函数的签名：int(int, int)
    std::packaged_task<int(int, int)> task(multiply);

    // 2. 获取与 packaged_task 关联的 future 对象
    std::future<int> result_future = task.get_future();

    // 3. 创建一个新线程，并将 packaged_task 作为其任务
    // 注意：packaged_task 是不可复制的，所以需要使用 std::move
    // 传入的参数 10 和 20 会作为 task 的参数
    std::thread task_thread(std::move(task), 10, 20);

    std::cout << "Main thread: Waiting for the task to complete..." << std::endl;

    // 4. 在主线程中，通过 future 对象等待并获取结果
    // get() 会阻塞当前线程，直到结果可用
    int result = result_future.get();

    std::cout << "Main thread: Task finished. The result is " << result << std::endl;
  
    // 等待线程结束
    task_thread.join();

    return 0;
}

```

# (C++) 多进程

在操作系统中，进程是独立的、拥有自己私有内存空间的实体。这种隔离性确保了系统的稳定性和安全性，但也意味着进程之间不能像线程那样直接访问彼此的变量。

## 进程间通信 IPC

为了让不同的进程协同工作，操作系统提供了多种**进程间通信 Inter-Process Communication，简称 IPC** 机制

通信方式可以大致分为两大类：**共享内存**和 **消息传递** 。这两种模式各有优劣，适用于不同的场景。

### 共享内存

（效率最高）

**核心思想：操作系统划出一块公共的内存区域，并将其映射到需要通信的多个进程的地址空间中**

这些进程都可以直接读写这块共享内存，从而实现数据的快速交换

* **优点** ：速度快，因为数据不需要在内核空间和用户空间之间进行拷贝。一旦建立共享内存，后续的通信就像普通的内存读写一样。
* **缺点** ：需要处理同步问题。多个进程同时读写同一块内存时，可能会产生 **竞争条件（race condition）** ，导致数据不一致。因此，通常需要配合**信号量（Semaphore）** 或 **互斥锁（Mutex）** 等同步机制来保证数据访问的原子性。

### 消息传递

消息传递模式下，进程之间通过发送和接收消息来进行通信。操作系统内核充当中间人，负责消息的传递和存储

具体实现也有好几种：


#### 管道（Pipes）

这是最古老也最简单的一种 IPC 方式。管道可以理解为一段内核缓冲区，数据只能单向流动，先进先出。

* **匿名管道** ：只能用于有亲缘关系的进程之间（如父子进程）。通常通过 `|` 符号在 Shell 中使用。例如，`ls | grep a` 中，`ls` 进程的输出通过管道传递给 `grep` 进程作为输入。
* **命名管道（Named Pipes / FIFO）** ：通过文件系统中的一个特殊文件来命名，因此可以在不相关的进程之间进行通信。

#### 消息队列（Message Queues）


消息队列是存放在内核中的消息链表。进程可以向其中添加消息，也可以从其中读取消息。每个消息都有一个类型，可以实现消息的定向传递。

* **优点** ：可以解耦发送方和接收方。消息发送后，接收方不一定需要立即处理，可以等到方便的时候再读取。
* **缺点** ：通信效率比共享内存低，因为涉及到数据的多次拷贝。

#### 信号（Signals）

信号是一种相对简单的通知机制，用于通知进程发生了某种事件。它不用于传递复杂的数据，更像是发送一个“中断”或“提醒”。例如，`Ctrl+C` 产生 `SIGINT` 信号，用于终止进程。

#### 套接字（Sockets）

套接字是更通用的 IPC 机制，可以用于同一台机器上不同进程间的通信，也可以用于网络上不同机器间的进程通信。它是网络通信的基础，提供了双向的、全双工的通信能力。


#### 综合对比与选择

| 方式               | 优点                               | 缺点                                   | 典型应用场景                   |
| ------------------ | ---------------------------------- | -------------------------------------- | ------------------------------ |
| **共享内存** | 速度最快，适合大量数据交换         | 需要额外的同步机制，编程复杂           | 高性能计算、数据密集型任务     |
| **管道**     | 简单易用，特别适合单向数据流       | 只能用于亲缘关系进程（匿名），单向通信 | 命令行工具链、简单的数据流处理 |
| **消息队列** | 方便灵活，解耦进程，支持非阻塞通信 | 速度较慢，有消息大小限制               | 任务队列、服务间通信           |
| **信号**     | 简单轻量，用于通知事件             | 只能传递少量信息，不可靠               | 进程控制（终止、暂停等）       |
| **套接字**   | 通用性强，可用于本地和网络通信     | 编程相对复杂，有性能开销               | 客户端-服务器架构、网络服务    |
