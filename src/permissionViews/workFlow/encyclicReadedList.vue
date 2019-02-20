<template>
    <div>
        <el-row>
            <el-col :span="24" style="background-color: white;padding:10px 20px;">

                <h2 class="h2">
                    <div style="float: left;padding-top: 4px;padding-right: 5px;">
                        <img  :src="getNoticeUrl()"  width="16" height="16" />
                    </div>
                    <div>
                        <span style="float:left;height:32px;line-height: 32px;font-weight: normal;font-size: 14px;">我的已阅</span>
                    </div>
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
                            <el-input v-model="form.processInstanceName" size="small" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :xs="20"  class="inputPadding">
                        <el-form-item label="单据类型">
                            <el-select v-model="form.orderType" placeholder="" size="small" style="width: 95%" clearable>
                                <el-option
                                        v-for="item in woTypeData"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :xs="20" class="inputPadding">
                        <el-button :span="6" :xs="20" type="primary" icon="el-icon-search" round @click.enter="search()" size="small" style="margin-top: 4px;">查询</el-button>
                        <el-button type="primary" icon="el-icon-refresh" size="small" round @click="resetDialog" style="margin-left: 8px">重置</el-button>
                    </el-col>
                </el-form>
                <my-table ref="tableProductLine" :myTableData="myTableData" @getSelectedData="getSelectionData" @customerEdit="customerEdit"></my-table>
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
    import util from '@/libs/util';
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
                myTableData: {
                    hiddenAction: true,
                    url: '/microarch/activiti/task/encyclicReadedList/' + sessionStorage.getItem('userName'), // Cookies.get('user');,
                    dlUrl: '',
                    viewName: 'viewOrder',
                    exportName: '我的已阅信息.xlsx',
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
                            width: 22
                        },
                        {
                            headName: '单据编号',
                            headKey: 'businessKey',
                            width: 80
                        },
                        {
                            headName: '主题',
                            headKey: 'processInstanceName',
                            viewUnderline: true,
                            hasCustomerEdit: true,
                            showToolTipFlag:true
                        },
                        {
                            headName: '单据类型',
                            headKey: 'orderTypeText'
                        },
                        {
                            headName: '传阅人',
                            headKey: 'cpeopleName',
                            width: 60
                        },

                        {
                            headName: '创建时间',
                            headKey: 'cdate',
                            width: 80
                        },
                        {
                            headName: '受阅时间',
                            headKey: 'sdate',
                            width: 80
                        }

                    ],
                    entity: {},
                    where: [{'field': 'speople', 'opt': 'like', 'value': sessionStorage.getItem('userName'), 'assemble': 'and'},
                        {'field': 'sdate', 'opt': 'notnull', 'assemble': 'and'}
                    ],
                    conditions: [],
                    pageRequest: {},
                    myorderBy: 'cdate DESC'
                },
                form: {
                    processInstanceName: '',
                    businessKey: '',
                    orderType: ''
                },
                woTypeData: [],
                dirArry: ['woType'],
                total: 1,
                pageNumber: 1,
                pageSize: 10,
                condition: [], // 查询条件
                selectionData: '',
                dialogVisible: false,
                hisPath: '',
                processInstanceId: '',
                isFirstNode: false,
                myorderBy: 'cdate DESC'
            };
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
            getSelectionData (val) {
                var that = this;
                this.selectionData = val;
                if (val) {
                    this.processInstanceId = this.selectionData.processInstanceId;
                    this.$myHttp({
                        method: 'get',
                        url: this.prefix + '/microarch/activiti/trace/photo?processInstanceId=' + this.selectionData.processInstanceId,
                        responseType: 'arraybuffer'
                    }).then(res => {
                        // console.log('imgsrc---',res)
                        return 'data:image/png;base64,' + btoa(
                            new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
                        );
                    }).then(data => {
                        that.taskListDate.imgSrc = data;
                    });
                    this.taskListDate.trackListUrl = '/microarch/activiti/task/trace/list/' + this.selectionData.processInstanceId;
                }
            },
            search () {
                var _this = this;
                var myentity = [];

                myentity.push({'field': 'speople', 'opt': 'like', 'value': sessionStorage.getItem('userName'), 'assemble': 'and'});
                myentity.push({'field': 'sdate', 'opt': 'notnull', 'assemble': 'and'});
                if (_this.form.processInstanceName) {
                    myentity.push({'field': 'processInstanceName', 'opt': 'like', 'value': _this.form.processInstanceName, 'assemble': 'and'});
                }
                if (_this.form.businessKey) {
                    myentity.push({'field': 'businessKey', 'opt': 'like', 'value': _this.form.businessKey, 'assemble': 'and'});
                }
                if (_this.form.orderType) {
                    myentity.push({'field': 'orderType', 'opt': 'like', 'value': _this.form.orderType, 'assemble': 'and'});
                }
                _this.myTableData.where = myentity;
                console.log('查询条件是', _this.myTableData.where);
                this.$refs.tableProductLine.findAllProject(1);
                /* this.conditions=myconditions;
                this.mypage=0;
                this.mysize=10;
                */
                /* this.findAllProject(this.conditions,this.mypage,this.mysize,this.direction,this.field); */
            },
            toHistory: function () {
                if (!this.selectionData) {
                    this.$message({
                        message: '未选择要查看的数据',
                        type: 'warning'
                    });
                    return null;
                }
                this.dialogVisible = true;
                this.taskListDate.showHisStatus = this.selectionData.showHisApprovalStatus;
                this.processInstanceId = this.selectionData.processInstanceId;
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
            },
            resetDialog () {
                var _this = this;
                setTimeout(function () {
                    _this.form.processInstanceName = '';
                    _this.form.businessKey = '';
                    _this.form.orderType = '';

                }, 100);
            }
        },

        mounted: function () {
            // 获取当前页面所需数据字典数据
            util.getSelectData(this, this.dirArry);
            var that = this;
            document.onkeydown = function (event) {
                // console.log('keyCode---',event.keyCode)
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