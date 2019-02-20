<template>

    <div>
        <el-row>

            <el-col :span="24" style="background-color: white;padding:10px 20px;">
                <h2>
                    <div style="float: left;padding-top: 4px;padding-right: 5px;">
                        <img  :src="getNoticeUrl()"  width="16" height="16" />
                    </div>
                    <div>
                        <span style="float:left;height:32px;line-height: 32px;font-weight: normal;font-size: 14px;">实例管理</span>
                    </div>
                    <div style="float:right;padding:0;">
                        <el-button @click="toHistory()" icon="el-icon-circle-plus-outline" size="small" type="primary">流程跟踪</el-button>
                        <!--<el-button @click="toDelete()" icon="el-icon-remove" size="small" type="danger">强制删除</el-button>-->
                    </div>
                </h2>
                <el-form ref="form" :model="form" label-width="80px" style="overflow: hidden;margin-bottom: 10px;">
                    <el-col :span="6" :xs="20" class="inputPadding">
                        <el-form-item label="流程KEY">
                            <el-input v-model="form.key" size="small" clearable></el-input>
                        </el-form-item>

                    </el-col>

                    <el-col :span="6" :xs="20" class="inputPadding">
                        <el-form-item label="流程名称">
                            <el-input v-model="form.procDefName" size="small" clearable></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6" :xs="20" class="inputPadding">
                        <el-form-item label="业务信息">
                            <el-input v-model="form.name" size="small" clearable></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6" :xs="20" class="inputPadding">
                        <el-button :span="6" :xs="20" type="primary" icon="el-icon-search" round @click.enter="search()" size="small" style="margin-top: 4px;">查询</el-button>
                    </el-col>
                </el-form>

                <el-dialog title="流程跟踪" :visible.sync="dialogVisible" append-to-body  :modal-append-to-body="false" width="1000px">
                    <task-list :taskListDate="taskListDate" :processInstanceId="processInstanceId"></task-list>
                </el-dialog>

                <my-table @getSelectedData="getSelectedData" ref="actInstanceTable" :myTableData="myTableData"></my-table>
            </el-col>

        </el-row>
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
                    trackListUrl: ''
                },

                myTableData: {
                    url: '/microarch/activiti/instance/list',
                    dlUrl: '',
                    viewName: '',
                    editName: '',
                    hiddenAction: true,
                    exportName: '实例信息.xlsx',
                    selectColFlag:{
                        headName: '选择',
                        headKey: '',
                        selectionRadioButton: true,
                        isHidden: true,
                        fixedColumn: true
                    },
                    tableThead: [
                        {
                            headName: '序号',
                            headKey: 'pageIndex',
                            width: 22,
                            align: 'center',
                            isNumber:true
                        },
                        {
                            headName: '流程定义KEY',
                            headKey: 'key',
                            unSort: true
                        },
                        {
                            headName: '流程定义名称',
                            headKey: 'procDefName',
                            unSort: true
                        },
                        {
                            headName: '模块名称',
                            headKey: 'moduleName',
                            unSort: true
                        },
                        {
                            headName: '业务信息',
                            headKey: 'name',
                            isNeedTips: true,
                            unSort: true
                        },
                        {
                            headName: '发起者',
                            headKey: 'applyPerson',
                            unSort: true
                        },
                        {
                            headName: '当前流程节点',
                            headKey: 'curTaskName',
                            isNeedTips: true,
                            unSort: true
                        },
                        {
                            headName: '当前任务创建时间',
                            headKey: 'curTaskCreateTime',
                            unSort: true
                        },
                        {
                            headName: '当前处理人',
                            headKey: 'curTaskAssignee',
                            isNeedTips: true,
                            unSort: true
                        }
                    ],
                    entity: {},
                    where: [],
                    conditions: [],
                    pageRequest: {},
                    myorderBy: 'id DESC',
                    radio: ''
                },
                form: {
                    key: '',
                    name: '',
                    procDefName: ''
                },
                dialogVisible: false,
                processInstanceId: '',
                total: 1,
                pageNumber: 1,
                pageSize: 10,
                condition: []// 查询条件
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
                this.myTableData.radio = val.id;
                if (this.checkValue()) {
                    this.processInstanceId = this.myTableData.radio;
                    this.$myHttp({
                        method: 'get',
                        url: this.prefix + '/microarch/activiti/trace/photo?processInstanceId=' + this.myTableData.radio,
                        responseType: 'arraybuffer'
                    }).then(res => {
                        // console.log('imgsrc---',res)
                        return 'data:image/png;base64,' + btoa(
                            new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
                        );
                    }).then(data => {
                        this.taskListDate.imgSrc = data;
                    });
                    this.taskListDate.trackListUrl = '/microarch/activiti/task/trace/list/' + this.myTableData.radio;
                }
            },
            search () {
                var _this = this;
                var myentity = [];
                if (this.form.key) {
                    myentity.push({'field': 'key', 'opt': 'like', 'value': _this.form.key, 'assemble': 'and'});
                }
                if (this.form.name) {
                    myentity.push({'field': 'name', 'opt': 'like', 'value': _this.form.name, 'assemble': 'and'});
                }
                if (this.form.procDefName) {
                    myentity.push({'field': 'procDefName', 'opt': 'like', 'value': _this.form.procDefName, 'assemble': 'and'});
                }
                this.myTableData.where = myentity;
                this.$refs.actInstanceTable.findAllProject(1);
            },
            toHistory: function () {
                if (this.checkValue()) {
                    this.dialogVisible = true;
                    this.processInstanceId = this.myTableData.radio;
                }
            },
            toDelete: function () {
                if (this.checkValue()) {
                    this.$confirm('是否确定强制删除流程实例?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$myHttp({
                            method: 'GET',
                            url: this.prefix + '/microarch/activiti/instance/delete/' + this.myTableData.radio,
                            data: {'processInstanceId': this.myTableData.radio}
                        }).then(res => {
                            // 成功回调方法
                            this.$message({
                                showClose: true,
                                message: '强制删除成功！',
                                type: 'success'
                            });
                            this.$refs.actInstanceTable.findAllProject(1);
                        });
                    }).catch(() => {
                    });
                }
            },
            checkValue () {
                if (this.myTableData.radio.length === 0) {
                    this.$message({
                        message: '请选择',
                        type: 'warning'
                    });
                    return false;
                }
                return true;
            }
        },
        mounted: function () {},
        filters: {

        }
    };
</script>
<style scoped>
    h2{
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