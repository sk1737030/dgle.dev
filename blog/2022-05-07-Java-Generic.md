---
title: 까먹어서 다시 보는 Generic
description: 까먹어서 다시 찾아보는 제네릭
slug: generic
authors: dongle  
tags: [Java]
image: https://i.imgur.com/mErPwqL.png
hide_table_of_contents: false
---
모든 소스는 [이곳에서](https://github.com/sk1737030/til/tree/master/til-generic/src) 확인 가능 합니다!

## Generic 제네릭 지네릭 줴네릭 

제네릭을 사용하는데, 헷갈려서 다시 공부 할 겸 정리
<!--truncate-->

### 제네릭이란???

JDK 1.5에 도입된 `컴파일` 시에 미리 타입을 지정해서, 런타임시에 오류를 줄이고 타입 검사나 타입 변환과 같은 번거로운 작업을 생략할 수 있는 타입 검사를 도와주는 **갓갓문법**이다.

### 그렇다면 왜 나왔을까??

```java
// 문제의 코드
List<Object> list = new ArrayList<>();
before.add("pub");
before.add("dog");
before.add(1);

for (Object o : before) {
    String substring = ((String) o).substring(0, 1); // Runtime Error
    System.out.println(substring);
}
```

list 안에 어떠한 타입이라도 들어갈 수 있게 돼서, 컴파일 시에 에러를 알 수가 없고, 그러다 보니 런타임시에 에러가 발생을 하게 되고, 개발 할 때에도 더욱 불편한 건 항상 타입체크를 하고 casting을 해야 여러 메소드를 사용할 수 있게 된다. 

### 흔한  Generic 사용

```java
public class Main {

    public static void main(String[] args) {

        List<String> list = new ArrayList<>(); // 1.7 이후에서는 타입 추론이 가능해서 뒤에 타입은 생략이 가능하다.
        list.add("pub");
        list.add("dog");
        list.add(1); // Complie Error

				for (String s : list) {
            String substring = s.substring(0, 1);
            System.out.println(substring);
        }
    }
}
```

타입을 `체크`할 필요도 없고 `캐스팅` 할 필요도 없어진다.

### 조금 더

Dog Sitter(집사) 강아지 집사가 간식을 준다고 했을 때 

```java
public class Animal{}
public class Dog extends Animal{}
public class Pug extends Dog{}
public class Siba extends Dog{}
```

```java
public class Sitter {

	public void giveSnack(House<Dog> house, Snack snack) {
		...
  }
}

```

컴파일 에러나는 상황  

```java
Pug pug = new Pug();
Dog dog = pug;

System.out.println(pug.getClass()); // class generic.animal.Pug
System.out.println(dog.getClass()); // class generic.animal.Pug

Sitter sitter = new Sitter();
House<Pug> pugHouse = new House<>();
sitter.giveSnack(pugHouse, new Snack()); // 컴파일 error!
```

- 매우.. 헷갈리지만 조금 더 생각해보면 컴파일 에러가 나는 이유는 당연하다. 만약 컴파일 에러가 안 난다고 가정을 해보면

if 컴파일 error가 아니라면 !

```java
Sitter sitter = new Sitter();
House<Pug> pugHouse = new House<>();
House<Siba> sibaHouse = new House<>();
sitter.giveSnack(pugHouse, new Snack()); // 컴파일 error가 아니라면!
sitter.giveSnack(sibaHouse, new Snack()); // 컴파일 error가 아니라면!
```

- 이렇게 Dog을 상속했지만 두 가지의 다른 타입이 들어갈 수 있게 되는 상황이 발생한다.
    
    **어 아니? 그래서 뭐가 문제야 Dog를 상속한 pug와 siba 가앙지들이 들어 갈 수 있는거 아니야!????** 
    

![Untitled](2022-05-0/../2022-05-07/Untitled.png)  

만약 저게 허용이 된다고 가정 했을 때의 문제가 되는 부분을 코드로 본다면 

```java
public class House<T> implements Iterable {
 
    List<T> lists = new ArrayList<>();

    public void add(T t) {
        lists.add(t);
    }

    public T get(int i) {
        return lists.get(i);
    }

		@Override
    public Iterator iterator() {
        return lists.iterator();
    }

    @Override
    public void forEach(Consumer action) {
        Iterable.super.forEach(action);
    }

    @Override
    public Spliterator spliterator() {
        return Iterable.super.spliterator();
    }
}
```

```java
House<Pug> pugHouse = new House<>();
House<Siba> sibaHouse = new House<>();

House<Dog> dogHouse = new House<>();
dogHouse.add(pugHouse); // Compile Error
dogHouse.add(sibaHouse); // Compile Error

for(Dog dog: dogHouse) {
    ...
}
```

아까 1.5 이전에 보았던 비슷한 문제가 오른쪽의 코드에서 생기게 된다. 

:::note그렇다면 왜 자바는  raw type을 허용했을까?
`List list = new ArrayList<>()`가 되는 이유는 호환성 때문이다. 자바가 제네릭을 받아들이기까지 거의 10년이 걸린 탓에 제네릭 없이 짠 코드가 이미 세상을 뒤덮어 버렸다. 그래서 기존 코드를 모두 수용하면서 제네릭을 사용하는 새로운 코드와도 맞물려 돌아가게 해야만 했다. raw 타입을 사용하는 메서드에 매개 변수화 타입의 인스턴스를 넘겨도 동작해야만 했던 것이다.
:::note

### [무변성 (invariant)](https://stackoverflow.com/questions/8902331/what-is-a-class-invariant-in-java)

A가 B의 상위 타입일 때 `GenericType<A>`가 `GenericType<B>` 의 상위 타입이 아니면 변성이 없다.
다른 코드들이 뭘 하든 간에, 클래스의 모든 인스턴스에 대해 유지되는 속성이다.  

```java
Animal animal = new Pug();
House<Animal> dogHouse = new House<Dog>(); // Compile Error 
```

`House<Animal>` 은 `House<Dog>` 의 상위 타입이 아니다. 아니니까 속성이 유지될 수 없다.

### **[공변 (covariant)](https://www.javatpoint.com/covariant-return-type)**

우리가 ~~(그나마 나에게)~~ 가장 흔하게 쓰는 형태이지 않을까 싶다. 상위타입에서 물 흐르듯이 하위타입의 방향으로 코드를 사용할 때이다.  

- A가 B의 상위 타입이고 `T<A>`가 `T<B>`의 상위 타입이면 공변이라 한다.

    ```java
    public class Sitter {

        public void giveSnack(House<? extends Dog> dog, 
                Snack snack) {
            List<? extends Dog> all = dog.getAll();
        }
    }
    ```

    ```java
    // 공변
    Sitter covariant = new Sitter();
    House<Pug> pug2 = new House<>();
    covariant.giveSnack(pug2, new Snack());

    House<Siba> siba2 = new House<>();
    covariant.giveSnack(siba2, new Snack());
    ```

- 문제점
    ```java
    House<Pug> pug = new House<>();
    House<? extends Dog> dogHouse = pug;
    // dogHouse.push(new Pug()); // Compile Error
    ```

    ```java
    public class House<T> implements Iterable{

            ...

        List<T> lists = new ArrayList<>();
            
        public void push(T pug) {
            lists.add(pug);
        }
    }
    ```

### [반공변(contravariant)](https://codechacha.com/ko/java-covariance-and-contravariance/)  

- A가 B의 상위 타입이고 `T<A>`가 `T<B>`의 하위 타입이면 반공변이라한다.  
    
    ```java
    // 반공변
    House<Pug> pug = new House<>();
    House<? super Pug> pugh = pug;
    
    House<Dog> dog = new House<>();
    House<? super Pug> pughh = dog;
    ```
    
-  반공변은 반대로 Get을 할 때 컴파일 에러가 발생한다.  

    ```java
    // 반공변
    House<Dog> dog = new House<>();
    House<? super Dog> pugh = dog;
    pugh.push(new Pug());
    pugh.push(new Dog());
    // Pug housePug = pugh.get(0); // Compile Error

    House<Pug> pug = new House<>();
    House<? super Pug> pugh2 = pug;
    pugh2.push(new Pug());
    // pugh2.push(new Dog()); // Compile Error
    // Pug housePug = pugh2.get(0); // Compile Error
    ```

에러가 발생하는 이유는 당연한데 조금만 더 곰곰이 생각해보면, ~~사실 생각해봐도 어렵다~~ get으로 가져올 때 return 값이 Pug일 수도 있고, Pug 위에 상위객체가 올 수 있어서 에러가 날 수밖에 없다.

### Java 코드에 반공변 볼 수 있는 곳

```java
public class Collecitons  {
	public static <T> void copy(List<? super T> dest, List<? extends T> src) {
		...
	}
}
```

```java
List<Integer> src = new ArrayList<>();
List<Number> dest = new ArrayList<>();

Collections.copy(dest, src);
```

![Untitled](2022-05-07/Untitled%201.png)

### 타입 제거 시기

자바 코드에서 선언되고 사용된 제네릭 타입은 컴파일 시 컴파일러에 의해 자동으로 검사되어 타입 변환된다. 그 후에 코드 내의 모든 제네릭 타입은 제거되어, 컴파일된 class 파일에는 어떠한 제네릭 타입도 포함되지 않게 된다. 이런 식으로 동작하는 이유는 제네릭을 사용하지 않는 코드와의 호환성을 유지하기 위해서이다.  



출처  
[https://docs.oracle.com/javase/tutorial/java/generics/types.html](https://docs.oracle.com/javase/tutorial/java/generics/types.html)  
[http://www.tcpschool.com/java/java_generic_concept](http://www.tcpschool.com/java/java_generic_concept)  
[https://www.youtube.com/watch?v=PtM44sO-A6g](https://www.youtube.com/watch?v=PtM44sO-A6g)  
[Effective Java](http://www.yes24.com/Product/Goods/65551284)  
[https://stackoverflow.com/questions/8902331/what-is-a-class-invariant-in-java](https://stackoverflow.com/questions/8902331/what-is-a-class-invariant-in-java) 무변성이란  
[https://codechacha.com/ko/java-covariance-and-contravariance/](https://codechacha.com/ko/java-covariance-and-contravariance/)  