<template>
    <div>
        <el-row>
            <el-col :span="24" style="background-color: white;padding:10px 20px;">

                <h2 class="h2">

                    <div style="float: left;padding-top: 4px;padding-right: 5px;"><img  :src="getNoticeUrl()"  width="16" height="16" /></div><div><span style="float:left;height:32px;line-height: 32px;font-weight: normal;font-size: 14px;">我的待办</span></div>

                    <div class="tableBtn" style="float:right;padding:0;">
                        <!--<el-button @click="toSign" icon="el-icon-circle-plus-outline" size="small" type="primary">签收-->
                        <!--</el-button>-->
                        <!--<el-button type="primary" icon="el-icon-circle-plus-outline"  @click.enter="toDo" size="small" style="margin-top: 4px;">办理</el-button>-->
                        <!--<el-button type="primary" icon="el-icon-search"  @click.enter="toHistory()" size="small" style="margin-top: 4px;">流程跟踪</el-button>-->
                        <el-dropdown @command="handleCommand">
                            <el-button type="primary" size="small">
                                更多操作<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="get">签收</el-dropdown-item>
                                <el-dropdown-item command="export">excel导出</el-dropdown-item>
                                <el-dropdown-item command="selfCol">自定义列</el-dropdown-item>
                                <el-dropdown-item command="moreQuery">高级查询</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </h2>
                <!--<el-button @click="toDo()" size="small" type="primary" -->
                <!--style="margin-top: 20px;margin-bottom: 10px">转发-->
                <!--</el-button>-->
            <el-form ref="form" :model="form" label-width="80px" style="overflow: hidden;margin-bottom: 10px;">
                <div style="overflow:hidden">
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
                    <el-button :span="6" :xs="20" type="primary" icon="el-icon-search" round @click.enter="search()" size="small" style="margin-top: 4px;float:left;">查询</el-button>
                    <el-button :span="2" :xs="20" type="primary" icon="el-icon-refresh" round @click="clearSearch()" size="small" style="margin-top: 4px;float:left;">重置</el-button>
                    <!--<span style="font-size:33px;float:left;margin-left:10px;position:relative;top:-3px;color:#eee;cursor: pointer;"><i class="el-icon-circle-plus-outline" circle @click="advancedSearch()"></i></span>-->
                </el-col>

                </div>
                <div id="divAdvSearch" v-show="form.advancedFlag">
                <el-col :span="6" :xs="20" class="inputPadding">
                    <el-form-item label="发起人">
                        <el-input v-model="form.startUser" size="small" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12" :xs="20" class="inputPadding">
                    <el-form-item label="创建时间">
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
                <el-col :span="6" :xs="20"></el-col>
                </div>
            </el-form>
                <my-table v-if="loadOnceFlag" ref="tableProductLine" :myTableData="myTableData" @excelTableRefresh="excelTableRefresh" @getSelectedData="getSelectedData"  @customerEdit="customerEdit" @goProcess="toDo" @traceFlow="toHistory"></my-table>
                <!--<my-table v-if="loadOnceFlag && loadExcelFlag" v-show="false" ref="tableProductLineHide" :myTableDataExcel="myTableDataExcel" :myTableData="myTableData"></my-table>-->
            </el-col>
        </el-row>

            <el-dialog title="流程跟踪" :visible.sync="dialogVisible" append-to-body  :modal-append-to-body="false" width="1000px">
            <task-list :taskListDate="taskListDate" :processInstanceId="processInstanceId"></task-list>
        </el-dialog>
    </div>
</template>


<script>
    import myTable from '../../components/myTableSys';
    import Cookies from 'js-cookie';
    import FileSaver from 'file-saver';
    import XLSX from 'xlsx';
    import taskList from './trackList.vue';
    export default {
        data () {
            return {
                taskListDate: {
                    imgSrc: '',
                    trackListUrl: '',
                    showHisStatus:false
                },
                imgSrc: '',
                trackListUrl: '',
                tranckPid: '',
                loadOnceFlag: true,
                loadExcelFlag:true,
                myTableData: {
                    actionWidth:55,
                    exportName:'待办列表',
                    hiddenAction: true,
                    showTodoListAction:true,
                    url: '/microarch/activiti/task/toDoList/' + sessionStorage.getItem('userName'), // Cookies.get('user');,
                    dlUrl: '',
                    viewName: 'viewOrder',
                    editName: 'editOrder',
                    selectColFlag:{
                        headName: '选择',
                        headKey: '',
                        selectionRadioButton: true,
                        isHidden: true,
                        fixedColumn: true
                    },
                    customStyleData:['toDoListTableThead','toDoListCheckedThreadData'],
                    checkedThreadData:['pageIndex','businessKey','businessInfo','priority','startUser','name','status','createTime'],
                    tableThead: [
                        {
                            headName: '序号',
                            headKey: 'pageIndex',
                            width: 22
                        },
                        {
                            headName: '单据编号',
                            headKey: 'businessKey',
                            width: 60
                        },
                        {
                            headName: '主题',
                            headKey: 'businessInfo',
                            width: 120,
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
                            headKey: 'startUser',
                            width: 40
                        },
                        {
                            headName: '当前节点',
                            headKey: 'name',
                            width: 50
                        },
                        {
                            headName: '待办状态',
                            headKey: 'status',
                            width: 40
                        },
                        {
                            headName: '创建时间',
                            headKey: 'createTime'
                        }

                    ],
                    entity: {},
                    where: [],
                    conditions: [],
                    pageRequest: {},
                    myorderBy: 'createTime DESC',
                    radio: ''
                },
                form: {
                    businessKey: '',
                    businessInfo: '',
                    priority: '',
                    startUser: '',
                    createTime: '',
                    startTime: '',
                    endTime: '',
                    advancedFlag: false
                },

                total: 1,
                pageNumber: 1,
                pageSize: 10,

                condition: [], // 查询条件
                selectionData: '',
                dialogVisible: false,
                hisPath: '',
                processInstanceId: '',
                isFirstNode: false,
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
            };
        },
        destroyed () {
            sessionStorage.setItem('toDoListConditions', JSON.stringify(this.form));
        },
        components: {
            myTable,
            taskList
        },
        // applye2
        methods: {
            getNoticeUrl() {
                return require('@/images/task.png');
            },
            excelTableRefresh(){
                this.loadExcelFlag=false;
                setTimeout(()=> {
                    this.loadExcelFlag=true;
                },10)

            },
            /// 报表导出
            exportExcel () {
                var _this = this;

                var wb = XLSX.utils.table_to_book(document.querySelector('#myTable'));

                var fix = document.querySelector('.el-table__fixed');

                if (fix) {
                    wb = XLSX.utils.table_to_book(document.querySelector('#myTable').removeChild(fix));
                    document.querySelector('#myTable').appendChild(fix);
                } else {
                    wb = XLSX.utils.table_to_book(document.querySelector('#myTable'));
                }

                var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: true, type: 'array'});

                try {
                    FileSaver.saveAs(new Blob([wbout], {type: 'application/octet-stream'}), '我的待办.xlsx');
                } catch (e) {
                    console.log(e, wbout);
                }
                return wbout;
            },
            reStoreValue () {
                if (this.form.createTime) {
                    this.form.startTime = this.form.createTime[0].getTime();
                    this.form.endTime = this.form.createTime[1].getTime();
                }
            },
            getSelectedData (val) {
                var that = this;
                this.selectionData = val;
                this.myTableData.radio = val.id;
                if (val) {
                    this.processInstanceId = this.selectionData.pid;// alert(this.selectionData.businessUrl)
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
                    this.taskListDate.showHisStatus = this.selectionData.showHisApprovalStatus;
                    this.taskListDate.trackListUrl = '/microarch/activiti/task/trace/list/' + this.selectionData.pid;
                }
            },
            search () {
                let _this = this;
                let myentity = [];
                if (this.form.businessKey) {
                    myentity.push({'field': 'businessKey', 'opt': 'like', 'value': _this.form.businessKey, 'assemble': 'and'});
                }
                if (this.form.businessInfo) {
                    myentity.push({'field': 'businessInfo', 'opt': 'like', 'value': _this.form.businessInfo, 'assemble': 'and'});
                }
                if (this.form.priority) {
                    myentity.push({'field': 'priority', 'opt': '=', 'value': _this.form.priority, 'assemble': 'and'});
                }
                if (this.form.startUser) {
                    myentity.push({'field': 'startUser', 'opt': '=', 'value': _this.form.startUser, 'assemble': 'and'});
                }
                if (this.form.createTime) {
                    _this.form.startTime = _this.form.startTime == '' ? _this.form.createTime[0].getTime() : _this.form.startTime;
                    _this.form.endTime = _this.form.endTime == '' ? _this.form.createTime[1].getTime() : _this.form.endTime;
                    myentity.push({'field': 'createTime', 'opt': '>=', 'value': _this.form.startTime, 'assemble': 'and'});
                    // _this.form.createTime[1].setHours(23,59,59,999);
                    myentity.push({'field': 'createTime', 'opt': '<=', 'value': _this.form.endTime, 'assemble': 'and'});
                }
                this.myTableData.where = myentity;
                console.log('查询条件是', this.myTableData.where);
                this.loadOnceFlag = false;
                setTimeout(() => {
                    this.loadOnceFlag = true;
                }, 1);
            },
            clearSearch () {
                this.form.businessKey = '';
                this.form.businessInfo = '';
                this.form.priority = '';
                this.form.startUser = '';
                this.form.createTime = '';
            },
            advancedSearch: function () {
                if (!this.form.advancedFlag) {
                    this.form.advancedFlag = true;
                } else {
                    this.form.advancedFlag = false;
                }
            },
            handleCommand(command){
                if(command=='get'){
                    this.toSign();
                }else if(command=='export'){
                    this.$refs.tableProductLine.exportTableList();
                }else if(command=='selfCol'){
                    this.$refs.tableProductLine.customColumn();
                }else if(command=='moreQuery'){
                    this.advancedSearch();
                }
            },
            toSign: function () {
                if (this.selectionData.length == 0) {
                    this.$message({
                        message: '未选择要签收的数据',
                        type: 'warning'
                    });
                    return null;
                }
                if (this.selectionData.status != '待签收') {
                    this.$message({
                        message: '待办已签收,无需再次签收',
                        type: 'warning'
                    });
                    return null;
                }
                var _this = this;
                this.$myHttp({
                    method: 'POST',
                    url: this.prefix + '/microarch/activiti/claim?taskId=' + this.selectionData.id + '&userName=' + sessionStorage.getItem('userName'), // Cookies.get('user');,
                    data: {}
                }).then(resp => {
                    console.log(resp);
                    this.$message({
                        message: '签收成功',
                        type: 'success'
                    });
                    this.$refs.tableProductLine.findAllProject(1);
                });
            },
            toDo: function (val) {
                // if (this.selectionData.length == 0) {
                //     this.$message({
                //         message: '未选择要办理的数据',
                //         type: 'warning'
                //     });
                //     return null;
                // }
                this.selectionData=val;
                if (this.selectionData.businessUrl) {
                    this.myTableData.editName = this.selectionData.businessUrl.split(',')[0];
                    this.myTableData.viewName = this.selectionData.businessUrl.split(',')[1];
                }

                this.$myHttp({
                    method: 'GET',
                    url: this.prefix + '/microarch/activiti/task/waitfor/' + this.selectionData.id,
                    data: {}
                }).then(res => {
                    this.isFirstNode = res.data.activityId == 'apply';
                    if (this.isFirstNode) {
                        this.$router.push({
                            'name': this.myTableData.editName,
                            'params': {
                                'row': this.selectionData
                            }
                        });
                    } else {
                        this.$router.push({
                            'name': this.myTableData.viewName,
                            'params': {
                                'row': this.selectionData
                            }
                        });
                    }
                });
            },
            customerEdit (row) {
                this.$myHttp({
                    method: 'GET',
                    url: this.prefix + '/microarch/activiti/task/waitfor/' + row.id,
                    data: {}
                }).then(res => {
                    this.isFirstNode = res.data.activityId == 'apply';
                    if(row.configFormKey == "" ){
                        if (this.isFirstNode) {
                            this.$router.push({
                                'name': row.businessUrl.split(',')[0],
                                'params': {
                                    'row': row
                                }
                            });
                        } else {
                            this.$router.push({
                                'name': row.businessUrl.split(',')[1],
                                'params': {
                                    'row': row
                                }
                            });
                        }
                    }else{
                        this.$router.push({
                            'name': row.configFormKey,
                            'params': {
                                'row': row
                            }
                        });
                    }

                });
            },
            toHistory: function () {
                // if (!this.selectionData) {
                //     this.$message({
                //         message: '未选择要查看的数据',
                //         type: 'warning'
                //     });
                //     return null;
                // }
                this.dialogVisible = true;
                this.processInstanceId = this.selectionData.pid;

                // this.$router.push({
                //     name: 'trackList',
                //     'params': {
                //         routeParams: +this.selectionData.id,
                //         routeParamsPid: +this.selectionData.pid,
                //
                //
                //     }
                // })
            }
        },
        mounted: function () {
            var that = this;
            var toDoListConditions = sessionStorage.getItem('toDoListConditions');
            this.form = toDoListConditions == null ? this.form : JSON.parse(toDoListConditions);
            this.search();// 一进来就执行查询功能
            // console.log('JSON.parse(toDoListConditions)----',JSON.parse(toDoListConditions))
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