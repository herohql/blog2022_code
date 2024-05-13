---
title: Angular 生命周期之 ngOnChanges
date: 2022-08-15
tags:
  - angular

summary: 主要用于监测组件输入属性的变化，它会获得一个 SimpleChanges 对象，包含绑定属性的新值和旧值。
comment:
  title: ngOnChanges
---

## 示例

### child.component.ts
```js
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-child',
  template: `
    <a (click)="changeFromChild()">Change from child</a>
    <br/>
    {{parentData}}
  `	
})
export class ChildComponent implements OnInit {
  @Input() parentData: any;
  constructor() {
  }

  ngOnInit() {
  }

  changeFromChild(){
    this.parentData -= 1;
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
  }
}

```
### 父组件.ts

```js
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-parent',
  template: `
    <a (click)="changeFromParent()">Change from parent</a>
    <br/>
    <app-child [parentData]=data></app-child>
  `
})
export class ParentComponent implements OnInit {
  data = 0
  constructor() {
  }

  ngOnInit() {
  }

  changeFromParent(){
    this.data += 1;
  }
}
```

* `ngOnChanges()` 将在 `ngOnInit()` 之前触发，并且每次 `parentData` 从其父组件更新时触发
* `ngOnChanges()` 采用 `SimpleChanges` 类型的更改参数。
* `changeFromChild()` 不会调用 `ngOnChanges()`
* `changeFromParent()` 将调用`ngOnChanges()`
* 当调用 `ngOnChanges()`时，此示例仅记录 `SimpleChanges` 实例。

每次调用 `ngOnChanges()` 时，`SimpleChanges` 实例都会捕获 `parentData`的
* 上一个值
* 当前值
* firstChange（第一次调用 ngOnChanges 时为真）

下面是示例记录的SimpleChange对象：

```js
ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
}
//console output
{
  parentData: { currentValue: 1, firstChange: false, previousValue: 0 }
}
```

### 多输入呢？
每个输入属性在单个对象中与其对应的 SimpleChanges 实例一起返回
```js
//SimpleChanges object with multiple inputs
{
  parentData: { currentValue: 1, firstChange: false, previousValue: 0 },
  firstName: { currentValue: "Sam", firstChange: false, previousValue: "Eric" },
  age: { currentValue: 25, firstChange: false, previousValue: 20 }
}
```
### ngOnChanges 与 ngOnInit

`ngOnInit` 在组件初始化时只被<font color="#96151d">调用一次</font>。

`ngOnChanges` 在 `ngOnInit` 之前以及每当组件的绑定输入从父组件更改时被调用。

> 请记住，`ngOnChanges` 特定于子组件上的绑定输入。这意味着如果您没有任何 `@Input` 属性，则永远不会调用 `ngOnChanges`。

### 什么时候应该使用 ngOnChanges？

每当您想检测由 `@Input` 修饰的变量的更改时，请使用 `ngOnChanges`。请记住，只有父组件的更改才会触发此功能。

还要记住，即使没有实现 ngOnChanges，来自父级的更改仍然会更新子级值。`ngOnChanges` 只是增加了跟踪先前值和当前值的追踪功能。