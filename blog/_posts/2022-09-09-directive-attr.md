---
title: Angular 中构建自定义属性指令
date: 2022-09-09
tags:
  - angular

summary: 属性指令可用于改变元素、组件的行为或外观ngClass、ngStyle 等
comment:
  title: custom-directive
---

## Angular 内置的属性指令
[文档](https://angular.cn/guide/built-in-directives#built-in-attribute-directives)
- NgClass  添加和删除一组 CSS 类
- NgStyle	 添加和删除一组 HTML 样式
- NgModel	 将双向数据绑定添加到 HTML 表单元素

## 创建一个设置字号的属性指令
```bash
ng generate directive highlight
```
hightlight.directive.ts包含以下代码
```js
import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {

  constructor(el: ElementRef) {
    el.nativeElement.style.fontSize = "20px";  
  }

}
```
```html
<p>This is <span appHighlight>Angular</span></p>
```
@Directive 装饰器有一个selector选择器，[]为自定义指令用作 HTML 元素中的属性。

ElementRef让我们直接通过其访问 DOM 元素nativeElement property.

## 添加事件处理
```js
import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {

  constructor(private el: ElementRef) { }

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight("20px");
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight("16px");
  }

  private highlight(fontSize: string) {
    this.el.nativeElement.style.fontSize = fontSize;
  }

}
```

## 指令接收数据
html看起来像这样
```html
<p>This is <span appHighlight [highlightText]="'30px'">Angular</span></p>
```
可以将数据发送到指令，而不是在指令内定义值。我们可以通过使用@Input属性来实现
```js
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  @Input() highlightText: string;

  constructor(private el: ElementRef) { }

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.highlightText);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight("16px");
  }

  private highlight(fontSize: string) {
    this.el.nativeElement.style.fontSize = fontSize;
  }

}
```

如果您想避免使用单引号[highlightText]="'30px'"，可以将其替换为。highlightText="30px"

将指令和字体属性合并为一个属性而不是分别定义两个属性，我们可以使用@Input别名来做到这一点，或者设置成同一个名字也可以。

```html
<p>This is <span [appHighlight]="'30px'">Angular</span></p>
```
highlight.directive.ts 使用 @Input 别名
```js
@Input('appHighlight') highlightText: string;
```


最终代码
```js
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  @Input('appHighlight') highlightText: string;

  constructor(private el: ElementRef) { }

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.highlightText);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight("16px");
  }

  private highlight(fontSize: string) {
    this.el.nativeElement.style.fontSize = fontSize;
  }

}
```