---
title: DB transaction Isolation에 대해서 알아보자
description: Db 트랜잭션 Isolation
slug: db-isolation
authors: dongle  
tags: [DB, Isolation]
image: https://i.imgur.com/mErPwqL.png
hide_table_of_contents: false
---

예전에 한 번 읽었던 RealMysql를 다시금 읽으면서 정리하는 Transaction Isolation!
<!--truncate-->

# Transaction Isolation Level

### ACID
ACID는 데이터베이스 내에서 일어나는 하나의 트랜잭션(transaction)의 안전성을 보장하기 위해 필요하다.
- `Atomicity`: transaction의 작업이 부분적으로 성공하는 일이 없도록 보장하는 성질이다. 송금하는 사람의 계좌에서 돈은 빠져나갔는데 받는 사람의 계좌에 돈이 들어오지 않는 일은 없어야 한다.  
- `Consistency`: transaction이 끝날 때 DB의 여러 제약 조건에 맞는 상태를 보장하는 성질이다. 송금하는 사람의 계좌 잔고가 0보다 작아지면 안 된다.  
- `Isolation`: transaction이 진행되는 중간 상태의 데이터를 다른 transaction이 볼 수 없도록 보장하는 성질이다. 송금하는 사람의 계좌에서 돈은 빠져나갔는데 받는 사람의 계좌에 돈이 아직 들어가지 않은 DB 상황을 다른 transaction이 읽으면 안 된다.  
- `Durability`: transaction이 성공했을 경우 해당 결과가 영구적으로 적용됨을 보장하는 성질이다. 한 번 송금이 성공하면 은행 시스템에 장애가 발생하더라도 송금이 성공한 상태로 복구할 수 있어야 한다.  

:::note동시성
ACID를 높이면 높일 수록 동시성이 떨어진다, 
:::note

### Read Uncommitted (Dirty Read)

- 일반적으로 거의 사용하지 않는다.  
- 변경 내용이 commit이나 Rollback 여부에 상관 없이 다른 트랜잭션에게 보여준다.  
- 어떤 트랙잭션에서 처리한 작업이 완료되지 않았는데도 다른 트랜잭션에서 볼 수 있게 된다.  
- Dirty read를 유발한다.

### Read Committed

- Oracle Dbms에서 기본적으로 사용되고 있는 격리 수준(`Shared Lock`을 사용한다)
    - Shared Lock
        - 일반적인 SELECT 쿼리는 lock을 사용하지 않고 DB를 읽어 들인다. 하지만 `SELECT ... FOR SHARE` 등 일부 SELECT 쿼리는 read 작업을 수행할 때 DB가 각 row에 Shared lock을 건다.
- `Commit이 완료된 데이터`만 다른 트랜잭션에서 조회 할 수 있다.
- 어떤 트랜잭션에서 처리한 작업이 Commit이 안되어 있다면 다른 트랜잭션은 undo 영역에 있는 기존 값을 참조해서 보여준다.
- Non-repetable read라는 부정합 문제 발생 할 수 있다.
    
:::note
`Repeatable read`: 하나의 트랜잭션 내에서 동일 select 쿼리를 실행했을 때는 항상 같은 결과가 나와야한다는 정합성 정의
:::note>

동일 Transaction1 내에서 Select문의 결과값을 받고 작업 도중 만약 다른 Transaciton2에서 insert 또는 update를 했다고 가정 했을 때 Transaction1에서 같은 select에 다른 결과값이 보일 수 있는 문제이다. 

글로 설명하면 조금 햇갈리는데 그림으로 보면 쉽다..


![[https://akasai.space/db/about_isolation/](https://akasai.space/db/about_isolation/)](./2022-05-24/Untitled.png)  
[https://akasai.space/db/about_isolation/](https://akasai.space/db/about_isolation/)
    

### Repeatable Read

- Mysql InnoDB에서 기본적으로 사용되는 격리 수준(Shared Lock을 사용한다)
- Non-repetable read라는 부정합 문제가 발생하지 않는다.
- Undo 공간에 백업해두고 실제 레코드 값을 변경한다.
- 언두 영역에 백업된 레코드의 여러 버전 가운데 몇 번째 이전 버전까지 찾아 들어가야 하는지에 있다. Undo 영역에서 특정 트랜잭션 번호의 구간 내에서 백업된 데이터를 보여준다. 하지만 트랜잭션을 종료하지 않으면 무한정으로 언두 영역이 커질 수 있어서 성능 하락이 될 수 있음.
    
![[https://www.cyber.pe.kr/2016/11/mysql-innodb-type.html](https://www.cyber.pe.kr/2016/11/mysql-innodb-type.html)](./2022-05-24/Untitled%201.png)  
[https://www.cyber.pe.kr/2016/11/mysql-innodb-type.html](https://www.cyber.pe.kr/2016/11/mysql-innodb-type.html)

1. 시스템 테이블 영역
    - DB의 시스템이 생성한 영역이다. 사용자가 생성한 데이터베이스와 테이블, 테이블에 대한 메타 정보 등을 정리하여 관리한다.
2. 트랜잭션 영역
    - DB가 쿼리를 처리하는 과정에서 시스템 상의 오류가 발생할 경우 원상태로 복구하기 위해 쿼리 처리 이전의 데이터를 보관하는 영역이다.
3. 데이터 영역
    - 실제 데이터가 저장되는 영역으로, DB 사용자가 저장한 모든 데이터는 이 영역에 저장된다. 이 영역에서는 DB의 성능을 유지하기 위해 데이터 삭제 시, 완전 삭제 대신 데이터가 삭제된 것으로 표시만 하고 삭제 영역에 데이터를 그대로 유지한다. 이 같은 특징 때문에 삭제된 데이터의 복구가 가능하다.
    

### Serializable

- 동시성이 중요한 DB에서는 거의 사용하지 않는다.
- 읽기 작업도 공유 잠금을 획득 해야 하며 동시에 다른 트랜잭션은 그러한 레코드를 변경하지 못한다.
- 한 트랜잭션에서 읽고 쓰는 레코드를 다른 트랜잭션에서는 접근 불가하다

참고  
[https://suhwan.dev/2019/06/09/transaction-isolation-level-and-lock/](https://suhwan.dev/2019/06/09/transaction-isolation-level-and-lock/) - gap lock, record lock 등 격리 레벨별 설명이 자세하다.  
[https://www.cyber.pe.kr/2016/11/mysql-innodb-type.html](https://www.cyber.pe.kr/2016/11/mysql-innodb-type.html)  
[RealMysql](http://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9791158392703)