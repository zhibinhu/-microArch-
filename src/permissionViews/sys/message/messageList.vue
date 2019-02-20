<template>
    <div>
        <el-row>
            <el-col :span="24" style="background-color: white;padding:10px 20px;">
                <h2>
                    <div><div style="float: left;padding-top: 6px;padding-right: 5px;"><img  :src="getNoticeUrl()"  width="20" height="20" /></div><div><span style="float:left;height:32px;line-height: 32px;font-weight: normal;font-size: 14px;">消息通知</span></div></div>
                    <div class="tableBtn" style="float:right;padding:0;">
                        <el-button @click="deleteSelect" icon="el-icon-delete" size="small" type="danger">删除
                        </el-button>
                        <el-button @click="readSel" icon="el-icon-circle-plus-outline" size="small" type="primary">标记为已读
                        </el-button>
                        <el-button @click="readAll" icon="el-icon-circle-plus-outline" size="small" type="primary">全部标记为已读
                        </el-button>
                    </div>
                </h2>
                <!--表格展示列表show-summary-->
                <el-table
                        id="curTable"
                        :data="ourtableData"
                        :max-height="maxHeight"
                        ref="myTable"
                        border
                        stripe
                        :header-cell-style="{padding:'4px 0',background:'#dfebf9',fontSize:'12px'}"
                        :cell-style="{fontSize:'12px',padding:'4px 0'}"
                        @selection-change="handleSelectionChange"
                        style="width: 100%">
                    <el-table-column
                            type="selection"
                            width="55"
                    ></el-table-column>
                    <el-table-column
                            width="70"
                            prop="status"
                            align="center"
                            label="状态">
                        <template slot-scope="scope">
                                <span >
                                    <img  :src="getUrl(scope.row.status)"  width="20" height="20" />
                                </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="subject"
                            width="250"
                            label="主题"
                            >
                        <template slot-scope="scope">
                            <div v-if= "scope.row.status === '0'" style="font-size: 20px;">
                                <strong>{{scope.row.subject}}</strong>
                            </div>
                            <div v-else style="font-size: 20px;">
                                {{scope.row.subject}}
                            </div >
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="content"
                            label="内容"
                            :show-overflow-tooltip="true"
                            >
                        <template slot-scope="scope">
                            <div v-if= "scope.row.status === '0'">
                                <strong>{{scope.row.content}}</strong>
                            </div>
                            <div v-else>
                                {{scope.row.content}}
                            </div >
                        </template>
                    </el-table-column>
                    <el-table-column
                            width="139"
                            prop="emailFromName"
                            label="发件人">
                    </el-table-column>
                    <el-table-column
                            width="139"
                            prop="createTime"
                            label="发件时间">
                    </el-table-column>
                </el-table>
                <el-pagination
                        class="setMinWidth"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageNumber"
                        :page-sizes="[10, 20, 30, 40,50,100]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :style="paginationStyle"
                        :total="total">
                </el-pagination>
            </el-col>
        </el-row>
    </div>
</template>
<script>

    import Cookies from 'js-cookie';

    export default {
        components: {

        },
        data () {
            return {
                maxHeight:this.$store.state.maxHeight,

                ourtableData: [],
                id: '',
                subject: '',
                emailTo: '',
                emailFrom: '',
                type: 1,
                status: '',
                pageNumber: 1,
                pageSize: 10,
                total: 1,
                condition: [],
                statusData: [],
                dirArry: ['message_status'],
                iconName: 'read.png',
                fullHeight: document.documentElement.clientHeight,
                paginationStyle: 'margin-bottom:35px',
                myTableStyle: 'margin-bottom:35px',

            };
        },
        mounted () {
            this.$store.state.me = this
            this.queryList(1, 10);
            window.onresize = () => {
                return (() => {
                    window.fullHeight = document.documentElement.clientHeight;
                    this.fullHeight = window.fullHeight;
                    this.setPaginationStyle();
                })();
            };
        },
        methods: {
            setPaginationStyle: function () {

                //动态设置table最大高度  使头部、尾部在数据增多时固定
                this.$store.state.fullHeight = this.fullHeight
                if(Cookies.get('hiddenRightValue') == 'true'){
                    this.maxHeight = this.fullHeight - 140

                }else {
                    this.maxHeight = this.fullHeight - 190

                }
                // 浏览器高度小于 704 直接定位到底部
                if (this.fullHeight < 500) {
                    this.paginationStyle = 'background-color: white;position: fixed;bottom: 0; width: 100%; z-index: 100;margin-left:-20px';
                    this.myTableStyle = 'margin-bottom:35px';
                } else {
                    // table宽度小于 浏览器高度 - （面包屑 + 导航栏的高度）说明需要固定位置
                    if (this.$refs.myTable && this.$refs.myTable.$el.clientHeight < this.fullHeight - 280) {
                        this.paginationStyle = 'background-color: white';
                        this.myTableStyle = 'margin-bottom:0px';
                    } else {
                        this.paginationStyle = 'background-color: white;position: fixed;bottom: 0; width: 100%; z-index: 100;margin-left:-20px';
                        this.myTableStyle = 'margin-bottom:35px';
                    }
                }
            },

            getCurrentRow (val, account) {
                this.managerName = val;
                this.account = account;
            },
            queryList (currentPage, currentSize) {
               var conditions =  [
                    {
                        "field": "type",
                        "opt": "=",
                        "value": "MSG",
                        "assemble": "and"
                    },
                    {
                        "field": "emailTo",
                        "opt": "=",
                        "value": sessionStorage.getItem('userName'),
                        "assemble": "and"
                    }
                ]
                var params = {
                    'where': conditions,
                    'pageNum': 0,
                    'pageSize': 10,
                    'orderBy': 'createTime desc'
                };

                params.where = conditions ;
                params.pageNum = currentPage - 1;
                params.pageSize = currentSize;

                this.$myHttp({
                    method: 'post',
                    url: this.prefix + '/microarch/sys/message/list',
                    data: params
                }).then(res => {
                    if (res.data && res.data.rows) {
                        this.ourtableData = res.data.rows;
                        this.total = parseInt(res.data.total);
                    }
                });
                setTimeout(function () {
                    var curTable = document.getElementById('curTable');
                    var thGutter = curTable.getElementsByClassName('gutter')[0];
                    thGutter.style.display = 'table-cell';
                }, 500);
            },
            handleSelectionChange (val) {
                this.multipleSelection = val;
            },
            handleSizeChange (val) {
                console.log(`每页 ${val} 条`);
                this.pageSize = val;
                this.pageNumber = 1;
                this.queryList(1, val);
            },
            handleCurrentChange (val) {
                console.log(`当前页: ${val}`);
                this.pageNumber = val;
                this.queryList(val, this.pageSize);
            },
            getUrl(status){
                if(status === '0') {
                    return require('@/images/unread.png');
                }else{
                    return require('@/images/read.png');
                }
            },
            getNoticeUrl() {
                return require('@/images/notice.png');
            },
            deleteSelect() {
                if(this.multipleSelection) {
                    var ids = this.multipleSelection.map(item => {
                        return item.id
                    })
                    this.$confirm('此操作将永久删除项目信息, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$myHttp({
                            method: 'post',
                            url: this.prefix + '/microarch/sys/message/batchDelete?ids=' + ids
                        }).then(res => {
                            this.$message({
                                message: ' 删除成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.queryList(1, 10);
                                }
                            })
                        });
                    }).catch(e => {
                        // 打印一下错误
                        console.log('catch->' + e)
                    })
                }else {
                        this.$message({
                            message: ' 未选择删除数据',
                            type: 'warning',
                            duration: 1500
                        })
                    }
            },
            readSel() {
                if(this.multipleSelection) {
                    var ids = this.multipleSelection.map(item => {
                        return item.id
                    })
                    this.$myHttp({
                        method: 'POST',
                        url: this.prefix + '/microarch/sys/message/read?ids=' + ids
                    }).then(res => {
                        // this.queryList(1, 10);
                        this.handleCurrentChange(1);
                        this.$emit('getMessageCount');
                    });
                }else{
                    this.$message({
                        message: ' 未选择标记数据',
                        type: 'warning',
                        duration: 1500
                    })
                }
            },
            readAll() {
                this.$myHttp({
                    method: 'GET',
                    url: this.prefix + '/microarch/sys/message/readAll/'+sessionStorage.getItem('userName'),
                    data: {}
                }).then(res => {
                    // this.queryList(1, 10);
                    this.handleCurrentChange(1);
                    this.$emit('getMessageCount');
                });
            }
        },
        updated: function () {
            // render完成之后出发调整样式方法
            this.setPaginationStyle();
        }
    };
</script>
<style scoped>
    .el-message-box{
        width:600px;
        height:600px;
    }
    .commonTable{
        max-height:485px;
        overflow-y:auto;
        position:relative;
    }
    .inputPadding{
        padding-left:10px;
    }
    .setMinWidth{

    }
    .el-dialog__body{
        padding-bottom:10px;
    }
    .commonTable .el-radio__label{
        display:none;
    }
    .el-button.is-circle {
        padding: 7px;
    }

    .el-tooltip {

        height: 28px;
    }
    h2{
        overflow: hidden;
        padding: 0;
        padding-bottom: 10px;
        border-bottom: 1px solid #ddd;
        margin-bottom: 10px;
    }
</style>