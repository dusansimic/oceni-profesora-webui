// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import BootstramVue from 'bootstrap-vue'
import VueSession from 'vue-session'
import moment from 'moment'
import VueMomentJS from 'vue-momentjs'
import config from './config.json'
import sha256 from 'sha256';

Vue.use(BootstramVue)
Vue.use(VueSession)
Vue.use(VueMomentJS, moment);

Vue.prototype.$config = config;
Vue.prototype.$sha256 = sha256;

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
