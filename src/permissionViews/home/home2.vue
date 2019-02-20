
<style lang="less" src="./home2.less" scoped></style>
<style type="text/css">
    .homePageCarousel .el-carousel__indicators{
        left:initial !important;
        right:-40px !important;
        bottom:10px !important;
    }
    .homePageCarousel .el-carousel__indicator{
        width:25px;
        height:25px;
        border-radius:50%;
        text-align:center;
        line-height:25px;
        border:1px solid #fff;
        color:#fff;
        padding:0;
        margin-left:10px;
        font-size:14px;
    }
    .homePageCarousel .is-active{
        background:#fff;
        color:#00a0e9;
    }
</style>
<template>
    <div style="min-width:800px;overflow-x:auto;">
        <div class="block">
            <span class="demonstration"><Icon type="images" size="18" style="margin-right:5px;vertical-align: middle;"></Icon>新闻图片</span>
            <el-carousel id="carousel" class="homePageCarousel" height="250px">
                <el-carousel-item v-for="(item,index) in carouselImgData" :key="index">
                    <!--<h3>{{ item }}</h3>-->
                    <img :src="'data:image/gif;base64,'+item.content" alt="" width="100%" height="100%" />
                </el-carousel-item>
            </el-carousel>
        </div>
        <div class="newsNotice">
            <h3>
                <span><Icon type="ios-paper-outline" size="20" style="margin-right:10px;color:#308cee;vertical-align: middle;"></Icon>新闻公告</span>
                <span class="readMore" @click="clickMore('01')">MORE<i class="el-icon-more"></i> </span>
            </h3>
            <ul>
                <li v-for="(item,index) in newsNotice" @click="linkToDetail(item.id,'01')">
                    <span class="iconHot"><img v-if="item.hotIconFlag" src="../../images/hot.png" width="20" height="20" /></span>
                    <span class="date">{{item.lastmodifiedTime | dateFil}}</span>
                    <span class="text">{{item.documentTitle}}</span>
                    <span class="iconHot"  v-if="item.likeCount && item.likeCount!= '0'" style="float:right;"><Icon style="margin-right: 3px;color: #ff3a41" size="16" type="thumbsup"></Icon>{{item.likeCount}}</span>
                    <span class="iconHot" v-if="item.commentCount && item.commentCount!= '0'" :style="item.likeCount && item.likeCount!= '0' ? 'float:right;margin-right: 13px':'float:right;margin-right: 34px'"><Icon type="chatbubble-working" size="14" style="margin-right:5px;color: #2d8cf0"></Icon>{{item.commentCount}}</span>
                </li>
            </ul>
        </div>
        <div class="usualMenu">
            <h3>
                <span><Icon type="ios-paper-outline" size="20" style="margin-right:10px;color:#308cee;vertical-align: middle;"></Icon>常用菜单</span>
                <span class="readMore" @click="addNewMenu"><i class="el-icon-circle-plus-outline" style="color:#308cee;font-size:20px;display: inline-block;vertical-align: middle;"></i> </span>
            </h3>
            <ul>
                <li v-for="(item,index) in usualMenu">
                    <span class="menuText" @click="goForRoute(item.resId)">{{item.resName}}</span>
                    <i class="el-icon-close" @click="delMenu(item.id)"></i>
                </li>
            </ul>
            <div class="selectMenu" v-show="selectMenuFlag">
                <el-form size="mini" class="menuForm">
                    <el-form-item label=" " prop="preMenu" style="float:left;width:60%;margin-bottom: 0;margin-right:10px;">
                        <el-popover
                                placement="bottom"
                                width="100%"
                                trigger="click">
                            <el-tree
                                    :data="myTreeData"
                                    :props="defaultProps"
                                    node-key="id"
                                    :default-expanded-keys="firstTreeId"
                                    @node-click="handleNodeClick"
                                    ref="tree"
                                    class="treeShow">
                            </el-tree>
                            <el-input ref="preMenuInput1" v-model="ruleForm.preMenu" placeholder="请选择" readOnly slot="reference" @focus="showTree"></el-input>
                        </el-popover>
                    </el-form-item>
                   <el-button type="primary" size="mini" round @click="addMenu">确定</el-button>
                </el-form>
            </div>
        </div>
        <div class="willDo">
            <h3>
                <span><Icon type="ios-timer-outline" size="20" style="margin-right:10px;color:#308cee;vertical-align: middle;"></Icon>待办工作</span>
                <span class="currentDate">{{currentDate}}</span>
                <span class="leftWork">今日剩余工作总计</span>
            </h3>
            <ul>
                <li v-for="(item,index) in carouselData" :key="index" @click="toList(item.type)">
                    <span>{{item.willOrnot}}</span>
                    <p>{{item.total}}</p>
                </li>
                <!--<li>-->
                    <!--<span>已办</span>-->
                    <!--<p>16</p>-->
                <!--</li>-->
                <!--<li style="border-left:1px solid #ccc;">-->
                    <!--<span>待阅</span>-->
                    <!--<p>16</p>-->
                <!--</li>-->
                <!--<li>-->
                    <!--<span>已阅</span>-->
                    <!--<p>16</p>-->
                <!--</li>-->
            </ul>
        </div>
        <div class="fastNotice">
            <h3>
                <span><Icon type="ios-list-outline" size="20" style="margin-right:10px;color:#308cee;vertical-align: middle;"></Icon>项目快讯</span>
                <span class="readMore" @click="clickMore('04')">MORE<i class="el-icon-more"></i> </span>
            </h3>
            <ul>
                <li v-for="(item,index) in projectMes" :key="index" @click="linkToDetail(item.id,'04')">
                    <span class="iconHot"><img v-if="false" src="../../images/hot.png" width="20" height="20" /></span>
                    <span class="date">{{item.lastmodifiedTime  | dateFil}}</span>
                    <span class="text">{{item.documentTitle}}</span>
                    <span class="iconHot"  v-if="item.likeCount && item.likeCount!= '0'" style="float:right;"><Icon style="margin-right: 3px;color: #ff3a41" size="16" type="thumbsup"></Icon>{{item.likeCount}}</span>
                    <span class="iconHot" v-if="item.commentCount && item.commentCount!= '0'" :style="item.likeCount && item.likeCount!= '0' ? 'float:right;margin-right: 13px':'float:right;margin-right: 34px'"><Icon type="chatbubble-working" size="14" style="margin-right:5px;color: #2d8cf0"></Icon>{{item.commentCount}}</span>
                </li>
            </ul>
        </div>
        <div class="fastLink">
            <h3>
                <span><Icon type="android-share-alt" sinkize="20" style="margin-right:10px;color:#308cee;vertical-align: middle;"></Icon>快速链接</span>
                <span class="readMore" @click="changeBatch"><img  :src="getNoticeUrl()"  width="16" height="16" style="color:#308cee;font-size:20px;display: inline-block;vertical-align: middle;"/></span>
            </h3>
            <ul>
                <li v-for="(item,index) in linkData" :key="index" @click="linkToWeb(item.value)">

                    <el-tooltip placement="top" :content="item.label" v-if="getFastLinklength(item.label)">
                      <span class="menuText">{{item.label}}</span>
                    </el-tooltip>
                    <span  v-if="!getFastLinklength(item.label)" class="menuText">{{item.label}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    import Cookies from 'js-cookie';
    import shrinkableMenu from '../main-components/shrinkable-menu/shrinkable-menu.vue';

    export default {
        data () {
            return {
                carouselImgData: [],
                currentDate: '',
                carouselData: [],
                newsNotice: [],
                projectMes: [],
                usualMenu: [],
                selectMenuFlag: false,
                myTreeData: [{
                    id: '1',
                    menuName: '订单管理33',
                    // menuCode: '30',
                    childrens: [
                        {
                            id: 12,
                            pid: 1,
                            text: ''
                        }
                    ]
                }],
                defaultProps: {
                    children: 'children',
                    label: 'title'
                },
                firstTreeId: [],
                ruleForm: {
                    preMenu: '',
                    preMenuRouteName: ''
                },
                dirArry: ['fastLink'],
                fastLinkData: [],
                linkData: []
            };
        },
        components: {shrinkableMenu},
        computed: {
            menuList () {
                return this.$store.state.app.menuList;
            }
         },
        mounted () {
            let year = (new Date().getFullYear());
            let month = (new Date().getMonth() + 1) > 9 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1);
            let date = new Date().getDate() > 9 ? new Date().getDate() : '0' + new Date().getDate();
            this.currentDate = year + '-' + month + '-' + date;

            this.crouselImgData();// 新闻图片
            this.getNewsData('01');// 新闻公告
            this.getNewsData('04');// 项目快讯
            this.showCrouselData();// 待办工作
            this.getUsualMenu();
            this.getSelectData();
        },
        methods: {
            getNoticeUrl() {
                return require('@/images/forward.png');
            },
            linkToWeb (url) {
                window.open(url, '_blank');
            },
            delMenu (id) {
                var _this = this;
                this.$confirm('确定要删除该常用菜单吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _this.$myHttp({
                        method: 'post',
                        url: this.permissionPrefix + '/microarch/sys/menuCommon/delete',
                        data: {
                            'entity': {
                                'id': id
                            }
                        }
                    }).then(res => {
                        console.log('res--del--menu ----', res);
                        if (res.data.code == 10000) {
                            this.$message({
                                type: 'success',
                                message: '删除成功'
                            });
                        }
                        _this.getUsualMenu();// 刷新常用菜单列表
                    });
                });
            },
            goForRoute (resId) {
                // let allList=JSON.parse(localStorage.getItem('permissionList'));
                // for(var i=0;i<allList.length;i++){
                //     if(allList[i].id==id){
                this.$router.push({
                    name: resId
                });
                //     }
                // }
            },
            addNewMenu () {
                this.selectMenuFlag = true;
            },
            addMenu () {
                this.$myHttp({
                    method: 'post',
                    url: this.permissionPrefix + '/microarch/sys/menuCommon/save',
                    data: {
                        'entity': {
                            'resId': this.ruleForm.preMenuRouteName,
                            'resName': this.ruleForm.preMenu,
                            'userId': 0
                        }

                    }
                }).then(res => {
                    console.log('res------addmenu---', res);
                    if (res.data.code == 10000) {
                        this.$message({
                            type: 'success',
                            message: '常用菜单添加成功'
                        });
                        this.getUsualMenu();// 刷新常用菜单列表
                        this.selectMenuFlag = false;
                        this.ruleForm.preMenuRouteName = '';
                        this.ruleForm.preMenu = '';
                    }
                });
            },
            showTree () {
                var that = this;
                var params = {
                    'where': [{
                        'field': 'id',
                        'opt': '>',
                        'value': '1'
                    }],
                    'pageNum': 0,
                    'pageSize': 10,
                    'orderBy': 'id asc'
                };
                this.$myHttp({
                    method: 'get',
                    url: this.permissionPrefix + '/microarch/sys/sysuser/getMenuTree'
                }).then(res => {
                    let resData = JSON.parse(res.data.ext);
                    console.log('res-tree data------', resData);
                    // for(var i=0;i<resData.length;i++) {
                    //     this.firstTreeId.push(resData[i].id);
                    //     console.log('firstTreeId---', this.firstTreeId)
                    // }
                    this.myTreeData = [];
                    this.myTreeData = resData;
                    // setTimeout(function () {
                    //     for(var i=0;i<that.firstTreeId.length;i++) {
                    //         that.$refs.tree.store.nodesMap[that.firstTreeId[i]].expanded = true;
                    //     }
                    // },1000)
                    // console.log('myTreeData---------',this.myTreeData)
                });
            },
            handleNodeClick (data) {
                // console.log(data);
                if (data.component == 'Main') {
                    this.$message('目录节点不可作为常用菜单！');
                } else {
                    this.ruleForm.preMenu = data.title;
                    this.ruleForm.preMenuRouteName = data.name;
                    this.$refs.preMenuInput1.focus();
                    this.$refs.preMenuInput1.blur();
                    document.body.click();
                }
            },
            crouselImgData () {
                this.$myHttp({
                    method: 'post',
                    url: this.prefix + '/microarch/sys/images/carousel?type=01'
                }).then(res => {
                    // console.log('resimg--crouselData---',res)
                    if (res.data) {
                        this.carouselImgData = res.data;
                        setTimeout(function () {
                            var carousel = document.getElementById('carousel');
                            var indicators = carousel.getElementsByClassName('el-carousel__indicator');
                            for (var i = 0; i < indicators.length; i++) {
                                indicators[i].innerHTML = i + 1;
                            }
                        }, 0);
                    }
                });
            },
            getNewsData (type) {
                this.$myHttp({
                    method: 'post',
                    url: this.prefix + '/microarch/sys/SysDocument/findNameByOrgCode',
                    data: {
                        'entity': {
                            'documentType': type
                        }
                    }
                }).then(res => {
                    if (type == '01') {
                        // console.log('新闻公告---', res);
                        if (res.data && res.data.rows) {
                            let noticeRows=res.data.rows;
                            let nowTime=new Date().getTime();
                            let threeDay=3*24*3600*1000;
                            // console.log('noticeRows--',noticeRows,'--nowTime--',nowTime)
                            // console.log('firstData---',new Date(noticeRows[0].lastmodifiedTime).getTime())
                            // console.log('disTime--',(3*24*3600*1000));
                            for(var i=0;i<noticeRows.length;i++){
                                let everyDataTime=new Date(noticeRows[i].lastmodifiedTime).getTime();
                                let disTime=nowTime-everyDataTime;
                                if(disTime<threeDay){
                                    noticeRows[i].hotIconFlag=true;
                                }
                            }
                            this.newsNotice = noticeRows.length <= 7 ? noticeRows : noticeRows.slice(0, 7);



                            this.newsNotice.forEach(o => {
                                if(o.documentTitle.length > 13){
                                    o.documentTitle = o.documentTitle.slice(0, 13) + '...'
                                }
                            })
                            // console.log('noticeRows---',noticeRows)
                        }
                    } else if (type == '04') {
                        // console.log('项目快讯---', res);
                        if (res.data && res.data.rows) {
                            this.projectMes = res.data.rows.length <= 6 ? res.data.rows : res.data.rows.slice(0, 6);

                            this.projectMes.forEach(o => {
                                if(o.documentTitle.length > 13){
                                    o.documentTitle = o.documentTitle.slice(0, 13) + '...'
                                }
                            })
                        }
                    }
                });
            },
            getUsualMenu () {
                this.$myHttp({
                    method: 'post',
                    url: this.permissionPrefix + '/microarch/sys/menuCommon/list',
                    data: {
                        pageSize: 120,
                        pageNum: 0
                    }
                }).then(res => {
                    console.log('aaaaaaaaaaaaaaaaaaaaaaaa----', res);
                    if (res.data) {
                        this.usualMenu = res.data.rows;
                    }
                });
            },
            linkToDetail (id, type) {
                this.$router.push({
                    'name': 'newsView',
                    'params': {
                        'id': id,
                        'viewType': 'home',
                        'type': type
                    },
                    'query':{
                        'id':id,
                        'viewType': 'home',
                        'type': type
                    }
                });
            },
            clickMore (type) {
                this.$router.push({
                    'name': 'newsList',
                    'params': {
                        'type': type
                    }
                });
            },
            showCrouselData () {
                var userName = sessionStorage.getItem('userName');
                this.$myHttp({
                    method: 'post',
                    url: this.prefix + '/microarch/activiti/task/getIndexMsg/' + userName
                }).then(res => {
                    // console.log('res---home ===crouselData---',res);
                    if (res.data) {
                        this.carouselData = [
                            {
                                willOrnot: '待办',
                                total: res.data.toDoSize,
                                type: 'waitFor'
                            },
                            {
                                willOrnot: '已办',
                                total: res.data.haveSize,
                                type: 'transated'
                            },
                            {
                                willOrnot: '待阅',
                                total: res.data.unReadSize,
                                type: 'unRead'
                            },
                            {
                                willOrnot: '已阅',
                                total: res.data.readedSize,
                                type: 'readed'
                            }
                        ];
                    } else {
                        this.carouselData = [
                            {
                                willOrnot: '待办',
                                total: 0,
                                type: 'waitFor'
                            },
                            {
                                willOrnot: '已办',
                                total: 0,
                                type: 'transated'
                            },
                            {
                                willOrnot: '待阅',
                                total: 0,
                                type: 'unRead'
                            },
                            {
                                willOrnot: '已阅',
                                total: 0,
                                type: 'readed'
                            }
                        ];
                    }
                });
            },
            toList (type) {
                console.log(type);
                if (type == 'waitFor') {
                    this.toWaitFor();
                } else if (type == 'transated') {
                    this.toTransated();
                } else if (type == 'unRead') {
                    this.toUnRead();
                } else {
                    this.toReaded();
                }
            },
            toWaitFor () {
                this.$router.push({
                    'name': 'workFlow/toDoList',
                    'params': {
                    }
                });
            },
            toTransated () {
                this.$router.push({
                    'name': 'workFlow/haveList',
                    'params': {
                    }
                });
            },
            toUnRead () {
                this.$router.push({
                    'name': 'workFlow/encyclicList',
                    'params': {
                    }
                });
            },
            toReaded () {
                this.$router.push({
                    'name': 'workFlow/encyclicReadedList',
                    'params': {
                    }
                });
            },
            changeBatch() {
                var links = this.fastLinkData;
                var oldLinks = this.linkData;
                var result = [];
                for(var i=0,len=links.length;i<len;i+=5){
                    result.push(links.slice(i,i+5));
                }
                var newArray = result[Math.floor(Math.random()*result.length)];
                if(JSON.stringify(oldLinks) == JSON.stringify(newArray)) {
                    newArray = result[Math.floor(Math.random()*result.length)];
                }
                this.linkData = newArray;
            },

            getSelectData () {
                var that = this;
                this.$myHttp({
                    method: 'post',
                    url: this.permissionPrefix + '/microarch/sys/sysDictHead/findByDcode',
                    data: {
                        'entity': {
                            'dtype': 'fastLink'
                        }
                    }
                }).then(resp => {
                    var resArry = [];
                    for (var d = 0, len = resp.data.entity.sysDicts.length; d < len; d++) {
                        resArry.push({
                            value: resp.data.entity.sysDicts[d].dkey,
                            label: resp.data.entity.sysDicts[d].dvalue
                        });
                    }
                    that.fastLinkData = resArry;
                    that.linkData = this.fastLinkData.slice(0,5);
                });
            },
            getFastLinklength(value) {
                var len = 0;
                for (var i=0; i<value.length; i++) {
                    var c = value.charCodeAt(i);
                    //单字节加1
                    if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
                        len++;
                    }
                    else {
                        len+=2;
                    }
                }
                return len>20;
            }
        },
        filters: {
            dateFil (value) {
                return value.substring(0, 10);
            }
        }
    };
</script>