---
title: Spring Cloud Gateway Route 설정해보기
description: 스프링 게이트웨이 Route 까보기
slug: gateway
authors: dongle  
tags: [SCG, Spring Cloud Gateway, Route]
image: https://i.imgur.com/mErPwqL.png
hide_table_of_contents: false
---
Spring gateway을 사용할 때 일반적으로 2가지 방식으로 route 설정을 할 수 있는데 어떤게 더 좋을까?
<!--truncate-->
모든 소스는 [이곳](https://github.com/sk1737030/til/tree/master/spring-cloud-gateway)에서 확인 가능합니다:)

## Spring Gateway Route
Spring gateway을 사용할 때 일반적으로 2가지 방식으로 route 설정을 할 수 있다.


### Yaml

```yaml
spring: 
	cloud:
    gateway:
      globalcors:
        corsConfigurations:
          '[/**]':
            allowedOrigins: '*'
            allowedMethods:
              - POST
              - GET
              - PUT
              - OPTIONS
              - DELETE
      routes:
        - id: a-service
          uri: http://localhost:18081
          predicates:
            - Path=/aservice/**
        - id: b-service
          uri: http://localhost:18082
          predicates:
            - Path=/bservice/**
```

```verilog
2022-02-19 18:07:46.827 DEBUG 33218 --- [  restartedMain] o.s.c.gateway.config.GatewayProperties   : Routes supplied from Gateway Properties: [RouteDefinition{id='a-service', predicates=[PredicateDefinition{name='Path', args={_genkey_0=/aservice/**}}], filters=[], uri=http://localhost:18081, order=0, metadata={}}, RouteDefinition{id='b-service', predicates=[PredicateDefinition{name='Path', args={_genkey_0=/bservice/**}}], filters=[], uri=http://localhost:18082, order=0, metadata={}}]
```

### Java

```java
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RouteConfig {

    @Bean
    public RouteLocator bRoue(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("q-service", r -> r.path("/q-service/**")
                .uri("http://localhost:18081"))
            .route("q-service", r -> r.path("/w-service/**")
                .uri("http://localhost:18080"))
            .build();
    }

    @Bean
    public RouteLocator cRoute(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("c-service", r -> r.path("/c-service/**")
                .uri("http://localhost:18081"))
            .route("d-service", r -> r.path("/d-service/**")
                .uri("http://localhost:18080"))
            .build();
    }
}
```

라우트들을 나눠서 설정할 수 있다. 그렇다면 따로 설정한 라우터들이 어떻게 같이 합쳐져서 작동하는 것 일까?

Route 구성도  
![[https://zhuanlan.zhihu.com/p/359523303](https://zhuanlan.zhihu.com/p/359523303)](2022-05-08/Untitled.png)  

[https://zhuanlan.zhihu.com/p/359523303](https://zhuanlan.zhihu.com/p/359523303)  

일단 먼저 봐야할 것은 `RouteDefinationLocator`이다.

### RouteDefinationLocator
```java
public interface RouteDefinitionLocator {
	Flux<RouteDefinition> getRouteDefinitions();
}
```

`RouteDefinationLocator`을 구현한 객체들은 5개가 있다.  
1. `CachingRouteDefinitionLocator`
2. `CompositeRouteDefinitionLocator`
3. `DiscoveryClientRouteDefinitionLocator`
4. `PropertiesRouteDefinitionLocator` 
5. `RouteDefinitionRepository`

### DiscoveryClientRouteDefinitionLocator
Service Discovery(Netflix Eureka, Consul, or Zookeeper)와 연동하여 등록된 서비스들을 기준으로 경로를 만든다.

### PropertiesRouteDefinitionLocator  
Yaml에 설정한 property value들이 **GateWayProperty** 직렬화되어 값이 들어가고  

```java
public class PropertiesRouteDefinitionLocator implements RouteDefinitionLocator {

	private final GatewayProperties properties;

	public PropertiesRouteDefinitionLocator(GatewayProperties properties) {
		this.properties = properties;
	}

	@Override
	public Flux<RouteDefinition> getRouteDefinitions() {
		return Flux.fromIterable(this.properties.getRoutes());
	}

}
```

![Untitled](2022-05-08/Untitled%201.png)

GatewayProperty 값은 **PropertiesRouteDefinitionLocator 에 쓰이게 된다.**  

![Untitled](2022-05-08/Untitled%202.png)

### **CompositeRouteDefinitionLocator**
[자바 DSL](https://docs.spring.io/spring-integration/reference/html/dsl.html)(편리하게 fluent API를 지원)로 설정한 라우터들의 값이 들어가 있고  

![Untitled](2022-05-08/Untitled%203.png)  

`CompositeRouteDefinitionLocator`에서 **PropertiesRouteDefinitionLocator에서** 설정한 라우터들에 id가 없을 경우 randid가 들어가게 된다.  

```java
public class CompositeRouteDefinitionLocator implements RouteDefinitionLocator {
...
	@Override
	public Flux<RouteDefinition> getRouteDefinitions() {
		return this.delegates.flatMapSequential(RouteDefinitionLocator::getRouteDefinitions)
				.flatMap(routeDefinition -> {
					if (routeDefinition.getId() == null) {
						return randomId().map(id -> {
							routeDefinition.setId(id);
							if (log.isDebugEnabled()) {
								log.debug("Id set on route definition: " + routeDefinition);
							}
							return routeDefinition;
						});
					}
					return Mono.just(routeDefinition);
				});
	}
}
```

### RouteDefinitionRouteLocator

Route들을 key를 기준으로 확인 후에 `RoutePredicateFactory`에 집어넣는다.  

```java
public class RouteDefinitionRouteLocator implements RouteLocator {
	
	...

	public RouteDefinitionRouteLocator(RouteDefinitionLocator routeDefinitionLocator,
			List<RoutePredicateFactory> predicates, List<GatewayFilterFactory> gatewayFilterFactories,
			GatewayProperties gatewayProperties, ConfigurationService configurationService) {
		this.routeDefinitionLocator = routeDefinitionLocator;
		this.configurationService = configurationService;
		initFactories(predicates);
		gatewayFilterFactories.forEach(factory -> this.gatewayFilterFactories.put(factory.name(), factory));
		this.gatewayProperties = gatewayProperties;
	}

	// RoutePredicateFactory 검사
	private void initFactories(List<RoutePredicateFactory> predicates) {
		predicates.forEach(factory -> {
			String key = factory.name();
			if (this.predicates.containsKey(key)) {
				this.logger.warn("A RoutePredicateFactory named " + key + " already exists, class: "
						+ this.predicates.get(key) + ". It will be overwritten.");
			}
			this.predicates.put(key, factory);
			if (logger.isInfoEnabled()) {
				logger.info("Loaded RoutePredicateFactory [" + key + "]");
			}
		});
	}

	public Flux<Route> getRoutes() {
		Flux<Route> routes = this.routeDefinitionLocator.getRouteDefinitions().map(this::convertToRoute);

		if (!gatewayProperties.isFailOnRouteDefinitionError()) {
			// instead of letting error bubble up, continue
			routes = routes.onErrorContinue((error, obj) -> {
				if (logger.isWarnEnabled()) {
					logger.warn("RouteDefinition id " + ((RouteDefinition) obj).getId()
							+ " will be ignored. Definition has invalid configs, " + error.getMessage());
				}
			});
		}

		return routes.map(route -> {
			if (logger.isDebugEnabled()) {
				logger.debug("RouteDefinition matched: " + route.getId());
			}
			return route;
		});
	}
  ...
}
```

### CompositeRouteLocator

여러 개의 `RouteLocator` 들은 delegates를 가지고, 각 RouteLocator들이 가지고 있는 Route들을 하나로 합친다.

```java
public class CompositeRouteLocator implements RouteLocator {

	private final Flux<RouteLocator> delegates;

	public CompositeRouteLocator(Flux<RouteLocator> delegates) {
		this.delegates = delegates;
	}

	@Override
	public Flux<Route> getRoutes() {
		return this.delegates.flatMapSequential(RouteLocator::getRoutes);
	}
```

![this.deligates 안에 설정한 route들이 담겨있는 것을 볼 수 있다.](2022-05-08/Untitled%204.png)

this.deligates 안에 설정한 route들이 담겨있는 것을 볼 수 있다.

### CachingRouteLocator

deletgate들을 받아 캐시에 저장해서 route들을 가진다.

```java
public class CachingRouteLocator implements Ordered, RouteLocator, ApplicationListener<RefreshRoutesEvent>, ApplicationEventPublisherAware {

	private final Map<String, List> cache = new ConcurrentHashMap<>();

	public CachingRouteLocator(RouteLocator delegate) {
		this.delegate = delegate;
		routes = CacheFlux.lookup(cache, CACHE_KEY, Route.class).onCacheMissResume(this::fetch);
	}

	private Flux<Route> fetch() {
		return this.delegate.getRoutes().sort(AnnotationAwareOrderComparator.INSTANCE);
	}
  
}
```

Cache에 Route들이 담기게 된다.

![Untitled](2022-05-08/Untitled%205.png)

 

### 그리고 마지막으로 최초 시작점인 GatewayAutoConfiguration

Gateway의 Route 등 각종 config들을 설정한다.

```java
@Configuration(proxyBeanMethods = false)
@ConditionalOnProperty(name = "spring.cloud.gateway.enabled", matchIfMissing = true)
@EnableConfigurationProperties
@AutoConfigureBefore({ HttpHandlerAutoConfiguration.class, WebFluxAutoConfiguration.class })
@AutoConfigureAfter({ GatewayReactiveLoadBalancerClientAutoConfiguration.class,
		GatewayClassPathWarningAutoConfiguration.class })
@ConditionalOnClass(DispatcherHandler.class)
public class GatewayAutoConfiguration {
   
  ...
	

	@Bean
	@Primary
	@ConditionalOnMissingBean(name = "cachedCompositeRouteLocator")
	public RouteLocator cachedCompositeRouteLocator(List<RouteLocator> routeLocators) {
		return new **CachingRouteLocator**(new CompositeRouteLocator(Flux.fromIterable(routeLocators)));
	}
   ...
}
```

`cachedCompositeRouteLocator` 설정한 roteLocator(java, yaml)들이 담기게 된다. 

![Untitled](2022-05-08/Untitled%206.png)

### 결론  
개인적으로는 yaml으로 설정하기보다는 **Java Config**로 설정하는 게 좋다고 봅니다.  
Yaml 설정하면 간단하게 설정 할 수 있는 반면에, IDE의 도움을 받기 힘들고, 오타, yaml 라인이 다른 경우나 yaml 문법 에러 발생 등 정말 누구나 할 수 있는 실수인데, 만약 인지를 못하고 Product로 배포가 되면 장애가 발생합니다.  
또한 게이트웨이다보 니 게이트웨이 뒤로 흐르는 모든 application들이 흐를 수 없게 되어 치명적인 장애가 발생할 수 있으니 Production 환경에서는 Java Config로 설정을 하는 걸 추천드립니다.  

### 후기  
요즘 내부 구현을 많이 까 보면서, 내가 필요한 부분들을 따로 빼서 커스텀해서 쓰는 일이 몇 번 하다보니, 지금도 마찬가지지만 예전에는 진짜 막 썼었구나라고 다시금 많이 느끼고 그러면서 요즘  스프링과 1cm 정도 거리가 가까워졌다는 걸 느끼면서 ~~물론 그러면서 머리가 빠진...~~ 개인적으로 **성장**하고 있는 걸 많이 느끼고 있다.

참고  
[https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/](https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/)  
[https://blog.jungbin.kim/spring/2021/02/27/spring-cloud-gateway-route-locator.html](https://blog.jungbin.kim/spring/2021/02/27/spring-cloud-gateway-route-locator.html)  
[https://www.baeldung.com/spring-cloud-gateway#spring-cloud-discoveryclient-support](https://www.baeldung.com/spring-cloud-gateway#spring-cloud-discoveryclient-support)  
[https://dlsrb6342.github.io/2019/05/14/spring-cloud-gateway-구조/](https://dlsrb6342.github.io/2019/05/14/spring-cloud-gateway-%EA%B5%AC%EC%A1%B0/)  