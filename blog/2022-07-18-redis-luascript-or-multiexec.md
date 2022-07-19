---
title: 레디스 원자성을 위한 multi 와 luascript의 차이
description: What is difference Between Redis luascript and multi exec 
slug: redis-multi-lua
authors: dongle  
tags: [Redis, Luascript, transaction]
image: https://i.imgur.com/mErPwqL.png
hide_table_of_contents: false
---
Redis에서 원자성을 위해 Luascirpt와 Multi Exec 중 뭘 써야할까?
<!--truncate-->


# Redis에서 원자성을 위해 Luascirpt와 Multi Exec 중 뭘 써야할까?

## Multi와  exec를 사용하면

Multi와 exec는 레디스에서 트랜잭션을 사용하겠다는 명령어인데 일반적인 RDB와 다르게 롤백기능이없다. (롤백기능이 없는 이유는 단순성과 성능에 상당한 영향을 미치기 때문에 RDB와 다르게 없다고한다.)  
그러면 레디스는 어떻게 트랜잭션을 바라볼까? Multi로 선언하면 multi안에 명령어들이 묶여 순서대로 같이 큐에 담기게된다. 그리고 EXEC를 만나는 순간 큐에 담긴 명령어들이 순서대로 한 오퍼레이션에 묶여 실행이되고  
만약 큐에 쌓인 명령어가 중간에 실패하는 일이 생기면 실패한 부분만 skip하고 다음부분이 연속적으로 실행되게된다. 



```java
> MULTI
OK
> INCR foo
QUEUED
> INCR bar
QUEUED
> EXEC
1) (integer) 1
2) (integer) 1
```

위와 같이, exec의 명령을 한 순서대로 array형태로 응답값을 준다. 

<br />

### watch와 같이 사용하면

우리가 사용하는 RDB의 optimistic lock과 같은데, 만약 짧은시간에 여러 클라이언트가 동시에 접근 할시 흔히 동시성 문제가 생기는데 `watch` 를 사용하면 해결이 된다. 

```java
WATCH mykey
val = GET mykey
val = val + 1
MULTI
SET mykey $val
EXEC
```

myKey라는 key에 watch를 주고(키를 감시) 작업 후에, exec(수신 전) 전 다른 클라이언트에서 먼저 val값을 수정을했으면 트랜잭션은 자동으로 실패하게 된다.  
이 때는 클라이언트의 수정뿐만 아니라 ttl에 의한 키만료 제거 등과같이 Redis에 자체에 의한 수정도 포함이된다.  


:::note
Trasnaction 안에 있는 명령은 exec가 전송 될 때까지 큐에 담겨있어서 watch에 트리거 되지 않으니 주의해야한다.
:::note

💡 `Discard`
Discard는 큐에 담겨있는 것들을 버린다.

```
> SET foo 1
OK
> MULTI
OK
> INCR foo
QUEUED
> DISCARD
OK
> GET foo
"1"
```

<br />

## Luascript란

루아스크립트는 Redis에 내장된 실행 엔진에 의해 실행되는데. 현재 레디스는 단일 스크립트 엔진인 lua 5.1 인터피리터를 지원한다. 또 스크립트는 서버에서 실행되므로 이는 자연스럽게 네트워킹 리소스를 절약하게 되어 스크립트에서 데이터를 읽고 쓰는 건 매우 효율적이게 작동한다. 또 레디스에서 루아 스크립트를 사용하면 atomic을 함을 보장해준다. 또 루아스크립트를 사용하면 조건적인 update를 여러 키에 컬쳐 지원해주고,  개별의 각기다른 데이터 타입을 원자적으로 결합이가능해진다.

그냥 단순한 사용을 해본다면 

```java
>EVAL "return redis.call('SET', KEYS[1], ARGV[1])" 1 foo bar
OK
> GET foo
bar
```

조금 더 사용을 해본다면 

```java
> EVAL "redis.call('sadd','myset1', 'user1')
redis.call('sadd','myset2', 'user2')
local members = redis.call('keys','myset*') 
local results = {} 
for index,key in ipairs(members) 
do results[index] = redis.call('smembers',key) 
end return results" 
```

<br />

## 차이점
`multi/exec` 는 트랜잭션 응답을 array 형태로 받아서 여러 명령어를 통해 예를들어 작업은 불가능하지만 Luasript는  script를 이용해 가능하다.  
예를 들어 lpop으로 담긴 userlist 큐에 순서대로 꺼내서 그 키값으로 user의 점수를 올린다고한다면 luascript를 사용하면 편하다.

```java
> lpush userList user1 user2 user3
> EVAL "
local user = redis.call('LPOP', 'userList')
local result = redis.call('INCRBY', user, 1);

return result " 
```
<br />

## 뭘 사용해야할까
`multi`를 사용하던 `luascript` 를 사용하던 둘다 atomic하게 한 오퍼레이션에 명령들을 한 번에 같이 보낼 수 있지만 특정 상황에서는 `multi/exec`로는 구현이 힘들 때가있으니 이때 luascript 사용이 대안이 될 수 있다.

<br />

참고   
[https://redis.io/docs/manual/programmability/eval-intro/](https://redis.io/docs/manual/programmability/eval-intro/)  
[https://stackoverflow.com/questions/62970603/lua-scripts-vs-multi-exec-in-redis](https://stackoverflow.com/questions/62970603/lua-scripts-vs-multi-exec-in-redis)   
[redisTransaction](https://redis.io/docs/manual/transactions/)  
[https://redis.io/commands/eval/](https://redis.io/commands/eval/)  
[https://scalegrid.io/blog/redis-transactions-long-running-lua-scripts/](https://scalegrid.io/blog/redis-transactions-long-running-lua-scripts/)  
[https://engineering.linecorp.com/ko/blog/atomic-cache-stampede-redis-lua-script/](https://engineering.linecorp.com/ko/blog/atomic-cache-stampede-redis-lua-script/)  
[lua script limits to solve the problem of inaccurate high concurrency counts](https://javamana.com/2022/195/202207141451441296.html)  