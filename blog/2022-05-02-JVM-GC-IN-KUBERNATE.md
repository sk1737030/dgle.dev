---
title: Container 환경에서의 JVM GC
description: 컨테이너 환경에서의 JVM GC는 어떻게 되는지 알아보자.
slug: container-gc
authors: dongle  
tags: [Kubernate, Container, JVM, Java]
image: https://i.imgur.com/mErPwqL.png
hide_table_of_contents: false
---

작성중에 있습니다.

## Jdk 11에서의 GC는 무조건 G1GC죠!

당연히 GC를 G1GC를 쓰고 있겠지라고 한치의 의심없이 생각을 했었다. 아니 적어도 Jdk 11을 사용하면서 GC를 zgc vs g1gc를 뭘 써야 더 좋을까 이런 행복회로만 했었지 설마 **Serial Collector**를 고민을 하고 있을 줄이야 꿈에서도 생각을 못했다. ****결론부터 말하자면 Container 환경에서 메모리와 Cpu에 따라서  g1gc를 쓸 수도 아닐 수도 있다.
<!--truncate-->

### 발단

일단 우리는 흔하디 흔한 `Kubernate`의 멋있는 오케스트라를 연주를 하며 `Container`환경에서 app을 배포하고 관리하고있다. 어느날 Slack에 크루 중 누군가가 우리 당연히 g1gc쓰고 있죠? 라고 올라와서 나는 엥? 당연한거 아닌가라고 생각을 하고 다른 일을 했는데 다른 크루가 우리 **Serial Collector** 인거 같은데요??? 라고 답장을 달았다.  

![아니 이게 뭔 개 소리야!](./2022-05-02/images/Untitled.png)

<!-- <img src="./2022-05-02/images/Untitled.png" height="100px" width="300px" /> -->

아니 이게 뭔 X 소리야!

### 정말일까?

나는 우리 jdk11버전 쓰는데? 그럴리가 있어? 에이 잘못 봤겠지라고 생각을 하고 좋아 내 눈으로 확인을 해봐야지라며 container에  들어가서 확인을 해 봤는데

```bash
> java -XX:+PrintCommandLineFlags -version

Picked up JAVA_TOOL_OPTIONS:
...
-XX:+SegmentedCodeCache 
-XX:+UseCompressedClassPointers 
-XX:+UseCompressedOops 
**-XX:+UseSerialGC** 

openjdk version "11.0.13" 2021-10-19
OpenJDK Runtime Environment (build 11.0.13+8-post-Debian-1deb11u1)
OpenJDK 64-Bit Server VM (build 11.0.13+8-post-Debian-1deb11u1, mixed mode)
```

일단 다른 Java_Tool Option이 있었지만 다 생략하고 먼저 OpenJdk 사용 중이고 Version은 11.0.13을 사용하는 걸 확인 하고, 옵션을 봤는데 `-XX:+UseSerialGC`  (~~아니 형이 왜 요기서 나와~~)  

### 의심

너무 놀라서, 지금 생각해보면 말도안되는 여러 의심들을 했는데 

1. 저 JDK 버전이 문제가 있어서 무조건 SerialGC를 주입 할 것이다.
    - 라고 생각을 했지만, 사실 말도 안된다 무슨 동네 OpenJdk도 아니고 이 생각은 금방 넘어갔다
2. 누군가가 주입을 했을 것이다.
    - 누군가가 build를 할 때 주입을 해놨을 거라고 생각을 하고 build부분을 유심히 봤지만 SerialGC의 S도 찾아 볼 수 없었다.
3. 저 옵션이 보여주는건 가짜야!

등등 진짜 말도안되는 의심들을 하기 시작했다.

### 침착

사실 위에 저런 의심말고도 여러 가정과 수 많은 의심들을 했었다. 그러다가 현실을 받아들이고 왜 SerialGC를 사용 하게 되었을까라고 생각을 했다. 사실 난 나보다 Kube환경에서의 Container가 자동으로 **저렇게 설정한 이유가 있겠지라고** 더 믿기 때문에 오랜만에 SeraliGC와 G1GC를 다시 확인 해 보기로 했다.

### SerailGC

### G1GC

### 원인

원인은 [RedHat문서](https://developers.redhat.com/articles/2022/04/19/java-17-whats-new-openjdks-container-awareness#tuning_defaults_for_containers)에서 찾을 수 있었는데

<aside>
💡 For Java 11+ it's also useful to know which GC is being used, and you can display this information via -Xlog:gc=info. For example, when container limits allow only a single CPU to be active, the Serial GC will be selected. `If more than one CPU is active and sufficient memory (at least 2GB) is allocated to the container, the G1 GC will be selected in Java 11 and later versions:`

</aside>

CPU Core를 2개이상이면서 Memory가 2G이상이여야 G1GC가 채택된다는 것이다.

[아마도  코드에서는 이런 느낌이지 않을까](https://developers.redhat.com/articles/2022/04/19/best-practices-java-single-core-containers#the_jvm_as_a_dynamic_execution_platform)

```bash
void GCConfig::select_gc_ergonomically() {
  if (os::is_server_class_machine()) {
#if INCLUDE_G1GC
    FLAG_SET_ERGO_IF_DEFAULT(UseG1GC, true);
#elif INCLUDE_PARALLELGC
    FLAG_SET_ERGO_IF_DEFAULT(UseParallelGC, true);
#elif INCLUDE_SERIALGC
    FLAG_SET_ERGO_IF_DEFAULT(UseSerialGC, true);
#endif
  } else {
#if INCLUDE_SERIALGC
    FLAG_SET_ERGO_IF_DEFAULT(UseSerialGC, true);
#endif
  }
}

// This is the working definition of a server class machine:
// >= 2 physical CPU's and >=2GB of memory
```