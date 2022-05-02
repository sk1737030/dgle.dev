---
title: Request Rate Limiter를 만들어보자!
description: Make Custom Rate Limiter With Spring Cloud Gateway
slug: RateLimiter
authors: dongle  
tags: [SCG, Spring Cloud Gateway, Rate Limiter]
image: https://i.imgur.com/mErPwqL.png
hide_table_of_contents: false
---
[모든 소스](https://github.com/sk1737030/til/tree/master/./2022-05-01/spring-cloud-gateway-late-limiter)는 요기서 확인가능합니다. :)  

# Spring Cloud Gateway를 사용해서 API Limiter 구현을 해보자!
## Api Limitier가 필요한 이유?

limiter는 왜 필요할까를 먼저 생각해보면 다양한 이유가 있겠지만, 정말 간단하게 생각해보면 10초 걸리는 헤비한 api가 있을 경우 client들이 짧은 시간에 api를 무분별하게 요청하게되면 우리의 서버는 ~~끔찍한 결말~~을 맞게 될 것이다.
<!--truncate-->
저런 단순한 이유말고도 유저별 차등(A유저는 초당 3번 요청, B유저는 초당 30번 요청)을 줄 수도 있고 등등 여러가지 이점이 생긴다. ~~그러므로 정말 꼭 하나쯤은 이참에 장만하시는 게~~

여러 다른 방법으로도 api limiter를 apllicaiton 단에서 구현 할 수 있겠지만,  빠르고 정확하고 serializable하게  Api Limiter를 구현하는 건 정말 하나부터 열까지 생각해야 할게 많고 **너무 어렵다**(~~나에게는~~). 

그렇다면, 어떻게 조금 쉽게 구현 할 수 있는가를 찾아보면!!  

**[가상 면접 사례로 배우는 대규모 시스템 설계 기초라는 책에서](http://www.yes24.com/Product/Goods/102819435)**  힌트를 얻을 수 있는데, 
핵심은 `Redis + Lua Script`를 사용하여 구현을 하는 것이다.


:::note왜 Lua Script일까??
redis document에서 찾을 수 있는데, 루아 스크립트가 실행 되는 동안 일단 레디스는 blocked 상태가 된다.  즉 레디스는 루아 스크립트가 atomic 하게 실행하는 걸 보장하기 때문에 RateLimite를 구현 할 수 있게 된다.
:::note

그렇다면, 정말 조금만 더 더 욕심을 내서 요즘같이 대 MS시대에 여러 Applicaiton에 Route 역할도 하고 Gateway 역할도 하면서 거기에 더하여 Limiter까지 지원한다면 얼마나 좋을까? 
근데 그런 팔방미인의 무-친 캐리머신이 있으니

## [Spring Cloud Gateway](https://docs.spring.io/./2022-05-01/spring-cloud-gateway/docs/2.2.9.RELEASE/reference/html/)

Spring Cloud Gateway를 정말 정-말 간단하게  소개하면 그냥 Gateway 역할을 한다.

우리의 위키에는 Gateway를 설명 잘 해놨는데, **게이트웨이**는 컴퓨터 다른 네트워크로 들어가는 입구 역할을 하는 네트워크 포인트이다. 넓은 의미로는 종류가 다른 네트워크 간의 통로의 역할을 하는 장치이다. 쉽게 예를 들자면 해외여행을 들 수 있는데 해외로 나가기 위해서 꼭 통과해야하는 공항이 게이트웨이와 같은 개념이다. MSA환경에서 정말 빼놓을 수 없는 구현해야할 어플리케이션 중 하나이다.

대표적인 기능으로 여러가지가 있지만 내가 사용하는 기능들만 추리면  
- Router 역할
- 각종 Filter들
- LB기능
- Security

등등 진짜 수 많은 기능을 제공하고있으니 알아보면 나중에 한 번씩 써먹게된다. 

그 중 Gateway Filter중에 RequestRateLimiter라는 녀석이 있는데 이 녀석을 잘 써먹으면 손 한 번 까딱으로 Api Limiter가 짜란 구현이된다.

## Spring Gateway Limiter

기본적으로 Spring Gateway는 RateLimite를 Redis와 lua를 사용하여 구현을 해놨는데 우리는 이걸 가지고 사용하기만하면 된다. 

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
return해주는 key를 가지고 뒤에서 구분을 하기 때문에 필수적으로 구현을 해야한다.  
getParameter로 userId가 들어온다는 가정하에 구현을 하였다.



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

설정한 burstCapacity 10 에서 -1 이된 9가 remain 으로 header에 응답이 오게 된다.  
돌아오는 응답 헤더가 궁금하면 `RedisRateLimiter` 에 선언되어있는 Header에서 추가로 확인이 가능합니다.

![Untitled](./2022-05-01/spring-cloud-gateway/Untitled%202.png)
<br/>

### 그렇다면 레디스에 저장은 어떻게될까❓

일단 레디스에 저장되는 데이터 셋을 본다면  
![redis data](./2022-05-01/spring-cloud-gateway/Untitled%203.png)

왜 이렇게 저장되는지는 `RedisRateLimiter.java`에 `getKeys`라는 메소드에서 확인 할 수 있는데 

![Untitled](./2022-05-01/spring-cloud-gateway/Untitled%204.png)
<br/><br/><br/>

이상으로 우리의 레디스를 활용한 ~~우아하고 깔끔한~~ **RateLimiter**가 완성 됐다!  
<br/>


![Untitled](./2022-05-01/spring-cloud-gateway/Untitled%205.png)   
<br/><br/><br/>
<br/><br/><br/>


사실 요기까지만해도 그냥 쓰기에도 나쁘지 않지만 조금 아쉽다.  
그러나 우리의 기획자나 비지니스 요구사항은 이렇게 간단하지 않다. 




예를 들어,  
1. 특정 유저의 주식 조회 요청을 분당 1번으로 설정을하고 주식 주문을 초당 1번만 가능하다던지 
2. 속도 문제로 복잡하고 리소스가 많이 드는 요청일 경우 분당 1번만 요청하게 한다던지 
3. 지금 redis에는 timestamp와 tokenKey 2개만 들어가있는데 다른 추가적인 정보도 넣고 싶다던지
4. Redis TTL를 더 길게 잡는다던지
5. User 별로 요청량을 다르게 하고 싶다던지 

냉혹한 비즈니스 세계에서는 이것보다도 더 많은 **Limiter**로써의 더 많은 **역할**과 **책임** 을 요구하게 되는데, 기본적으로 제공하는 `RateLimiter`로는 작업이 어렵다. 그래서 조금의 커스텀을 해야 할 필요가 있다. 

## Custom Redis limiter

그렇다면 어떻게 저런 요구사항을 구현을 할 수 있을까? 

심플하면서 간단하게(~~평범하면서도 우아하게~~) 구현을 하면 

### Custom

우선적으로 우리는 잘 구현되어있는`RedisRateLimiter`를 상속받아서 사용한다.

```java title="CustomRedisRateLimiter.java"
@Configuration
@Slf4j
public class CustomRedisRateLimiter extends RedisRateLimiter {
	...
}
```

만약 **User** 별로 요청량을 다르게 한다면 우리는 수정해야 할 메소드가 크게 두 개가 있는데  
먼저 **isAllowed**, **loadConfiguration** 이 두개의 메소드를 수정해야 한다.

```java title="CustomRedisRateLimiter.java"
@Configuration
@Slf4j
public class CustomRedisRateLimiter extends RedisRateLimiter {
    ...
    
    private final Config userAConfig = new Config().setBurstCapacity(10).setReplenishRate(1).setRequestedTokens(1);
    private final Config commonUserConfig = new Config().setBurstCapacity(1).setReplenishRate(1).setRequestedTokens(1);

    @Override
    public Mono<Response> isAllowed(String routeId, String id) {
        Config routeConfig = loadConfiguration(routeId, id);

        int replenishRate = routeConfig.getReplenishRate();
        int burstCapacity = routeConfig.getBurstCapacity();
        int requestedTokens = routeConfig.getRequestedTokens();

        try {
            List<String> keys = getKeys(id);

            List<String> scriptArgs = Arrays.asList(replenishRate + "", burstCapacity + "", "", requestedTokens + "");
            Flux<List<Long>> flux = redisTemplate.execute(this.script, keys, scriptArgs);
            return flux.onErrorResume(throwable -> {
                if (log.isDebugEnabled()) {
                    log.debug("Error calling rate limiter lua", throwable);
                }
                return Flux.just(Arrays.asList(1L, -1L));
            }).reduce(new ArrayList<Long>(), (longs, l) -> {
                longs.addAll(l);
                return longs;
            }).map(results -> {
                boolean allowed = results.get(0) == 1L;
                Long tokensLeft = results.get(1);

                Response response = new Response(allowed, getHeaders(routeConfig, tokensLeft));

                if (log.isDebugEnabled()) {
                    log.debug("response: " + response);
                }
                return response;
            });
        } catch (Exception e) {
            log.error("Error determining if user allowed from redis", e);
        }

        return Mono.just(new Response(true, getHeaders(routeConfig, -1L)));
    }

    Config loadConfiguration(String routeId, String key) {
        if (key.equals("demo1234")) {
            return getConfig().getOrDefault(routeId + key, userAConfig);
        }
        return getConfig().getOrDefault(routeId, commonUserConfig);

    }
}
```

우리가 앞에서 `UserKeyResolver`에서 설정한 `key`가 들어 오게되는데,  이 키를 가지고 제한하고자하는 요청량을 먼저 Config를 주입하면 끝이다.


```java title="CustomRedisRateLimiter.java"
@Configuration
@Slf4j
public class CustomRedisRateLimiter extends RedisRateLimiter {

    private final Config userAConfig = new Config().setBurstCapacity(10).setReplenishRate(1).setRequestedTokens(1);
    private final Config commonUserConfig = new Config().setBurstCapacity(1).setReplenishRate(1).setRequestedTokens(1);
    private ReactiveStringRedisTemplate redisTemplate;

    private RedisScript<List<Long>> script;

    @Autowired
    public CustomRedisRateLimiter(ReactiveStringRedisTemplate redisTemplate, RedisScript<List<Long>> script,
        ConfigurationService configurationService) {
        super(redisTemplate, script, configurationService);
        this.redisTemplate = redisTemplate;
        this.script = script;
    }

    public CustomRedisRateLimiter(int defaultReplenishRate, int defaultBurstCapacity) {
        super(defaultReplenishRate, defaultBurstCapacity);
    }

    public CustomRedisRateLimiter(int defaultReplenishRate, int defaultBurstCapacity, int defaultRequestedTokens) {
        super(defaultReplenishRate, defaultBurstCapacity, defaultRequestedTokens);
    }

    static List<String> getKeys(String id) {
        String prefix = "request_rate_limiter.{" + id;
        String tokenKey = prefix + "}.tokens";
        String timestampKey = prefix + "}.timestamp";
        return Arrays.asList(tokenKey, timestampKey);
    }

    @Override
    public Mono<Response> isAllowed(String routeId, String id) {
        Config routeConfig = loadConfiguration(routeId, id);

        int replenishRate = routeConfig.getReplenishRate();
        int burstCapacity = routeConfig.getBurstCapacity();
        int requestedTokens = routeConfig.getRequestedTokens();

        try {
            List<String> keys = getKeys(id);

            List<String> scriptArgs = Arrays.asList(replenishRate + "", burstCapacity + "", "", requestedTokens + "");
            Flux<List<Long>> flux = redisTemplate.execute(this.script, keys, scriptArgs);
            return flux.onErrorResume(throwable -> {
                if (log.isDebugEnabled()) {
                    log.debug("Error calling rate limiter lua", throwable);
                }
                return Flux.just(Arrays.asList(1L, -1L));
            }).reduce(new ArrayList<Long>(), (longs, l) -> {
                longs.addAll(l);
                return longs;
            }).map(results -> {
                boolean allowed = results.get(0) == 1L;
                Long tokensLeft = results.get(1);

                Response response = new Response(allowed, getHeaders(routeConfig, tokensLeft));

                if (log.isDebugEnabled()) {
                    log.debug("response: " + response);
                }
                return response;
            });
        } catch (Exception e) {
            log.error("Error determining if user allowed from redis", e);
        }

        return Mono.just(new Response(true, getHeaders(routeConfig, -1L)));
    }

    Config loadConfiguration(String routeId, String key) {
        if (key.equals("demo1234")) {
            return getConfig().getOrDefault(routeId + key, userAConfig);
        }
        return getConfig().getOrDefault(routeId, commonUserConfig);

    }
}
```

그리고 `application.yml` 파일에 `rate-limitter` `customRedisRateLimiter`를 추가해준다.

```yml title="application.yaml"
spring:
...
- name: RequestRateLimiter
    args:
        rate-limitter: "#{@customRedisRateLimiter}"
        key-resolver: "#{@apiKeyResolve}"
```

### 결과

`Get localhost:18080/demo?userId=demo1234` 

![Untitled](./2022-05-01/spring-cloud-gateway/Untitled%206.png)

Request 요청시 위에 설정한 userAConfig에 맞게 응답값이 돌아오게된다.

`Get localhost:18080/demo?userId=test` 

![Untitled](./2022-05-01/spring-cloud-gateway/Untitled%207.png)

 `Remaining` 보다 요청을 더많이하게 되면 `429 Too Many Request` 가 응답으로 오게된다.

![Untitled](./2022-05-01/spring-cloud-gateway/Untitled%208.png)

추가해도 좋을만한 옵션이 있는데, 만약 다양한 이유로 요청을 거절 하고 싶을 때 예를 들어 헤더에 약속된 값이 없거나 등
그럴때 사용 할 수 있는 옵션이 `deny-empty-key`라는 옵션이다. (default true)이다.  
이 옵션을 사용하기위해서 **____EMPTY_KEY__** 을 뒤로 넘겨 주게 되면 `FORBIDDEN` 응답으로 돌려주게된다.

```java title="UserKeyResolver.java"
@Bean
public KeyResolver apiKeyResolve() {
    if (!exchange.getRequest().getQueryParams().containsKey("userId")) {
          return Mono.just("____EMPTY_KEY__");
    }

    return Mono.just(exchange.getRequest().getQueryParams().getFirst("userId"));
}
```

<br/>

![Untitled](./2022-05-01/spring-cloud-gateway/Untitled%209.png)

### 정말 잘 작동 할까?

이 부분을 확인하기 위해서 짧은시간에 많은 부하테스트를 해 볼 것이다. 간단하게 [k6](https://k6.io/) 부하테스트 도구를 이용해서  테스트를 해 볼 겁니다. 

조건 초당 1회 요청을 가능한지를 테스트한다면

limiter 설정  
`requestedTokens` 1  
`burstCapacity` 1  
`replenishRate` 1 

k6/loadtest.js

```js title="loadtest.js"
import http from 'k6/http';
import { check, group, sleep } from 'k6';

export const options = {
    duration: '10s',
    vus: '1',
};

const BASE_URL = 'http://localhost:18080';

export default () => {
    const limiter = http.get(`${BASE_URL}/demo?userId=test`);

    check(limiter, {
        'success limitter ': (resp) => resp.status === 200
    });
};
```

정말 간단한 스크립트로 보면 알겠지만  
10초동안 get요청을 한다는 스크립트이고, 결과로 200일 경우 성공으로 보겠다는 것이다.

### 결과  

![Untitled](./2022-05-01/spring-cloud-gateway/Untitled%2010.png)

11번의 요청이 성공적으로 200으로 return 되었고, 6045번이 실패한 내역이다.

## 이상으로

이렇게 간단하게 `RateLimiter`를 구현을 해보았는데, 처음에는 구현을 어떻게 하지라며 고민을 하면서,  
Redis를 끄적끄적이며 구현중에 (~~Watch와 Multi와 함께라면),~~  
구글신에 검색중에 Spring 진영에 잘 구현이 되어 있어서 쉽게 가져와서 요구사항에 맞게 사용을 했었다.  
이미 잘 만들어져서 책임을 다하는 객체가 있으면 잘 사용하는것도 중요하다라고 

### 추가로 한 번 고민 해야 할 부분

Gateway에서 Request body를 읽어서 무언가를 처리 한 후에 다음 Filter로 넘겨 줄 때에는 고민을 해봐야하는데,  
잘 알다시피 Servlet Request Body를 Filter에서 한 번 읽으면,  
다시 뒤에서 body를 못 읽는다는 문제가 있다.  
이 부분은 한 번 읽고 body를 캐싱 해서 다시 body를 넣어주는 추가 작업이 필요하다.

### 참고

[가상 면접 사례로 배우는 대규모 시스템 설계](http://www.yes24.com/Product/Goods/102819435)  
[Spring Cloud gateway Docs](https://docs.spring.io/./2022-05-01/spring-cloud-gateway/docs/current/reference/html/)  
[https://redis.io/docs/manual/programmability/eval-intro/](https://redis.io/docs/manual/programmability/eval-intro/)  