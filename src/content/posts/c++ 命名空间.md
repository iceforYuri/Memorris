---
title: c++ 命名空间
published: 2025-03-04
discription: 作为附加信息来区分不同库中相同名称的函数、类、变量等。
category: 指南
tags: [C++高级]
---
*It's not like I'm pessimistic or anything... I'm just moving forward without looking back.*——*Sekai Ichi Hatsukoi - World's Greatest First Love*

本质上，命名空间就是定义了一个范围，定义了能够使用的当前库对象

# 定义命名空间

```cpp
namespace namespace_name {
   // 代码声明
}
```

调用命名空间中的函数或变量时，在调用代码的前面加上命名空间的名称即可

```
<_name>::<_code>;  // code 可以是变量或函数
```

## using指令

使用 **using namespace** 指令在使用命名空间时就可以不用在前面加上命名空间的名称，后续的代码将使用指定的命名空间中的名称
