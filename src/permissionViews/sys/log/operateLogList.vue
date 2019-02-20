<template>
    <div>
        <el-row>
            <el-col :span="24" style="background-color: white;padding:10px 20px;">

                <el-form :model="form" label-width="100px" style="overflow: hidden;margin-bottom: 10px;">
                    <el-col :span="6" :xs="20"  class="inputPadding">
                        <el-form-item label="操作类型">
                            <el-select v-model="form.operateType" size="small" clearable>
                                <el-option
                                        v-for="item in operateTypeData"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" :xs="20" class="inputPadding">
                        <el-form-item label="操作时间">
                            <el-date-picker
                                    style="width:100%;"
                                    v-model="form.createTime"
                                    type="daterange"
                                    align="right"
                                    unlink-panels
                                    range-separator="-"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    size="small"
                                    @change="reStoreValue"
                                    :picker-options="createTimePickerOptions">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>

                    <el-col :span="2" :xs="20" class="inputPadding">
                        <el-button :span="6" :xs="20" type="primary" icon="el-icon-search" round @click.enter="search()" size="small" style="margin-top: 4px;">查询</el-button>

                    </el-col>
                    <el-col :span="8" :xs="20" class="inputPadding">
                        <el-alert
                            title="默认查询最近7天的操作记录"
                            type="info"
                            show-icon
                            :closable="false">
                        </el-alert>
                    </el-col>
                </el-form>
                <my-table ref="operateLogList" :myTableData="myTableData" @showParams="showParams" @showResult="showResult"></my-table>
            </el-col>
        </el-row>
        <request-params v-if="paramsVisible" ref="showParams" @listen-show-params="showParams"></request-params>
        <request-result v-if="resultVisible" ref="showResult" @listen-show-result="showResult"></request-result>
    </div>
</template>

<script>

    import myTable from "@/components/myTableSys"
    import util from "@/libs/util";
    import requestParams from './requestParams';
    import requestResult from './requestResult';
    export default {
        components: {
            myTable, requestParams, requestResult
        },
        data() {
            return {
                myTableData: {
                    url: '/microarch/sys/log/operate',
                    exportName:'用户操作日志信息.xlsx',
                    actionWidth:145,
                    hiddenAction: true,
                    showLogListAction:true,
                    tableThead: [
                        {
                            headName:'序号',
                            headKey: 'pageIndex',
                            width: 22
                        },
                        {
                            headName: '操作IP',
                            headKey: 'requestIp',
                            width:50
                        },
                        {
                            headName: '操作类型',
                            headKey: 'operateType',
                            dirKey: true,
                            width:40
                        },
                        {
                            headName: '操作描述',
                            headKey: 'description',
                            showToolTipFlag:true,
                            width:65
                        },
                        {
                            headName: '请求URL',
                            headKey: 'actionUrl',
                            showToolTipFlag:true
                        },
                        {
                            headName: '请求方法',
                            headKey: 'actionMethod',
                            showToolTipFlag:true

                        },
                        {
                            headName: '操作时间',
                            headKey: 'createTime',
                            width:60
                        }
                    ],
                    entity: {},
                    where: [{'field': 'createTime', 'opt': '>=', 'value': ((new Date()).getTime() - 3600 * 1000 * 24 * 7), 'assemble': 'and'},
                            {'field': 'createTime', 'opt': '<=', 'value': ((new Date()).getTime()), 'assemble': 'and'}
                            ],
                    ext: [],
                    conditions: [],
                    pageRequest: {},
                    sortBy: {},
                    myorderBy: 'createTime desc'
                },
                form: {
                    requestIp: '',
                    id: 0,
                    operateType: '',
                    description:'',
                    params:'',
                    actionMethod:'',
                    createTime:'',
                    startUser: '',
                },
                condition:[],//查询条件
                selectionData:[],
                objects:[],
                dirArry: ['operateType'],
                operateTypeData: [],
                paramsVisible: false,
                resultVisible: false,
                params: '',
                result: '',
                createTimePickerOptions: {
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
                if(this.form.requestIp){
                    myentity.push({"field":'requestIp',"opt": "like","value":_this.form.requestIp,"assemble": "and"});
                }

                if (this.form.createTime) {
                    _this.form.startTime = _this.form.startTime == '' ? _this.form.createTime[0].getTime() : _this.form.startTime;
                    _this.form.endTime = _this.form.endTime == '' ? _this.form.createTime[1].getTime() : _this.form.endTime;
                    myentity.push({'field': 'createTime', 'opt': '>=', 'value': _this.form.startTime, 'assemble': 'and'});
                    myentity.push({'field': 'createTime', 'opt': '<=', 'value': _this.form.endTime, 'assemble': 'and'});
                }
                if(this.form.operateType){
                    myentity.push({"field":'operateType',"opt": "like","value":_this.form.operateType,"assemble": "and"});
                }
                this.myTableData.where=myentity;
                this.$refs.operateLogList.findAllProject(1);
            },
            reStoreValue () {
                if (this.form.createTime) {
                    this.form.startTime = this.form.createTime[0].getTime();
                    this.form.endTime = this.form.createTime[1].getTime();
                }
            },
            showParams(val){
                this.paramsVisible = true;       //点击后显示弹窗
                this.$nextTick(()=>{
                    //初始化子组件，可以传参过去，由子组件的init()方法接收处理，通过ref的值showParams可以访问到子组件的属性方法
                    this.$refs.showParams.init(val.params);
                })
            },

            showResult(val) {
                this.resultVisible = true;       //点击后显示弹窗
                this.$nextTick(()=>{
                    //初始化子组件，可以传参过去，由子组件的init()方法接收处理，通过ref的值showResult可以访问到子组件的属性方法
                    this.$refs.showResult.init(val.actionResult);
                })
            }

        },
        mounted: function () {
            util.getSelectData(this, this.dirArry);
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

