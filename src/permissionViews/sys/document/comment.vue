<template>
    <div class="commentArea">
        <el-input v-model="commentText" size="small" placeholder="添加评论或点赞" @blur="textLength"></el-input>
        <div class="actionBtn">
            <span>{{thumbsNum}}人已赞</span>
            <div class="commentBtn">
                <Button type="ghost" shape="circle" icon="thumbsup" @click="giveGood">点赞</Button>
                <Button type="primary" shape="circle" @click="giveComment">评论</Button>
            </div>
        </div>
        <div class="thumbsNum">
            <Icon class="thumb" size="16" type="thumbsup"></Icon>
            <span>{{thumbsNames}}</span>
        </div>
        <div class="messageBox">
            <div class="everyMessage" v-for="(item,index) in allComments">
                <h3 class="mesTit">
                    <span class="blueLine"></span>
                    <span class="mesText">
                        <strong>{{item.cname}}：</strong>
                        {{item.content}}
                    </span>
                </h3>
                <p class="clickFn">
                    <span class="replyTime">{{item.lastmodifiedTime}}</span>
                    <span class="canClick" :ref="item.replyBtn" @click="replyMessage(index)"><Icon type="chatbubble-working" size="14" style="margin-right:5px;"></Icon>回复</span>
                    <!--<span class="canClick"><Icon size="14" type="thumbsup" style="margin-right:5px;"></Icon>点赞</span>-->
                    <span class="canClick" v-if="item.cname==loginName" @click="delComment(item.id,index)">删除</span>
                </p>
                <div class="reply" v-if="item.replyFlag">
                    <el-input v-model="item.replyText" size="small" placeholder="回复评论" style="margin:10px 0;" @blur="replyLength(item.replyText)"></el-input>
                    <div class="replyBtn">
                        <el-button size="small" round @click="cancelReply(index)">取消</el-button>
                        <el-button size="small" type="primary" round @click="toComment(item.id,item.fromUid,index)">回复</el-button>
                    </div>
                </div>
                <div class="replyList">
                    <ul>
                        <li v-for="(replyItem,k) in item.replies && item.replies.length>=3?item.replies.slice(0,item.replies.length).reverse().slice(0,3):item.replies && item.replies.length>0 && item.replies.length<3 ? item.replies.slice(0,item.replies.length).reverse():item.replies">
                            <h3 class="mesTit">
                                <span class="mesText">
                                    <strong>{{replyItem.cname}}：</strong>
                                    {{replyItem.content}}
                                </span>
                            </h3>
                            <p class="clickFn">
                                <span class="replyTime">{{replyItem.lastmodifiedTime}}</span>
                                <span class="canClick" v-if="replyItem.cname==loginName" @click="delReplyItem(replyItem.id,item.id,index)">删除</span>
                            </p>
                        </li>
                        <li v-if="!item.showReplyFlag" v-for="(replyItem,k) in item.replies && item.replies.length>3?item.replies.slice(0,item.replies.length).reverse().slice(3,item.replies.length):[]">
                            <h3 class="mesTit">
                                <span class="mesText">
                                    <strong>{{replyItem.cname}}：</strong>
                                    {{replyItem.content}}
                                </span>
                            </h3>
                            <p class="clickFn">
                                <span class="replyTime">{{replyItem.lastmodifiedTime}}</span>
                                <span class="canClick" v-if="replyItem.cname==loginName">删除</span>
                            </p>
                        </li>
                    </ul>
                    <span class="moreReply" v-if="item.replies && item.replies.length>3 && item.showReplyFlag" @click="getAllReply($event,item.id,index)">共{{item.replies.length}}条评论</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Cookies from 'js-cookie';
    export default {
        data(){
            return{
                commentText:'',
                replyText:'',
                replyBtnDom:'',
                thumbsNum:0,
                thumbsNames:'',
                isGiveGoodOrNotFlag:false, //判断是否已点赞
                allComments:[],  //所有评论列表
                loginName:Cookies.get('user'),
                replyNum:[],


            }
        },
        methods: {
            textLength(){
                let commentText=this.commentText.replace(/^(\s)*|(\s)*$/g,'');
                if(commentText.length>500){
                    this.$message({
                        type:'warning',
                        message:'评论内容不能超过500个字符'
                    });
                    return ;
                }

            },
            replyLength(replyText){
                let replyTextReal=replyText.replace(/^(\s)*|(\s)*$/g,'');
                if(replyTextReal.length>500){
                    this.$message({
                        type:'warning',
                        message:'回复内容不能超过500个字符'
                    });
                    return ;
                }
            },
            delComment(commentId,index){
                this.$myHttp({
                    method: 'post',
                    url: this.prefix + '/microarch/sys/comment/delete',
                    data: {
                        'entity': {
                            'id': commentId
                        }
                    }
                }).then(res => {
                    console.log('res---delComment---',res);
                    if(res.data.code==10000){
                        this.$message({
                            type:'success',
                            message:'评论删除成功'
                        });
                        this.getAllComments();//刷新评论列表
                    }
                })
            },
            delReplyItem(replyId,commentId,index){
                this.$myHttp({
                    method: 'post',
                    url: this.prefix + '/microarch/sys/comment/delSysReplay',
                    data: {
                        'entity': {
                            'id': replyId
                        }
                    }
                }).then(res => {
                    console.log('res---delReply---',res);
                    if(res.data.code==10000){
                        this.$message({
                            type:'success',
                            message:'回复删除成功'
                        });
                    }
                    this.getAllReply(false,commentId,index);//刷新回复列表
                })
            },
            getAllReply(event,commentId,index){
                // console.log('event--',event)
                this.$myHttp({
                    method: 'post',
                    url: this.prefix + '/microarch/sys/comment/findReply',
                    data: {
                        'entity': {
                            'commentId': commentId
                        }
                    }
                }).then(res => {
                    // console.log('allReply---',res);
                    // console.log('index---',index);
                    if(res.data) {
                        let repliesValue=res.data.rows;
                        this.$set(this.allComments[index],'replies',repliesValue);
                        if(event && event.target.className=='moreReply'){
                            this.$set(this.allComments[index],'showReplyFlag',false);
                        }
                    }
                    // console.log('getAllReply---',this.allComments[index]);
                })
            },
            giveComment(){
                let commentText=this.commentText.replace(/^(\s)*|(\s)*$/g,'');
                if(commentText==''){
                    this.$message({
                        type:'warning',
                        message:'评论内容不能为空'
                    });
                    return ;
                }
                if(commentText.length>500){
                    this.$message({
                        type:'warning',
                        message:'评论内容不能超过500个字符'
                    });
                    return ;
                }
                this.$myHttp({
                    method: 'post',
                    url: this.prefix + '/microarch/sys/comment/saveComment',
                    data: {
                        'entity': {
                            'commentType': 'content',
                            'topicId':this.$route.query.id,
                            'content':commentText
                        }
                    }
                }).then(res => {
                    console.log('res---comment---',res);
                    if(res.data.entity){
                        this.$message({
                            type:'success',
                            message:'评论成功'
                        });
                        this.commentText='';
                        this.getAllComments();//刷新评论列表
                    }
                })
            },
            toComment(commentId,fromUid,index){
                let content=this.allComments[index].replyText;
                console.log('content----',content);
                content=content.replace(/^(\s)*|(\s)*$/g,'');
                if(content==''){
                    this.$message({
                        type:'warning',
                        message:'回复内容不能为空'
                    });
                    return ;
                }
                if(content.length>500){
                    this.$message({
                        type:'warning',
                        message:'回复内容不能超过500个字符'
                    });
                    return ;
                }
                this.$myHttp({
                    method: 'post',
                    url: this.prefix + '/microarch/sys/comment/replay',
                    data: {
                        'entity': {
                            'commentId': commentId,
                            'toUid':fromUid,
                            'content':content
                        }
                    }
                }).then(res => {
                    console.log('contentsave---res---',res);
                    this.getAllReply(false,commentId,index);//刷新回复内容
                    this.cancelReply(index);//隐藏回复框
                    this.allComments[index]['replyText']='';
                })
            },
            replyMessage(index) {
                // console.log('replyBtn----',this.$refs['replyBtn'+index])
                this.$refs['replyBtn'+index][0].className='canClick active';
                this.$set(this.allComments[index],'replyFlag',true);
                let tempComments=this.allComments;
                this.allComments=[];
                this.allComments=tempComments;
            },
            cancelReply(index) {
                this.$set(this.allComments[index],'replyFlag',false);
                this.$refs['replyBtn'+index][0].className='canClick';
                let tempComments=this.allComments;
                this.allComments=[];
                this.allComments=tempComments;
            },
            getThumbsNum() {
                this.$myHttp({
                    method: 'post',
                    url: this.prefix + '/microarch/sys/comment/findAllUser',
                    data: {
                        'entity': {
                            'topicId': this.$route.query.id
                        }
                    }
                }).then(res => {
                    console.log('thumbsnum---', res);
                    this.thumbsNum = res.data.rows.length;
                    this.thumbsNames='';
                    for (var i = 0; i < res.data.rows.length; i++) {
                        this.thumbsNames += res.data.rows[i].cname + '、';
                    }

                });
            },
            isGiveGoodOrNot() {
                this.$myHttp({
                    method: 'post',
                    url: this.prefix + '/microarch/sys/comment/giveGoodExist',
                    data: {
                        'entity': {
                            'topicId': this.$route.query.id
                        }
                    }
                }).then(res => {
                    console.log('isGiveGoodOrNot---', res);
                    this.isGiveGoodOrNotFlag=res.data.ext;

                })
            },
            giveGood(){
                if(this.isGiveGoodOrNotFlag){
                    this.$message({
                        type:'warning',
                        message:'已点赞'
                    });
                    return;
                }else{
                    this.$myHttp({
                        method: 'post',
                        url: this.prefix + '/microarch/sys/comment/saveComment',
                        data: {
                            'entity': {
                                'commentType': 'img',
                                'topicId':this.$route.query.id
                            }
                        }
                    }).then(res => {
                        console.log('点赞了----',res);
                        if(res.data.code==10000) {
                            this.$message({
                                type: 'success',
                                message: '点赞成功'
                            });
                            this.isGiveGoodOrNotFlag=true;
                            this.getThumbsNum();//刷新点赞人数及人名

                        }
                    })
                }
            },
            getAllComments(){
                this.$myHttp({
                    method: 'post',
                    url: this.prefix + '/microarch/sys/comment/findAllReply',
                    data: {
                        'entity': {
                            'topicId': this.$route.query.id
                        }
                    }
                }).then(res => {
                    console.log('allComments---', res);
                    this.allComments=res.data.rows;
                    this.allComments=this.allComments.reverse();
                    for(var i=0;i<this.allComments.length;i++){
                        this.allComments[i].replyFlag=false;
                        this.allComments[i]['replyBtn']='replyBtn'+i;
                        this.allComments[i]['replyText']='';
                        this.getAllReply(false,this.allComments[i].id,i);  //查找所有评论下的回复
                        this.allComments[i]['showReplyFlag']=true;
                    }

                })
            }
        },
        mounted() {
            console.log('this.$route---', this.$route);
            this.getThumbsNum();//获取所有点赞用户
            this.isGiveGoodOrNot();//确定是否已点赞
            this.getAllComments();//获取该文章的所有评论

        }
    }
</script>
<style scoped>
    .commentArea{

    }
    .actionBtn{
        height:31px;
        line-height: 31px;
        padding: 10px 0;
        clear: both;
    }
    .commentBtn{
        float:right;
    }
    .thumbsNum{
        padding:10px 0;
        padding-left:20px;
        padding-bottom: 15px;
        position: relative;
        border-bottom: 1px solid #eee;
        color:#2d8cf0;
        clear: both;
    }
    .thumbsNum span{
        white-space: normal;
        word-break: break-all;
        line-height: 20px;
    }
    .thumb{
        position: absolute;
        left:0;
        top:10px;
    }
    .messageBox{
        margin:20px 0;
    }
    .messageBox .everyMessage{
        position: relative;
        margin-bottom: 20px;
    }
    .everyMessage h3.mesTit{
        position: relative;
        padding-left: 15px;
        margin:5px 0;
        font-weight: normal;
    }
    .everyMessage h3.mesTit .blueLine{
        position: absolute;
        left:0;
        top:5px;
        border-left:3px solid #2d8cf0;
        height:12px;
    }
    .everyMessage h3.mesTit .mesText{
        line-height: 20px;
        font-size:14px;
        color:#666;
        white-space: normal;
        word-break: break-all;
    }
    .everyMessage h3.mesTit strong{
        color:#999;
    }
    .everyMessage .clickFn{
        color:#666;
        padding-left: 15px;
    }
    .clickFn span{
        margin-right:20px;
    }
    .clickFn span.replyTime{
        color:#999;
    }
    .clickFn span.canClick{
        cursor: pointer;
    }
    .clickFn span.canClick:hover,.clickFn span.canClick.active{
        color: #2d8cf0;
    }
    .reply{
        width:60%;
        margin-left:15px;
    }
    .replyBtn{
        text-align: right;
    }
    .replyList{
        margin-left:15px;
        background:#ecf0f9;
        margin-top:10px;
        overflow: hidden;
    }
    .everyMessage .replyList h3.mesTit .mesText{
        font-size:12px;
    }
    .everyMessage .replyList h3.mesTit .mesText strong{
        font-weight: normal;
    }
    .replyList li{
        margin-bottom:15px;
    }
    .replyList li .mesText{
        font-size:12px;
        color:#333;
    }
    .replyList li .mesText strong{
        color:#2d8cf0;
    }
    .replyList .moreReply{
        color:#2d8cf0;
        cursor: pointer;
        padding: 0 15px 10px;
        display: inline-block;
    }
</style>