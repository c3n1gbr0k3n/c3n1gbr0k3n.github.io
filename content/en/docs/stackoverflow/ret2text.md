---
title: "ret2text"
description: ""
lead: ""
date: 2020-10-06T08:48:57+00:00
lastmod: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
  docs:
    parent: "stackoverflow"
weight: 1
toc: true
---

## 0x01 介绍

既然溢出可以覆盖局部变量，即利用栈三大功能之一保存局部变量，那么也可以利用栈三大功能之一保存函数返回后的地址，我们可以溢出覆盖函数返回后的地址为任意我们想要它返回执行的地方，从而实现getshell

![1af992215335770bc01df475475fa9e1](images/1af992215335770bc01df475475fa9e1.png)

举一个例子来说

```c
#include<stdio.h>
#include<stdlib.h>

void getshell() {    // getshell函数
    system("/bin/sh");
}

void run(){    // 写run函数的目的是为了简化，因为现在32位main函数需要绕过ecx
    char buf[0x10];    // local variable
    printf("input: ");
    scanf("%s", buf);
}

int main(){
    run();
    return 0;
}
// gcc ret2text.c -o ret2text -m32 -fno-pic -no-pie -fno-stack-protector
```

按照正常的程序流程来说，main函数应该会返回执行\_libc\_start\_main中的指令，但是scanf的%s格式化控制符是可以无字符数限制输入造成栈溢出的，这样我们就可以想办法覆盖main函数的函数返回地址为程序中getshell函数的地址，从而执行 `system("/bin/sh");`
首先需要的是确定getshell函数的位置，这里可以用objdump之类的工具来查看

![3cd18b5ddfdc7a98e374380aabba5015](images/3cd18b5ddfdc7a98e374380aabba5015.png)
