---
title: 数据库系统概念 中级SQL
published: 2025-11-20
description: 第四章 有更复杂形式的SQL查询、 视图定义、 事务、完整性约束，以及关于SQL 数据定义和授权的更多详细信息。
category: 指南
tags: ['DataBase']
---
*Till ~ ~ ~ I found her*

# 4.1 连接表达式

*允许程序员以一种更自然的方式编写一些查询，并表达某些只用笛卡儿积很难表达的查询。*

## 4.1.1 自然连接

自然连接只考虑在两个关系的模式中都出现的那些属性上取值相同的元组对，并**会去除重复的属性（连接那一个判断）**

```sql
student natural join takes
```

多表连接时可以使用：

```sql
select name, title
from student natural join takes, course
where takes.course_id = course.course_id;
```

## 4.1.2 连接条件

join on 用于指定任意的连接条件

```sql
select *
from student join takes on student.ID = takes.ID;
```

但是使用 on 不会**去重**，即 `ID`属性出现了两次，一次是 `student`中的，另一次是 `takes`中的

## 4.1.3 外连接

**外连接（outer join）**运算通过在结果中**创建包含空值的元组**，来保留那些在连接中会丢失的元组。

> 如果被转换成集合可能更好理解

共有三种形式的外连接：

* **左外连接（left outer join）**只**保留出现**在左外连接运算之前 **（左边）** 的关系中的元组。
* **右外连接（right outer join）**只**保留出现***在右外连接运算之后 **（右边）** 的关系中的元组。
* **全外连接（full outer join）** 保留出现在两个关系中的元组。

> 不保留未匹配元组的连接运算被称作内连接（inner join）运算，即直接join

外连接用法类似如下，

```sql
select *
from student natural left outer join takes;
```

此结果中包含所有学生，但是在Snow 对应的元组 ，那些只出现在takes 关系模式中的属性取空值

> 另外同理，不包含natural 声明的连接查询会多出一个匹配的属性，即保留连接中的判别属性

## 4.1.4 连接类型和条件

为了把常规连接和外连接区分开来，在SQL 中把常规连接称作内连接。

当  join 子句中没有使用 outer 前缀时，缺省的连接类型是内连接。

# 4.2 视图

视图和with属性声明类似，就像定义了一个可供调用的查询变量

> SQL 允许通过查询来定义一种“虚拟关系”，它在概念上包含查询的结果。 该虚拟关系并不预先计算和存储，而是在使用虚拟关系的时候才通过执行查询计算出来。

但视图与with语句的不同之处在于：视图一旦创建，在被显式删除之前就一直是可用的。由with定义的命名子查询对于定义它的查询来说只是本地可用的。

## 4.2.1 视图定义

定义视图：

```sql
create view v as <查询表达式>;
```

## 4.2.2 在 SQL 查询中使用视图

* 当我们定义一个视图时，数据库系统**存储视图本身的定义**，而不存储定义该视图的查询表达式的求值结果。
* 一旦视图关系出现在查询中，它就**被已存储的查询表达式代替**。
* 因此，每当我们计算这个查询时，视图关系都被**重新计算**。

## 4.2.3 物化视图

物化视图（materialized view)：如果用于定义视图的实际关系发生改变，则视图也跟着修改以保持最新

保持物化视图一直在最新状态的过程称为物化视图维护（materialized view maintenance),或者通常简称为视图维护（view maintenance)

## 4.2.4 视图更新

如果定义视图的查询对下列条件都能满足，那么就称SQL 视图是可更新的：

* `from` 子句中只有一个数据库关系。
* `select` 子句中只包含关系的属性名，并不包含任何表达式、聚集或 `distinct` 声明。
* 没有出现在 `select` 子句中的任何属性都可以取 `null` 值；也就是说，这些属性没有非空约束，也不构成主码的一部分。
* 查询中不含有 `group by` 或 `having` 子句。

可以通过在视图定义的末尾包含 `with check option` 子句的方式来定义视图；这样，如果向视图中插入一条不满足视图的 `where` 子句条件的元组，则数据库系统会拒绝该插入操作。

类似地，如果新值不满足 `where` 子句的条件，则更新也会被拒绝。

# 4.3 事务

事务（transaction）由查询和（或）更新语句的序列组成

* `commit work` 提交当前事务；也就是说，它使事务执行的更新在数据库中成为永久性的。在事务被提交后，一个新的事务会自动开始。
* `rollback work` 回滚当前事务；也就是说，它会撤销事务中 SQL 语句执行的所有更新。因此，数据库状态被恢复到它执行该事务的第一条语句之前的状态。

> 关键字 `work` 在两条语句中都是可选的。

# 4.4 完整性约束

* **完整性约束（integrity constraint）**：保证授权用户对数据库所做的修改不会导致数据一致性的丢失

> 防止对数据的意外破坏

* **安全性约束**防止未经授权的用户访问数据库。

DDL中的额外条件

## 4.4.1 单个关系上的约束

create table 完整性约束包括：

* `not null`；
* `unique`；
* `check(<谓词>)`。

### 非空约束

```sql
name varchar(20) not null
budget numeric(12,2) not null
```

非空（`not null`）约束禁止对该属性插入空值，并且它是域约束（domain constraint）的一个示例。

可能导致向一个声明为非空的属性插入空值的任何数据库修改都会产生错误诊断信息。

### 唯一性约束

$$
\text{unique } (A_{j_1}, A_{j_2}, \dots, A_{j_m})
$$

唯一性（`unique`）声明指出属性 $A_{j_1}, A_{j_2}, \dots, A_{j_m}$ 形成了一个**超键**；也就是说，在关系中没有两个元组能在所有列出的属性上取值相同。然而声明了唯一性的属性允许为 `null`，除非它们已被显式地声明为非空。请回忆一下，空值并不等于其他的任何值。（这里对空值的处理与对3.8.4节中定义的 `unique` 结构的处理一样。）

### check 子句

当应用于关系声明时， `check(P）`子句指定一个谓词P，关系中的每个元组都必须满足谓词 P

```sql
create table section
(
    course_id    varchar(8),
    sec_id       varchar(8),
    semester     varchar(6),
    year         numeric(4,0),
    building     varchar(15),
    room_number  varchar(7),
    time_slot_id varchar(4),
    primary key (course_id, sec_id, semester, year),
    check (semester in ('Fall', 'Winter', 'Spring', 'Summer'))
);
```

* 未满足问题：如果check子句不为假，则它是满足的，因此计算结果为未知的子句也是满足的。 如果不需要空值，则必须指定单独的非空约束
* 声明位置：check子句可以单独出现，也可以作为属性声明的一部分出现
* check子句中的谓词可以是包括子查询在内的任意谓词

## 4.4.2 引用完整性

保证一个关系（引用关系）中给定属性集合的取值也在另一个关系（被引用关系）的特定属性集的取值中出现

外码是引用完整性约束的一种形式，其中被引用的属性构成被引用关系的主码

```sql
foreign key (dept_name) references department(dept_name)
```

然而，这个被指定的属性列表必须声明为被引用关系的超码，要么使用主码约束，要么使用唯一性约束来进行这种声明。在更为普遍的引用完整性约束形式中，被引用的属性不必是候选码，但这样的形式不能在 SQL 中直接声明。

### 删除

* 默认：当违反引用完整性约束时，通常的处理是**拒绝执行导致破坏完整性的操作**（即执行更新操作的**事务被回滚**）
* 但是，在外码（`foreign key`）子句中可以指明：如果被引用关系上的删除或更新操作违反了约束，那么系统必须采取一些措施来改变引用关系中的元组以恢复完整性约束，而不是拒绝这样的操作。请考虑 `course`关系上一个完整性约束的如下定义：

```sql
create table course
(
    ...
    foreign key (dept_name) references department
        on delete cascade
        on update cascade,
    ...
);
```

由于有了与外码声明相关联的级联删除（`on delete cascade`）子句，如果删除 `department`中的一个元组导致违反了这种引用完整性约束，则系统并不拒绝该删除，而是对 `course`关系做“级联（cascade）”删除，即删除引用了被删除系的元组。

* 类似地，如果更新被约束引用的字段时违反了约束，则系统并不拒绝更新操作，而是将 `course`中引用元组的 `dept_name`字段也改为新值。
* SQL还允许外码（`foreign key`）子句指定除级联以外的其他动作，如果约束被违反，可将引用域（这里是 `dept_name`）置为 `null`（通过用 `set null`代替 `cascade`），或置为该域的缺省值（通过使用 `set default`）。


### 完整性约束SQL查询

* 普通**函数依赖**
  * 检验**非箭头侧**的表中**唯一性**
  * ```sql
    SELECT 
        MAX(A.Unique_MFGR_Count) AS Max_Unique_MFGR_Count
    FROM (
        SELECT 
            P_BRAND,
            COUNT(DISTINCT P_MFGR) AS Unique_MFGR_Count
        FROM 
            PART
        GROUP BY 
            P_BRAND
    ) AS A;

    ```
* **主键**依赖
  * 检验主键在表中的**唯一性**
  * 通过 where xx is null **检验非空状态**
  * ```sql
    select l_orderkey, count(*) 
    from lineitemcopy1
    group by (l_orderkey, l_linenumber) 
    having count(*)>1;

    select * from lineitemcopy1 
    where l_orderkey is null 
    and l_linenumber is null;

    ```
* **外键**依赖
  * 检验外键表中的取值是否**都出现在了主键表**中
  * ```sql
    select count(O_CUSTKEY) 
    from orderscopy1 
    where O_CUSTKEY 
    not in 
    ( select C_CUSTKEY from customercopy1 );

    ```


## 4.4.3 给约束赋名

命名约束：在约束的前面使用关键字 `constraint` 和我们希望为其赋予的名称

例如，如果我们希望将名称 `minsalary` 赋给 `instructor` 的 `salary` 属性上的 `check` 约束，那么可以将对 `salary` 的声明修改为：

```sql
salary numeric(8,2), constraint minsalary check (salary > 29000),
```

之后，如果我们决定不再需要这个约束，那么可以写为：

```sql
alter table instructor drop constraint minsalary;
```

# 4.5 SQL 的数据类型与模式

## 4.5.1 SQL 中的日期和时间类型

除了我们在 3.2 节中介绍过的基本数据类型以外，SQL 标准还支持与日期和时间相关的几种数据类型。

* 日期（`date`）：日历日期，包括年（四位）、月和月中的日。
* 时间（`time`）：一天中的时间，用时、分和秒来表示。可以用变量 `time(p)` 来指定秒的小数点后的数字位数（缺省值为 0）。通过指定 `time with timezone`，还可以把时区信息连同时间一起存储。
* 时间戳（`timestamp`）：`date` 和 `time` 的结合。可以用变量 `timestamp(p)` 来指定秒的小数点后的数字位数（缺省值为 6）。如果指定 `with timezone`，则时区信息也会被存储。

日期和时间类型的值可按如下方式说明：

```sql
date '2018-04-25'
time '09:30:00'
timestamp '2018-04-25 10:29:01.45'
```

我们可以利用 `extract (field from d)` 来从 `date` 或 `time` 值 **`d`** 中提取出单独的域，这里的域（`field`）可以是 `year`、`month`、`day`、`hour`、`minute` 或 `second` 中的一种。时区信息可以用 `timezone_hour` 和 `timezone_minute` 来提取。

SQL 定义了一些函数来获取当前的日期和时间。例如，`current_date` 返回当前日期，`current_time` 返回当前时间（带有时区），还有 `localtime` 返回当前的本地时间（不带时区）。时间戳（日期加上时间）由 `current_timestamp`（带有时区）以及 `localtimestamp`（本地日期加时间，不带时区）返回。

## 4.5.2 类型转换和格式化函数

使用形如 `cast(e as t)`的表达式来将表达式 e 转换为类型 t

可以使用coalesce函数来选择在查询结果中输出空值的方式。 该函数接收任意数量的参数（所有参数必须是相同的类型），并返回第一个非空参数。

## 4.5.3 缺省值

SQL 允许为属性指定**缺省**（`default`）值，如下面的 `create table` 语句所示：

```sql
create table student
(
    ID        varchar(5),
    name      varchar(20) not null,
    dept_name varchar(20),
    tot_cred  numeric(3,0) default 0,
    primary key (ID)
);
```

# 4.6 SQL 中的索引定义

索引（index）:允许数据库系统高效地找到在关系中具有该属性指定值的那些元组，而不扫描关系的所有元组

### 创建

我们使用 `create index` 命令来创建索引，形式为：

```sql
create index <索引名> on <关系名>(<属性列表>);
```

属性列表是构成索引搜索码的关系属性的列表。

为了在 `instructor` 关系上定义以 `dept_name` 为搜索码的、名为 `dept_index` 的索引，我们写作：

```sql
create index dept_index on instructor (dept_name);
```

### 删除

我们为一个索引指定的索引名在撤销索引时需要用到。`drop index` 命令采用的形式是：

```sql
drop index <索引名>;
```

# 4.7 授权

## 4.7.1 权限的授予与收回

SQL 标准包括选择（`select`）、插入（`insert`）、更新（`update`）和删除（`delete`）权限。所有权限（`all privilege`）这样的权限可以用作允许所有权限的简写形式。一个创建了新关系的用户将被自动授予该关系上的所有权限。

### 授权

授权（`grant`）语句用来授予权限。此语句的基本形式为：

```sql
grant <权限列表>
on <关系名或视图名>
to <用户/角色列表>;
```

权限列表（`privilege list`）允许在一条命令中授予多个权限。角色的概念将在 4.7.2 节中介绍。

关系上的选择权限用于读取关系中的元组。下面的授权语句给数据库用户 Amit 和 Satoshi 授予了 `department` 关系上的选择权限：

```sql
grant select on department to Amit, Satoshi;
```

### 收权

我们使用收权（`revoke`）语句来收回权限。此语句的形式与授权几乎是一样的：

```sql
revoke <权限列表>
on <关系名或视图名>
from <用户/角色列表>
```

因此，为了收回前面我们所授予的那些权限，我们写作：

```sql
revoke select on department from Amit, Satoshi;
revoke update (budget) on department from Amit, Satoshi;
```

## 4.7.2 角色

在 SQL 中创建角色如下所示：

```sql
create role instructor;
```

然后角色就可以像用户那样被授予权限，如这条语句所示：

```sql
grant select on takes
to instructor;
```

角色可以授予用户，也可以授予其他角色，如这些语句所示：

```sql
create role dean;
grant instructor to dean;
grant dean to Satoshi;
```

因此，一个用户或一个角色的权限包括：

* 直接授予该用户/角色的所有权限。
* 授予该用户/角色所拥有的角色的所有权限。
