import Vue from 'vue'
import Router from 'vue-router'
import Demo from '@/views/demo/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/demo',
      name: 'demo',
      component: Demo
    }
  ]
})
