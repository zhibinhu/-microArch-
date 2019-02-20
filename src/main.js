import Vue from 'vue';
import iView from 'iview';
import {router} from './router/index';
import store from './store';
import App from './app.vue';
import util from '@/libs/util.js';
import hasPermission from '@/libs/hasPermission.js';
import 'iview/dist/styles/iview.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import './libs/axios';
import * as filters from './filters'; // global filters
import myGlobal from './components/myGlobal.vue';

Vue.use(iView);
Vue.use(hasPermission);
Vue.use(ElementUI);
axios.defaults.withCredentials = true;
window.Promise = Promise;
Vue.prototype.$myHttp = axios;
Vue.prototype.myGlobal = myGlobal;
Vue.prototype.menuUri = '';// ./src/data/menu.json'
window.suffix = ''; // ?user=admin&roles=pUser


Vue.prototype.allBtnSize = 'mini';
Vue.prototype.loginPrefix = process.env.API_HOST;
Vue.prototype.homePrefix = process.env.API_HOST;
Vue.prototype.prefix = process.env.API_HOST;
Vue.prototype.prefixWork = process.env.API_HOST;
Vue.prototype.permissionPrefix = process.env.API_HOST;

window.UEDITOR_SERVER_URL = process.env.UEDITOR_SERVER_URL;
window.API_HOST = process.env.API_HOST;


// register global utility filters.
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});

new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App),
    mounted () {
        // 调用方法，动态生成路由
        util.initRouter(this);
    }
});
