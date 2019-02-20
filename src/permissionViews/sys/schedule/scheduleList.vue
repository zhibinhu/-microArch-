<template>
    <div>
        <el-row>
            <el-col :span="24" style="background-color: white;padding:10px 20px;">

                <h2>
                    <div style="float: left;padding-top: 4px;padding-right: 5px;">
                        <img  :src="getNoticeUrl()"  width="16" height="16" />
                    </div>
                    <div>
                        <span style="float:left;height:32px;line-height: 32px;font-weight: normal;font-size: 14px;">定时任务管理</span>
                    </div>
                    <div class="tableBtn" style="float:right;padding:0;">
                        <el-button @click="addNewOrder()"  icon="el-icon-circle-plus-outline" size="small" type="primary">新增
                        </el-button>
                        <!--<el-button @click="deleteHandle()" icon="el-icon-circle-plus-outline" size="small" type="danger">删除-->
                        <!--</el-button>-->
                        <el-button @click="pauseHandle()" icon="el-icon-circle-plus-outline" size="small" type="danger">暂停
                        </el-button>
                        <el-button @click="resumeHandle()" icon="el-icon-circle-plus-outline" size="small" type="danger">恢复
                        </el-button>
                        <el-button @click="runHandle()" icon="el-icon-circle-plus-outline" size="small" type="danger">立即执行
                        </el-button>
                        <el-button @click="logHandle()" icon="el-icon-circle-plus-outline" size="small" type="success">日志列表
                        </el-button>
                    </div>
                </h2>
                <el-form :model="form" label-width="100px" style="overflow: hidden;margin-bottom: 10px;">
                    <el-col :span="6" class="inputPadding" >
                        <el-form-item label="bean名称">
                            <el-input v-model="form.beanName" size="small" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" class="inputPadding" >
                        <el-form-item label="方法名称">
                            <el-input v-model="form.methodName" size="small" clearable></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6" class="inputPadding" >
                        <el-form-item label="状态">
                            <el-select v-model="form.status" size="small" clearable>
                                <el-option
                                        v-for="item in statusOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>


                    <el-col :span="6" :xs="20" class="inputPadding">
                        <el-button :span="6" :xs="20" type="primary" icon="el-icon-search" round @click.enter="search()" size="small" style="margin-top: 4px;">查询</el-button>
                    </el-col>
                </el-form>
                <my-table ref="jobList" :myTableData="myTableData"  @getSelectionData="getSelectionData"></my-table>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import myTable from "@/components/myTableSys"

    export default {
        components: {
            myTable
        },
        data() {
            return {
                myTableData: {
                    right:true,
                    url: '/microarch/sys/schedule/list',
                    dlUrl: '/microarch/sys/schedule/delete',
                    viewName: 'sys/scheduleView',
                    editName: 'sys/scheduleEdit',
                    exportName:'定时任务信息.xlsx',
                    tableThead: [
                        {
                            headName: '选择',
                            headKey: '',
                            selectionCheckbox: true,
                            isHidden: true,
                            fixedColumn: true
                        },
                        {
                            headName:'序号',
                            headKey: 'pageIndex',
                            width:22,
                            align:'center'
                        },
                        {
                            headName: 'bean名称',
                            headKey: 'beanName',
                            underline:true,
                        },
                        {
                            headName: '方法名称',
                            headKey: 'methodName'
                        },
                        {
                            headName: '参数',
                            headKey: 'params',
                            width:60,
                            showToolTipFlag: true
                        },
                        {
                            headName: 'cron表达式',
                            headKey: 'cronExpression',
                            width:50
                        },
                        {
                            headName: '备注',
                            headKey: 'remark',
                            showToolTipFlag: true
                        },
                        {
                            headName: '状态',
                            headKey: 'statusText',
                            width:30
                        }
                    ],
                    entity: {},
                    ext: [],
                    conditions: [],
                    pageRequest: {},
                    sortBy: {},
                    myorderBy: 'createTime desc'
                },
                form: {
                    beanName: '',
                    methodName: '',
                    params:'',
                    cronExpression:'',
                    status:'',
                    remark:''
                },
                managerIdData: [],
                statusData: [],
                typeData: [],
                typeOptions: [

                ],
                condition:[],//查询条件
                selectionData:[],
                objects:[],
                statusOptions: [
                    {
                        value: '0',
                        label: '正常'
                    }, {
                        value: '1',
                        label: '暂停'
                    }
                ]
            }
        },
        methods: {
            getNoticeUrl() {
                return require('@/images/task.png');
            },
            getSelectionData(val){
                this.selectionData=val;
            },
            search() {
                var _this = this;
                var data = {};
                var myentity=[];
                if(this.form.beanName){
                    myentity.push({"field":'beanName',"opt": "like","value":_this.form.beanName,"assemble": "and"});
                }
                if(this.form.methodName){
                    myentity.push({"field":'methodName',"opt": "like","value":_this.form.methodName,"assemble": "and"});
                }
                if(this.form.status){
                    myentity.push({"field":'status',"opt": "=","value":_this.form.status,"assemble": "and"});
                }
                this.myTableData.where=myentity;
                this.$refs.jobList.findAllProject(1);
            },
            addNewOrder(){
                this.$router.push({
                    name:'sys/scheduleEdit',
                })
            },
            // 删除
            deleteHandle () {
                var ids = this.selectionData.map(item => {
                    return item.id
                })
                this.$confirm(`确定进行删除操作?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$myHttp({
                        url: this.prefix + '/microarch/sys/schedule/delete',
                        method: 'post',
                        data: {ids:ids}
                    }).then(res => {
                        if (res.status === 200) {
                            this.$message({
                                message: '删除成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.$refs.jobList.findAllProject(1);
                                }
                            })
                        } else {
                            this.$message.error("删除失败")
                        }
                    })
                }).catch(() => {})
            },
            // 暂停
            pauseHandle () {
                var ids = this.selectionData.map(item => {
                    return item.id
                })
                this.$confirm(`确定暂停操作?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$myHttp({
                        url: this.prefix + '/microarch/sys/schedule/pause?ids=' + ids,
                        method: 'post'
                    }).then(res =>  {
                        if (res.status === 200) {
                            this.$message({
                                message: '暂停成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.$refs.jobList.findAllProject(1);
                                }
                            })
                        } else {
                            this.$message.error("暂时失败")
                        }
                    })
                }).catch(() => {})
            },
            // 恢复
            resumeHandle () {
                var ids = this.selectionData.map(item => {
                    return item.id
                })
                this.$confirm(`确定恢复操作?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$myHttp({
                        url: this.prefix + '/microarch/sys/schedule/resume?ids=' + ids,
                        method: 'post'
                    }).then(res => {
                        if (res.status === 200) {
                            this.$message({
                                message: '恢复成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.$refs.jobList.findAllProject(1);
                                }
                            })
                        } else {
                            this.$message.error("恢复失败")
                        }
                    })
                }).catch(() => {})
            },
            // 立即执行
            runHandle () {
                var ids =  this.selectionData.map(item => {
                    return item.id
                })
                this.$confirm(`确定立即执行操作?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$myHttp({
                        url: this.prefix + '/microarch/sys/schedule/run?ids=' + ids,
                        method: 'post'
                    }).then(res =>  {
                        if (res.status === 200) {
                            this.$message({
                                message: '执行成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.$refs.jobList.findAllProject(1);
                                }
                            })
                        } else {
                            this.$message.error("执行失败")
                        }
                    })
                }).catch(() => {})
            },
            logHandle () {
                this.$router.push({
                    name:'sys/scheduleLogList',
                })
            }
        },
        mounted: function(){
        }

    }

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

