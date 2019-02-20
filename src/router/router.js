import Main from '@/permissionViews/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () => import('@/permissionViews/login.vue')
};
export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@/permissionViews/error-page/403.vue')
};
export const page404 = {
    path: '*',
    meta: {
        title: '404-页面不存在'
    },
    name: 'errorFirst-404',
    component: () => import('@/permissionViews/error-page/404.vue')
};
export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/permissionViews/error-page/500.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    component: Main,
    children: [
        {path: 'home', title: {i18n: 'home'}, name: 'home_index', component: () => import('@/permissionViews/home/home2.vue')},
        {
            path: 'changePassword',
            title: '修改密码',
            name: 'changePassword',
            component: () => import('@/permissionViews/changePassword.vue')
        },
        {
            path: 'sys/addUserRemindTepMage',
            title: '增加模板',
            name: 'sys/addUserRemindTepMage',
            component: () => import('@/permissionViews/sys/userRemindTepMege/userRemindTepMageAdd.vue')
        },
        {
            path: 'sys/editUserRemindTepMage',
            title: '修改模板',
            name: 'sys/editUserRemindTepMage',
            component: () => import('@/permissionViews/sys/userRemindTepMege/userRemindTepMageEdit.vue')
        },
        {
            path: 'sys/addOrganization',
            title: '组织增加',
            name: 'sys/addOrganization',
            component: () => import('@/permissionViews/sys/org/organizationAdd.vue')
        },
        {
            path: 'sys/detailOrganization',
            title: '组织查询',
            name: 'sys/detailOrganization',
            component: () => import('@/permissionViews/sys/org/organizationDetail.vue')
        },
        {
            path: 'sys/editOrganization',
            title: '组织修改',
            name: 'sys/editOrganization',
            component: () => import('@/permissionViews/sys/org/organizationEdit.vue')
        },
        {
            path: 'sys/addRoleManagement',
            title: '角色增加',
            name: 'sys/addRoleManagement',
            component: () => import('@/permissionViews/sys/role/roleManagementAdd.vue')
        },
        {
            path: 'sys/editRoleManagement',
            title: '角色修改',
            name: 'sys/editRoleManagement',
            component: () => import('@/permissionViews/sys/role/roleManagementEdit.vue')
        },
        {
            path: 'sys/detailRoleManagement',
            title: '角色查询',
            name: 'sys/detailRoleManagement',
            component: () => import('@/permissionViews/sys/role/roleManagementDetail.vue')
        },
        {
            path: 'sys/addPostManagement',
            title: '岗位增加',
            name: 'sys/addPostManagement',
            component: () => import('@/permissionViews/sys/post/postManagementAdd.vue')
        },
        {
            path: 'sys/editPostManagement',
            title: '岗位修改',
            name: 'sys/editPostManagement',
            component: () => import('@/permissionViews/sys/post/postManagementEdit.vue')
        },
        {
            path: 'sys/detailPostManagement',
            title: '岗位查询',
            name: 'sys/detailPostManagement',
            component: () => import('@/permissionViews/sys/post/postManagementDetail.vue')
        },
        {
            path: 'sys/lookUser',
            title: '查看用户',
            name: 'sys/lookUser',
            component: () => import('@/permissionViews/sys/user/lookUser.vue')
        },
        {
            path: 'sys/editUser',
            title: '新增/编辑用户',
            name: 'sys/editUser',
            component: () => import('@/permissionViews/sys/user/addNewUser.vue')
        },
        {
            path: 'sys/dictManagement',
            title: '字典项管理',
            name: 'sys/dictManagement',
            component: () => import('@/permissionViews/sys/dict/dictManagementEdit.vue')
        },
        {
            path: 'sys/addDictManagement',
            title: '字典项管理',
            name: 'sys/addDictManagement',
            component: () => import('@/permissionViews/sys/dict/dictManagementAdd.vue')
        },
        {
            path: 'sys/detailDictManagement',
            title: '查看字典项管理',
            name: 'sys/detailDictManagement',
            component: () => import('@/permissionViews/sys/dict/dictManagementDetail.vue')
        },
        {
            path: 'sys/resourcesAdd',
            title: '新增资源',
            name: 'sys/resourcesAdd',
            component: () => import('@/permissionViews/sys/resources/resourcesAdd.vue')
        },
        {
            path: 'sys/resourcesEdit',
            title: '资源修改',
            name: 'sys/resourcesEdit',
            component: () => import('@/permissionViews/sys/resources/resourcesAdd.vue')
        },
        {
            path: 'sys/addRoleAssignment',
            title: '新增菜单',
            name: 'sys/addRoleAssignment',
            component: () => import('@/permissionViews/sys/rolePerson/roleAssignmentAdd.vue')
        },
        {
           path:'sys/shareDoc',
           title:'共享文档管理',
           name:'sys/shareDoc',
           component:()=>import('@/permissionViews/sys/shareDoc/shareDoc.vue')
        },
        {
            path: 'workFlow/mapping/addForm',
            title: '配置流程表单',
            name: 'workFlow/mapping/addForm',
            component: () => import('@/permissionViews/workFlow/mapping/addForm.vue')
        },
        {
            path: 'workFlow/testFirst',
            title: '测试表单',
            name: 'workFlow/testFirst',
            component: () => import('@/permissionViews/workFlow/testFirst.vue')
        },
        {
            path: 'workFlow/trackList',
            title: '流程跟踪',
            name: 'workFlow/trackList',
            component: () => import('@/permissionViews/workFlow/trackList.vue')
        },
        {
            path: 'editOrder',
            title: '编辑订单',
            name: 'editOrder',
            component: () => import('@/permissionViews/sysorder/orderEdit.vue')
        },
        {
            path: 'viewOrder',
            title: '查看订单',
            name: 'viewOrder',
            component: () => import('@/permissionViews/sysorder/orderView.vue')
        },
        {
            path: 'workFlow/addEntrustProcess',
            title: '流程委托',
            name: 'workFlow/addEntrustProcess',
            component: () => import('@/permissionViews/workFlow/entrust/entrustProcessEdit.vue')
        },
        {
            path: 'workFlow/entrustProcessView',
            title: '流程委托查看',
            name: 'workFlow/entrustProcessView',
            component: () => import('@/permissionViews/workFlow/entrust/entrustProcessView.vue')
        },
        {
            path: 'workFlow/model/modelEdit',
            title: '编辑模型',
            name: 'workFlow/model/modelEdit',
            component: () => import('@/permissionViews/workFlow/model/modelEdit.vue')
        },
        {
            path: 'workFlow/mapping/formCnfAdd',
            title: '工单增加',
            name: 'workFlow/mapping/formCnfAdd',
            component: () => import('@/permissionViews/workFlow/mapping/formCnfAdd.vue')
        },
        {
            path: 'workFlow/mapping/formCnfEdit',
            title: '工单修改',
            name: 'workFlow/mapping/formCnfEdit',
            component: () => import('@/permissionViews/workFlow/mapping/formCnfAdd.vue')
        },
        {
            path: 'sys/documentEdit',
            title: '信息增加',
            name: 'editDocument',
            component: () => import('@/permissionViews/sys/document/documentEdit.vue')
        },
        {
            path: 'sys/documentView',
            title: '信息查看',
            name: 'viewDocument',
            component: () => import('@/permissionViews/sys/document/documentView.vue')
        },
        {
            path: 'sys/newsView',
            title: '信息查看',
            name: 'newsView',
            component: () => import('@/permissionViews/sys/document/newsView.vue')
        },
        {
            path: 'sys/newsList',
            title: '新闻列表',
            name: 'newsList',
            component: () => import('@/permissionViews/sys/document/newsList.vue')
        },
        {
            path: 'workFlow/encyclicList',
            title: '我的待阅',
            name: 'workFlow/encyclicList',
            component: () => import('@/permissionViews/workFlow/encyclicList.vue')
        },
        {
            path: 'workFlow/encyclicReadedList',
            title: '我的已阅',
            name: 'workFlow/encyclicReadedList',
            component: () => import('@/permissionViews/workFlow/encyclicReadedList.vue')
        },
        {
            path: 'sys/cfieldsView',
            title: '扩展字段查看',
            name: 'sys/cfieldsView',
            component: () => import('@/permissionViews/sys/cfields/cfieldsView.vue')
        },
        {
            path: 'sys/cfieldsEdit',
            title: '扩展字段编辑',
            name: 'sys/cfieldsEdit',
            component: () => import('@/permissionViews/sys/cfields/cfieldsEdit.vue')
        },
        {
            path: 'sys/imagesEdit',
            title: '图片增加',
            name: 'sys/imagesEdit',
            component: () => import('@/permissionViews/sys/images/imagesEdit.vue')
        },
        {
            path: 'sys/imagesView',
            title: '图片查看',
            name: 'sys/imagesView',
            component: () => import('@/permissionViews/sys/images/imagesView.vue')
        },
        {
            path: 'workFlow/custRule/custRuleEdit',
            title: '流程规则编辑',
            name: 'workFlow/custRule/custRuleEdit',
            component: () => import('@/permissionViews/workFlow/custRule/custRuleEdit.vue')
        },
        {
            path: 'sys/message/messageList',
            title: '消息列表',
            name: 'sys/message/messageList',
            component: () => import('@/permissionViews/sys/message/messageList.vue')
        },
        {
            path:'sys/scheduleEdit',
            title:'定时任务编辑',
            name:'sys/scheduleEdit',
            component:()=> import('@/permissionViews/sys/schedule/scheduleEdit.vue')
        },
        {
            path:'sys/scheduleView',
            title:'定时任务查看',
            name:'sys/scheduleView',
            component:()=> import('@/permissionViews/sys/schedule/scheduleView.vue')
        },
        {
            path:'sys/scheduleLogList',
            title:'定时任务日志查看',
            name:'sys/scheduleLogList',
            component:()=> import('@/permissionViews/sys/schedule/scheduleLogList.vue')
        },
        {
            path:'sys/log/operateLogList',
            title:'用户操作日志',
            name:'sys/log/operateLogList',
            component:()=> import('@/permissionViews/sys/log/operateLogList.vue')
        },
        {
            path:'sys/log/loginLogList',
            title:'用户访问日志',
            name:'sys/log/loginLogList',
            component:()=> import('@/permissionViews/sys/log/loginLogList.vue')
        }
    ]
};

export const permissionRouter = {
    path: '/',
    name: 'permissionRouter',
    component: Main,
    children: []
};
// 把两个部分的router合并为一个
var otherRouterChildren = otherRouter.children;
var permissionRouterChildren = permissionRouter.children;
for (var i = 0; i < permissionRouterChildren.length; i++) {
    otherRouterChildren.push(permissionRouterChildren[i]);
}
console.log('other---', otherRouter);
// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    ...appRouter,
    page500,
    page403
];
