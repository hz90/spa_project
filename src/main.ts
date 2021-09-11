import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import axios from 'axios';
import VueAxios from 'vue-axios';
import { BootstrapVue, BootstrapVueIcons, ToastPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import JsEncrypt from 'jsencrypt';

Vue.use(VueAxios, axios);
Vue.use(BootstrapVue);
Vue.use(ToastPlugin);
Vue.use(BootstrapVueIcons);
Vue.config.productionTip = false;
Vue.prototype.jsEncrypt = JsEncrypt;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
