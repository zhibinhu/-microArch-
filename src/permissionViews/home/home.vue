<template>
    <div style="min-width:800px;overflow-x:auto;">
          <el-row style="height:210px;margin-bottom:10px;">
              <el-col :span="18" class="commonHeight">
                  <div class="whiteBg commonHeight">
                       <p class="title"><i class="el-icon-document"></i>我的任务</p>
                       <el-carousel :interval="5000" arrow="always" :autoplay="false" height="135px" indicator-position="none">
                          <el-carousel-item v-for="(items,index) in carouselData" :key="index" style="padding:0 55px;text-align:center;">
                              <el-row style="height:100%;">
                                      <el-col style="height:100%;" :span="6" v-for="(item,i) in items.cardData" class="cardOnly" :key="i">
                                          <div class="bgFile" @click="toList(item.type)">
                                              <div class="upContent">
                                                  <span class="will">{{item.willOrnot}}</span>
                                                  <p>共{{item.total}}项</p>
                                              </div>
                                              <div class="downContent">
                                                  <span>{{todayDate}}</span>
                                              </div>
                                          </div>
                                      </el-col>
                              </el-row>
                          </el-carousel-item>
                       </el-carousel>
                  </div>
              </el-col>
              <el-col :span="6" class="commonHeight">
                  <div class="whiteBg marginDiv commonHeight">
                      <p class="title"><i class="el-icon-bell"></i>通知<span class="totalMsg">{{notice.length}}条公告</span> </p>
                      <div id="noticeWrap">
                      <div class="noticeBox" id="notices" style="top:0px;">
                          <div v-for="(item,index) in notice">
                              <p class="noticeTit" @click="viewDocument(item.id)"><span>{{item.documentTitle}}</span></p>
                              <span class="rightDate">{{item.lastmodifiedTime.split(/\s/g)[0]}}</span></div>
                      </div>
                      </div>
                  </div>
              </el-col>
          </el-row>
        <!--下半部分-->
        <el-row>
            <el-col :span="18" class="commonHeight">
                <div class="whiteBg commonHeight" style="position:relative;">
                    <span v-show="more02" class="lookMore" @click="showMore('02')">更多</span>
                    <p class="title"><i class="el-icon-document"></i>用户手册</p>
                    <ul class="manualList">
                        <li v-if="manuals.length==0" style="justify-content: center;">暂无数据</li>
                        <li v-else v-for="(item,index) in manuals">
                            <div class="manualImg">
                                <img :src="imgUrl" alt="图片" width="108" height="82"/>
                            </div>
                            <div class="manualText">
                                <div>
                                <p class="manualTitle">{{item.documentTitle}}</p>
                                <p class="time"><span class="date">{{(item.lastmodifiedTime).split(/\s/g)[0]}}</span> | <span class="uploader">{{item.createByName}}</span> 上传</p>
                                <p class="detailBtn"><span class="btn" @click="viewDocument(item.id)">详细</span></p>
                                </div>
                            </div>
                            <div class="manualDownload">
                                <!--<p class="iconStar">-->
                                    <!--<i class="el-icon-star-on"></i>-->
                                    <!--<i class="el-icon-star-on"></i>-->
                                    <!--<i class="el-icon-star-on"></i>-->
                                    <!--<i class="el-icon-star-on"></i>-->
                                    <!--<i class="el-icon-star-off"></i>-->
                                <!--</p>-->
                                <p class="downloadIcon">
                                    <i class="el-icon-download" @click="downloadAttachement(item.attachList)"></i>下载
                                </p>
                                <!--<p class="favor">-->
                                    <!--<i class="el-icon-star-on"></i>收藏-->
                                <!--</p>-->
                            </div>
                        </li>
                    </ul>
                </div>
            </el-col>
            <el-col :span="6" style="height:363px;">
                <div class="whiteBg marginDiv commonHeight">
                    <p class="title"><i class="el-icon-download"></i>模板下载</p>
                    <div class="border-left">
                        <div class="list-classify" v-if="downloadFile.length==0" style="text-align: center;">
                            暂无数据
                        </div>
                        <div v-else class="list-classify" v-for="(item,index) in downloadFile">
                            <p class="hTitle"><img :src="index==0?excelImg:index==1?docImg:index==2?pdfImg:''"><span>{{item.documentTitle}}</span></p>
                            <h5><p class="hText" :title="item.documentDesc">{{item.documentDesc}}</p>
                                <label class="text-info">{{item.lastmodifiedTime.split(' ')[0]}}</label>
                                <el-button class="goRight" type="primary" size="mini" round @click="downloadAttachement(item.attachList)">下载</el-button>
                            </h5>
                        </div>
                        <!--<div class="list-classify">-->
                            <!--<p class="hTitle"><img :src="docImg">模板类型2</p>-->
                            <!--<h5><p class="hText">我是文档我是文档我是文档我是文档我是文档我是文档</p>-->
                                <!--<label class="text-info">2月21日</label>-->
                                <!--<el-button class="goRight" type="primary" size="mini" round>更多信息</el-button>-->
                            <!--</h5>-->
                        <!--</div>-->
                        <!--<div class="list-classify">-->
                            <!--<p class="hTitle"><img :src="pdfImg">模板类型3</p>-->
                            <!--<h5><p class="hText">我是文档我是文档我是文档我是文档我是文档我是文档</p>-->
                                <!--<label class="text-info">2月21日</label>-->
                                <!--<el-button class="goRight" type="primary" size="mini" round>下载</el-button>-->
                            <!--</h5>-->
                        <!--</div>-->

                        <span v-show="more03" class="lookMoreTemplate" @click="showMore('03')">更多</span>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import Cookies from 'js-cookie';
    import axios from 'axios';
    export default {
        data () {
            return {
                imgUrl: require('../../images/manual.jpg'),
                excelImg: require('../../images/excl.png'),
                docImg: require('../../images/word.png'),
                pdfImg: require('../../images/pdf.png'),
                downloadFile: [
                    // {
                    //     documentTitle:'模板类型1',
                    //     documentDesc:'我是文档我是文档我是文档我是文档我是文档我是文档',
                    //     lastmodifiedTime:'2018-02-01 '
                    // },
                    // {
                    //     documentTitle:'模板类型2',
                    //     documentDesc:'我是文档我是文档我是文档我是文档我是文档我是文档',
                    //     lastmodifiedTime:'2018-02-01 '
                    // },
                    // {
                    //     documentTitle:'模板类型3',
                    //     documentDesc:'我是文档我是文档我是文档我是文档我是文档我是文档',
                    //     lastmodifiedTime:'2018-02-01 '
                    // }
                ],
                todayDate: '',
                manuals: [
                    // {
                    //     imgSrc:imgUrl,
                    //     title:'用户差旅手册',
                    //     date:'2018-03-15',
                    //     uploader:'系统管理员'
                    // },
                    // {
                    //     imgSrc:imgUrl,
                    //     title:'用户差旅手册',
                    //     date:'2018-03-15',
                    //     uploader:'系统管理员'
                    // },
                    // {
                    //     imgSrc:imgUrl,
                    //     title:'用户差旅手册',
                    //     date:'2018-03-15',
                    //     uploader:'系统管理员'
                    // }
                ],
                carouselData: [
                    // {
                    // cardData:[
                    //     {
                    //         willOrnot:'待办',
                    //         total:3,
                    //         date:''
                    //     },
                    //     {
                    //         willOrnot:'待办',
                    //         total:3,
                    //         date:'2018-09-01'
                    //     },
                    //     {
                    //         willOrnot:'待办',
                    //         total:3,
                    //         date:'2018-09-01'
                    //     },
                    //     {
                    //         willOrnot:'待办',
                    //         total:3,
                    //         date:'2018-09-01'
                    //     }
                    // ]
                    // },
                    // {
                    // cardData:[
                    //     {
                    //         willOrnot:'已办',
                    //         total:3,
                    //         date:'2018-09-02'
                    //     },
                    //     {
                    //         willOrnot:'已办',
                    //         total:3,
                    //         date:'2018-09-03'
                    //     },
                    //     {
                    //         willOrnot:'已办',
                    //         total:3,
                    //         date:'2018-09-04'
                    //     },
                    //     {
                    //         willOrnot:'已办',
                    //         total:3,
                    //         date:'2018-09-05'
                    //     }
                    // ]
                    // }
                ],
                notice: [
                    // {
                    //     title:'关于加班调休的通知20',
                    //     date:'2018-02-02'
                    // }
                ],
                more02: true,
                more03: true
            };
        },
        mounted () {
            var that = this;
            window.onresize = function () {
                that.noticesMove();
            };
            let year = (new Date().getFullYear());
            let month = (new Date().getMonth() + 1) > 9 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1);
            let date = new Date().getDate() > 9 ? new Date().getDate() : '0' + new Date().getDate();
            this.todayDate = year + '-' + month + '-' + date;
            // 展示我的任务
            this.showCrouselData();
            // 展示通知
            this.showManuals('01');
            // 展示用户手册
            this.showManuals('02');
            // 展示模板下载
            this.showManuals('03');
        },
        methods: {
            noticesMove () {
                var noticesHeight = document.getElementById('notices').offsetHeight - 50;
                console.log('noticesHeight---', document.getElementById('notices').offsetHeight, '---', typeof noticesHeight);
                if (noticesHeight > 100) {
                    var scrollTime = (noticesHeight / 20).toFixed(2);
                    // console.log('scrollTime---',scrollTime)
                    var style1 = document.createElement('style');
                    var delayPer = (2 * 100 / scrollTime).toFixed(2);// 每次循环前延迟时间
                    style1.innerHTML = '.noticeBox {\n' +
                        '        animation: myMove222 ' + scrollTime + 's linear infinite;\n' +
                        '        animation-fill-mode: forwards;\n' +
                        '    }@keyframes myMove222 {\n' +
                        '        0%, ' + delayPer + '%{\n' +
                        '            transform: translateY(0);\n' +
                        '        }\n' +
                        '        100% {\n' +
                        '            transform: translateY(-' + noticesHeight + 'px);\n' +
                        '        }\n' +
                        '    }.noticeBox:hover{animation-play-state:paused;-webkit-animation-play-state:paused;}';

                    document.head.appendChild(style1);
                }
            },
            showCrouselData () {
                var userName = sessionStorage.getItem('userName');
                this.$myHttp({
                    method: 'post',
                    url: this.prefix + '/microarch/activiti/task/getIndexMsg/' + userName
                }).then(res => {
                    console.log('res---home ===crouselData---', res);
                    if (res.data) {
                        var cardDataObj = {};
                        cardDataObj.cardData = [
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
                        this.carouselData.push(cardDataObj);
                    } else {
                        var cardDataObj = {};
                        cardDataObj.cardData = [
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
                        this.carouselData.push(cardDataObj);
                    }
                });
            },
            showManuals (type) {
                var that = this;
                // if(sessionStorage.getItem('token')) {
                //     axios.defaults.headers.common["Authorization"] = 'Sys ' + sessionStorage.getItem('token');
                // }
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
                        // console.log('res--home-01--',res)
                        if (res.data) {
                            this.notice = res.data.rows;
                            setTimeout(function () {
                                that.noticesMove();// 开始滚动通告模块
                            }, 0);
                        }
                    } else if (type == '02') {
                        // console.log('res--home-02--',res)
                        if (res.data) {
                            this.manuals = res.data.rows.slice(0, 3);
                        }
                    } else if (type == '03') {
                        // console.log('res--home-03--',res)
                        if (res.data) {
                            this.downloadFile = res.data.rows.slice(0, 3);
                            // console.log('downloadFile---',this.downloadFile)
                        }
                    }
                });
            },
            showMore (type) {
                var that = this;
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
                        if (res.data) {
                            this.notice = res.data.rows;
                            setTimeout(function () {
                                that.noticesMove();// 开始滚动通告模块
                            }, 0);
                        }
                    } else if (type == '02') {
                        if (res.data) {
                            this.manuals = res.data.rows;
                        }
                        that.more02 = false;
                    } else if (type == '03') {
                        if (res.data) {
                            this.downloadFile = res.data.rows;
                        }
                        that.more03 = false;
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

            viewDocument (id) {
                this.$router.push({
                    'name': 'viewDocument',
                    'params': {
                        'id': id,
                        'viewType': 'home'
                    }
                });
            },
            // 下载文件
            downloadAttachement (list) {
                if (list != null) {
                    var attach = list[0];
                    var title = attach.attachmentName;
                    var id = attach.id;
                    this.$myHttp({
                        method: 'post',
                        url: this.prefix + '/microarch/sys/sysAttchement/download' + window.suffix,
                        data: {
                            'entity': {
                                'id': id
                            }
                        },
                        responseType: 'arraybuffer'
                    }).then(res => {
                        // 成功回调
                        var headers = res.headers;
                        var blob = new Blob([res.data], {
                            type: headers['content-type']
                        });
                        var link = document.createElement('a');
                        link.href = window.URL.createObjectURL(blob);
                        if (!title) {
                            var fileName = headers['content-disposition'];
                            title = fileName.includes('filename=') ? fileName.split('=')[1] : '下载的表单文件';
                        }
                        link.download = title;
                        link.click();
                    });
                }
            }

        }
    };
</script>
<style scoped>
    .commonHeight{
        height:100%;
    }
    .marginDiv{
        margin-left:10px;
    }
    .totalMsg{
        float:right;
        font-size:12px;
        color:#e8511e;
    }
.whiteBg{
    background: #fff;
    padding-bottom: 10px;

}
.whiteBg p.title{
    font-size:16px;
    padding:10px;

}
.whiteBg p.title i{
    color:#2d8cf0;
    margin-right:5px;
}
.whiteBg .lookMore{
    position:absolute;
    bottom:15px;
    right:50px;
    cursor: pointer;
    color:#1775ea;
    z-index:10;
}
 .bgFile{
     width:110px;
     height:100%;
     margin:0 auto;
     overflow:hidden;
     background:url('../../images/bg-file.png');
     background-size:100% 100%;
 }
h3{
    font-size:16px;
    text-align:center;
}
    .cardOnly{
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
    }
    .cardOnly .upContent{
        margin:5px;
        height:33%;
        margin-bottom:40px;
        margin-top:12px;
    }
    .cardOnly .upContent p{
        cursor: pointer;
    }
    .cardOnly .will{
        background: #ff8778;
        padding:2px 20px;
        margin-top:3px;
        display: inline-block;
        color:#fff;
    }
    .cardOnly p{
        padding:8px;
    }
    .cardOnly .downContent{
        color:#000;
        padding:10px;
        padding-bottom:0px;
    }
    #noticeWrap{
        position: relative;
        height:calc(100% - 44px);
        height:-webkit-calc(100% - 44px);
        height:-moz-calc(100% - 44px);
        width:100%;
        overflow:hidden;
    }
    .noticeBox{
        position: absolute;
        left:0;
        width:100%;
    }
.noticeBox>div{
    line-height:28px;
    overflow:hidden;
    padding:0 10px;
}
    .noticeBox .noticeTit{
        color:#1775ea;
        font-size:12px;
        cursor: pointer;
        width:60%;
        overflow:hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        float:left;
    }
    .noticeBox span.rightDate{
        float:right;
    }

    /*文字无缝滚动*/
    .manualList,.manualList li{
        overflow:hidden;
    }
.manualList li{
    margin-top: 10px;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px dashed #f5f5f5;
    text-align:left;
    position: relative;
    height:100%;
    display:flex;
    align-items:center;
}
    .manualList li:first-child{
        margin-top:0;
    }
.manualList .manualImg{
    float:left;
}
.manualImg img{
    margin-left:10px;
    display:block;
}
.manualList .manualText{
    float:left;
    width:calc(100% - 150px);
    margin-left:20px;
}
.manualText .manualTitle{
    color:#1775ea;
    font-size:14px;
    line-height:25px;
}
.manualText .time{
    color:#999;
    font-size:12px;
    line-height:20px;
    padding:5px 0;
}
.manualText .detailBtn span{
    display:inline-block;
    padding:2px 16px;
    color:orange;
    font-size:12px;
    border:1px solid orange;
    cursor:pointer;
}
.manualList .manualDownload{
    position: absolute;
    right:0;
    width:260px;
    height:100%;
    display: flex;
    align-items:center;
}
.manualDownload .iconStar{
    font-size:12px;
    margin-right:20px;
    color:orange;
}
.manualDownload .downloadIcon{
    width:50px;
    text-align:center;
    color:#1775ea;
    margin-right:10px;
}
    .downloadIcon i{
        border:1px solid #1775ea;
        border-radius: 50%;
        display:block;
        width:25px;
        height:25px;
        font-size:20px;
        margin:2px auto;
    }
    .manualDownload .favor{
        width:50px;
        text-align: center;
        color:orange;
    }
    .favor i{
        display:block;
        width:20px;
        height:20px;
        font-size:20px;
        margin:2px auto;
    }
    .border-left {
        border-left: 5px solid #e7eaec;
        margin-left: 25px;
        margin-right:10px;
        position: relative;
        margin-top: 20px;
    }
    .list-classify {
        height: 90px;
        margin-bottom: 3px;
    }
    .list-classify p.hTitle {
        color: #666666;
        margin-left: -25px !important;
        margin-top: -10px;
        height: 24px;
        line-height: 24px;
        font-size: 14px;
    }
    .list-classify p.hTitle span{
        width:calc(100% - 42px);
        white-space: nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
        float: right;
        height: 42px;
        line-height: 42px;
    }
    .border-left h5 {
        color: #bdbdbd;
        padding-left: 30px;
        margin-top: 15px;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 20px;
        font-size: 12px;
        font-weight:normal;
    }
    .goRight{
        float:right;
        position: relative;
        top: -5px;
    }
    .lookMoreTemplate {
        margin-top:15px;
        cursor: pointer;
        color:#1775ea;
        float: right!important;
    }
    .border-left label {
        font-weight: normal;
    }
    .text-info {
        color: #31708f;
    }
    .hText{
        height: 15px;
        margin-bottom: 10px;
        font-size: 12px;
        line-height: 15px;
        overflow:hidden;
    }
    img {
        vertical-align: middle;
    }
</style>