---
title: Spring Boot Batch 따라가보기 - 1
description: Follow up Spring Boot Batch
slug: spring-boot-batch-1
authors: dongle
tags: [ SpringBoot, SpringBootBatch, Spring-Boot-Batch ]
image: https://i.imgur.com/mErPwqL.png
hide_table_of_contents: false
---

코린이의 Spring Boot Batch 파헤쳐보기
<!--truncate-->

# 스프링 배치

## 배치 사용 이유

대량의 레코드의 로깅 분석, 트랜잭션 관리, 잡 프로세스 관리, 잡 재시작, skip, 리소스 관리등 사용성좋은 기능들을 제공해준다. 가장 큰 이점으로는 여러 data formatter를 지원하여 Read,
Write 를 도와줘서 복잡한 코드를 사용하지 않아도 사용하기가 쉽다.

또한 중요한 다른 이점으로 청크 기반의 프로세싱을 지원하며, 배치 잡 상태를 관리해주는데, 중단된 실패한 잡의 재시작, 여러 이유로 skip되버린 records의 재시작, 또는 잡의 진행상태 들을 관리해주어
유지보수관리에 용이하다.

## 배치 아키텍처

## Job 시작 flow

![batch-job-start-flow](./2023-04-27/Untitled.png)

1. 마지막에 실행된 job을 조회
2. 없으면 새로운 job을 등록
3. 있을 경우 해당하는 job을 조회한다.
    - 여러가지 상태들을 확인한다.
        - ex) step 들의 상태가 running 또는 *STOPPING 일시 throw*

### 배치 비지니스 로직 flow

![spring-boot-batch-business-flow](./2023-04-27/Untitled.png)

**JobInstance**

JobInstace는 논리적으로 실행을 나타낸다. JobInstae는 Job 이름과 인수로 식별된다. Job명이 동일하다면 동일한 JobInstance로 생각을하여, Job이 에러 등으로 처리가 도중에 중단하고
있었을 경우 재실행을 보장 할 수 있고, 처리의 도중부터 실행된다.

**JobExecution**

JobExecution은 작업의 실행을 나타낸다. JobInstance 와 1:N의 관계를 가진다.  
ExecutionContext를 가지고있는데 Spring Batch가 여러 진행 상황과 메타데이터를 체크하기위해 가지기도 하지만 사용자가 공유를위해 사용할 수 도 있다.

**StepExecution**

StepExecution은 Step의 실행을 나타낸다. JobExecution과 StepExecution은 1:N의 관계를 가진다.
JobExecution과 마찬가지로 ExecutionContext를 가지는데, 복수의 step간의 공유를 위해서 사용하지 않을려면 StepExecution을 사용 할 수 있다.

# 참고

[Spring Batch Tutorial: Batch Processing Made Easy with Spring | by Jalal Nasser | DreamiFly | Medium](https://medium.com/dreamifly/spring-batch-tutorial-batch-processing-made-easy-with-spring-3219b4de052)  
https://www.baeldung.com/rest-assured-tutorial)