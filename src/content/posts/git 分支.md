---
title: git 分支
published: 2025-04-27
discription: 
category: 指南
tags: [git]
---
*请求出错: Expecting value: line 1 column 1 (char 0)*——*未知*

## 查看本地分支

```
git branch
```

## 查看远端分支

```
git branch -r
```

不过如果一开始的仓库没有同步，很多旧版本仓库会将master作为主分支，这个时候 `git branch -r`是找不到当前分支的

此时需要同步远程仓库和本地

```
git fetch <_name>
```

name是当前远程仓库的名字，即之前的origin

## 切换分支

此时通过checkout或者switch即可切换分支

```
git checkout main
//
git switch main
```

### 推送到不同仓库情况

默认同名时：

```
git push origin <branch_name>
```

推送不同名时：

```
git push origin <local_branch_name>:<remote_branch_name>
```
