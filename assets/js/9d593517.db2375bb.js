"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[8141],{3905:(e,t,n)=>{n.d(t,{Zo:()=>s,kt:()=>d});var o=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,o,a=function(e,t){if(null==e)return{};var n,o,a={},i=Object.keys(e);for(o=0;o<i.length;o++)n=i[o],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(o=0;o<i.length;o++)n=i[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var u=o.createContext({}),c=function(e){var t=o.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):r(r({},t),e)),n},s=function(e){var t=c(e.components);return o.createElement(u.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},g=o.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,u=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),g=c(n),d=a,m=g["".concat(u,".").concat(d)]||g[d]||p[d]||i;return n?o.createElement(m,r(r({ref:t},s),{},{components:n})):o.createElement(m,r({ref:t},s))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,r=new Array(i);r[0]=g;var l={};for(var u in t)hasOwnProperty.call(t,u)&&(l[u]=t[u]);l.originalType=e,l.mdxType="string"==typeof e?e:a,r[1]=l;for(var c=2;c<i;c++)r[c]=n[c];return o.createElement.apply(null,r)}return o.createElement.apply(null,n)}g.displayName="MDXCreateElement"},1675:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>r,default:()=>p,frontMatter:()=>i,metadata:()=>l,toc:()=>c});var o=n(7462),a=(n(7294),n(3905));const i={title:"Spring Cloud Gateway Route \uc124\uc815\ud574\ubcf4\uae30",description:"\uc2a4\ud504\ub9c1 \uac8c\uc774\ud2b8\uc6e8\uc774 Route \uae4c\ubcf4\uae30",slug:"gateway",authors:"dongle",tags:["SCG","Spring Cloud Gateway","Route"],image:"https://i.imgur.com/mErPwqL.png",hide_table_of_contents:!1},r=void 0,l={permalink:"/gateway",editUrl:"https://github.com/facebook/docusaurus/edit/main/website/blog/2022-05-08-Spring-Cloud-Gateway-Route.md",source:"@site/blog/2022-05-08-Spring-Cloud-Gateway-Route.md",title:"Spring Cloud Gateway Route \uc124\uc815\ud574\ubcf4\uae30",description:"\uc2a4\ud504\ub9c1 \uac8c\uc774\ud2b8\uc6e8\uc774 Route \uae4c\ubcf4\uae30",date:"2022-05-08T00:00:00.000Z",formattedDate:"May 8, 2022",tags:[{label:"SCG",permalink:"/tags/scg"},{label:"Spring Cloud Gateway",permalink:"/tags/spring-cloud-gateway"},{label:"Route",permalink:"/tags/route"}],readingTime:6.34,hasTruncateMarker:!0,authors:[{name:"Dongle",title:"Junior Backend Developer",url:"https://github.com/sk1737030",imageURL:"https://github.com/sk1737030.png",key:"dongle"}],frontMatter:{title:"Spring Cloud Gateway Route \uc124\uc815\ud574\ubcf4\uae30",description:"\uc2a4\ud504\ub9c1 \uac8c\uc774\ud2b8\uc6e8\uc774 Route \uae4c\ubcf4\uae30",slug:"gateway",authors:"dongle",tags:["SCG","Spring Cloud Gateway","Route"],image:"https://i.imgur.com/mErPwqL.png",hide_table_of_contents:!1},prevItem:{title:"Spring Kafka Rebalancing \ucc98\ub9ac \ud574\ubcf4\uae30",permalink:"/rebalnace"},nextItem:{title:"\uae4c\uba39\uc5b4\uc11c \ub2e4\uc2dc \ubcf4\ub294 Generic",permalink:"/generic"}},u={authorsImageUrls:[void 0]},c=[{value:"Spring Gateway Route",id:"spring-gateway-route",level:2},{value:"Yaml",id:"yaml",level:3},{value:"Java",id:"java",level:3},{value:"RouteDefinationLocator",id:"routedefinationlocator",level:3},{value:"DiscoveryClientRouteDefinitionLocator",id:"discoveryclientroutedefinitionlocator",level:3},{value:"PropertiesRouteDefinitionLocator",id:"propertiesroutedefinitionlocator",level:3},{value:"<strong>CompositeRouteDefinitionLocator</strong>",id:"compositeroutedefinitionlocator",level:3},{value:"RouteDefinitionRouteLocator",id:"routedefinitionroutelocator",level:3},{value:"CompositeRouteLocator",id:"compositeroutelocator",level:3},{value:"CachingRouteLocator",id:"cachingroutelocator",level:3},{value:"\uadf8\ub9ac\uace0 \ub9c8\uc9c0\ub9c9\uc73c\ub85c \ucd5c\ucd08 \uc2dc\uc791\uc810\uc778 GatewayAutoConfiguration",id:"\uadf8\ub9ac\uace0-\ub9c8\uc9c0\ub9c9\uc73c\ub85c-\ucd5c\ucd08-\uc2dc\uc791\uc810\uc778-gatewayautoconfiguration",level:3},{value:"\uacb0\ub860",id:"\uacb0\ub860",level:3},{value:"\ud6c4\uae30",id:"\ud6c4\uae30",level:3}],s={toc:c};function p(e){let{components:t,...i}=e;return(0,a.kt)("wrapper",(0,o.Z)({},s,i,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Spring gateway\uc744 \uc0ac\uc6a9\ud560 \ub54c \uc77c\ubc18\uc801\uc73c\ub85c 2\uac00\uc9c0 \ubc29\uc2dd\uc73c\ub85c route \uc124\uc815\uc744 \ud560 \uc218 \uc788\ub294\ub370 \uc5b4\ub5a4\uac8c \ub354 \uc88b\uc744\uae4c?"),(0,a.kt)("p",null,"\ubaa8\ub4e0 \uc18c\uc2a4\ub294 ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/sk1737030/til/tree/master/spring-cloud-gateway"},"\uc774\uacf3"),"\uc5d0\uc11c \ud655\uc778 \uac00\ub2a5\ud569\ub2c8\ub2e4:)"),(0,a.kt)("h2",{id:"spring-gateway-route"},"Spring Gateway Route"),(0,a.kt)("p",null,"Spring gateway\uc744 \uc0ac\uc6a9\ud560 \ub54c \uc77c\ubc18\uc801\uc73c\ub85c 2\uac00\uc9c0 \ubc29\uc2dd\uc73c\ub85c route \uc124\uc815\uc744 \ud560 \uc218 \uc788\ub2e4."),(0,a.kt)("h3",{id:"yaml"},"Yaml"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-yaml"},"spring: \n    cloud:\n    gateway:\n      globalcors:\n        corsConfigurations:\n          '[/**]':\n            allowedOrigins: '*'\n            allowedMethods:\n              - POST\n              - GET\n              - PUT\n              - OPTIONS\n              - DELETE\n      routes:\n        - id: a-service\n          uri: http://localhost:18081\n          predicates:\n            - Path=/aservice/**\n        - id: b-service\n          uri: http://localhost:18082\n          predicates:\n            - Path=/bservice/**\n")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-verilog"},"2022-02-19 18:07:46.827 DEBUG 33218 --- [  restartedMain] o.s.c.gateway.config.GatewayProperties   : Routes supplied from Gateway Properties: [RouteDefinition{id='a-service', predicates=[PredicateDefinition{name='Path', args={_genkey_0=/aservice/**}}], filters=[], uri=http://localhost:18081, order=0, metadata={}}, RouteDefinition{id='b-service', predicates=[PredicateDefinition{name='Path', args={_genkey_0=/bservice/**}}], filters=[], uri=http://localhost:18082, order=0, metadata={}}]\n")),(0,a.kt)("h3",{id:"java"},"Java"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-java"},'import org.springframework.cloud.gateway.route.RouteLocator;\nimport org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;\nimport org.springframework.context.annotation.Bean;\nimport org.springframework.context.annotation.Configuration;\n\n@Configuration\npublic class RouteConfig {\n\n    @Bean\n    public RouteLocator bRoue(RouteLocatorBuilder builder) {\n        return builder.routes()\n            .route("q-service", r -> r.path("/q-service/**")\n                .uri("http://localhost:18081"))\n            .route("q-service", r -> r.path("/w-service/**")\n                .uri("http://localhost:18080"))\n            .build();\n    }\n\n    @Bean\n    public RouteLocator cRoute(RouteLocatorBuilder builder) {\n        return builder.routes()\n            .route("c-service", r -> r.path("/c-service/**")\n                .uri("http://localhost:18081"))\n            .route("d-service", r -> r.path("/d-service/**")\n                .uri("http://localhost:18080"))\n            .build();\n    }\n}\n')),(0,a.kt)("p",null,"\ub77c\uc6b0\ud2b8\ub4e4\uc744 \ub098\ub220\uc11c \uc124\uc815\ud560 \uc218 \uc788\ub2e4. \uadf8\ub807\ub2e4\uba74 \ub530\ub85c \uc124\uc815\ud55c \ub77c\uc6b0\ud130\ub4e4\uc774 \uc5b4\ub5bb\uac8c \uac19\uc774 \ud569\uccd0\uc838\uc11c \uc791\ub3d9\ud558\ub294 \uac83 \uc77c\uae4c?"),(0,a.kt)("p",null,"Route \uad6c\uc131\ub3c4",(0,a.kt)("br",{parentName:"p"}),"\n",(0,a.kt)("img",{alt:"[https://zhuanlan.zhihu.com/p/359523303](https://zhuanlan.zhihu.com/p/359523303)",src:n(3092).Z,width:"1749",height:"1120"}),"  "),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://zhuanlan.zhihu.com/p/359523303"},"https://zhuanlan.zhihu.com/p/359523303"),"  "),(0,a.kt)("p",null,"\uc77c\ub2e8 \uba3c\uc800 \ubd10\uc57c\ud560 \uac83\uc740 ",(0,a.kt)("inlineCode",{parentName:"p"},"RouteDefinationLocator"),"\uc774\ub2e4."),(0,a.kt)("h3",{id:"routedefinationlocator"},"RouteDefinationLocator"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-java"},"public interface RouteDefinitionLocator {\n    Flux<RouteDefinition> getRouteDefinitions();\n}\n")),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"RouteDefinationLocator"),"\uc744 \uad6c\ud604\ud55c \uac1d\uccb4\ub4e4\uc740 5\uac1c\uac00 \uc788\ub2e4.  "),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("inlineCode",{parentName:"li"},"CachingRouteDefinitionLocator")),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("inlineCode",{parentName:"li"},"CompositeRouteDefinitionLocator")),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("inlineCode",{parentName:"li"},"DiscoveryClientRouteDefinitionLocator")),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("inlineCode",{parentName:"li"},"PropertiesRouteDefinitionLocator")," "),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("inlineCode",{parentName:"li"},"RouteDefinitionRepository"))),(0,a.kt)("h3",{id:"discoveryclientroutedefinitionlocator"},"DiscoveryClientRouteDefinitionLocator"),(0,a.kt)("p",null,"Service Discovery(Netflix Eureka, Consul, or Zookeeper)\uc640 \uc5f0\ub3d9\ud558\uc5ec \ub4f1\ub85d\ub41c \uc11c\ube44\uc2a4\ub4e4\uc744 \uae30\uc900\uc73c\ub85c \uacbd\ub85c\ub97c \ub9cc\ub4e0\ub2e4."),(0,a.kt)("h3",{id:"propertiesroutedefinitionlocator"},"PropertiesRouteDefinitionLocator"),(0,a.kt)("p",null,"Yaml\uc5d0 \uc124\uc815\ud55c property value\ub4e4\uc774 ",(0,a.kt)("strong",{parentName:"p"},"GateWayProperty")," \uc9c1\ub82c\ud654\ub418\uc5b4 \uac12\uc774 \ub4e4\uc5b4\uac00\uace0  "),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-java"},"public class PropertiesRouteDefinitionLocator implements RouteDefinitionLocator {\n\n    private final GatewayProperties properties;\n\n    public PropertiesRouteDefinitionLocator(GatewayProperties properties) {\n        this.properties = properties;\n    }\n\n    @Override\n    public Flux<RouteDefinition> getRouteDefinitions() {\n        return Flux.fromIterable(this.properties.getRoutes());\n    }\n\n}\n")),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"Untitled",src:n(9581).Z,width:"1678",height:"568"})),(0,a.kt)("p",null,"GatewayProperty \uac12\uc740 ",(0,a.kt)("strong",{parentName:"p"},"PropertiesRouteDefinitionLocator \uc5d0 \uc4f0\uc774\uac8c \ub41c\ub2e4."),"  "),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"Untitled",src:n(6929).Z,width:"1729",height:"678"})),(0,a.kt)("h3",{id:"compositeroutedefinitionlocator"},(0,a.kt)("strong",{parentName:"h3"},"CompositeRouteDefinitionLocator")),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://docs.spring.io/spring-integration/reference/html/dsl.html"},"\uc790\ubc14 DSL"),"(\ud3b8\ub9ac\ud558\uac8c fluent API\ub97c \uc9c0\uc6d0)\ub85c \uc124\uc815\ud55c \ub77c\uc6b0\ud130\ub4e4\uc758 \uac12\uc774 \ub4e4\uc5b4\uac00 \uc788\uace0  "),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"Untitled",src:n(5851).Z,width:"2024",height:"1003"}),"  "),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"CompositeRouteDefinitionLocator"),"\uc5d0\uc11c ",(0,a.kt)("strong",{parentName:"p"},"PropertiesRouteDefinitionLocator\uc5d0\uc11c")," \uc124\uc815\ud55c \ub77c\uc6b0\ud130\ub4e4\uc5d0 id\uac00 \uc5c6\uc744 \uacbd\uc6b0 randid\uac00 \ub4e4\uc5b4\uac00\uac8c \ub41c\ub2e4.  "),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-java"},'public class CompositeRouteDefinitionLocator implements RouteDefinitionLocator {\n...\n    @Override\n    public Flux<RouteDefinition> getRouteDefinitions() {\n        return this.delegates.flatMapSequential(RouteDefinitionLocator::getRouteDefinitions)\n                .flatMap(routeDefinition -> {\n                    if (routeDefinition.getId() == null) {\n                        return randomId().map(id -> {\n                            routeDefinition.setId(id);\n                            if (log.isDebugEnabled()) {\n                                log.debug("Id set on route definition: " + routeDefinition);\n                            }\n                            return routeDefinition;\n                        });\n                    }\n                    return Mono.just(routeDefinition);\n                });\n    }\n}\n')),(0,a.kt)("h3",{id:"routedefinitionroutelocator"},"RouteDefinitionRouteLocator"),(0,a.kt)("p",null,"Route\ub4e4\uc744 key\ub97c \uae30\uc900\uc73c\ub85c \ud655\uc778 \ud6c4\uc5d0 ",(0,a.kt)("inlineCode",{parentName:"p"},"RoutePredicateFactory"),"\uc5d0 \uc9d1\uc5b4\ub123\ub294\ub2e4.  "),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-java"},'public class RouteDefinitionRouteLocator implements RouteLocator {\n    \n    ...\n\n    public RouteDefinitionRouteLocator(RouteDefinitionLocator routeDefinitionLocator,\n            List<RoutePredicateFactory> predicates, List<GatewayFilterFactory> gatewayFilterFactories,\n            GatewayProperties gatewayProperties, ConfigurationService configurationService) {\n        this.routeDefinitionLocator = routeDefinitionLocator;\n        this.configurationService = configurationService;\n        initFactories(predicates);\n        gatewayFilterFactories.forEach(factory -> this.gatewayFilterFactories.put(factory.name(), factory));\n        this.gatewayProperties = gatewayProperties;\n    }\n\n    // RoutePredicateFactory \uac80\uc0ac\n    private void initFactories(List<RoutePredicateFactory> predicates) {\n        predicates.forEach(factory -> {\n            String key = factory.name();\n            if (this.predicates.containsKey(key)) {\n                this.logger.warn("A RoutePredicateFactory named " + key + " already exists, class: "\n                        + this.predicates.get(key) + ". It will be overwritten.");\n            }\n            this.predicates.put(key, factory);\n            if (logger.isInfoEnabled()) {\n                logger.info("Loaded RoutePredicateFactory [" + key + "]");\n            }\n        });\n    }\n\n    public Flux<Route> getRoutes() {\n        Flux<Route> routes = this.routeDefinitionLocator.getRouteDefinitions().map(this::convertToRoute);\n\n        if (!gatewayProperties.isFailOnRouteDefinitionError()) {\n            // instead of letting error bubble up, continue\n            routes = routes.onErrorContinue((error, obj) -> {\n                if (logger.isWarnEnabled()) {\n                    logger.warn("RouteDefinition id " + ((RouteDefinition) obj).getId()\n                            + " will be ignored. Definition has invalid configs, " + error.getMessage());\n                }\n            });\n        }\n\n        return routes.map(route -> {\n            if (logger.isDebugEnabled()) {\n                logger.debug("RouteDefinition matched: " + route.getId());\n            }\n            return route;\n        });\n    }\n  ...\n}\n')),(0,a.kt)("h3",{id:"compositeroutelocator"},"CompositeRouteLocator"),(0,a.kt)("p",null,"\uc5ec\ub7ec \uac1c\uc758 ",(0,a.kt)("inlineCode",{parentName:"p"},"RouteLocator")," \ub4e4\uc740 delegates\ub97c \uac00\uc9c0\uace0, \uac01 RouteLocator\ub4e4\uc774 \uac00\uc9c0\uace0 \uc788\ub294 Route\ub4e4\uc744 \ud558\ub098\ub85c \ud569\uce5c\ub2e4."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-java"},"public class CompositeRouteLocator implements RouteLocator {\n\n    private final Flux<RouteLocator> delegates;\n\n    public CompositeRouteLocator(Flux<RouteLocator> delegates) {\n        this.delegates = delegates;\n    }\n\n    @Override\n    public Flux<Route> getRoutes() {\n        return this.delegates.flatMapSequential(RouteLocator::getRoutes);\n    }\n")),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"this.deligates \uc548\uc5d0 \uc124\uc815\ud55c route\ub4e4\uc774 \ub2f4\uaca8\uc788\ub294 \uac83\uc744 \ubcfc \uc218 \uc788\ub2e4.",src:n(2964).Z,width:"1083",height:"517"})),(0,a.kt)("p",null,"this.deligates \uc548\uc5d0 \uc124\uc815\ud55c route\ub4e4\uc774 \ub2f4\uaca8\uc788\ub294 \uac83\uc744 \ubcfc \uc218 \uc788\ub2e4."),(0,a.kt)("h3",{id:"cachingroutelocator"},"CachingRouteLocator"),(0,a.kt)("p",null,"deletgate\ub4e4\uc744 \ubc1b\uc544 \uce90\uc2dc\uc5d0 \uc800\uc7a5\ud574\uc11c route\ub4e4\uc744 \uac00\uc9c4\ub2e4."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-java"},"public class CachingRouteLocator implements Ordered, RouteLocator, ApplicationListener<RefreshRoutesEvent>, ApplicationEventPublisherAware {\n\n    private final Map<String, List> cache = new ConcurrentHashMap<>();\n\n    public CachingRouteLocator(RouteLocator delegate) {\n        this.delegate = delegate;\n        routes = CacheFlux.lookup(cache, CACHE_KEY, Route.class).onCacheMissResume(this::fetch);\n    }\n\n    private Flux<Route> fetch() {\n        return this.delegate.getRoutes().sort(AnnotationAwareOrderComparator.INSTANCE);\n    }\n  \n}\n")),(0,a.kt)("p",null,"Cache\uc5d0 Route\ub4e4\uc774 \ub2f4\uae30\uac8c \ub41c\ub2e4."),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"Untitled",src:n(415).Z,width:"1049",height:"365"})),(0,a.kt)("h3",{id:"\uadf8\ub9ac\uace0-\ub9c8\uc9c0\ub9c9\uc73c\ub85c-\ucd5c\ucd08-\uc2dc\uc791\uc810\uc778-gatewayautoconfiguration"},"\uadf8\ub9ac\uace0 \ub9c8\uc9c0\ub9c9\uc73c\ub85c \ucd5c\ucd08 \uc2dc\uc791\uc810\uc778 GatewayAutoConfiguration"),(0,a.kt)("p",null,"Gateway\uc758 Route \ub4f1 \uac01\uc885 config\ub4e4\uc744 \uc124\uc815\ud55c\ub2e4."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-java"},'@Configuration(proxyBeanMethods = false)\n@ConditionalOnProperty(name = "spring.cloud.gateway.enabled", matchIfMissing = true)\n@EnableConfigurationProperties\n@AutoConfigureBefore({ HttpHandlerAutoConfiguration.class, WebFluxAutoConfiguration.class })\n@AutoConfigureAfter({ GatewayReactiveLoadBalancerClientAutoConfiguration.class,\n        GatewayClassPathWarningAutoConfiguration.class })\n@ConditionalOnClass(DispatcherHandler.class)\npublic class GatewayAutoConfiguration {\n   \n  ...\n    \n\n    @Bean\n    @Primary\n    @ConditionalOnMissingBean(name = "cachedCompositeRouteLocator")\n    public RouteLocator cachedCompositeRouteLocator(List<RouteLocator> routeLocators) {\n        return new **CachingRouteLocator**(new CompositeRouteLocator(Flux.fromIterable(routeLocators)));\n    }\n   ...\n}\n')),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"cachedCompositeRouteLocator")," \uc124\uc815\ud55c roteLocator(java, yaml)\ub4e4\uc774 \ub2f4\uae30\uac8c \ub41c\ub2e4. "),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"Untitled",src:n(9143).Z,width:"1002",height:"379"})),(0,a.kt)("h3",{id:"\uacb0\ub860"},"\uacb0\ub860"),(0,a.kt)("p",null,"\uac1c\uc778\uc801\uc73c\ub85c\ub294 yaml\uc73c\ub85c \uc124\uc815\ud558\uae30\ubcf4\ub2e4\ub294 ",(0,a.kt)("strong",{parentName:"p"},"Java Config"),"\ub85c \uc124\uc815\ud558\ub294 \uac8c \uc88b\ub2e4\uace0 \ubd05\ub2c8\ub2e4.",(0,a.kt)("br",{parentName:"p"}),"\n","Yaml \uc124\uc815\ud558\uba74 \uac04\ub2e8\ud558\uac8c \uc124\uc815 \ud560 \uc218 \uc788\ub294 \ubc18\uba74\uc5d0, IDE\uc758 \ub3c4\uc6c0\uc744 \ubc1b\uae30 \ud798\ub4e4\uace0, \uc624\ud0c0, yaml \ub77c\uc778\uc774 \ub2e4\ub978 \uacbd\uc6b0\ub098 yaml \ubb38\ubc95 \uc5d0\ub7ec \ubc1c\uc0dd \ub4f1 \uc815\ub9d0 \ub204\uad6c\ub098 \ud560 \uc218 \uc788\ub294 \uc2e4\uc218\uc778\ub370, \ub9cc\uc57d \uc778\uc9c0\ub97c \ubabb\ud558\uace0 Product\ub85c \ubc30\ud3ec\uac00 \ub418\uba74 \uc7a5\uc560\uac00 \ubc1c\uc0dd\ud569\ub2c8\ub2e4.",(0,a.kt)("br",{parentName:"p"}),"\n","\ub610\ud55c \uac8c\uc774\ud2b8\uc6e8\uc774\ub2e4\ubcf4 \ub2c8 \uac8c\uc774\ud2b8\uc6e8\uc774 \ub4a4\ub85c \ud750\ub974\ub294 \ubaa8\ub4e0 application\ub4e4\uc774 \ud750\ub97c \uc218 \uc5c6\uac8c \ub418\uc5b4 \uce58\uba85\uc801\uc778 \uc7a5\uc560\uac00 \ubc1c\uc0dd\ud560 \uc218 \uc788\uc73c\ub2c8 Production \ud658\uacbd\uc5d0\uc11c\ub294 Java Config\ub85c \uc124\uc815\uc744 \ud558\ub294 \uac78 \ucd94\ucc9c\ub4dc\ub9bd\ub2c8\ub2e4.  "),(0,a.kt)("h3",{id:"\ud6c4\uae30"},"\ud6c4\uae30"),(0,a.kt)("p",null,"\uc694\uc998 \ub0b4\ubd80 \uad6c\ud604\uc744 \ub9ce\uc774 \uae4c \ubcf4\uba74\uc11c, \ub0b4\uac00 \ud544\uc694\ud55c \ubd80\ubd84\ub4e4\uc744 \ub530\ub85c \ube7c\uc11c \ucee4\uc2a4\ud140\ud574\uc11c \uc4f0\ub294 \uc77c\uc774 \uba87 \ubc88 \ud558\ub2e4\ubcf4\ub2c8, \uc9c0\uae08\ub3c4 \ub9c8\ucc2c\uac00\uc9c0\uc9c0\ub9cc \uc608\uc804\uc5d0\ub294 \uc9c4\uc9dc \ub9c9 \uc37c\uc5c8\uad6c\ub098\ub77c\uace0 \ub2e4\uc2dc\uae08 \ub9ce\uc774 \ub290\ub07c\uace0 \uadf8\ub7ec\uba74\uc11c \uc694\uc998  \uc2a4\ud504\ub9c1\uacfc 1cm \uc815\ub3c4 \uac70\ub9ac\uac00 \uac00\uae4c\uc6cc\uc84c\ub2e4\ub294 \uac78 \ub290\ub07c\uba74\uc11c ",(0,a.kt)("del",{parentName:"p"},"\ubb3c\ub860 \uadf8\ub7ec\uba74\uc11c \uba38\ub9ac\uac00 \ube60\uc9c4...")," \uac1c\uc778\uc801\uc73c\ub85c ",(0,a.kt)("strong",{parentName:"p"},"\uc131\uc7a5"),"\ud558\uace0 \uc788\ub294 \uac78 \ub9ce\uc774 \ub290\ub07c\uace0 \uc788\ub2e4."),(0,a.kt)("p",null,"\ucc38\uace0",(0,a.kt)("br",{parentName:"p"}),"\n",(0,a.kt)("a",{parentName:"p",href:"https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/"},"https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/"),(0,a.kt)("br",{parentName:"p"}),"\n",(0,a.kt)("a",{parentName:"p",href:"https://blog.jungbin.kim/spring/2021/02/27/spring-cloud-gateway-route-locator.html"},"https://blog.jungbin.kim/spring/2021/02/27/spring-cloud-gateway-route-locator.html"),(0,a.kt)("br",{parentName:"p"}),"\n",(0,a.kt)("a",{parentName:"p",href:"https://www.baeldung.com/spring-cloud-gateway#spring-cloud-discoveryclient-support"},"https://www.baeldung.com/spring-cloud-gateway#spring-cloud-discoveryclient-support"),(0,a.kt)("br",{parentName:"p"}),"\n",(0,a.kt)("a",{parentName:"p",href:"https://dlsrb6342.github.io/2019/05/14/spring-cloud-gateway-%EA%B5%AC%EC%A1%B0/"},"https://dlsrb6342.github.io/2019/05/14/spring-cloud-gateway-\uad6c\uc870/")))}p.isMDXComponent=!0},9581:(e,t,n)=>{n.d(t,{Z:()=>o});const o=n.p+"assets/images/Untitled 1-537a060eddc6cebb678cb2eed9f7ce6b.png"},6929:(e,t,n)=>{n.d(t,{Z:()=>o});const o=n.p+"assets/images/Untitled 2-2ca8958503e816aee719c207dd1dfb43.png"},5851:(e,t,n)=>{n.d(t,{Z:()=>o});const o=n.p+"assets/images/Untitled 3-9b6e49f05eba03ff26bc2accc55dc845.png"},2964:(e,t,n)=>{n.d(t,{Z:()=>o});const o=n.p+"assets/images/Untitled 4-73c6829a0a54efb556439b564df0be67.png"},415:(e,t,n)=>{n.d(t,{Z:()=>o});const o=n.p+"assets/images/Untitled 5-13c825c1eadeb1ce8b242c1ac296ae41.png"},9143:(e,t,n)=>{n.d(t,{Z:()=>o});const o=n.p+"assets/images/Untitled 6-a002a2368847cac2e7746d6b93736cf0.png"},3092:(e,t,n)=>{n.d(t,{Z:()=>o});const o=n.p+"assets/images/Untitled-b81964f0be36af8e05b92420a9f3fdde.png"}}]);