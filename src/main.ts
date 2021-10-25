import 'babel-polyfill';

import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import Hooks from '@/router/hooks/hook';
import store from './store';
import axios from 'axios';
import VueAxios from 'vue-axios';
// import { BootstrapVue, BootstrapVueIcons, ToastPlugin } from 'bootstrap-vue';
// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap-vue/dist/bootstrap-vue.css';
import JsEncrypt from 'jsencrypt';
import VueLazyload from 'vue-lazyload';
Vue.use(VueLazyload, {
  loading: require('@/assets/images/default.png'),
});
import { BToast, ToastPlugin, BButton, ButtonPlugin } from 'bootstrap-vue';
Vue.component('b-toast', BToast);
Vue.component('b-button', BButton);
Vue.use(VueAxios, axios);
// Vue.use(BootstrapVue);
Vue.use(ToastPlugin);
Vue.use(ButtonPlugin);
// Vue.use(BootstrapVueIcons);
Vue.config.productionTip = false;
Vue.prototype.jsEncrypt = JsEncrypt;
Hooks.hook(router);
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
