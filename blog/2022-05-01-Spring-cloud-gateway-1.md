---
title: Request Rate Limiter를 만들어보자! 1편
description: Make Custom Rate Limiter With Spring Cloud Gateway 1
slug: RateLimiter1
authors: dongle  
tags: [SCG, Spring Cloud Gateway, Rate Limiter]
image: https://i.imgur.com/mErPwqL.png
hide_table_of_contents: false
---
[모든 소스](https://github.com/sk1737030/til/tree/master/./2022-05-01/spring-cloud-gateway-late-limiter)는 요기서 확인가능합니다. :)  

# Spring Cloud Gateway를 사용해서 API Limiter 구현을 해보자! 1편
## Api Limitier가 필요한 이유?

limiter는 왜 필요할까를 먼저 생각해보면 다양한 이유가 있겠지만, 정말 간단하게 생각해보면 10초 걸리는 헤비한 api가 있을 때 client들이 짧은 시간에 API를 무분별하게 요청하게 되면 우리의 서버는 ~~끔찍한 결말~~을 맞게 될 것이다.
<!--truncate-->
저런 단순한 이유말고도 사용자별 차등(A 사용자는 초당 3번 요청, B 사용자는 초당 30번 요청)을 줄 수도 있고 등등 여러 가지 이점이 생긴다. ~~그러므로 정말 꼭 하나쯤은 이참에 장만하시는 게~~

여러 다른 방법으로도 api limiter를 apllicaiton 단에서 구현할 수 있겠지만,  빠르고 정확하고 serializable하게  Api Limiter를 구현하는 건 정말 하나부터 열까지 생각해야 할 게 많고 **너무 어렵다**(~~나에게는~~). 

그렇다면, 어떻게 조금 쉽게 구현할 수 있는가를 찾아보면!!  

**[가상 면접 사례로 배우는 대규모 시스템 설계 기초라는 책에서](http://www.yes24.com/Product/Goods/102819435)**  힌트를 얻을 수 있는데, 
핵심은 `Redis + Lua Script`를 사용하여 구현하는 것이다.


:::note왜 Lua Script일까??
Redis Document에서 찾을 수 있는데, 루아 스크립트가 실행되는 동안 일단 레디스는 blocked 상태가 된다. 즉 레디스는 루아 스크립트가 atomic 하게 실행하는 걸 보장하기 때문에 RateLimite를 구현할 수 있게 된다.
:::note

그렇다면, 정말 조금만 더욱더 욕심을 내서 요즘같이 대 MS 시대에 여러 Applicaiton에 Route 역할도 하고 Gateway 역할도 하면서 거기에 더하여 Limiter까지 지원한다면 얼마나 좋을까? 
근데 그런 팔방미인의 무-친 캐리머신이 있으니

## [Spring Cloud Gateway](https://docs.spring.io/./2022-05-01/spring-cloud-gateway/docs/2.2.9.RELEASE/reference/html/)

Spring Cloud Gateway를 정말 정-말 간단하게  소개하면 그냥 Gateway 역할을 한다.

우리의 위키에는 Gateway를 설명 잘해놨는데, **게이트웨이**는 컴퓨터 다른 네트워크로 들어가는 입구 역할을 하는 네트워크 포인트이다. 넓은 의미로는 종류가 다른 네트워크 간의 통로의 역할을 하는 장치이다. 쉽게 예를 들자면 해외여행을 들 수 있는데 해외로 나가기 위해서 꼭 통과해야 하는 공항이 게이트웨이와 같은 개념이다. MSA환경에서 정말 빼놓을 수 없는 구현해야 할 애플리케이션 중 하나이다.

대표적인 기능으로 여러 가지가 있지만 내가 사용하는 기능들만 추리면  
- Router 역할
- 각종 Filter
- LB 기능
- Security

등등 진짜 수많은 기능을 제공하고 있으니 알아보면 나중에 한 번씩 써먹게된다. 

그 중 Gateway Filter 중에 RequestRateLimiter 라는 녀석이 있는데 이 녀석을 잘 써먹으면 손 한 번 까딱으로 Api Limiter가 짜란 구현이된다.

## Spring Gateway Limiter

기본적으로 Spring Gateway는 RateLimite를 Redis와 lua를 사용하여 구현을해놨는데 우리는 이걸로 사용하기만 하면 된다. 

```groovy title="build.gradle"
ext {
    set('springCloudVersion', "2020.0.5")
}

dependencies {
    implementation 'org.springframework.cloud:spring-cloud-starter-gateway'
    implementation 'org.springframework.boot:spring-boot-starter-data-redis-reactive'
    runtimeOnly 'com.h2database:h2'

    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testImplementation 'org.junit.jupiter:junit-jupiter:5.7.1'
}

dependencyManagement {
    imports {
        mavenBom "org.springframework.cloud:spring-cloud-dependencies:${springCloudVersion}"
    }
}

tasks.named('test') {
    useJUnitPlatform()
}
```

<br/>

### 기본 구현

```java
@Configuration
public class CustomUserKeyResolver() {
	@Bean
	KeyResolver userKeyResolver() {
		return exchange -> Mono.just(exchange.getRequest().getQueryParams().getFirst("userId"));	
	}
}
```

keyResolver를 세팅을 먼저 해준다.  
return해주는 key를 가지고 뒤에서 구분을 하므로 필수적으로 구현을 해야 한다.  
getParameter로 userId가 들어온다는 가정하에 구현하였다.



```yaml title="application.yml"
spring:
  cloud:
    gateway:
      routes:
      - id: rate_limiter_route
        uri: http://localhost:19000
        filters:
        - name: RequestRateLimiter
          args:
            key-resolver: "#{@userKeyResolver}"
            redis-rate-limiter.replenishRate: 1
            redis-rate-limiter.burstCapacity: 10
            redis-rate-limiter.requestedTokens: 1
```

`key-resolver` 우리가 선언한 bean이름을 주입 해 준다.  
`requestedTokens` 요청시에 소모되는 토큰의 개수  
`burstCapacity` 버킷의 담겨져있는 최대량  
`replenishRate` 초당 버킷 회복량   

<br/>

:::noteRateLimiter 알고리즘
  `[Token bucket` 알고리즘을](https://dev.to/satrobit/rate-limiting-using-the-token-bucket-algorithm-3cjh) 따른다.
:::note

<br/>

설정을 다 했으니 한 번 요청을 해보면

![Untitled](./2022-05-01/spring-cloud-gateway/Untitled%201.png)

설정한 burstCapacity 10 에서 -1 이 된 9가 remain으로 header에 응답이 오게 된다.  
돌아오는 응답 헤더가 궁금하면 `RedisRateLimiter` 에 선언되어있는 Header에서 추가로 확인할 수 있습니다.

![Untitled](./2022-05-01/spring-cloud-gateway/Untitled%202.png)
<br/>

### 그렇다면 레디스에 저장은 어떻게될까❓

일단 레디스에 저장되는 데이터 셋을 본다면  
![redis data](./2022-05-01/spring-cloud-gateway/Untitled%203.png)

왜 이렇게 저장되는지는 `RedisRateLimiter.java`에 `getKeys`라는 메소드에서 확인할 수 있는데 

![Untitled](./2022-05-01/spring-cloud-gateway/Untitled%204.png)
<br/><br/><br/>

이상으로 우리의 레디스를 활용한 ~~우아하고 깔끔한~~ **RateLimiter**가 완성됐다!  
<br/>


![Untitled](./2022-05-01/spring-cloud-gateway/Untitled%205.png)   
<br/><br/><br/>
<br/><br/><br/>


사실 요기까지만해도 그냥 쓰기에도 나쁘지 않지만 조금 아쉽다.  
그러나 우리의 기획자나 비지니스 요구사항은 이렇게 간단하지 않다. 

예를 들어,  
1. 특정 사용자의 주식 조회 요청을 분당 1번으로 설정을 하고 주식 주문을 초당 1번만 가능하다던지 
2. 속도 문제로 복잡하고 리소스가 많이 드는 요청일 경우 분당 1번만 요청하게 한다던지 
3. 지금 redis에는 timestamp와 tokenKey 2개만 들어가 있는데 다른 추가적인 정보도 넣고 싶다든지
4. Redis TTL을 더 길게 잡는다든지
5. User 별로 요청량을 다르게 하고 싶다든지 

냉혹한 비즈니스 세계에서는 이것보다도 더 많은 **Limiter**로써의 더 많은 **역할**과 **책임** 을 요구하게 되는데, 기본적으로 제공하는 `RateLimiter`로는 작업이 어렵다. 그래서 조금의 커스텀을 해야 할 필요가 있다. 


[Request Rate Limiter를 만들어보자! 2편](https://sk1737030.github.io/RateLimiter2)