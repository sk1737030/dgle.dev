---
title: Spring Kafka Graceful Shutdown
description: Spring kafka는 Graceful shutdown하게 잘 죽을까?
slug: kafkashutodwn
authors: dongle  
tags: [SpringBoot, Kafka, Graceful, Shutdown]
image: https://i.imgur.com/mErPwqL.png
hide_table_of_contents: false
---

Consumer가 메세지를 처리중에 Spring Boot 어플리케이션에서 shutdown event가 일어 났을 때 과연 잘 Shutdown Graceful하게  종료가 되는지가 궁금해서 해보는 실험. 
<!--truncate-->

[모든 소스는 이곳](https://github.com/sk1737030/til/tree/master/spring-kafka-graceful-shutdown)에서 확인 가능합니다 :)

# Spring Boot Kafka Grace full Shutdown

Consumer가 메세지를 처리중에 Spring Boot 어플리케이션에서 shutdown event가 일어 났을 때 과연 잘 Shutdown Graceful하게  종료가 되는지가 궁금해서 해보는 실험. 

## 무엇을 테스트하냐

Consumer가 컨슘 후 데이터를 잘 commit하는지 Conusmer info 관찰 

`shutdownTimeout` : defualt 30초 

`Kafka version`: 2.7.1

`SpringBootVersion`: v2.5.6

## 방법

1. `shutdownTimeout`  내 정상적으로 모든 메세지가 잘 처리 되도록
    1. Spring Boot Kafka 메세지를 10개 생성
    2. Consume 할 때 처리 시간이 개당 1초가 걸리도록 실험 
    3. 모든 메세지를 소비 할 때까지 최소 10초의 시간이 필요한 작업으로 설정
    4. 컨슈머 커밋이 어떻게 되는지 확인
2. `shutdownTimeout`을 넘어서도록 설정 
    1. Spring Boot Kafka 메세지를 10개 생성
    2. Consume 할 때 처리 시간이 개당 10초가 걸리도록 실험 
    3. 모든 메세지를 소비 할 때까지 최소 100초의 시간이 필요한 작업으로 설정 
    4. 컨슈머 커밋이 어떻게 되는지 확인

`Shutdown Signal`은 단순하게 2로 테스트할 예정이다.

linux의 shutdow number 확인

![[https://linuxhint.com/kill-signal-numbers-linux/](https://linuxhint.com/kill-signal-numbers-linux/)](./2022-06-20/Untitled.png)  

[https://linuxhint.com/kill-signal-numbers-linux/](https://linuxhint.com/kill-signal-numbers-linux/)

- **SIGKILL (9)**: SIGKILL signal 은 프로세스를 즉각 종료 할 때 사용한다.
- **SIGINT(2)**: 사용자의 요청으로 중단이 될 때 사용한다. (e.g., Ctrl+C).
- S**IGTERM(15)**: SIGTERM signal 종료 요청을 보낸다, 요청을 보낼 뿐 SIGKILL은 아니다.

:::noteaSigterm
안전하게 어플리케이션을 종료하고 싶으면 `SIGINT`나 `SIGTEMR`으로 요청을 추천한다.
:::note

## 실험 및 결과

각종 설정은 default로 설정하고 진행한다.

```
fetch.max.bytes = 52428800
fetch.max.wait.ms = 500
fetch.min.bytes = 1
auto.commit.interval.ms = 5000
```

### 1번

Consumer test.offset.1의  offset 확인  

![Untitled](./2022-06-20/Untitled%201.png)  
- `current-offset`: 36
- `Lag`: 9

어플리케이션 종료 `signal 2: SIGINT`  

```
2022-06-08 16:45:18.347 DEBUG 11696 --- [ionShutdownHook] s.c.a.AnnotationConfigApplicationContext : Closing org.springframework.context.annotation.AnnotationConfigApplicationContext@34d046b6, started on Wed Jun 08 16:45:09 KST 2022
2022-06-08 16:45:18.347 DEBUG 11696 --- [ionShutdownHook] ySourcesPropertyResolver$DefaultResolver : Found key 'spring.liveBeansView.mbeanDomain' in PropertySource 'systemProperties' with value of type String
2022-06-08 16:45:18.348 DEBUG 11696 --- [ionShutdownHook] o.s.c.support.DefaultLifecycleProcessor  : Stopping beans in phase 2147483547
```

Debug로 로그 확인  

```
essageListenerContainer$ListenerConsumer : Commit list: {test-0=OffsetAndMetadata{offset=45, leaderEpoch=null, metadata=''}}
essageListenerContainer$ListenerConsumer : Committing: {test-0=OffsetAndMetadata{offset=45, leaderEpoch=null, metadata=''}}
org.apache.kafka.clients.NetworkClient   : [Consumer clientId=consumer-test.offset.1-1, groupId=test.offset.1] Sending OFFSET_COMMIT request with header RequestHeader(apiKey=OFFSET_COMMIT, apiVersion=7, clientId=consumer-test.offset.1-1, correlationId=17) and timeout 30000 to node 2147483646: {group_id=test.offset.1,generation_id=5,member_id=consumer-test.offset.1-1-0fd44995-c1a6-451a-9987-ab35edab9f74,group_instance_id=null,topics=[{name=test,partitions=[{partition_index=0,committed_offset=45,committed_leader_epoch=-1,committed_metadata=}]}]}
org.apache.kafka.clients.NetworkClient   : [Consumer clientId=consumer-test.offset.1-1, groupId=test.offset.1] Received OFFSET_COMMIT response from node 2147483646 for request with header RequestHeader(apiKey=OFFSET_COMMIT, apiVersion=7, clientId=consumer-test.offset.1-1, correlationId=17): OffsetCommitResponseData(throttleTimeMs=0, topics=[OffsetCommitResponseTopic(name='test', partitions=[OffsetCommitResponsePartition(partitionIndex=0, errorCode=0)])])
o.a.k.c.c.internals.ConsumerCoordinator  : [Consumer clientId=consumer-test.offset.1-1, groupId=test.offset.1] Committed offset 45 for partition test-0
o.a.k.c.c.internals.ConsumerCoordinator  : [Consumer clientId=consumer-test.offset.1-1, groupId=test.offset.1] Executing onLeavePrepare with generation Generation{generationId=5, memberId='consumer-test.offset.1-1-0fd44995-c1a6-451a-9987-ab35edab9f74', protocol='range'} and memberId consumer-test.offset.1-1-0fd44995-c1a6-451a-9987-ab35edab9f74
o.a.k.c.c.internals.ConsumerCoordinator  : [Consumer clientId=consumer-test.offset.1-1, groupId=test.offset.1] Revoke previously assigned partitions test-0
o.s.k.l.KafkaMessageListenerContainer    : test.offset.1: partitions revoked: [test-0]
essageListenerContainer$ListenerConsumer : Commit list: {}
o.a.k.c.c.internals.AbstractCoordinator  : [Consumer clientId=consumer-test.offset.1-1, groupId=test.offset.1] Member consumer-test.offset.1-1-0fd44995-c1a6-451a-9987-ab35edab9f74 sending LeaveGroup request to coordinator localhost:9092 (id: 2147483646 rack: null) due to the consumer unsubscribed from all topics
org.apache.kafka.clients.NetworkClient   : [Consumer clientId=consumer-test.offset.1-1, groupId=test.offset.1] Sending LEAVE_GROUP request with header RequestHeader(apiKey=LEAVE_GROUP, apiVersion=2, clientId=consumer-test.offset.1-1, correlationId=18) and timeout 30000 to node 2147483646: {group_id=test.offset.1,member_id=consumer-test.offset.1-1-0fd44995-c1a6-451a-9987-ab35edab9f74}
o.a.k.c.c.internals.AbstractCoordinator  : [Consumer clientId=consumer-test.offset.1-1, groupId=test.offset.1] Resetting generation due to consumer pro-actively leaving the group
o.a.k.clients.consumer.KafkaConsumer     : [Consumer clientId=consumer-test.offset.1-1, groupId=test.offset.1] Unsubscribed all topics or patterns and assigned partitions
o.s.s.c.ThreadPoolTaskScheduler          : Shutting down ExecutorService
o.a.k.c.c.internals.AbstractCoordinator  : [Consumer clientId=consumer-test.offset.1-1, groupId=test.offset.1] Heartbeat thread has closed
o.a.k.c.c.internals.ConsumerCoordinator  : [Consumer clientId=consumer-test.offset.1-1, groupId=test.offset.1] Executing onLeavePrepare with generation Generation{generationId=-1, memberId='', protocol='null'} and memberId
o.a.k.c.c.internals.AbstractCoordinator  : [Consumer clientId=consumer-test.offset.1-1, groupId=test.offset.1] Resetting generation due to consumer pro-actively leaving the group
org.apache.kafka.clients.NetworkClient   : [Consumer clientId=consumer-test.offset.1-1, groupId=test.offset.1] Received LEAVE_GROUP response from node 2147483646 for request with header RequestHeader(apiKey=LEAVE_GROUP, apiVersion=2, clientId=consumer-test.offset.1-1, correlationId=18): LeaveGroupResponseData(throttleTimeMs=0, errorCode=0, members=[])
o.a.k.c.c.internals.AbstractCoordinator  : [Consumer clientId=consumer-test.offset.1-1, groupId=test.offset.1] LeaveGroup response with Generation{generationId=5, memberId='consumer-test.offset.1-1-0fd44995-c1a6-451a-9987-ab35edab9f74', protocol='range'} returned successfully: ClientResponse(receivedTimeMs=1655698563052, latencyMs=12, disconnected=false, requestHeader=RequestHeader(apiKey=LEAVE_GROUP, apiVersion=2, clientId=consumer-test.offset.1-1, correlationId=18), responseBody=LeaveGroupResponseData(throttleTimeMs=0, errorCode=0, members=[]))
```

흥미로운 로그가 몇 개 보인다. 

1. OFFSET_COMMIT  
2. Revoke Listener가 작동을 하고  
3. LeaveGroup Request  
4. Thread Shutodnw Event가 시작을 하고   
5. HeaerBeat thread가 종료 되고   
6. LeaveGroup을 받는다.  

topic의 offset 확인   
![Untitled](./2022-06-20/Untitled%202.png)  

- `current-offset`:45
- `lag`: 0

### 2번

Consumer test.offset.1의  offset 확인 

![Untitled](./2022-06-20/Untitled%201.png)

- current-offset: 36
- Lag: 9

어플리케이션 종료 `signal 2: SIGINT`

```
2022-06-08 16:45:18.347 DEBUG 11696 --- [ionShutdownHook] s.c.a.AnnotationConfigApplicationContext : Closing org.springframework.context.annotation.AnnotationConfigApplicationContext@34d046b6, started on Wed Jun 08 16:45:09 KST 2022
2022-06-08 16:45:18.347 DEBUG 11696 --- [ionShutdownHook] ySourcesPropertyResolver$DefaultResolver : Found key 'spring.liveBeansView.mbeanDomain' in PropertySource 'systemProperties' with value of type String
2022-06-08 16:45:18.348 DEBUG 11696 --- [ionShutdownHook] o.s.c.support.DefaultLifecycleProcessor  : Stopping beans in phase 2147483547
```

Shout down TimeOut 이후 로그를 본다면

```
2022-06-03 18:16:35.861  INFO 9116 --- [ionShutdownHook] o.s.c.support.DefaultLifecycleProcessor  :
 **Failed to shut down 1 bean with phase value 2147483547 within timeout of 30000ms:** 
[org.springframework.kafka.config.internalKafkaListenerEndpointRegistry]
```

Offset 확인

![Untitled](./2022-06-20/Untitled%203.png)

`shutdown timeout`으로 인해 Commit이 정상적으로 안된 상태이다.

### 결론

Timeout 이내에 메시지는 잘 `Graceful`하게 처리한다. 그러나 만약 timeout 내에 처리를 못 한다면 메시지를 중복으로 처리하는 상황이 나타날 수 있으니, 적절한 방어 로직과 수동 commit으로 풀어서 처리를하거나 timeout을 알맞게 설정해야 할 거 같다.

# 참고  
[https://docs.spring.io/spring-kafka/docs/2.5.17.RELEASE/reference/html/](https://docs.spring.io/spring-kafka/docs/2.5.17.RELEASE/reference/html/)  
[https://bravenamme.github.io/2020/10/06/graceful-shutdown/](https://bravenamme.github.io/2020/10/06/graceful-shutdown/)  
[https://docs.confluent.io/confluent-cli/current/overview.html](https://docs.confluent.io/confluent-cli/current/overview.html)  
[https://kafka.apache.org/documentation/](https://kafka.apache.org/documentation/)  
[signum 번호 설명](https://linuxhint.com/kill-signal-numbers-linux/) 
[zoe kafka cli](https://github.com/adevinta/zoe)  
[consume Config 설명](https://docs.confluent.io/platform/current/installation/configuration/consumer-configs.html)