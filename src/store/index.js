import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import user from './modules/user';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        myGlobalermission: {},
        //主题颜色
        themeColor:'#495060',
        ORIGINAL_THEME:'#409EFF',
        me:null,
        shrinkTop:true,
        hiddenRightValue:false

    },
    mutations: {

    },
    actions: {

    },
    modules: {
        app,
        user
    }
});

export default store;
