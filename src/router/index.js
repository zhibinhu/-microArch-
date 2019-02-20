import Vue from 'vue';
import iView from 'iview';
import Util from '../libs/util';
import VueRouter from 'vue-router';
import {routers} from './router';
Vue.use(VueRouter);

// 路由配置
const RouterConfig = {
    // mode: 'history',
    routes: routers
};
export const router = new VueRouter(RouterConfig);
router.beforeEach((to, from, next) => {
    let token = sessionStorage.getItem('token');
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    if (!token && to.path != '/login') {
        console.log('---token不存在----');
        return next({
            path: '/login'
        });
    }
    Util.toDefaultPage(routers, to.name, router, next);
    next();
});
router.afterEach((to) => {
    Util.openNewPage(router.app, to.name, to.params, to.query);
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});
