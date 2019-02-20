<style lang="less">
    @import "./main.less";

    .el-table th {
        font-size: 12px;
        color: #5C5C5C;
        background: #dbe2eb;
    }
    .ivu-menu {
        font-size:13px
    }
    .layout-text{
        font-size:13px
    }
</style>
<template>
    <div class="main" :class="{'main-hide-text': shrink}" >
        <div class="sidebar-menu-con" :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto'}">
            <shrinkable-menu
                    :shrink="shrink"
                    :open-names="openedSubmenuArr"
                    :menu-list="menuList">
                <div slot="top" class="logo-con">
                    <img v-show="!shrink" src="../images/logo.png" key="max-logo"/>
                    <img v-show="shrink" src="../images/logo-min.png" key="min-logo"/>
                </div>
            </shrinkable-menu>
        </div>
        <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'200px'}">

            <transition name="el-fade-in-linear">

            <div class="main-header"  v-show="this.$store.state.shrinkTop?false:true">
                <!--<div class="navicon-con">-->
                <!--<Button style="padding:2px 15px;" :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text"-->
                <!--@click="toggleClick">-->
                <!--<Icon type="navicon" size="26"></Icon>-->
                <!--</Button>-->
                <!--</div>-->
                <div class="header-middle-con">
                    <div class="main-breadcrumb">
                        <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
                    </div>
                </div>
                <div class="header-avator-con">
                    <div class="user-dropdown-menu-con">
                        <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                            <!--<Avatar icon="person" style="background: #619fe7;margin-right:10px;"></Avatar>-->
                            <el-dropdown @command="handleCommand">
                                <span class="el-dropdown-link" style="cursor: pointer">{{ userName }}
                                    <i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item name="loginout" command="handleClickUserDropdown"
                                                      style="line-height: 20px;font-size: 12px">
                                        退出登录 <i class="el-icon-remove" style="color: #F56C6C;font-size: 16px"></i>
                                    </el-dropdown-item>
                                    <el-dropdown-item name="changePassword" divided command="ChangePassword"
                                                      style="line-height: 20px;font-size: 12px">
                                        修改密码 <i class="el-icon-edit" style="color: #67C23A;font-size: 16px"></i>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>


                            <div @click="showMessage">
                                <el-badge :value="mesCount" class="messageBox" >
                                    <i  class="el-icon-message" style="font-size: 18px;cursor:pointer"></i>
                                </el-badge>
                            </div>


                            <fullscreen v-model="isFullscreen" style="margin-right: 10px;margin-top: 8px"/>

                            <el-dropdown @command="handleCommand">
                                <span class="el-dropdown-link" style="cursor: pointer">
                                <Icon type="gear-b" size="19" style="margin-top: 3px"></Icon>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item name="hiddenLeft"
                                                      style="line-height: 20px;font-size: 12px">
                                        <el-checkbox @change="hiddenLeft" v-model="hiddenLeftValue"><li style="font-size: 13px;color: #7b7d81;">隐藏侧边栏</li></el-checkbox>

                                    </el-dropdown-item>
                                    <el-dropdown-item name="hiddenRight" divided
                                                      style="line-height: 20px;font-size: 12px">
                                        <el-checkbox @change="hiddenRight" v-model="hiddenRightValue"><li  style="font-size: 13px;color: #7b7d81;">隐藏头部</li></el-checkbox>

                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>



                            <div class="logoutBox" @click="logoutWeb">
                                <Icon type="log-out" size="15" ></Icon>
                                <span>退出</span>
                            </div>
                        </Row>
                    </div>
                </div>
            </div>

            </transition>

            <div class="tags-con" >
                <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
            </div>
        </div>
        <div class="single-page-con" :style="{left: shrink?'60px':'200px',top:this.$store.state.shrinkTop?'40px':'78px'}">
            <ABackTop :height="100" :bottom="80" :right="50" container=".single-page-con"></ABackTop>

            <div class="single-page">
                <router-view @getMessageCount="getMessageCount"></router-view>
            </div>
        </div>
    </div>
</template>
<script>
    import Cookies from 'js-cookie';
    import tagsPageOpened from './main-components/tags-page-opened.vue';
    import shrinkableMenu from './main-components/shrinkable-menu/shrinkable-menu.vue';
    import breadcrumbNav from './main-components/breadcrumb-nav.vue';
    import util from '@/libs/util.js';
    import myGlobal from '@/components/myGlobal.vue';
    import Fullscreen from './main-components/fullscreen/index'
    import ABackTop from './main-components/a-back-top/index'



    export default {
        components: {
            shrinkableMenu,
            tagsPageOpened,
            breadcrumbNav,
            myGlobal,
            Fullscreen,
            ABackTop
        },
        data () {
            return {
                hiddenLeftValue:false,
                hiddenRightValue:this.$store.state.hiddenRightValue,
                shrink: false,
                shrinkTop:this.$store.state.shrinkTop,
                openedSubmenuArr: this.$store.state.app.openedSubmenuArr,
                userName: '',
                mesCount: 0,
                showMesCount: false,
                timer:null,
                isFullscreen: false,
                themeColor:'#ff7b78'
            };
        },
        computed: {
            menuList () {
                return this.$store.state.app.menuList;
            },
            currentPath () {
                return this.$store.state.app.currentPath; // 当前面包屑数组
            },
            pageTagsList () {
                // console.log('this.$store.state.app.pageOpenedList--------======------',this.$store.state.app.pageOpenedList)
                this.$store.state.app.pageOpenedList = JSON.parse(localStorage.getItem('pageOpenedList'));
                return this.$store.state.app.pageOpenedList;
            },

            cachePage () {
                return this.$store.state.app.cachePage;
            }
        },
        methods: {
            init () {
                this.getUser();
                this.getLocalShrink();
            },
            hiddenLeft(value){
                Cookies.set('hiddenLeftValue',value)
                this.toggleClick()
            },
            hiddenRight(value){
                Cookies.set('hiddenRightValue',value)

                if(this.$store.state.me){
                    this.$store.state.me.setPaginationStyle()
                }
                this.$store.state.shrinkTop = value
            },
            getLocalShrink(){
                this.shrink = Cookies.get('shrink') == 'true'?true:false
                this.$store.state.shrinkTop = Cookies.get('hiddenRightValue') == 'true'?true:false
                this.hiddenLeftValue = Cookies.get('hiddenLeftValue') == 'true'?true:false
                this.$store.state.hiddenRightValue = Cookies.get('hiddenRightValue') == 'true'?true:false

            },
            toggleClick () {
                this.shrink = !this.shrink;
                Cookies.set('shrink',this.shrink)
            },

            getUser: function () {
                var _this = this;
                this.userName = Cookies.get('user');
                // let userId=sessionStorage.getItem('uid');
                let pathArr = util.setCurrentPath(this, this.$route.name);
                console.log('parthArr---', pathArr);
                if (pathArr.length >= 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                this.$myHttp({
                    method: 'get',
                    url: this.prefix + '/microarch/sys/sysuser/getAllResources'
                }).then(res => {
                    console.log('main.vue--res--', res);
                    // myGlobal.permission = res.data.rows;
                    window.localStorage.setItem('permissionList', JSON.stringify(res.data.rows));
                });
            },
            logoutWeb () {
                this.$router.push({
                    name: 'login'
                });
                sessionStorage.clear();
                localStorage.clear();
                this.$store.state.app.routers.splice(1);
                this.$store.commit('clearAllTags');// 清除上次登录后打开的标签

                //移除所有native事件
                document.onkeydown = (event => {})
            },
            /* 退出登录与修改密码跳转 */
            handleCommand (command) {
                if (command == 'handleClickUserDropdown') {
                    // window.location = this.prefix + 'sys/logout';
                    this.$router.push({
                        name: 'login'
                    });
                    sessionStorage.clear();
                    localStorage.clear();
                    // console.log('frontRouters:',this.$store.state.app.routers)
                    this.$store.state.app.routers.splice(1);
                    this.$store.commit('clearAllTags');// 清除上次登录后打开的标签
                    // console.log('afterRouters:',this.$store.state.app.routers)

                    //移除所有native事件
                    document.onkeydown = (event => {})
                }
                if (command == 'ChangePassword') {
                    this.$router.push({
                        name: 'changePassword'
                    });
                }
            },

            checkTag (name) {
                let openpageHasTag = this.pageTagsList.some(item => {
                    if (item.name === name) {
                        return true;
                    }
                });
                if (!openpageHasTag) { //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
                    util.openNewPage(this, name, this.$route.params || {}, this.$route.query || {});
                }
            },
            getSysDict () {
                this.$myHttp({
                    method: 'POST',
                    url: this.permissionPrefix + '/microarch/sys/sysDictHead/find',
                    data: {
                        'entity': {}
                    }
                }).then(res => {
                    localStorage.setItem('sysDict', JSON.stringify(res.data.rows));
                    console.log('sysDict---', res);
                });
            },
            getMessageCount () {
                this.$myHttp({
                    method: 'GET',
                    url: this.prefix + '/microarch/sys/message/countsUnread/'+sessionStorage.getItem('userName'),
                    data: {}
                }).then(res => {
                    this.mesCount = res.data
                    if(res.data >0 ) {
                        this.showMesCount = true
                    }else{
                        this.showMesCount = false
                    }
                });
            },
            showMessage () {
                this.$router.push({
                    name: 'sys/message/messageList'
                });
            }
        },
        watch: {
            $route (to) {
                this.$store.commit('setCurrentPageName', to.name);
                let pathArr = util.setCurrentPath(this, to.name);
                if (pathArr.length > 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                localStorage.currentPageName = to.name;
            },
            hiddenRightValue(n,o){
                this.hiddenRightValue = this.$store.state.hiddenRightValue
            }
        },
        beforeMount() {
            //设置定时器，每30秒刷新一次
            // this.timer = setInterval(this.getMessageCount,30*1000);
        },
        beforeDestroy() {
            // clearInterval(this.timer);
            // this.timer = null;
        },
        mounted () {
            this.init();
            this.getSysDict();
            this.getMessageCount();
        }
    };
</script>
<style scoped>
.logoutBox{
    margin-top: 3px;
    margin-left:10px;
    border-left:1px solid #ccc;
    padding-left:10px;
    cursor: pointer;
}
    .logoutBox span{
        margin-left:5px;
        font-size: 14px;
    }

.messageBox{
    margin-left: 10px;
    margin-right: 10px;
    margin-top: 2px;
}
.topbar-btn-notice-num {
    font-size: 10px;
    color: #fff;
    background: #f54743;
    border-radius: 7px;
    padding: 1px 3px;
    position: absolute;
    line-height: 1;
    top: -6px;
    z-index: 9;
    margin-left: -3px;
    margin-top: 0;
    white-space: nowrap;
}
.el-menu-item {

    float: left;
    height: 45px;
    line-height: 45px;
    margin: 0;
    border-bottom: 2px solid transparent;
    border-bottom-color: transparent;
    color: #909399;

}
</style>
<style>
    #mesCount .el-badge__content.is-fixed{

        position: absolute;
        top: 14px;
        right: 15px;
        -webkit-transform: translateY(-50%) translateX(100%);
        transform: translateY(-50%) translateX(100%);

    }
    #mesCount .el-badge__content {
        background-color: #f56c6c;
        border-radius: 7px;
        color: #fff;
        display: inline-block;
        font-size: 12px;
        height: 18px;
        line-height: 18px;
        padding: 0 6px;
        text-align: center;
        white-space: nowrap;
        border: 1px solid #fff;
    }
</style>