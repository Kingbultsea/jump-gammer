import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

// eclare module 'vue/types/vue' { // 模块补充 可以去这个路径查阅
//  interface Vue {
//    $ws: WebSocket
//  }
//

window.$ws = undefined as (WebSocket | undefined)

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
