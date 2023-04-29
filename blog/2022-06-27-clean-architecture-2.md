---
title: 만들면서 배우는 클린 아키텍처 정리 - 2
description: Clean Architecture Study - 2
slug: clean-arch-2
authors: dongle  
tags: [Spring Boot, Clean Architecture, Book]
image: https://i.imgur.com/mErPwqL.png
hide_table_of_contents: false
---
만들면서 배우는 클린 아키텍처를 읽고 공부한 내용을 정리. - 2
<!--truncate-->

모든 소스는 [이곳에](https://github.com/sk1737030/til/tree/master/clean-architecture) 있습니다:)

### 테스트 전략
만드는 비용이 적고, 유지보수하기 쉽고, 빨리 실행되고, 안정적인 작은 크기의 테스트들에 대해 높은 커버리지를 유지해야 한다는 것이다. 가장 확실한 건 하나의 클래스가 제대로 동작하는지 확인할 수 있는 **단위테스트**이다.  
![테스트피라미드 [https://martinfowler.com/bliki/TestPyramid.html](https://martinfowler.com/bliki/TestPyramid.html)](./2022-06-27/Untitled%206.png)  
테스트피라미드 [https://martinfowler.com/bliki/TestPyramid.html](https://martinfowler.com/bliki/TestPyramid.html)  
위로 올라 갈 수록 비용이 비싸진다.  

<br />

### 테스트를 작성 할 때 지금하려는 목적이 뭔지 생각해야한다.
테스트는 서비스가 모킹된 대상의 특정 메서드와 상호작용했는지 여부를 검사 할 수 있는데 만약 모든 것을 검증하려다 보면 클래스가 조금이라도 변경되면 테스트가 쉽게 변경이된다. 이는 테스트의 본질을 떨어뜨리는 행위기 때문에 불필요한 부분은 테스트를 하지 않고 **중요한 핵심 비지니스만 검증**을 하는 것이 더 낫다.

<br />

### 얼마만큼의 테스트면 충분할까?
라인 커버리지는 중요하지 않다. 80% 로든 심지어 100%로든 버그가 없다고 할 수 없다. 사람마다 다르겠지만 그냥 내가 마음이 불안하지않고 편하다면 충분하다고 생각이든다. 테스트를 실행 후에 마음이 편안한 상태로 배포를 할 수 있으면 충분하다고 본다. 
육각형 아키텍처에서의 테스트 전략은 

1. 도메인 엔티티를 구현할 때에는 **단위 테스트로** 커버  
2. 유스케이스를 구현 할 때는 **[단위 테스트로](https://github.com/sk1737030/til/blob/master/clean-architecture/src/test/java/com/clean/architecture/hexagonal/account/application/service/SendMoneyServiceTest.java)** 커버
3. 어댑터를 구현할 때는 **[통합 테스트로](https://github.com/sk1737030/til/blob/master/clean-architecture/src/test/java/com/clean/architecture/hexagonal/account/adapter/in/web/SendMoneyControllerTest.java)** 커버
4. 사용자가 취할 수 있는 중요 애플리케이션 경로는 [시스템 테스트로](https://github.com/sk1737030/til/blob/e41051a996d373182946204aa5d94a51b7ab0f20/clean-architecture/src/test/java/com/clean/architecture/hexagonal/SendMoneySystemTest.java) 커버

 <br />

`시스템 테스트`와 `통합테스트` 의 목적은 다르다.

:::note
**통합테스트는** 주로  `@WebMvcTest` 애너테이션을 사용하여 스프링이 특정 요청 경로, 자바와 JSON간의 매핑, http 입력 검증, 응답 값 검증 등에 필요한 전체 객체 네트워크를 인스턴스화하도록 만든다. 그리고 테스트에서는 웹 컨트롤러가 네트워크의 일부로서 잘 동작하는지 검증하기 때문에 필요하다.
:::note

:::note
새로운 필드를 추가할 때마다 테스트를 고치는 데 한 시간을 써야 한다면 뭔가 잘못된것이다!!!! 테스트 코드도 리팩토링 대상이다. 모킹하는 것이 너무 버거워지거나 코드의 특정 부분을 커버하기 위해 어떤 종류의 테스트를 써야 할지 모르겠다면 이는 **경고 신호**이다.
:::note

<br />

### 아키텍처 경계 강제하기
![[https://reflectoring.io/book/](https://reflectoring.io/book/)](./2022-06-27/Untitled%207.png)
[https://reflectoring.io/book/](https://reflectoring.io/book/) 

애플리케이션 계층은 애플리케이션 서비스안에 유스케이스를 구현하기 위해 도메인 엔티티에 접근한다.  
어댑터는 인커밍 포트를통해 서비스에 접근하고, 반대로 서비스는 아웃고잉 포트를 통해 어댑터에 접근한다.   
마지막으로 설정 계층은 어댑터와 서비스 객체를 생성할 팩터리를 포함하고 있고, 의존성 주십 메커니즘을 제공한다.  
의존성 규칙에 따르면 계층 경계를 넘는 의존성은 항상 안쪽방향으로 향해야 한다.  

<br />

경계표시를 위해서 자바에서 많이 쓰는 방법이  접근제한자를 쓰는 것이다. `package-private(default)`, `protectect`, `private` 를 사용한다.


:::note
`package-private`는 만능이 아니다. 패키지 내에 클래스가 특정 개수를 넘어가기 시작하면 하나의 패키지에 너무 많은 클래스를 포함하는 것이 혼란스러워지게 된다. 이렇게 되면 코드를 쉽게 찾을 수 있도록 하위 패키지를 두게 되는데 자바는 하위 패키지를 다른 패키지로 취급하기 때문에 하위 패키지의 package-private 멤버에 접근할 수 없게 된다. 그래서 하위 패키지의 멤버는 public으로 만들어서 바깥 세계에 노출시켜야 하기 때문에 규칙이 깨질 수 있다.
:::note

<br />

### 깨진창문이론
- 품질이 떨어진 코드에서 작업할 때 더 낮은 품질의 코드를 추가하기가 쉽다.  
- 테스트코드가 없는 코드는 테스트코드를 추가하지 않기 쉽다.  
- 지름길을 많이 사용한 코드에서 작업할 때 또 다른 지름길을 추가하기 쉽다.  
- 코딩 큐칙을 많이 어긴 코드에서 작업할 때 또 다른 큐칙을 어기기도 쉽다.  
- 깃 브랜치를 어지럽게 하면 점점 더 어지러워진다.  

<br />

### 의식적으로 지름길을 사용하기
지름길이 꼭 나쁜건 아니다. 때로는 시간적, 경제적등 다양한이유로 사용 할 수 있다. 이때에는 의도적으로 지름길을 사용했다는 사실을 문서로 남기고 팀에 공유하자 그러면 깨진 창문 이론의 영향을 더 줄일 수 있을 것이다.  

- 인커밍 포트 건너뛰기
    - 컨트롤러에서 서비스 바로 접근하기
- 애플리케이션 서비스 건너뛰기
    - 컨트롤러에서 레포지토리 바로 접근하기
- 도메인 엔티티를 입출력 모델로 사용하기
- 유스케이스간 같은 모델 공유하기
    - 다른 유스케이스인데 같은 모델을 공유

<br />

### 도메인이 왕이다
애플리케이션을 개발 할 때 도메인이 정말 중요하다면, 육각형 아키텍처를 사용 할 수 있다. `외부의 영향을 받지 않고 도메인 코드를 자유롭게 발전시킬 수 있다는 것은 육각형 아키텍처 스타일이 내세우는 가장 중요한 가치다.`  육각형 아키텍처는 당연한 말이겠지만 DDD의 조력자이다.   

<br />

### 경험이 여왕이다.

인간은 습관의 동물이기 때문에 편안한 길로 가려고한다. 물론 이게 나쁜 결정이 아니지만 다른 경험도 해보면 더 좋은 길을 찾을 수 있기 때문에, 작은 모듈부터 시작을 해서 경험을 해나가는 연습을 가지자. 내가 생각 했을 때는  중요한 것은 `정답은 없다` 그때그때 다르다 도메인마다 다르고 어떤 소프트웨어를 만드냐에 다르고 팀의 경험에 따라 다르다 그리고 내 마음에 드느냐에 따라서도 다르니 정답이 없다.  

<br />
<br />

# 참고   
[만들면서 배우는 클린 아키텍처](http://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9791158392758&orderClick=LAG&Kc=)  
[로버트마르틴형의원문](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) → [한글번역](https://blog.coderifleman.com/2017/12/18/the-clean-architecture/)  
[마틴형의테스트피라미드](https://martinfowler.com/bliki/TestPyramid.html)  
