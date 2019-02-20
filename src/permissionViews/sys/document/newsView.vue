<template>
    <div style="padding:10px;background: #fff;">
        <fieldset style="margin-bottom: 40px;">
            <legend>{{title}}</legend>
            <div class="newsCon" v-html="news">{{news}}</div>
            <comment></comment>
        </fieldset>
        <div style="text-align:center;position: fixed;width:calc(100% - 235px);bottom:20px;">
            <el-button class="el-icon-back" size="medium" round @click="backList">返回</el-button>
        </div>
    </div>
</template>

<script>
    import comment from './comment'
    export default {
        name: 'newsView',
        data () {
            return {
                id: '',
                news: '',
                viewType: '',
                type: '',
                title: '',
                commentText:''
            };
        },
        components:{comment},
        created () {
            this.id=this.$route.query.id;
            console.log('this.id222---',this.id);
            this.viewType = this.$route.query.viewType;
            this.type = this.$route.query.type;
            if (this.$route.params.row != undefined) {
                this.type = this.$route.params.row.documentType;
            }
            if (this.type == '01') {
                this.title = '新闻公告-内容';
            }
            if (this.type == '04') {
                this.title = '项目快讯-内容';
            }
            this.backfilleditData();
        },
        methods: {
            backfilleditData () {
                var dataId = this.id;
                if (dataId) {
                    this.$myHttp({
                        method: 'post',
                        url: this.prefix + '/microarch/sys/SysDocument/viewNews' + window.suffix,
                        data: {
                            'entity': {
                                'id': dataId
                            }
                        }
                    }).then(res => {
                        var backData = res.data;
                        this.news = backData;
                    });
                }
            },
            backList () {
                if (this.viewType == 'home') {
                    this.$router.push({
                        name: 'home_index'
                    });
                } else {
                    this.$router.push({
                        name: 'newsList',
                        'params': {
                            'type': this.type
                        }
                    });
                }
            }

        }
    };
</script>

<style >
    fieldset {
        padding:10px;
        color:#333;
        border:#06c solid 1px;
    }
    legend {
        color:#06c;
        font-weight:800;
        background:#fff;
        border:#b6b6b6 solid 1px;
        padding:3px 6px;
    }
    .newsCon{
        padding-bottom: 30px;
        margin-bottom: 20px;
        border-bottom: 1px solid #ccc;
    }
</style>