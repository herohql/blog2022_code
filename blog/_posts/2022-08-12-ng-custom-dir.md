---
title: Angular 中构建自定义结构指令
date: 2022-08-12
tags:
  - angular

summary: 结构指令可用于操作 DOM 中的 HTML 结构。使用它们，我们可以改变部分 DOM 的结构
comment:
  title: custom-directive
---

## Angular 内置的结构指令
[介绍](https://angular.cn/guide/built-in-directives#built-in-structural-directives)

- *ngIf
- *ngFor
- *ngSwitch

## 创建自定义结构指令-仿写*ngIf
创建一个自定义指令
```bash
ng generate directive customIf
```
 生成的指令应该是这样的
```Javascript
import { Directive } from '@angular/core';

@Directive({
  selector: '[customIf]',
})
export class customIfDirective {
  constructor() {}
}
```
完成如下 传递的值为 true 时，实现显示内容的功能
```html
<h2 *customIf="true">My visible content</h2>
<h2 *customIf="false">My hidden content</h2>
```
为了实现这一点，我们需要几个元素：
1. 决定 显示/隐藏 的输入布尔值 (@Input)
2. 有条件地显示的模板的引用(TemplateRef)
3. 一个容器，承载模板的 Angular 视图(ViewContainerRef)

`@input`装饰器 为了让它像显示的示例代码中那样工作*customIf="true"，我们需要将接收属性的命名设成和指令选择器相同：

```Javascript
import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[customIf]',
})
export class IfDirective {
 @Input() set customIf(show: boolean) {
    //code goes here
  }

  constructor() {}
}
```

现在指令可以接收传进来的布尔值，我们利用布尔值来决定是否将模板内容挂在到容器。 模板视图的引用`TemplateRef` 和 视图容器的引用`ViewContainerRef`可以通过从 `@angular/core` 导入它们：
```Javascript
import { TemplateRef, ViewContainerRef } from '@angular/core';

constructor(
    private templateRef: TemplateRef<unknown>,
    private vcr: ViewContainerRef
  ) {}
```

现在，我们可以使用视图容器 `ViewContainerRef` 的`createEmbeddedView()`方法来挂在模板视图

`this.vcr.createEmbeddedView(this.templateRef)`显示 、 `this.vcr.clear()` 删除。

最终代码
```Javascript
@Directive({
  selector: '[customIf]',
})
export class IfDirective {
@Input() set customIf(value: boolean) {
    this._renderTemplate(value)l
  }

constructor(
    private templateRef: TemplateRef<unknown>,
    private vcr: ViewContainerRef
  ) {}

private _renderTemplate(show: boolean) {
    this.vcr.clear();
    if (show) {
      this.vcr.createEmbeddedView(this.templateRef);
    }
  }
}
```
现在已经创建成功 `*customIf` 下面让我们创建else模板。

先了解`ngIf`的else是如何工作的，下面把 `ngIf`的语法糖展开看看

![alt](@assets/2022/1.jpg)

else 实际上会转成 `ngIfElse` 输入参数。

规则为：selector (customIf) + else (Else)  = customIfElse

所以我们可以通过`@Input`接收 `customIfElse`属性来获取else的输入模板 

```Javascript
@Input() customIfElse?: TemplateRef<unknown>;
```

现在，代码看起来像

```Javascript
@Directive({
  selector: '[customIf]',
})
export class IfDirective {
@Input() set customIf(value: boolean) {
    this._renderTemplate(value)l
  }
@Input() customIfElse?: TemplateRef<unknown>;
constructor(
    private templateRef: TemplateRef<unknown>,
    private vcr: ViewContainerRef
  ) {}

private _renderTemplate(show: boolean) {
    this.vcr.clear();
    if (show) {
      this.vcr.createEmbeddedView(this.templateRef);
    } else if (this.customIfElse) {
      this.vcr.createEmbeddedView(this.customIfElse);
    }
  }
}
```