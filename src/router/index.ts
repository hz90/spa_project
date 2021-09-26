import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

import Router from 'vue-router';
// import Home from '../views/Home.vue';
// import login from '../views/login/LoginVue.vue';
import Find from '../components/Find/Find.vue';
import MusicList from '../components/MusicList/MusicList.vue';
import Login from '../components/Social/Login.vue';

/**
 * 重写路由的push方法
 * 解决，相同路由跳转时，报错
 * 添加，相同路由跳转时，触发watch (针对el-menu，仅限string方式传参，形如"view?id=5")
 */
const routerPush = Router.prototype.push;
/* eslint-disable */
Router.prototype.push = function push(location: any): any {
  if (typeof location == 'string') {
    let Separator = '&';
    if (location.indexOf('?') == -1) {
      Separator = '?';
    }
    location = location + Separator + 'random=' + Math.random();
  }
  return routerPush.call(this, location);
};

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/musicList',
  },
  {
    path: '/musicList',
    name: 'MusicList',
    component: MusicList,
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ '../views/About.vue'),
  // },
  {
    path: '/find',
    name: 'Find',
    component: Find,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  // {
  //   path: '/login',
  //   name: 'Login',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: login,
  // },
];

const router = new VueRouter({
  routes,
});
/*
        全局守卫
        */
router.beforeEach((to, from, next) => {
  console.log('全局前置守卫');
  next();
});
router.afterEach((to, from) => {
  console.log('全局后置守卫');
});
//  // 路由独享守卫
//  {path:"/user",component:User,beforeEnter: (to:Route, from:Route, next:Function) => {
//   console.log("路由独享前置守卫")
//   next();
// }},
export default router;
