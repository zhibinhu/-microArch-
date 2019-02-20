<template>
    <div>
        <el-row>
            <el-col :span="24" style="background-color: white;padding:10px 20px;">
                <h2 class="h2">
                    <div style="float: left;padding-top: 4px;padding-right: 5px;"><img  :src="getNoticeUrl()"  width="16" height="16" /></div><div><span style="float:left;height:32px;line-height: 32px;font-weight: normal;font-size: 14px;">我的已办</span></div>
                    <div class="tableBtn" style="float:right;padding:0;">
                        <el-button type="primary" icon="el-icon-search"  @click.enter="toHistory()" size="small" style="margin-top: 4px;">流程跟踪</el-button>
                    </div>
                </h2>
            <el-form ref="form" :model="form" label-width="80px" style="overflow: hidden;margin-bottom: 10px;">

                <el-col :span="6" :xs="20"  class="inputPadding">
                    <el-form-item label="单据编号">
                        <el-input v-model="form.businessKey" size="small" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6" :xs="20"  class="inputPadding">
                    <el-form-item label="主题">
                        <el-input v-model="form.businessInfo" size="small" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6" :xs="20"  class="inputPadding">
                    <el-form-item label="紧急程度">
                        <el-select v-model="form.priority" placeholder="请选择" clearable size="small" style="width:100%;">
                            <el-option label="一般" value="50"></el-option>
                            <el-option label="紧急" value="100"></el-option>
                            <el-option label="特急" value="150"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6" :xs="20" class="inputPadding">
                    <el-button :span="6" :xs="20" type="primary" icon="el-icon-search" round @click.enter="search()" size="small" style="margin-top: 4px;">查询</el-button>
                    <el-button :span="2" :xs="20" type="primary" icon="el-icon-refresh" round @click="clearSearch()" size="small" style="margin-top: 4px;">重置</el-button>
                </el-col>
            </el-form>
                <my-table ref="tableProductLine" :myTableData="myTableData" @getSelectedData="getSelectedData" @customerEdit="customerEdit"></my-table>
            </el-col>
        </el-row>

        <el-dialog title="流程跟踪" :visible.sync="dialogVisible" :append-to-body="true" :modal-append-to-body="false" width="1000px">
            <task-list :taskListDate="taskListDate" :processInstanceId="processInstanceId"></task-list>
        </el-dialog>
    </div>
</template>


<script>
    import myTable from '../../components/myTableSys';
    import Cookies from 'js-cookie';
    import taskList from './trackList.vue';
    export default {
        data () {
            return {
                taskListDate: {
                    imgSrc: '',
                    trackListUrl: '',
                    showHisStatus:false
                },
                myTableData: {
                    right:true,
                    actionWidth:55,
                    url: '/microarch/activiti/task/haveDoneList/' + sessionStorage.getItem('userName'),
                    dlUrl: '',
                    viewName: 'viewOrder',
                    isHiddendelete: true,
                    isHiddenEdit: true,
                    exportName: '我的已办信息.xlsx',
                    selectColFlag:{
                        headName: '选择',
                        headKey: '',
                        selectionRadioButton: true,
                        isHidden: true,
                        fixedColumn: true
                    },
                    customStyleData:['haveDoneListTableThead','haveDoneListCheckedThreadData'],
                    checkedThreadData:['pageIndex','businessKey','businessInfo','priority','startUserName','currentActivityName','claimTime','createTime'],
                    tableThead: [
                        {
                            headName: '序号',
                            headKey: 'pageIndex',
                            width: 22,
                            isNumber:true
                        },
                        {
                            headName: '单据编号',
                            headKey: 'businessKey',
                            width: 60
                        },
                        {
                            headName: '主题',
                            headKey: 'businessInfo',
                            // width: 120,
                            showToolTipFlag: true,
                            viewUnderline: true,
                            hasCustomerEdit: true

                        },
                        {
                            headName: '紧急程度',
                            headKey: 'priority',
                            dirKey: true,
                            customerShow: true,
                            width: 40
                        },
                        {
                            headName: '发起人',
                            headKey: 'startUserName',
                            width: 40
                        },
                        {
                            headName: '当前节点',
                            headKey: 'currentActivityName',
                            width: 70,
                            showToolTipFlag: true,
                            unSort: true
                        },
                        {
                            headName: '签收时间',
                            headKey: 'claimTime',
                            width: 60
                        },
                        {
                            headName: '任务结束时间',
                            headKey: 'endTime',
                            width: 60
                        }

                    ],
                    entity: {},
                    where: [],
                    conditions: [],
                    pageRequest: {},
                    myorderBy: 'endTime DESC',
                    radio: ''
                },
                form: {
                    businessKey: '',
                    businessInfo: '',
                    priority: ''
                },
                total: 1,
                pageNumber: 1,
                pageSize: 10,
                condition: [], // 查询条件
                selectionData: '',
                dialogVisible: false,
                hisPath: '',
                processInstanceId: '',
                isFirstNode: false
            };
        },

        components: {
            myTable,
            taskList
        },

        methods: {
            getNoticeUrl() {
                return require('@/images/task.png');
            },
            getSelectedData (val) {
                var that = this;
                this.selectionData = val;
                this.myTableData.radio = val.id;
                if (val) {
                    this.processInstanceId = this.selectionData.pid;
                    this.$myHttp({
                        method: 'get',
                        url: this.prefix + '/microarch/activiti/trace/photo?processInstanceId=' + this.selectionData.pid,
                        responseType: 'arraybuffer'
                    }).then(res => {
                        // console.log('imgsrc---',res)
                        return 'data:image/png;base64,' + btoa(
                            new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
                        );
                    }).then(data => {
                        that.taskListDate.imgSrc = data;
                    });
                    this.taskListDate.trackListUrl = '/microarch/activiti/task/trace/list/' + this.selectionData.pid;
                }
            },
            search () {
                var _this = this;
                var myentity = [];
                if (this.form.businessKey) {
                    myentity.push({'field': 'businessKey', 'opt': 'like', 'value': _this.form.businessKey, 'assemble': 'and'});
                }
                if (this.form.businessInfo) {
                    myentity.push({'field': 'businessInfo', 'opt': 'like', 'value': _this.form.businessInfo, 'assemble': 'and'});
                }
                if (this.form.priority) {
                    myentity.push({'field': 'priority', 'opt': '=', 'value': _this.form.priority, 'assemble': 'and'});
                }

                this.myTableData.where = myentity;
                this.$refs.tableProductLine.findAllProject(1);
                /* this.conditions=myconditions;
                 this.mypage=0;
                 this.mysize=10;
                 */
                /* this.findAllProject(this.conditions,this.mypage,this.mysize,this.direction,this.field); */
            },
            clearSearch () {
                this.form.businessKey = '';
                this.form.businessInfo = '';
                this.form.priority = '';
            },
            toSign: function () {
                this.$router.push({
                    name: 'toSign'
                });
            },
            toHistory: function () {
                if (this.selectionData.length == 0) {
                    this.$message({
                        message: '未选择要查看的数据',
                        type: 'warning'
                    });
                    return null;
                }
                this.taskListDate.showHisStatus = this.selectionData.showHisApprovalStatus;
                this.processInstanceId = this.selectionData.pid;
                this.dialogVisible = true;
            },
            customerEdit (row) {
                if(row.configFormKey == "" ){
                    this.$router.push({
                        'name': row.businessUrl.split(',')[1],
                        'params': {
                            'row': row
                        }
                    });
                }else{
                    this.$router.push({
                        'name': row.configFormKey,
                        'params': {
                            'row': row
                        }
                    });
                }
            }
        },
        mounted: function () {
            var that = this;
            document.onkeydown = function (event) {
                if (event.keyCode == '13') {
                    that.search();
                }
            };
        },
        filters: {

        }

    };
</script>
<style scoped>
    .h2{
        overflow: hidden;
        padding: 0;
        padding-bottom: 10px;
        border-bottom: 1px solid #ddd;
        margin-bottom: 10px;
    }
    .el-form-item{
        margin-bottom:0;
    }
    .inputPadding{
        padding:0 15px;
    }
</style>