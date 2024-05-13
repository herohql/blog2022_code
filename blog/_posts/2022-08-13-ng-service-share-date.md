---
title: Angular 中使用服务进行数据共享
date: 2022-08-13
tags:
  - angular

summary: 使用输入输出装饰器将数据在父子组件之间传递，如果有10个级别的层次结构，想把数据从顶层传到底层，一定是大型灾难现场，我们可以在服务中通过BehaviorSubject的订阅和发布机制来传递。
comment:
  title: custom-directive
---
使用输入输出装饰器将数据在父子组件之间传递，如果有10个级别的层次结构，想把数据从顶层传到底层，一定是大型灾难现场，我们可以在服务中通过BehaviorSubject的订阅和发布机制来传递。

### 创建一个服务作为数据传输的中间件

```Javascript
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DataServiceService {

    private _dataStream = new BehaviorSubject("");
    constructor() { };

    //订阅
    getDataStream() {
        return this._dataStream.asObservable();
    }

    //发布
    putDataToStream(data: string) {
        this._dataStream.next(data)
    }

}

```

### 通过中间件发布数据

```Javascript
import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../../../../services/data/data-service.service';


@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

    constructor(private dataService: DataServiceService) { }

    ngOnInit(): void { }


    publishData() {
        this.dataService.putDataToStream('Data Published form Category');
    }

}

```

### 通过中间件获取数据
```Javascript
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataServiceService } from '../../services/data/data-service.service';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

    serviceData: string = "";

    constructor(private dataService: DataServiceService) {
        const data = this.dataService.getDataStream();
        data.subscribe({
            next: (data: string) => {
                this.serviceData = data;
            },
            error: (err: any) => {
                console.log(err);
            }
        })
    }

    ngOnInit(): void { }

}
```

### asObservable()
细心的可能会发现服务中的get方法，对 `new BehaviorSubject()` 执行了 `.asObservable()`, 其实省略这一步依然可以工作。

由于所有 `RxJS` `Subject`都扩展了`Observable`类，因此可以在`BehaviorSubject`实例上使用所有`Observable`和`Subject`方法。 `asObservable`方法将其强制转换为`Observable`。
```js
const sub = new BehaviorSubject<any>(null);
sub.next('foo'); // works as intended
const obs = sub.asObservable();
obs.next('bar'); // doesn't work at all
```
所以执行`asObservable()`之后只能作为`被观察对象`进行订阅, 不可以再进行 `next()` 发布，这样是为了 取值（订阅） 和 赋值（发布） 更严谨。

### 概念

Observable 表示<b>被观察对象</b>，其实是一个能够发出通知的对象，observable能够发出三个类型的通知:next、error、complete，其中后两个是可选的。 

Observer 表示<b>观察者</b>，当一个observer订阅了这个observable后，这个 observable就会向订阅他的observer推送通知， observer会根据不同的通知调用相应的处理器执行操作。