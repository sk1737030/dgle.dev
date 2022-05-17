---
title: Spring Kafka Rebalancing 처리 해보기
description: 카프카 리밸런싱이 일어나는 경우 어떻게 처리 
slug: rebalnace
authors: dongle  
tags: [Kafka, Spring Kafka]
image: https://i.imgur.com/mErPwqL.png
hide_table_of_contents: false
---

[모든 소스는 이곳에서](https://github.com/sk1737030/til/tree/master/kafka-repartitioning) 확인 가능합니다 :)

## 스프링 부트에서 Kafka Rebalancing 처리 해보기

Kafka를 통해 메시지를 받는 애플리케이션을 구성할 때 프로덕션 환경에서는 고려해야 할 여러 상황이 있는데 지금 생각나는 대표적으로 메시지유실, 중복 메시지 Consume, 확장 가능한 key 정하기, 카프카 리밸런싱 등 카프카를 사용하는데 많은 힘듦이 많이 있는데, 카프카 리밸런싱 상황에서 우리의 애플리케이션이 당황하지 않고 처리를 잘 할 수 있는 방법을 소개해 보려고 한다.

<!--truncate-->

### 카프카 리밸런싱이란?

먼저 리밸런싱이 뭔지 잠깐 알아보고 간다면, Kafka 토픽을 구성할 때 한 토픽을 여러 개의 Partitions들로 구성하는 일이 많은데, 자연스럽게 Consumer(`같은 Group.Id`)도 여러 개로 구성이 된다. 이때 메시지를 Consume 하는 상황에서 Consumer가 여러 가지 상황으로 인하여 Broker와 연결이 끊어졌을 때, 일어나는 것이 `리밸런싱인데` 문제없이 메시지를 소비하게 위해서 브로커가 장애가 일어났다고 판단하고 기존 Consumer에 할당되어 있는 파티션을 다른 Consumer에 재 할당하는 것이다. 

### 그렇다면 꼭 리밸런싱 처리를 해야할까?

이건 애플리케이션에서 카프카를 사용하는 이유에 따라 다른데, 만약 토픽을 컨슘 할 때 특정 key를 기준으로 컨슘을 하고 있다고 예를 들어 배달 주문에 대해서 카프카를 사용한다고 하였을 때 토픽의 Key를 한식(0 번), 중식(1 번), 양식(2 번), 일식(3 번) 으로 (그럴 리는 없겠지만) 할 경우, 만약 일식을 컨슘하는 애플리케이션이 어떠한 장애로 컨슘을 못한다고 하였을 때, 일식(3 번)의 파티션이 한식(0 번) 파티션으로 할당되었을 때 (런타임에) 처리가 따로 필요할 수가 있다. 한식만 가지고 있는 메뉴 정보를 일식을 포함한 메뉴 정보로 다시 불러온다든지, 아니면 따로 알람 처리를 한다든지 내부 메모리에 가지고 있는 정보들을 초기화 작업이 필요하는 등 여러 가지 처리할 수 있기 때문에 리밸런싱 처리는 카프카를 사용하는 이유에 따라 달라 처리 할 수도 안 해도 된다.

### 코드로

코드로 처리하는 부분은 의외로 간단한데 일단 Spring Docs에서 확인을 해본다면  
`Kafka의 ConsumerRebalanceListener` 를 구현한 `ConsumerAwareRebalanceListener` 를 사용하면 된다.

```java
public interface ConsumerAwareRebalanceListener extends ConsumerRebalanceListener {
 ...

default void onPartitionsRevokedBeforeCommit(Consumer<?, ?> consumer, Collection<TopicPartition> partitions) {
		try {
			onPartitionsRevoked(partitions);
		}
		catch (Exception e) { // NOSONAR
			LOGGER.debug(e, "User method threw exception");
		}
	}

	default void onPartitionsRevokedAfterCommit(Consumer<?, ?> consumer, Collection<TopicPartition> partitions) {
	}

	default void onPartitionsLost(Consumer<?, ?> consumer, Collection<TopicPartition> partitions) {
		try {
			onPartitionsLost(partitions);
		}
		catch (Exception e) { // NOSONAR
			LOGGER.debug(e, "User method threw exception");
		}
	}

	default void onPartitionsAssigned(Consumer<?, ?> consumer, Collection<TopicPartition> partitions) {
		try {
			onPartitionsAssigned(partitions);
		}
		catch (Exception e) { // NOSONAR
			LOGGER.debug(e, "User method threw exception");
		}
	}

	@Override
	default void onPartitionsRevoked(Collection<TopicPartition> partitions) {
	}

	@Override
	default void onPartitionsAssigned(Collection<TopicPartition> partitions) {
	}

	@Override
	default void onPartitionsLost(Collection<TopicPartition> partitions) {
	}
```

`onPartitionsAssigned` 은 파티션 재할당이 성공적으로 완료될 때 호출된다.  
`onPartitionsRevoked` 은 할당되어 있던 파티션이 제거 될 때 호출된다.  
`onPartitionsLost` 은  일반적인 상황에서는 실행이 안되나 만약 컨슈머의 세션 제한 시간이 만료되었거나 컨슈머가 더 이상 그룹에 속하지 않음을 나타내는 치명적인 오류가 수신된 경우 호출된다.  

:::noteReBalancing순서
참고로 일반적인 파티션이 할당되고 잘 실행되고 있는 런타임 환경에서는 당연한 말이 겠지만 `PartitionsRevoke`가 실행된 후 `PartitionsAssigned`가 실행된다. 반면 애플리케이션이 실행 될 때에는 `PartitionsAssigned`만 실행된다.
:::note

그래서 쉽게 Spring Kaka에서 잘 감싸서 준 `ConsumerAwareRebalanceListener` 상속 받아서 사용하면 된다.

```java
@Component
public class MyListener implements ConsumerAwareRebalanceListener {

  @Override
  public void onPartitionsAssigned(Consumer<?, ?> consumer, Collection<TopicPartition> partitions) {
      ConsumerAwareRebalanceListener.super.onPartitionsAssigned(consumer, partitions);
      System.out.println("onPartitionsAssigned");
      partitions.forEach(topicPartition -> System.out.println(topicPartition.partition()));
  }

  @Override
  public void onPartitionsLost(Consumer<?, ?> consumer, Collection<TopicPartition> partitions) {
      ConsumerAwareRebalanceListener.super.onPartitionsLost(consumer, partitions);
      System.out.println("onPartitionsLost");
  }

  @Override
  public void onPartitionsRevoked(Collection<TopicPartition> partitions) {
      ConsumerAwareRebalanceListener.super.onPartitionsRevoked(partitions);
      System.out.println("onPartitionsRevoked");
  }
}
```

`consumer` 에는 `Consumer`에  여러 정보들을 볼 수 있다.  
`partitions` 파라미터로 현재 할당 된 목록을 인자로 준다.  

![Untitled](TIL%209ed8da153fae44fea5d41800018a5caf/Untitled.png)

### 느낀점

진짜 카프카 너무 어렵다. 특히 카프카에 의존성이 높으면 높을수록 난도가 올라가는 거 같다. 생각 해 볼 부분들이 많은데, 카프카의 메시지를 produce할 때 유실이 나면 안 되는 서비스인데 어떻게 빠르면서 메시지가 유실되지 않을까를 고려 한다든지, 토픽의 key를 어떤 key로 설정하냐에 확정성이 있고 메시지가 잘 분배 될 때라던지, 리파티니셔닝 상황에서의 서비스가 문제가 없을까 메세지를 중복으로 읽을 경우는 없을 거라든지, 중복으로 메시지를 컨슘 할 경우도 있는데 이때는 어떻게 처리 해야 할까 등등 정말 카프카 어렵다. 그런데 막상 이런 걸 하나하나 해결 해서 서비스가 장애 없고 우아하게 잘 돌아가는 걸 할 수 있다면 얼마나 맛이 있을까? 그런 상상을 하면서 ~~야-근을 한다.~~

 

![Untitled](TIL%209ed8da153fae44fea5d41800018a5caf/Untitled%201.png)

참고  
[https://developer.confluent.io/learn-kafka/apache-kafka/partitions/](https://developer.confluent.io/learn-kafka/apache-kafka/partitions/)  
[https://www.popit.kr/kafka-consumer-group/](https://www.popit.kr/kafka-consumer-group/)  
[group id와 consume id 차이](https://stackoverflow.com/questions/34550873/difference-between-groupid-and-consumerid-in-kafka-consumer)  
[스프링 Kafka Docs](https://docs.spring.io/spring-kafka/docs/2.5.17.RELEASE/reference/html/)  
[ConsumerRebalanceListener설명](https://kafka.apache.org/25/javadoc/org/apache/kafka/clients/consumer/ConsumerRebalanceListener.html#onPartitionsLost-java.util.Collection-)  