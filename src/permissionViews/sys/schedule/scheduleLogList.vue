<template>
    <div>
        <el-row>
            <el-col :span="24" style="background-color: white;padding:10px 20px;">

                <h2>
                    <div style="float: left;padding-top: 4px;padding-right: 5px;">
                        <img  :src="getNoticeUrl()"  width="16" height="16" />
                    </div>
                    <div>
                        <span style="float:left;height:32px;line-height: 32px;font-weight: normal;font-size: 14px;">定时任务日志</span>
                    </div>
                </h2>
                <el-form :model="form" label-width="100px" style="overflow: hidden;margin-bottom: 10px;">
                    <!--<el-col :span="6" class="inputPadding" >-->
                        <!--<el-form-item label="任务ID">-->
                            <!--<el-input v-model="form.jobId" size="small" clearable></el-input>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
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

                    <el-col :span="6" :xs="20" class="inputPadding">
                        <el-button :span="6" :xs="20" type="primary" icon="el-icon-search" round @click.enter="search()" size="small" style="margin-top: 4px;">查询</el-button>
                    </el-col>
                </el-form>
                <my-table ref="jobLogList" :myTableData="myTableData"></my-table>
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
                    url: '/microarch/sys/schedule/loglist',
                    hiddenAction: true,
                    exportName:'定时任务日志信息.xlsx',
                    tableThead: [
                        {
                            headName:'序号',
                            headKey: 'pageIndex',
                            width:30,
                            align:'center'
                        },
                        {
                            headName: '任务ID',
                            headKey: 'jobId'
                        },
                        {
                            headName: 'bean名称',
                            headKey: 'beanName',
                            width:50,
                        },
                        {
                            headName: '方法名称',
                            headKey: 'methodName'
                        },
                        {
                            headName: '参数',
                            headKey: 'params'
                        },
                        {
                            headName: '状态',
                            headKey: 'statusText',
                            width: 30
                        },
                        {
                            headName: '耗时(单位：毫秒)',
                            headKey: 'times',
                            width: 60
                        },
                        {
                            headName: '执行时间',
                            headKey: 'createTime'
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
                    jobId: 0,
                    methodName:'',
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
                objects:[]
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
                // if(this.form.jobId){
                //     myentity.push({"field":'jobId',"opt": "like","value":_this.form.jobId,"assemble": "and"});
                // }
                if(this.form.methodName){
                    myentity.push({"field":'methodName',"opt": "like","value":_this.form.methodName,"assemble": "and"});
                }
                this.myTableData.where=myentity;
                this.$refs.jobLogList.findAllProject(1);
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

