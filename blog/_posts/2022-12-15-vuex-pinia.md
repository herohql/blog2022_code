---
title: Vue状态管理Pinia与VueX
date: 2022-12-15
tags:
  - vue3.0
  - vue

summary: 
comment:
  title: Pinia
---

## Pinia 的变化

Pinia 其实就是 Vuex 5，目前是Vuex的最高版本，Pinia 提供组合式风格 API，支持 TypeScript。 使用起来比Vuex简单。

Pinia，删除了`mutations` ， 只有 `states getters actions`


### 定义
Pinia store 是使用 defineStore() 定义的，并且它需要一个唯一名称，作为第一个参数传递
```js
import { defineStore } from 'pinia'
// useStore 可以是 useUser、useCart 之类的任何东西
// 第一个参数是应用程序中 store 的唯一 id
export const useStore = defineStore('main', {
   // 推荐使用 完整类型推断的箭头函数
  state: () => {
    return {
      // 所有这些属性都将自动推断其类型
      counter: 0
    }
  },
})
```

### 使用
可以定义任意数量的 store, 需要放到不用的文件中。

一旦 store 被实例化，你就可以直接在 store 上访问 state、getters 和 actions 中定义的任何属性, 不需要Vuex的 `commit、 dispatch`
```ts
<script setup lang="ts">
import { useStore } from '@/stores/counter'

const store = useStore()
console.log(store.counter) //直接访问
</script>
```

### state
```js
import { defineStore } from 'pinia'

const useStore = defineStore('storeId', {
  state: () => {
    return {
      counter: 0
    }
})
```
#### 重置状态
您可以通过调用 store 上的 $reset() 方法将状态 重置 到其初始值：
```js
const store = useStore()
store.$reset()
```

#### 改变状态
1. 直接修改 (不推荐)
2. $patch （不推荐）
```js
store.$patch({
  counter: store.counter + 1,
  name: 'Abalam',
})
```
这种方式会覆写整个state，必须将所有字段列出。 修改部分字段使用函数形式

函数形式
```js
store.$patch((state) => {
  state.items.push({ name: 'shoes', quantity: 1 })
  state.hasChanged = true
})
```
3. 使用actions中的方法（推荐）


#### 整个替换
通过将其 $state 属性设置为新对象来替换 Store 的整个状态
```js
store.$state = { counter: 666, name: 'Paimon' }
```

#### 模板中使用
```js
<script setup lang="ts">
import { useStore } from "...";
const store = useStore();
const { name, counter} = store;
const changeName = () => {
  store.name = "张三";
};
</script>
```
通过对象结构的方式不是响应式的，changeName不会引起页面的变化。需要使用`storeToRefs`
```js
import { storeToRefs } from 'pinia';
const store = useStore();
const { name, counter } = storeToRefs(store);
```

#### 订阅状态
可以通过 store 的 $subscribe() 方法查看状态及其变化，与常规的 watch() 相比，使用 $subscribe() 的优点是 subscriptions 只会在 patches 之后触发一次
```js
cartStore.$subscribe((mutation, state) => {
  // import { MutationType } from 'pinia'
  mutation.type // 'direct' | 'patch object' | 'patch function'
  // 与 cartStore.$id 相同
  mutation.storeId // 'cart'
  // 仅适用于 mutation.type === 'patch object'
  mutation.payload // 补丁对象传递给 to cartStore.$patch()

  // 每当它发生变化时，将整个状态持久化到本地存储
  localStorage.setItem('cart', JSON.stringify(state))
})
```
默认情况下，state subscriptions 绑定到添加它们的组件（如果 store 位于组件的 setup() 中）。 意思是，当组件被卸载时，它们将被自动删除。 如果要在卸载组件后保留它们，请将 { detached: true } 作为第二个参数传递给 detach 当前组件的 state subscription：
```js
export default {
  setup() {
    const someStore = useSomeStore()

    // 此订阅将在组件卸载后保留
    someStore.$subscribe(callback, { detached: true })

    // ...
  },
}
```
您可以在 pinia 实例上查看整个状态
```js
watch(
  pinia.state,
  (state) => {
    // 每当它发生变化时，将整个状态持久化到本地存储
    localStorage.setItem('piniaState', JSON.stringify(state))
  },
  { deep: true }
)
```
### getters
Getter 完全等同于 Store 状态的 计算值。 可以用 defineStore() 中的 getters 属性定义。 他们接收 state 作为第一个参数（推荐方式）

大多数时候，getter 只会依赖状态，但是，他们可能需要使用其他 getter。 正因为如此，我们可以在定义常规函数时通过 this 访问到 整个 store 的实例， 但是需要定义返回类型（在 TypeScript 中）。 这是由于 TypeScript 中的一个已知限制，并且不会影响使用箭头函数定义的 getter，也不会影响不使用 this 的 getter：

```js
export const useStore = defineStore('main', {
  state: () => ({
    counter: 0,
  }),
  getters: {
    // 自动将返回类型推断为数字
    doubleCount(state) {
      return state.counter * 2
    },

    // 返回类型必须明确设置
    doublePlusOne(): number {
      return this.counter * 2 + 1
    },
  },
})
```
然后你可以直接在 store 实例上访问 getter：
```js
<template>
  <p>Double count is {{ store.doubleCount }}</p>
</template>

<script>
export default {
  setup() {
    const store = useStore()

    return { store }
  },
}
</script>
```
getter 输出到模板中是响应式的

```tsx
<template>
  <p>Double count is {{ store.doubleCount }}</p>
  <button @click="patchStore">批量修改数据</button>
</template>
<script setup lang="ts">
import { useStore } from "...";
const store = useStore()
// 批量修改数据
const patchStore = () => {
  store.$patch({
    counter:20,
    age: 100,
  });
};
</script>
```
当我们点击批量修改数据按钮时，页面上字段也会跟着变化, 也可以使用新字段age。



通过 this 访问其他 getter
```js
export const useStore = defineStore('main', {
  state: () => ({
    counter: 0,
  }),
  getters: {
    // 类型是自动推断的，因为我们没有使用 `this`
    doubleCount: (state) => state.counter * 2,
    // 这里需要我们自己添加类型（在 JS 中使用 JSDoc）。 我们还可以
    // 使用它来记录 getter
    /**
     * 返回计数器值乘以二加一。
     *
     * @returns {number}
     */
    doubleCountPlusOne() {
      // 自动完成 ✨
      return this.doubleCount + 1
    },
  },
})
```
访问其他 Store 的getter
```js
import { useOtherStore } from './other-store'

export const useStore = defineStore('main', {
  state: () => ({
    // ...
  }),
  getters: {
    otherGetter(state) {
      const otherStore = useOtherStore()
      return state.localData + otherStore.data
    },
  },
})
```


### actions
使用 defineStore() 中的 actions 属性定义，并且它们非常适合定义业务逻辑,与 getters 一样，可以通过 this 访问。actions 可以是异步的，您可以在其中await 任何 API 调用甚至其他操作
```js
import { mande } from 'mande'
const api = mande('/api/users')
export const useUsers = defineStore('users', {
  state: () => ({
    userData: null,
    // ...
  }),

  actions: {
    async registerUser(login, password) {
      try {
        this.userData = await api.post({ login, password })
      } catch (error) {
        return error
      }
    },
  },
})
```
actions通过store的属性直接访问
```js
export default defineComponent({
  setup() {
    const store = useUsers()
    // Actions 像 methods 一样被调用：
    store.randomizeCounter()
    return {}
  },
})
```

[订阅 Actions](https://pinia.web3doc.top/core-concepts/actions.html#%E8%AE%A2%E9%98%85-actions)



## Vuex 回顾

 具有 `states getters mutations actions` 四种状态，

 store.state 来获取状态对象，并通过 store.commit 来触发 `mutations` 中的方法改变 `state`, 这两个是用的最多的。
 
 在 Vue 组件中， 可以通过 this.$store 访问store实例

 ### HelloWorld
 
 ```js
 import { createApp } from 'vue'
import { createStore } from 'vuex'

// 创建一个新的 store 实例
const store = createStore({
  state () {
    return {
      count: 0
    }
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})

const app = createApp({ /* 根组件 */ })

// 将 store 实例作为插件安装
app.use(store)
 ```

 ```js
methods: {
  increment() {
    this.$store.commit('increment')
    console.log(this.$store.state.count)
  }
}
 ```
 >  必须通过 mutation 的方式，而非直接改变 store.state

 ### getters

 getters可以认为是store中的计算属性，会把结果缓存起来，getters中的方法接受 state 作为其第一个参数。通常 getters里写一些对state数据的变形。 
 ```js
  this.$store.getters.getTodoById(2)
 ```

 实际开发中，更多的是直接 `this.$store.state.count ` 取值。

 ### mutations
 <font color='red'>更改 Vuex  store 状态的唯一方法</font>。

 使用的时候不能直接调用一个 .mutation , 而是需要调用 `store.commit('increment') `

 可以向 store.commit 传递参数 `store.commit('increment', {amount: 10} )` {amount: 10} 会传给 payload

 ```js
 mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
 ```

 ### actions
 actions 改变状态 提交的是 mutation，而不是直接变更状态, 并且可以包含`异步操作`

 actions 函数接受一个与 store 实例具有相同方法和属性的 context 对象, 通过 context.commit 提交一个 mutation, 使用 ES2015 的参数解构来简化代码
 
 ```js
 //定义
 actions: {
  increment ({ commit }, obj ) {
    commit('increment', obj)
  }
}
//使用
this.$store.dispatch('increment', {amount: 10})
 ```

通常actions不需要使用时传参，因为 异步请求一般会放在  actions 方法里面。

### Module 多模块
Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter
```js
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import user from './modules/user'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user
  },
  getters
})

export default store
```
./modules/app
```js
const state = {
  device: 'desktop'
}

const mutations = {

  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  }
}

const actions = {

  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  }
}

export default {
  namespaced: true, //带命名空间,避免冲突
  state,
  mutations,
  actions
}
```
使用的时候也需要加上命名空间
```js
this.$store.dispatch('app/toggleDevice', device)
```