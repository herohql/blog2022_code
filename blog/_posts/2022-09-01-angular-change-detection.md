---
title: angular 变更检测策略
date: 2022-09-01
tags:
  - angular 
 

summary: 
comment:
  title: angular-change-detection
---

## Angular  提供两种变更检测策略
* Default
* OnPush

`@Component` 装饰器上，通过`changeDetection`属性来修改策略

默认：`changeDetection: ChangeDetectionStrategy.Default`。

改为OnPush
```js
@Component({
    selector: "app-view",
    template: `...`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
```

## 先说结论：
OnPush 策略并不是把所有的变更检测都禁掉了，下面三种情况依然可以自动触发变更检测
1. @Input<b>引用</b>发生变化
2. 事件，比如 click、submit、mouse down...
3. Observable  事件订阅，同时设置 Async pipe

4. 手动触发变更检测

* ChangeDetectorRef.detectChanges
* ChangeDetectorRef.markForCheck()
* ApplicationRef.tick()

## 示例说明：
### 1.  @Input<b>引用</b>发生变化

在 JS 中有七种数据类型，其中包括六中基本类型, 一种引用类型。

六种基本类型分别为：Boolean、Number、String、Null、Undefined、Symbol (ECMAScript 6 新定义)。
一种引用类型：对象(Object)、数组(Array)、函数(Function)，还有两个特殊的对象：正则（RegExp）和日期（Date）

基本类型每次对它们的修改都会在内存里生成一个新的值， 而 `Object` 是通过引用传递的，每次对 Object 属性改动，引用不会改变。
```js
//父组件
@Component({
    template: `<h1>I am { { data.name } } </h1>

               <app-child [data]="data"></-child>
   
               <button (click)="changeDate()">Change</button>`
})
export class ParentComponent {
    data: any = {
        name: 'xiaoming',
        contact: {
            email: 'XXX@gmail.com'
        }
    };
    changeDate() {
        this.data.contact.email = 'new@gmail.com';
        this.data.name = 'xiaohei';
    }

}
```
```js
//子组件
@Component({
    selector: "app-child",
    template: `{ { data.contact.email } } `,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CDChildComponent implements OnChanges {
    @Input() data: any;

    ngOnChanges() {
        console.log('data has been changed');
    }
}
```
子组件@Component 上加了`changeDetection: ChangeDetectionStrategy.OnPush`, 我们点击 Change按钮，子组件 email 没有变化,因为对象的引用没有改变，不触发变更检测，。
>在 ChildComponent 加了 OnPush 表示，不会触发这个组件的变化检测。如果 OnPush 是加在某个父组件上，那么这个父组件和它下面所有的子组件都不会触发变化检测。

### 2. 事件触发
组件的 DOM 事件，包括其子组件的 DOM 事件，如 click、submit、mouse down 等，在 OnPush 策略下，会触发组件的变化检测。

在 `ChildComponent` 加一个 counter，并把它显示在页面里，在 ngOnInit 里把设置了 setInterval，每过一秒就让counter+1，代码如下：
```js
@Component({
    selector: "app-child",
    template: `<h3> child: { { counter } }</h3>
                `,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CDChildComponent implements OnInit, OnChanges {
    @Input() data: any;
    counter: number = 1;

    ngOnInit() {
        setInterval(() => this.counter++, 1000);
    }

    ngOnChanges() {
        console.log('data has been changed');
    }

}
```
> 如果是默认的变化检测策略，setInterval 会触发组件变化检测，页面的 counter 会每过一秒就自动更新一次。现在设置了 `OnPush`，setInterval 不会触发变化检测，页面上的 counter 不会有任何变化。

在 `ChildComponent` 页面加一个按钮，在这个按钮的点击事件里，设置每点击一次按钮让counter+1，具体代码如下：
```js
@Component({
    selector: "app-child",
    template: `
              <h3> child: { { counter } } </h3>
              <button (click)="changeCounter()">change child counter</button>
               `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CDChildComponent implements OnChanges {
    @Input() data: any;
    counter: number = 1;

    changeCounter() {
        this.counter++;
    }

    ngOnChanges() {
        console.log('data has been changed');
    }

}
```
> 按钮点击事件是属于 DOM 事件，虽然在 `ChildComponent` 设置了 `OnPush`，组件的 DOM 事件（或者它的子组件DOM事件）还是会触发这个组件的变化检测，页面的 counter 会更新

### <span id="async">3. Observable 事件订阅，同时设置 Async pipe</span>
在 `ChildComponent` 有`Observable`事件订阅，并在模板里设置`Async pipe`，在 `OnPush` 策略下，会触发变化检测，代码如下：
```js
@Component({
    selector: "app-child",
    template: `<h3>child: { { count$ | async } } </h3>
               `,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ChildComponent implements OnInit, OnChanges {
    @Input() data: any;
    counter: number = 1;
    count$: Observable<number>;

    ngOnInit() {
        this.count$ = interval(1000)
            .pipe(
                map((count: number) => ++count)
            );
    }
    ngOnChanges() {
        console.log('data has been changed');
    }
}
```
这时候页面的会每隔一秒更新一次

### 4. 手动触发变更检测
在 OnPush 策略下，手动三种方式会触发变化检测：

- ChangeDetectorRef.detectChanges
- ChangeDetectorRef.markForCheck()
- ApplicationRef.tick()

#### ChangeDetectorRef.detectChanges()
```js
@Component({
    selector: "app-child",
    template: `
                <h3> child: { { counter } } </h3> 
              `,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ChildComponent implements OnInit, OnChanges {
    @Input() data: any;
    counter: number = 1;

    constructor(private cd: ChangeDetectorRef) { }

    ngOnInit() {
        setInterval(() => {
            this.counter = this.counter + 1;
            this.cd.detectChanges();
        }, 1000);
    }
    ngOnChanges() {
        console.log('data has been changed' );
    }

}
```
> 立刻触发当前组件及子组件的变更检测
#### ChangeDetectorRef.markForCheck()
```js
@Component({
    selector: "app-child",
    template: `
                <h3> child: { { counter } } </h3> 
              `,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ChildComponent implements OnInit, OnChanges {
    @Input() data: any;
    counter: number = 1;
  
    constructor(private cd: ChangeDetectorRef) { }

    ngOnInit() {
        setInterval(() => {
            this.counter = this.counter + 10;
            this.cd.markForCheck();
        }, 1000);
    }
    ngOnChanges() {
        console.log('data has been changed:');
    }

}
```
> 效果跟 `detectChanges` 是一样的，只不过 `detectChanges` 会立马触发当前组件和它子组件变化检测。`markForCheck` 并不会立马触发变化检测，而是标记需要被变化检测，在当前或下一轮的变化检测中被触发。

#### ApplicationRef.tick()
```js
@Component({
    selector: "app-child",
    template: `
                <h3> child: { { counter } } </h3> 
              `,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ChildComponent implements OnInit, OnChanges {
    @Input() data: any;
    counter: number = 1;

    constructor(private applicationRef: ApplicationRef)) { }

    ngOnInit() {
        setInterval(() => {
            this.counter = this.counter + 1;
             this.applicationRef.tick();
        }, 1000);
    }
    ngOnChanges() {
        console.log('data has been changed');
    }

}
```
> `ApplicationRef.tick()` 触发整个应用的组件树从上到下执行变化检测。

## 什么是AsyncPipe
来自angular官方文档：AsyncPipe会订阅一个Observable或者Promise并返回它发出的最近的一个值，AsyncPipe会将该组件标记为需要进行变更检测，当组件被销毁时，AsyncPipe会自动取消订阅，以消除内存泄漏。

angular 异步管道允许订阅 angular 模板语法内的 observable，并负责自动取消订阅 observable。[代码](#async)

#### 直接用subscribe 订阅也挺方便的，为什么要使用异步管道呢？
需要取消订阅的业务，推荐用异步管道，如果不用异步管道，需要多如下代码。
1. `ngOnint中`添加对observable的订阅
2. 为了防止内存泄漏，`ngOnDestory`中添加`unsubscribe`
>  通过API 返回的数据，不需要调用 unsubscribe() 取消订阅，因为 Http Request 返回的 Observables 是 Cold Observable 并且只发送一个值，Cold Observable 在值发送完成以后，RxJS 会执行 OnCompleted 方法，表示这个 Observable 已经结束了，自动释放资源。