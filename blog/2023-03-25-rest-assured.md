---
title: RestAssured
description: RestAssured Test 
slug: rest-assured
authors: dongle  
tags: [SpringBoot, Test, rest-assured]
image: https://i.imgur.com/mErPwqL.png
hide_table_of_contents: false
---
Test시 Mock 이 지겹다면 RestAssured 를 강력추천합니다.    
<!--truncate-->

모든 소스는 [이곳에서](https://github.com/sk1737030/til/tree/master/rest-assured) 확인이 가능합니다!

# Rest Assured

REST Assured Java 라이브러리를 사용하여 REST 어플리케이션의 HTTP Endpoint에 초첨을 맞춘 테스트 도구이며, MockMVC와 같이 테스트를 편리하게 해주는 **`유용한 테스트 도구`**이며, 인수테스트 작성으로도 많이 사용이됩니다.

## 사용

### gradle.build

```java
testImplementation 'io.rest-assured:rest-assured'
```

- 당연하지만, 기본적인 test 를 위한 기본 것들은 import 하고 있어야한다.

### 코드

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT) //(0)
class RestAssuredApplicationTests {

  protected static RequestSpecification REQUEST_SPEC;

  @LocalServerPort
  private Integer port;

  @BeforeEach
  public void setRequestSpec() {
    RequestSpecBuilder reqBuilder = new RequestSpecBuilder();
    reqBuilder.setContentType(ContentType.JSON);
    reqBuilder.setPort(port);
    REQUEST_SPEC = reqBuilder.build();
  }

  @Test
  void getOrder() {
    ExtractableResponse<Response> actualResponse =
        RestAssured. // (1)
            given(). // (2)
              spec(REQUEST_SPEC).log().all().
            when(). // (3)
              get("/order/{orderId}", 1L).
            then(). // (4)
              log().all().extract(); // (5)

    assertThat(actualResponse.statusCode()).isEqualTo(HttpStatus.OK.value());
    assertThat(actualResponse.jsonPath().getObject(".", OrderController.OrderResponse.class)).isEqualTo(new OrderController.OrderResponse(1L, 10000L, 1000L));
  }

}
```

간단한 타켓 url 을 get 요청 및 검증하는 테스트입니다.

(0)`@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)`

- End to End 테스트 목적이니 SpringBootTest를 사용합니다.
- `webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT`
    - 지정된 포트로 톰캣을 띄우게 됩니다. 이는 실제로 mock이 아닌 별도의 스레드로 톰켓을 시작하게됩니다

  ![/tomcatstart](./2023-03-25/Untitled.png)

    <aside>
    💡 `WebEnvironment` **default** 설정은 **mock**입니다!

  In WebEnvironment.java  
  `WebEnvironment webEnvironment() default WebEnvironment.MOCK;`

    </aside>


(1) `RestAssured`

- `RestAssured` 를 시작으로 Java DSL 형태로 작성이 가능합니다.

    <aside>
    💡 Java DSL이란?

  DSL(Domain-specific Languages, 도메인 전용언어), 특정 비지니스 도메인의 문제를 해결하려고 만든 특수 프로그래밍 언어입니다.
  Stream, Collector 같은 것들도 DSL입니다.

    </aside>


(2) `given().log().all()`

- 모든 request 헤더와 바디 부분을 상세하게 로깅해줍니다.
- all 말고도 원하는 params, body, path 것을 명시가능합니다.
- given 에서 header 등에 여러 인증을 명시 할 수 있습니다.

(3) `when().get("/template/{targetId}", targetId)`

- get, post, put 등 원하는 httpMethod를 명시 할 수 있습니다.
- 안에 target url을 넣어서 요청이 됩니다.

(4) `then()`

- then 절에서는 주로 여러 응답을 검증 할 수 있습니다.
- 또는 응답 로그 확인용으로 사용이 가능합니다.

(5) `extract()`

- response 로 추출을 할 수 있습니다.
- 가져온 response로 추가 검증이 가능합니다.

`log.all`

아래왜 같이 콘솔에 요청 또는 응답 로그를 남기겠다고 명시하는 것입니다.

![request](./2023-03-25/Untitled%201.png)

## 번외

Mock을 사용하지 않고 end to end 테스트하기 `with FeignClient`

외부 request 요청 시 FeignClient를 많이 사용하는데, 이는 자연스럽게 외부 자원에 대한 테스트 고민을 하게 만들어줍니다.

여러가지 문제가 있는데요. 그것을 어떻게 해결 할 수 있는지 알아봅시다.

### FeignClient 는 Primary default 인 Config 이다.

즉, Bean으로 같은 name으로 생성해서는 FeignClient 를 갈아끼울 수 있는 방법이 없습니다. 이를 해결하고자 여러 방법이 있습니다.

![문제의 primary](./2023-03-25/Untitled%202.png)  


1. 가장 쉬운 방법은 default를 false로 선언하는 것입니다.

    ```java
    @FeignClient(
      name = "order",
      url = "${targetUrl}",
      primary = false  // (1)
    )
    public interface OrderClient { 
    	public Long orderAmount(Long id);
    }
    
    @Component
    @Primary
    public class FakeOtherOrderClient implements OtherOrderClient { // (2)
    
      @Override
      public Long orderAmount(Long id) {
        return 10000L;
      }
    
    }
    
    @RestController
    @RequestMapping("/order")
    public class OrderController {
    
      private final OtherOrderClient otherOrderClient;
    
      public OrderController(OtherOrderClient otherOrderClient) {
        this.otherOrderClient = otherOrderClient;
      }
    
      @GetMapping("/{orderId}")
      public ResponseEntity<OrderResponse> getOrder(@PathVariable Long orderId) {
        Long amount = otherOrderClient.orderAmount(orderId);
        return ResponseEntity.ok(new OrderResponse(orderId, amount, 1000L));
      }
    }
    ```

    - 이런식으로 테스트 패키지 아래 위치를 시켜 fake로 만들어서 대신 응답을 뱉을 수 있습니다 (~~예제는 사실 stub에 가깝긴하지만..~~)

   (1) `@FeignClient(primary = false)`

    - false로 primary config 로 등록이 안되도록 명시 해줍니다.

   (2) `public class FakeOtherOrderClient implements OtherOrderClient`

    - Fake 클래스로 상속을 받아 primary 로 선언을해서 테스트 시 Bean을 강제로 바꿔치기하는 것입니다.

2. 만약 FeignClient가 외부 dependency 인 경우에는 Feign Client에 false를 집어 넣을 수 없는데요 이때에는, OrderClient를 한 번더 감싸서 클래스로 만들고 만든 부분을 fake로 만드는 것입니다.
    - 글로 표현하면 어려운데요. 코드로 보시면 쉬울 거 같습니다!

    ```java
    @FeignClient(
      name = "order",
      url = "{targetUrl}"
    )
    public interface OrderClient { 
    
    	public Long orderAmount(Long id);
    }
    
    @Service
    public class WrapperOrderClient { // (1)
    
      private final OtherOrderClient otherOrderClient;
    
      public WrapperOrderClient(OtherOrderClient otherOrderClient) {
        this.otherOrderClient = otherOrderClient;
      }
    
      public Long orderAmount(Long id) {
        return otherOrderClient.orderAmount(id);
      }
    
    }
    
    @RestController
    @RequestMapping("/v2/order")
    public class OrderControllerV2 { 
    
      private final WrapperOrderClient wrapperOrderClient;
    
      public OrderControllerV2(WrapperOrderClient wrapperOrderClient) {
        this.wrapperOrderClient = wrapperOrderClient; 
      }
    
      @GetMapping("/{orderId}")
      public ResponseEntity<OrderResponse> getOrder(@PathVariable Long orderId) {
        Long amount = wrapperOrderClient.orderAmount(orderId); // (2)
        return ResponseEntity.ok(new OrderResponse(orderId, amount, 1000L));
      }
    }
    
    @Component
    @Primary
    public class FakeOtherOrderClientV2 extends WrapperOrderClient { // (3)
    
      public FakeOtherOrderClientV2(OtherOrderClientV2 otherOrderClientV2) {
        super(null);
      }
    
      @Override
      public Long orderAmount(Long id) {
        return 10000L;
      }
    
    }
    ```

   (1) `public class WrappedOrderClient`

    - 우리 코드에서 컨트롤이 가능하도록 WrapperOrderClient를 한 번더 감쌉니다.  

   (2) `Long amount = wrapperOrderClient.orderAmount(orderId);`

    - 일반적으로 사용 사용 할 때와 동일하게 사용합니다. 그저 감싼 객체로 사용을 합니다. 

   (3) `public class FakeOtherOrderClientV2 extends WrapperOrderClientTest`

    - 테스트 패키지에서 생성 후 감싼 객체를 상속을 받게 합니다.




### MockMvc와 차이점

MockMvc는 웹 애플리케이션을 애플리케이션 서버에 배포하지 않고도 스프링 MVC의 동작을 재현할 수 있는 라이브러리이며 대부분 Controller Layer Unit Test(단위 테스트)에 사용됩니다.

실제 서버 환경과 동일한 `@SpringBootTest`를 사용하지않고 Presentation Layer Bean들만 불러온다. 그리고 그 외 Bean은 Mock 객체 설정을 해주어 순수한 Controller 로직을 테스트를 할 수 있게 도와줍니다

물론 `@SpringBootTest` 를 사용하면 end to end 테스트가 가능하나, `RestAssured` 는 bdd기반의 테스트 코드를 작성 할 수 있게 도와줘서 테스트 가독성을 높여주며, json 검증시에도 상대적으로 쉽게 검증이 가능한 장점이 있다.

## 결론

이상으로 RestAssured를 알아봤는데요. 그러면 RestAssured의 단점은 SpringBootTest를 사용하게되다보니 테스트 속도가 mock을 사용 할 때 보다 매우 느립니다. 그래서 상황에 맞게 사용하는게 좋고, 개인적으로는 테스트 작성시에 `end-to-end` 테스트 시에는 BDD 형태로 가독성이 좋은 `RestAssured`를 사용하고, `Unit test` 또는 특정 레이어 텟트시에는 `mockmvc` 로 테스트를 한다면 좋을 거 같습니다.

# 참고

[Restaussred used docs](https://github.com/rest-assured/rest-assured/wiki/Usage)
[https://www.baeldung.com/rest-assured-tutorial](https://www.baeldung.com/rest-assured-tutorial)