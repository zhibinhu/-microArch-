<template>
    <div>
        <el-row>
            <el-col :span="24" style="background-color: white;padding:10px 20px;">

                <el-form :model="form" label-width="100px" style="overflow: hidden;margin-bottom: 10px;">

                    <el-col :span="6" class="inputPadding" >
                        <el-form-item label="登录名">
                            <el-input v-model="form.loginName" size="small" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" :xs="20" class="inputPadding">
                        <el-form-item label="访问时间">
                            <el-date-picker
                                    style="width:100%;"
                                    v-model="form.loginDate"
                                    type="daterange"
                                    align="right"
                                    unlink-panels
                                    range-separator="-"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    size="small"
                                    @change="reStoreValue"
                                    :picker-options="loginDatePickerOptions">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2" :xs="20" class="inputPadding">
                        <el-button :span="6" :xs="20" type="primary" icon="el-icon-search" round @click.enter="search()" size="small" style="margin-top: 4px;">查询</el-button>
                    </el-col>
                    <el-col :span="8" :xs="20" class="inputPadding">
                        <el-alert
                                title="默认查询最近7天的访问记录"
                                type="info"
                                show-icon
                                :closable="false">
                        </el-alert>
                    </el-col>
                </el-form>
                <my-table ref="loginLogList" :myTableData="myTableData"></my-table>
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
                    url: '/microarch/sys/log/login',
                    hiddenAction: true,
                    exportName:'用户访问日志信息.xlsx',
                    tableThead: [
                        {
                            headName:'序号',
                            headKey: 'pageIndex',
                            width: 22
                        },
                        {
                            headName: '登录名',
                            headKey: 'loginName',
                            width: 50
                        },
                        {
                            headName: '登录姓名',
                            headKey: 'loginCName',
                            width: 50
                        },
                        {
                            headName: '登录ip',
                            headKey: 'ipAddress'
                        },
                        {
                            headName: '访问时间',
                            headKey: 'loginDate'
                        },
                        {
                            headName: '客户端系统',
                            headKey: 'clientos',
                        },
                        {
                            headName: '客户端浏览器',
                            headKey: 'browserName',
                        }

                    ],
                    entity: {},
                    ext: [],
                    where: [{'field': 'loginDate', 'opt': '>=', 'value': ((new Date()).getTime() - 3600 * 1000 * 24 * 7), 'assemble': 'and'},
                        {'field': 'loginDate', 'opt': '<=', 'value': ((new Date()).getTime()), 'assemble': 'and'}
                    ],
                    conditions: [],
                    pageRequest: {},
                    sortBy: {},
                    myorderBy: 'loginDate desc'
                },
                form: {
                    loginName: '',
                    id: 0,
                    ipAddress:'',
                    clientos:'',
                    browserName:'',
                    loginDate: '',
                    startTime: '',
                    endTime: ''
                },
                condition:[],//查询条件
                selectionData:[],
                objects:[],
                loginDatePickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick (picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick (picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick (picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                }
            }
        },
        methods: {
            getSelectionData(val){
                this.selectionData=val;
            },
            search() {
                var _this = this;
                var data = {};
                var myentity=[];
                if(this.form.loginName){
                    myentity.push({"field":'loginName',"opt": "like","value":_this.form.loginName,"assemble": "and"});
                }
                if (this.form.loginDate) {
                    _this.form.startTime = _this.form.startTime == '' ? _this.form.loginDate[0].getTime() : _this.form.startTime;
                    _this.form.endTime = _this.form.endTime == '' ? _this.form.loginDate[1].getTime() : _this.form.endTime;
                    myentity.push({'field': 'loginDate', 'opt': '>=', 'value': _this.form.startTime, 'assemble': 'and'});
                    myentity.push({'field': 'loginDate', 'opt': '<=', 'value': _this.form.endTime, 'assemble': 'and'});
                }
                this.myTableData.where=myentity;
                this.$refs.loginLogList.findAllProject(1);
            },

            reStoreValue () {
                if (this.form.loginDate) {
                    this.form.startTime = this.form.loginDate[0].getTime();
                    this.form.endTime = this.form.loginDate[1].getTime();
                }
            },
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

