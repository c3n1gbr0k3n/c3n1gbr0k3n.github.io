---
title: "沙盒机制"
description: ""
excerpt: ""
date: 2023-05-21T09:38:21+08:00
lastmod: 2023-05-21T09:38:21+08:00
draft: false
weight: 50
images: []
categories: []
tags: []
contributors: []
pinned: false
homepage: false
---

## 0x01 介绍

沙盒是计算机领域的虚拟技术，一般会将不信任的软件放入沙盒中运行，如果检测到软件的违规行为就会禁止程序进一步执行。这里的沙盒机制是针对于pwn题，由于程序运行最后都会通过系统调用来调用硬件资源，所以我们可以监控程序调用了哪些系统调用。如果程序执行了一些系统调用比如execve等，则直接end。
实现禁用系统调用的方法有两种，一种是通过prctl系统调用，还有一种是seccomp库

### prctl系统调用

它的函数原型为

```c
#include<sys/prctl.h>
int prctl(int option, unsigned long arg2, unsigned long arg3, unsigned long arg4, unsigned long arg5);
```

- option：要执行的操作标志
- arg2、arg3、arg4、arg5：根据不同的操作标志有不同的参数
- 返回值：执行成功返回0，执行失败返回-1

option的值有很多，具体的可以查看[Linux手册](https://man7.org/linux/man-pages/man2/prctl.2.html)，这里比较常用的是`PR_SET_NO_NEW_PRIVS`（38）限制了新程序的特权，使其不能超过原程序的特权，只需要设置arg2为1即可

```c
int prctl(PR_SET_NO_NEW_PRIVS, 1, 0, 0, 0);
```

还有一个值是PR_SET_SECCOMP（22），如果arg2为1的话，则表示只开启read、write、exit和sigreturn这几个系统调用。如果arg2为2的话则表示为过滤模式，主要根据arg3来过滤东西，arg3是一个`struct sock_fprog`类型指针，该结构体原型为

```c
#include<linux/filter.h>

struct sock_fprog {
    unsigned short      len;
    struct sock_filter *filter;
};
```

- len：表示过滤器个数
- filter：指向过滤器的指针，指向sock_filter数组

sock_filter结构体原型为

```c
struct sock_filter {    /* Filter block */
        __u16   code;   /* Actual filter code */
        __u8    jt;     /* Jump true */
        __u8    jf;     /* Jump false */
        __u32   k;      /* Generic multiuse field */
};
```

- code：指令码，即该指令的操作类型和参数类型
- jt：表示跳转条件，即如果该指令的操作结果为真，应该跳转到哪个指令执行
- jf：表示跳转条件，即如果该指令的操作结果为假，应该跳转到哪个指令执行
- k：表示参数，即该指令的操作参数

常见的code有

- BPF_LD：加载数据
- BPF_ABS：偏移
- BPF_JMP：跳转到指定的指令执行
- BPF_RET：返回结果并结束过滤
- BPF_W：4个字节
- BPF_H：2个字节
- BPF_B：1个字节
- BPF_K：常数

为了方便编写规则，BPF提供了两个比较容易使用的宏在`/usr/include/linux/bpf_common.h`文件中

```c
#ifndef BPF_STMT
#define BPF_STMT(code, k) { (unsigned short)(code), 0, 0, k }
#endif
#ifndef BPF_JUMP
#define BPF_JUMP(code, k, jt, jf) { (unsigned short)(code), jt, jf, k }
#endif
```

BPF_STMT针对于读取返回指令设置的，BPF_JUMP则是针对于跳转指令。我们尝试写一个过滤规则

```c
#include <linux/seccomp.h>
#include<linux/filter.h>

struct sock_filter filter[] = {
    BPF_STMT(BPF_LD | BPF_W | BPF_ABS, 0),
    BPF_JUMP(BPF_JMP | BPF_JEQ, __NR_read, 1, 0),
    BPF_STMT(BPF_RET | BPF_K, SECCOMP_RET_ALLOW),
    BPF_STMT(BPF_RET | BPF_K, SECCOMP_RET_KILL),
}
```

第一条过滤规则为BPF_LD读取BPF_W四个字节BPF_ABS从帧偏移量为0处，也就是将系统调用号存入累加器中
第二条规则为BPF_JEQ判断累加器即系统调用号是否等于read的系统调用号，如果为true则BPF_JMP一条指令，即执行第四条规则，否则BPF_JMP零条指令，即执行第三条规则
第三条规则为BPF_RET返回BPF_K常量值SECCOMP_RET_ALLOW即运行执行
第四条规则为BPF_RET返回BPF_K常量值SECCOMP_RET_KILL即拒绝运行
过滤规则这部分可以参考[Linux Socket Filtering aka Berkeley Packet Filter (BPF)](https://www.kernel.org/doc/html/latest/networking/filter.html)
写一个具体的例子来看

```c
#include <unistd.h>
#include <asm/unistd.h>
#include <sys/prctl.h>
#include <linux/seccomp.h>
#include <linux/filter.h>

int main(int argc, char *argv[]) {
    struct sock_filter filter[] = {
        BPF_STMT(BPF_LD | BPF_W | BPF_ABS, 0),
        BPF_JUMP(BPF_JMP | BPF_JEQ, __NR_write, 1, 0),
        BPF_STMT(BPF_RET | BPF_K, SECCOMP_RET_ALLOW),
        BPF_STMT(BPF_RET | BPF_K, SECCOMP_RET_KILL)
    };
    struct sock_fprog fprog = {
        .len = sizeof(filter)/sizeof(filter[0]),
        .filter = filter,
    };
    prctl(PR_SET_NO_NEW_PRIVS, 1, 0, 0, 0);
    prctl(PR_SET_SECCOMP, 2, &fprog, 0, 0);
    syscall(__NR_write, 1, "hello\n", 6);
    return 0;
}
// gcc prctl_test.c -o prctl_test
```

![3d1433bc1ec644e4da8d29d0a21ccbff](images/3d1433bc1ec644e4da8d29d0a21ccbff.png)

### Seccomp库

它用起来比prctl更方便，但是需要安装部分库

```bash
sudo apt-get install libseccomp-dev libseccomp2 seccomp
```

可以写一个简单的例子来看一下使用方法

```c
#include <linux/seccomp.h>
#include <seccomp.h>
#include <unistd.h>

int main() {
    // 初始化过滤器
    scmp_filter_ctx ctx = seccomp_init(SCMP_ACT_ALLOW);

    // 添加一条过滤规则，禁用 write 系统调用
    seccomp_rule_add(ctx, SCMP_ACT_KILL, SCMP_SYS(write), 0);

    // 加载 seccomp 过滤器
    seccomp_load(ctx);
    syscall(__NR_write, 1, "hello\n", 6);
    return 0;
}
// gcc sccomp_test.c -o seccomp_test -lseccomp
// 编译的时候需要指定库即 -lseccomp
```

scmp_filter_ctx是过滤器的结构体，所有的过滤信息都保存在里面
seccomp_init是初始化结构体，它可以初始化过滤器为白名单模式和黑名单模式，SCMP_ACT_KILL即白名单模式，只有在规则里的系统调用才会被允许执行；SCMP_ACT_ALLOW即黑名单模式，在规则里的系统调用会被禁用
seccomp_rule_add是添加规则，第二个参数是指这条规则匹配后要做的操作，SCMP_ACT_ERRNO表示在匹配后报一个特殊的错误，也可以直接填为SCMP_ACT_KILL，即直接kill，第三个参数是系统调用号，第四个参数是对目标系统调用的参数做出限制，这里由于是直接禁用该系统调用，所以填0即可
seccomp_load是加载过滤器

![e3f02893e2e39754c56d2c15a1aaf1aa](images/e3f02893e2e39754c56d2c15a1aaf1aa.png)

## 0x02 参考文章

https://bbs.kanxue.com/thread-258146.htm
