---
title: Container 환경에서의 JVM GC
description: 컨테이너 환경에서의 JVM GC는 무엇이 선택될까?
slug: container-gc
authors: dongle  
tags: [Kubernate, Container, JVM, Java]
image: https://i.imgur.com/mErPwqL.png
hide_table_of_contents: false
---
## Jdk 11의 GC는 무조건 G1GC죠!

당연히 우리의 어플리케이션의 GC는 당연히 G1GC를 쓰고 있겠지라고 한치의 의심없이 생각을 했었다. 아니 적어도 Jdk 11을 사용하면서 GC를 zgc vs g1gc를 뭘 써야 더 좋을까 이런 생각만 했었지 설마 **G1GC vs Serial Collector**를 고민을 하고 있을 줄이야! 꿈에서도 생각을 못했다. 결론부터 말하자면 Container 환경에서 Cpu와 메모리에 따라서 GC선택이 g1gc가 될 수도 있고 아닐 수도 있다.

<!--truncate-->

### 발단

일단 우리는 흔하디 흔한 `Kubernate`의 멋있는 오케스트라를 연주를 하며 `Container`환경에서 app을 배포하고 관리하고있다. 어느날 Slack에 크루 중 누군가가 우리 당연히 g1gc쓰고 있죠? 라고 올라와서 나는 엥? 당연한거 아닌가라고 생각을 하고 다른 일을 했는데 다른 크루가 우리 **Serial Collector** 인거 같은데요??? 라고 답장을 달았다.  

![아니 이게 뭔 개 소리야!](2022-05-02/Untitled.png)  


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

### Serail Collector

The serial collector uses a single thread to perform all garbage collection work, which makes it relatively efficient because there is no communication overhead between threads.

It's best-suited to single processor machines because it can't take advantage of multiprocessor hardware, although it can be useful on multiprocessors for applications with small data sets (up to approximately 100 MB). The serial collector is selected by default on certain hardware and operating system configurations, or can be explicitly enabled with the option `-XX:+UseSerialGC`.

가장 중요한 핵심은 **Single processor** 일 때 Best Suite이다. 물론 작은 메모리 데이터셋(up to approximately 100 MB)을 사용하는 어플리케이션에서는 멀티 프로세서일 경우 쓸만하긴하나 별로 사용을 안한다.

### G1GC

java 9 부터 채택한 default GC이다. 

The Garbage-First (G1) garbage collector is targeted for **multiprocessor machines** **with a large amount of memory**. It attempts to meet garbage collection pause-time goals with high probability while achieving high throughput with little need for configuration. G1 aims to provide the best balance between latency and throughput using current target applications and environments whose features include:

가장 중요한 핵심은 Gabage First GC은 높은 메모리 량과 다중 프로세서을 타겟으로 삼고, 빠른 처리를 지원하여 STW를 줄인다는 것이다.

### 원인

원인은 [RedHat문서](https://developers.redhat.com/articles/2022/04/19/java-17-whats-new-openjdks-container-awareness#tuning_defaults_for_containers)에서 찾을 수 있었는데

:::noteJava 11GC In Container
For Java 11+ it's also useful to know which GC is being used, and you can display this information via -Xlog:gc=info. For example, when container limits allow only a single CPU to be active, the Serial GC will be selected. `If more than one CPU is active and sufficient memory (at least 2GB) is allocated to the container, the G1 GC will be selected in Java 11 and later versions:`
:::note

Container환경에서는 CPU Core를 2개이상 사용하면서 Memory가 2G이상이여야 G1GC가 채택된다는 것이다.

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

### 변경

원인은 일단 알았으니까 기존에 따로 지정을 안했던CPU processor를 늘리고 메모리도 증가를 시킨 결과  

```bash
/ # java -XX:+PrintCommandLineFlags -version
Picked up JAVA_TOOL_OPTIONS: -javaagent:/opt/agent/apm-agent.jar
-XX:G1ConcRefinementThreads=2 -XX:GCDrainStackTargetSize=64 
...
-XX:+UseCompressedOops 
**-XX:+UseG1GC** 
openjdk version "11.0.13" 2021-10-19

OpenJDK 64-Bit Server VM (build 11.0.13+8-post-Debian-1deb11u1, mixed mode)
```

그 후 몇일 간격으로 모니터링을 해본 결과 

기존 SerialGC 사용 할 때에는 GC가 일어날 때 전반적으로 pause time이 길었습니다. 100ms 

![Untitled](2022-05-02/Untitled%201.png)  

변경 후  

![Untitled](2022-05-02/Untitled%202.png)  

더 모니터링을 해 봐야겠지만 다소 150ms나 먹었던 Major GC부분이 heap size 변경 및 cpu processor증가 GC 변경 후에 아직 일어나지 않았습니다.

참조  
[https://docs.oracle.com/javase/9/gctuning/available-collectors.htm#GUID-45794DA6-AB96-4856-A96D-FDE5F7DEE498](https://docs.oracle.com/javase/9/gctuning/available-collectors.htm#GUID-45794DA6-AB96-4856-A96D-FDE5F7DEE498)  
[https://johngrib.github.io/wiki/java-gc-tuning/#serial-collector](https://johngrib.github.io/wiki/java-gc-tuning/#serial-collector)  
[https://d2.naver.com/helloworld/1329](https://d2.naver.com/helloworld/1329) - Naver의 GC정리는 나만 읽고 싶은 Docs 중 하나  
[https://docs.oracle.com/javase/9/gctuning/garbage-first-garbage-collector.htm#JSGCT-GUID-0394E76A-1A8F-425E-A0D0-B48A3DC82B42](https://docs.oracle.com/javase/9/gctuning/garbage-first-garbage-collector.htm#JSGCT-GUID-0394E76A-1A8F-425E-A0D0-B48A3DC82B42)  
[https://www.oracle.com/technetwork/tutorials/tutorials-1876574.html](https://www.oracle.com/technetwork/tutorials/tutorials-1876574.html) g1gc  