---
title: 数据库系统概念 SQL介绍
published: 2025-11-12
description: 第三章 尽管我们说SQL 语言是一种“查询语言”，但是除了查询数据库，它还具有很多别的功能。 它可以定义数据结构、 修改数据库中的数据以及定义安全性约束。
category: 指南
tags: ['DataBase']
---
*尽管我们说SQL 语言是一种“查询语言”，但是除了查询数据库，它还具有很多别的功能。 它可以定义数据结构、 修改数据库中的数据以及定义安全性约束。*

# 3.1 SQL 查询语言概览

SQL 语言有几个部分：

- **数据定义语言（Data-Definition Language，DDL）**。SQL DDL 提供定义关系模式、删除关系以及修改关系模式的命令。
- **数据操纵语言（Data-Manipulation Language，DML）**。SQL DML 提供从数据库中查询信息以及在数据库中插入元组、删除元组、修改元组的能力。
- **完整性（integrity）**。SQL DDL 包括定义完整性约束的命令，保存在数据库中的数据必须满足所定义的完整性约束。破坏完整性约束的更新是不允许的。
- **视图定义（view definition）**。SQL DDL 包括定义视图的命令。
- **事务控制（transaction control）**。SQL 包括定义事务的开始点和结束点的命令。
- 嵌入式 SQL（embedded SQL）和动态 SQL（dynamic SQL）。嵌入式和动态 SQL 定义 SQL 语句如何嵌入诸如 C、C++ 和 Java 这样的通用编程语言中。
- **授权（authorization）**。SQL DDL 包括定义对关系和视图的访问权限的命令。

约等于目录

# 3.2 SQL 数据定义

数据库中的关系集合是用数据定义语言（DDL）定义的。SQL DDL 不仅能够定义关系的集合，还能够定义有关每个关系的信息，包括：

- 每个关系的模式。
- 每个属性的取值类型。
- 完整性约束。
- 为每个关系维护的索引集合。
- 每个关系的安全性和权限信息。
- 每个关系在磁盘上的物理存储结构。

## 3.2.1 基本类型

| 类型                 | 全称形式                 | 说明                                                                     | 示例与限制                                                               |
| -------------------- | ------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| `char(n)`          | `character(n)`         | 固定长度的字符串，长度由用户指定为 `n`                                 | -                                                                        |
| `varchar(n)`       | `character varying(n)` | 可变长度的字符串，最大长度由用户指定为 `n`                             | -                                                                        |
| `int`              | `integer`              | 整数，属于依赖于机器的整数有限子集                                       | -                                                                        |
| `smallint`         | -                        | 小整数，是依赖于机器的整数类型的子集                                     | -                                                                        |
| `numeric(p, d)`    | -                        | 具有用户指定精度的定点数，共 `p`位数字（含符号位），小数点后有 `d`位 | `numeric(3,1)`可精确存储 `44.5`，但不能精确存储 `444.5`或 `0.32` |
| `real`             | -                        | 浮点数，精度依赖于机器                                                   | -                                                                        |
| `double precision` | -                        | 双精度浮点数，精度依赖于机器                                             | -                                                                        |
| `float(n)`         | -                        | 精度至少为 `n`位数字的浮点数                                           | -                                                                        |

更多类型将在4.5 节中介绍

每种类型都可能包含一个被称作空（null）值的特殊值，在一些情况下，空值会带来意想不到的效果，所以一般情况下我们需要设定考虑空值的取值。

## 3.2.2 基本模式定义

我们通过使用 `create table`命令来定义SQL 关系：

```sql
create table r
    (A₁ D₁, 
     A₂ D₂, 
     ..., 
     Aₙ Dₙ,
    (integrity-constraint₁),
    ...,
    (integrity-constraintₖ))
```

- $r$是该关系的名称
- 每个 $A_i$ 都是关系模式 $r$ 中的一个属性名称。
- $D_i$ 是属性 $A_i$ 域中值的数据类型。

**示例：**

```sql
create table instructor (
    ID         char(5),
    name       varchar(20),
    dept_name  varchar(20),
    salary     numeric(8,2)
)
```

### 完整性约束

SQL 支持许多不同的完整性约束

- $\text{primary key } (A_{j1}, A_{j2}, \cdots, A_{jm})$：主码声明表示属性 $A_{j1}, A_{j2}, \cdots, A_{jm}$ 构成关系的主码
  - 主码属性必须是非空且唯一的
- $\text{foreign key } (A_{k1}, A_{k2}, \cdots, A_{kn}) \text{ references } s$：外码声明表示关系中任意元组在属性 $(A_{k1}, A_{k2}, \cdots, A_{kn})$ 上的取值必须对应于关系 $s$ 中某元组在主码属性上的取值
- $\text{not null}$ ：一个属性上的非空约束表明在该属性上不允许存在空值；该约束把空值排除在该属性域之外。例如在图 3-1 中，`instructor` 关系的 `name` 属性上的非空约束保证了教师的姓名不会为空。

### DDL

这一部分内容涉及部分DDL语句：

#### 表操作

##### 修改

- DDL-表操作-添加字段

```sql
ALTER TABLE 表名 ADD 字段名 类型 [COMMENT 注释] [约束];
```

- DDL-表操作-修改数据类型

```sql
ALTER TABLE 表名 MODIFY 字段名 新数据类型;
```

- DDL-表操作-修改字段名和字段类型（**添加约束？**）

```sql
ALTER TABLE 表名 CHANGE 旧字段名 新字段名 类型 [COMMENT注释] [约束];
```

- DDL-表操作-删除字段

```sql
ALTER TABLE 表名 DROP 字段名;
```

- DDL-表操作-修改表名

```sql
ALTER TABLE 表名 RENAME TO 新表名;
```

##### 删除

- DDL-表操作-删除

```sql
DROP TABLE [IF EXISTS] 表名;
```

- DDL-表操作-删除指定表，并重新创建该表(清除表中的数据)

```sql
TRUNCATE TABLE 表名
```

### DML

#### 删除数据

```sql
DELETE FROM 表名 [WHERE 条件];
```

- 无条件删除整个表
- DELETE语句不能删除某一个字段的值，只能一次删除一行。

# 3.3 SQL 查询的基本结构

SQL 查询的基本结构 由 三个子句构成 ： select, from 和 where

这一部分内容与关系代数的讲解部分重合，不过多赘述

# 3.4 附加的基本运算

包括：

## 3.4.1 更名运算as

## 3.4.2 字符串运算

涉及字符串函数

- 连接字符串（使用“**||** "）
- 提取子串
- 计算字符串长度 **len()**
- 大小写转换（用**upper(s)** 函数将字符串s转换为大写，或用 **lower(s）** 函数将字符串s转换为小写）
- 去掉字符串后面的空格（使用trim(s)）
-

### 使用like运算符来实现模式匹配（实际应用挺重要的）

- 百分号（%): ％字符匹配任意子串。
- 下划线（_ )： 字符匹配任意一个字符。

示例：

> - `'Intro%'` 匹配以 “Intro” 打头的任意字符串。
> - `'%Comp%'` 匹配包含 “Comp” 子串的任意字符串，例如 `'Intro. to Computer Science'` 和 `'Computational Biology'`。
> - `'___'` 匹配只含三个字符的任意字符串。
> - `'___%'` 匹配至少含有三个字符的任意字符串。

SQL 通过使用比较运算符 `like` 来表达模式。考虑查询 “找出所在建筑名称中包含子串 `'Watson'` 的所有系名”。该查询可以写成：

```sql
select dept_name
from department
where building like '%Watson%';
```

# 3.5 集合运算

## 3.5.1 并运算

```sql
(select course_id
 from section
 where semester = 'Fall' and year= 2017)
union
(select course_id
 from section
 where semester = 'Spring' and year= 2018);
```

与 `select` 子句不同，`union` 运算自动**去除重复**

如果我们想**保留所有重复项**，就必须用 `union all` 代替 `union`：

```sql
(select course_id
 from section
 where semester = 'Fall' and year= 2017)
union all
(select course_id
 from section
 where semester = 'Spring' and year= 2018);
```

## 3.5.2 交运算

交运算使用 `intersect`表示，与 `union`一样，包含去重属性，且使用 `all`可取消去重

## 3.5.3 差运算

差运算使用 `except`表示，与 `union`一样，包含去重属性，且使用 `all`可取消去重

# 3.6 空值

## 3.6.1 空值处理

如果算术表达式的任一输入值为空 `null`，则该算术表达式（涉及诸如十、 一、 *或／）结果为空。

SQL将涉及空值的任何比较运算的结果视为 `unknown`（既不是谓词 `is null`，也不是 `is not null`, 我们将在本节的后面介绍这两个谓词）。 这创建了除 `true`、`false`之外的第三种逻辑值。

由于 `where`子句中的谓词可以对比较结果使用诸如 `and`、 `or`、`not`的布尔运算，因此这些布尔运算的定义也被扩展为可以处理 `unknown`值。

| 布尔运算 | 操作组合                | 结果        |
| -------- | ----------------------- | ----------- |
| `and`  | `true and unknown`    | `unknown` |
| `and`  | `false and unknown`   | `false`   |
| `and`  | `unknown and unknown` | `unknown` |
| `or`   | `true or unknown`     | `true`    |
| `or`   | `false or unknown`    | `unknown` |
| `or`   | `unknown or unknown`  | `unknown` |
| `not`  | `not unknown`         | `unknown` |

### 使用示例

SQL 在谓词中使用特殊的关键字 `null` 来测试空值。因此，为找出 `instructor` 关系中 `salary` 为空值的所有教师，我们可以写出：

```sql
select name
from instructor
where salary is null;
```

如果谓词 `is not null` 所作用的值非空，那么谓词为真。

SQL 允许我们通过使用 `is unknown` 和 `is not unknown` 子句来测试一个比较运算的结果是否为 `unknown`，而不是 `true` 或 `false`。例如：

```sql
select name
from instructor
where salary > 10000 is unknown;
```

## 3.6.2 distinct

当一个查询使用 `select distinct`子句时，重复元组必须被去除。在一些依赖查询中尤为有用

# 3.7 聚集函数

聚集函数（aggregate function）是以值集（集合或多重集合）为输入并返回单个值的函数。SQL 提供了五个标准的固有聚集函数：

- 平均值：`avg`
- 最小值：`min`
- 最大值：`max`
- 总和：`sum`
- 计数：`count`

`sum` 和 `avg` 的输入必须是数字集，但其他运算符可以作用在非数字数据类型的集合上，比如字符串。

## 3.7.1 基本聚集

```sql
select avg (salary)
from instructor
where dept_name = 'Comp. Sci.';
```

在一个基本查询（select+from+where）中使用聚集函数，被称为基本聚集

## 3.7.2 分组聚集

我们使用group by子句将聚集函数作用在一组元组集上，

### 分组查询注意事项

基本要求：出现在 `select`语句中但没有被聚集的属性只能是出现在 `group by`子句中的那些属性

> 任何没有出现在group by 子句中的属性如果出现在 select子句中，它只能作为聚集函数的参数

```sql
/* 错误查询 */
select dept_name, ID, avg (salary)
from instructor
group by dept_name;
```

## 3.7.3 having 子句

针对元组的查询，SQL语句中使用 `having`。SQL 在形成分组后才应用 `having`子句中的谓词，因此在 `having` 子句中可以使用聚集函数

> `where`语句中不允许使用聚集函数

```sql
select dept_name, avg (salary) as avg_salary
from instructor
group by dept_name
having avg (salary) > 42000;
```

与 `select` 子句的情况类似，任何出现在 `having` 子句中，但**没有被聚集的属性必须出现在 `group by` 子句**中，否则查询就是错误的。

包含聚集、`group by` 或 `having` 子句的查询的含义可通过下述运算序列来定义：

1. 与不带聚集的查询情况类似，首先根据 `from` 子句来计算出一个关系。
2. 如果出现了 `where` 子句，`where` 子句中的谓词将应用到 `from` 子句的结果关系上。
3. 如果出现了 `group by` 子句，满足 `where` 谓词的元组通过 `group by` 子句被放入分组中。如果没有 `group by` 子句，满足 `where` 谓词的整个元组集被当成一个分组。
4. 如果出现了 `having` 子句，它将应用到每个分组上；不满足 `having` 子句谓词的分组将被去掉。
5. `select` 子句利用剩下的分组产生查询结果中的元组，即在每个分组上应用聚集函数来得到单个结果元组。

## 3.7.4 对空值和布尔值的聚集

原则：

- 除了 `count(*）`之外所有的聚集函数都忽略其输入集合中的空值
- 规定空集的 `count`运算值为0，并且当作用在空集上时，其他所有聚集运算返回一个空值。

# 3.8 嵌套子查询

## 3.8.1 集合成员资格

连接词 `in`测试集合成员资格

连接词 `not in`测试集合成员资格的缺失。

我们需要从子查询得到的课程集合中找出那些在 2017 年秋季开课的课程。为完成此项任务我们将子查询嵌入外部查询的 `where` 子句中。最后的查询语句是：

```sql
select distinct course_id
from section
where semester = 'Fall' and year= 2017 and
      course_id in (select course_id
                    from section
                    where semester = 'Spring' and year= 2018);
```

## 3.8.2 集合比较

嵌套子查询能够对集合进行比较

考虑查询“找出工资至少比Biology系某位教师 的工资要高 的所有教师的姓名”：

```sql
select distinct T.name
from instructor as T, instructor as S
where T.salary > S.salary and S.dept_name = 'Biology';
```

SQL 提供另外一种方式编写上面的查询。 “至少比某一个要大”在SQL 中用 `>some`表示

```sql
select name
from instructor
where salary > some (select salary
                    from instructor
                    where dept_name = 'Biology');
```

SQL 也允许 `=some` , `=some` ，`<>some`，`=all, =all`和 `<>all`的比较

## 3.8.3 空关系测试

`exists`结构在作为参数的子查询非空时返回 `true`值

```sql
select course_id
from section as S
where semester = 'Fall' and year= 2017 and
      exists (select *
              from section as T
              where semester = 'Spring' and year= 2018 and
                    S.course_id= T.course_id);
```

同理，`no exists`表示相反的用法

上述查询还说明了 SQL 的一个特性：

- 来自外层查询的相关名称（上述查询中的 `S`）可以用在 `where` 子句的子查询中。使用了来自外层查询的相关名称的子查询被称作**相关子查询（correlated subquery）**。

## 3.8.4 重复元组存在性测试

如果在作为参数的子查询结果中没有重复的元组，则unique 结构返回true值

```sql
select T.course_id
from course as T
where unique (select R.course_id
              from section as R
              where T.course_id= R.course_id and
                    R.year = 2017);
```

## 3.8.5 from 子句中的子查询

SQL 允在from 子句中使用子查询表达式。

> 原理：
>
> 任何 select-from-where 表达式返回的结果都是关系，因而可以被插入到另一个 select-from-where 中关系可以出现的任何位置。

```sql
select dept_name, avg_salary
from (select dept_name, avg (salary) as avg_salary
      from instructor
      group by dept_name)
where avg_salary > 42000;
```

## 3.8.6 with子句

with子句提供了一种定义临时关系的方式，这个定义只对包含with子句的查询有效。

> 可以将其理解为视图(view)或者局部变量

```sql
with max_budget (value) as
    (select max(budget)
     from department)
select budget
from department, max_budget
where department.budget = max_budget.value;
```

# 3.9 数据库的修改DDL

详见DDL
