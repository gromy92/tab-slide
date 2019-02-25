// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// import jquery from './src/assets/js/jquery-1.8.1.min.js'
// import './assets/style/index.scss'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // jquery,
  components: { App },
  template: '<App/>'
})
