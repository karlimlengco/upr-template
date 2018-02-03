import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import VeeValidate from 'vee-validate'

var exec = require('child_process').exec;
var command = exec('set GH_TOKEN=c7146879a950cbfb49265d4bc59422b465601bd9');
command.stdout.on('data', function(data) {
  process.stdout.write(data);
});
command.stderr.on('data', function(data) {
  process.stderr.write(data);
});
command.on('error', function(err) {
  process.stderr.write(err);
});

Vue.use(require('vue-moment'))
Vue.use(VeeValidate)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App},
  router,
  store,
  template: '<App/>'
}).$mount('#app')
