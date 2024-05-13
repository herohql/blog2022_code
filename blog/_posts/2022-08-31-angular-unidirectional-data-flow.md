---
title: angular 单向数据流
date: 2022-08-31
tags:
  - angular 
 

summary: 
comment:
  title: unidirectional-data-flow
---
[stackoverflow](https://stackoverflow.com/questions/42634822/what-is-angulars-unidirectional-data-flow-rule)中看到个提问
>Angular's unidirectional data flow rule forbids updates to the view after it has been composed.<br>
>Angular 的单向数据流规则禁止在视图组合后对其进行更新。

>网友 ：I had to read this sentence about 8 times very slowly and I still don't get it

首先需要重申一下Angular中视图的概念，视图（View）是构建 UI 的最小单元，视图（View）分为 宿主视图（Component）、模板视图（Template）

![alt](@assets/2022/6.png)

单向数据流是指 视图树从上往下将数据转换为视图的过程中，不会进一步修改数据。

比如从上到下的变化检测流中，一旦变化检测已经完成了，任何更低层级的 component 都不允许去改变父级的属性。 

在实际开发中，有些钩子函数通过`@Output`去改变 父级 component 的数据值，是允许的，而有些又不允许。

Angular 组件树渲染过程与生命周期的关系:

![alt](@assets/2022/5.png)

更新 input bindings，然后会触发 child component 中 OnInit、DoCheck、OnChanges 函数，如果页面有 ng-content，相应也会触发 ngAfterContentInit 和 ngAfterContentChecked。

`AfterViewChecked`和`AfterViewInit`是在变更检测（change detetion）之后执行的，这时候数据正在渲染为视图，你又去改变数据，被认为是违反 Angular 的单向数据流。

 OnInit、DoCheck、OnChanges 函数是在变更检测之前执行的，这个时候还没有通知组件树去渲染DOM，所以可以对数据进行更改的。

 示例：
 定义一个父级组件 ComponentA，在这里会显示从 ChildComponent 发过来的 message，代码如下：

```js
@Component({
    template:`<h1>this is child A page</h1>
            <h4>{ { msgFromChild } } </h4>
            <app-child (sendMsgToParent)="getMsgFromChild($event)">
              this is child
            </app-child>`
})

export class ComponentA {
    msgFromChild: any = '';
    getMsgFromChild(value: any) {
        this.msgFromChild = value;
    }
}

```
定义一个 ChildComponent，通过 @Output 向 ComponentA 发送 message，代码如下：
```js
@Component({
    selector: "app-child",
    template: `<h5 style="color: crimson">this is grand child</h5>
                <ng-content></ng-content>`
})

export class ChildComponent implements  OnInit {
    @Output() sendMsgToParent: EventEmitter<any> = new EventEmitter<any>();
    msg = "hello, change this to parent component"
    ngOnInit() {
        this.sendMsgToParent.emit(this.msg);
    }
}
```
> 把 ngOnInit 换成 ngDoCheck、ngAfterContentInit、ngAfterContentChecked、ngOnChanges，效果是一样的，在 ComponentA 中 message 都能正常显示也不会报错。<br>
> 把 ngOnInit 换成 ngAfterViewInit 或 ngAfterViewChecked 就会报错。