---
title: angular 之依赖注入
date: 2022-08-24
tags:
  - angular 
 

summary: 
comment:
  title: injector
---
[提问](https://stackoverflow.com/questions/51667078/using-injector-get-instead-of-constructor-injection)
constructor(private injector: Injector) {}
this.injector.get(Router)


constructor(@inject(Router) private router: Router ) { }


constructor(private router: Router) { }

[wend](https://www.freecodecamp.org/news/angular-dependency-injection/)