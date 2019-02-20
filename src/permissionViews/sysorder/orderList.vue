<template>
    <div>
        <el-row>
            <el-col :span="24" style="background-color: white;padding:10px 20px;">
                <h2>
                    <div style="float: left;padding-top: 4px;padding-right: 5px;">
                        <img  :src="getNoticeUrl()"  width="16" height="16" />
                    </div>
                    <div>
                        <span style="float:left;height:32px;line-height: 32px;font-weight: normal;font-size: 14px;">流程测试工单</span>
                    </div>
                    <div class="tableBtn" style="float:right;padding:0;">
                        <el-button @click="addNewOrder" icon="el-icon-circle-plus-outline" size="small" type="primary">添加工单
                        </el-button>
                        <el-button :span="6" :xs="20" type="primary" icon="el-icon-circle-plus-outline"  @click.enter="handleEdit" size="small" style="margin-top: 4px;">编辑</el-button>
                        <el-button :span="6" :xs="20" type="primary" icon="el-icon-search"  @click.enter="toHistory()" size="small" style="margin-top: 4px;">流程跟踪</el-button>
                        <el-button :span="6" :xs="20" type="danger" icon="el-icon-remove"  @click.enter="deleteRow()" size="small" style="margin-top: 4px;">删除</el-button>
                    </div>
                </h2>
                <el-form :model="form" label-width="80px" style="overflow: hidden;margin-bottom: 10px;">
                    <el-col  :span="6" :xs="20" class="inputPadding">
                        <el-form-item label="流水号">
                            <el-input v-model="form.orderCode" size="small" clearable></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col  :span="6" :xs="20" class="inputPadding" >
                        <el-form-item label="费用类型">
                            <el-select v-model="form.feeType" size="small" clearable>
                                <el-option
                                        v-for="item in feeOptions"
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
                <my-table ref="orderList" :myTableData="myTableData"  @getSelectionData="getSelectionData" @customerEdit="customerEdit"></my-table>
            </el-col>
        </el-row>
        <el-dialog title="流程跟踪" :visible.sync="dialogVisible" :modal-append-to-body="false" append-to-body  width="1000px">
            <task-list :taskListDate="taskListDate" :processInstanceId="processInstanceId"></task-list>
        </el-dialog>
    </div>
</template>

<script>
    import myTable from '@/components/myTableSys';
    import taskList from '../workFlow/trackList';

    export default {
        data () {
            return {
                taskListDate: {
                    imgSrc: '',
                    trackListUrl: ''
                },
                myTableData: {
                    url: '/microarch/sys/sysorder/list',
                    dlUrl: '/microarch/sys/sysorder/del',
                    viewName: 'viewOrder',
                    editName: 'viewOrder',
                    hiddenAction: true,
                    exportName: '流程测试工单信息.xlsx',
                    tableThead: [
                        {
                            headName: '选择',
                            headKey: '',
                            selectionCheckbox: true,
                            isHidden: true,
                            fixedColumn: true
                        },
                        {
                            headName: '序号',
                            headKey: 'pageIndex',
                            width: 22,
                            align: 'center'
                        },
                        {
                            headName: '单据编号',
                            headKey: 'orderCode',
                            underline: true,
                            hasCustomerEdit: true
                        },
                        {
                            headName: '单据类型',
                            headKey: 'orderType'
                        },
                        {
                            headName: '费用类型',
                            headKey: 'feeType'
                        },
                        {
                            headName: '费用金额(元)',
                            headKey: 'feeAmount'
                        },
                        {
                            headName: '单据状态',
                            headKey: 'status'
                        },
                        {
                            headName: '备注',
                            headKey: 'remark'
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
                    orderName: '',
                    orderType: '',
                    status: ''
                },
                managerIdData: [],
                statusData: [],
                typeData: [],
                feeOptions: [
                    {
                        value: '交通费',
                        label: '交通费'
                    }, {
                        value: '住宿费',
                        label: '住宿费'
                    }, {
                        value: '其他',
                        label: '其他'
                    }
                ],
                condition: [], // 查询条件
                selectionData: [],
                dialogVisible: false,
                processInstanceId: ''
            };
        },
        methods: {
            getNoticeUrl() {
                return require('@/images/task.png');
            },
            getSelectionData (val) {
                this.selectionData = val;
            },
            search () {
                var _this = this;
                var data = {};

                var myentity = [];
                if (this.form.orderCode) {
                    myentity.push({'field': 'orderCode', 'opt': 'like', 'value': _this.form.orderCode, 'assemble': 'and'});
                }
                if (this.form.feeType) {
                    myentity.push({'field': 'feeType', 'opt': 'like', 'value': _this.form.feeType, 'assemble': 'and'});
                }

                this.myTableData.where = myentity;
                console.log('查询条件是', this.myTableData.where);

                // this.myTableData.entity = data;
                this.$refs.orderList.findAllProject(1);
            },
            addNewOrder () {
                this.$router.push({
                    name: 'editOrder'
                });
            },
            // 查看
            handleView () {
                if (this.selectionData.length > 1) {
                    this.$message({
                        message: '请选择一条数据',
                        type: 'warning'
                    });
                    return null;
                }
                if (this.selectionData.length == 0) {
                    this.$message({
                        message: '未选择要查看的数据',
                        type: 'warning'
                    });
                    return null;
                }
                this.$router.push({
                    'name': 'viewOrder',
                    'params': {
                        'id': this.selectionData[0].id,
                        'row': this.selectionData[0]
                    }
                });
            },
            // 修改
            handleEdit (row) {
                if (this.selectionData.length > 1) {
                    this.$message({
                        message: '请选择一条数据',
                        type: 'warning'
                    });
                    return null;
                }
                if (this.selectionData.length == 0) {
                    this.$message({
                        message: '未选择要编辑的数据',
                        type: 'warning'
                    });
                    return null;
                }
                if (this.selectionData[0].status != '草稿') {
                    this.$message({
                        message: '选择的数据已在流程中不能编辑',
                        type: 'warning'
                    });
                    return null;
                }
                this.$router.push({
                    'name': 'editOrder',
                    'params': {
                        'id': this.selectionData[0].id,
                        'row': this.selectionData[0]
                    }
                });
            },

            customerEdit (row) {
                if (row.status == '草稿') {
                    this.$router.push({
                        'name': 'editOrder',
                        'params': {
                            'id': row.id,
                            'row': row
                        }
                    });
                } else {
                    this.$router.push({
                        'name': 'viewOrder',
                        'params': {
                            'id': row.id,
                            'row': row
                        }
                    });
                }
            },
            // 删除
            deleteRow () {
                if (this.selectionData.length > 1) {
                    this.$message({
                        message: '请选择一条数据',
                        type: 'warning'
                    });
                    return null;
                }
                if (this.selectionData.length == 0) {
                    this.$message({
                        message: '未选择要删除的数据',
                        type: 'warning'
                    });
                    return null;
                }

                if (this.selectionData[0].status != '草稿') {
                    this.$message({
                        message: '选择的数据已在流程中不能删除',
                        type: 'warning'
                    });
                    return null;
                }
                var _this = this;
                this.$confirm('此操作将永久删除项目信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _this.$myHttp({
                        method: 'POST',
                        url: this.prefix + '/microarch/sys/sysorder/del' + window.suffix,
                        data: {
                            'entity': {
                                'id': this.selectionData[0].id
                            },
                            'ext': [
                                this.selectionData[0].id
                            ],
                            'pageNum': 0,
                            'pageSize': 1000
                        }
                    }).then(res => {
                        if (res.data.subCode == 0) {
                            if (_this.total % _this.mysize == 1) { _this.mypage = _this.mypage == 1 ? 1 : _this.mypage - 1; }
                            // 成功回调方法
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.$refs.orderList.findAllProject(1);
                        } else {
                            _this.$notify({
                                title: '无法删除',
                                message: res.data.subMsg,
                                type: 'warning'
                            });
                        }
                    });
                }).catch(() => {
                });
            },
            toHistory: function () {
                var that = this;
                if (this.selectionData.length > 1) {
                    this.$message({
                        message: '请选择一条数据',
                        type: 'warning'
                    });
                    return null;
                }
                if (this.selectionData.length == 0) {
                    this.$message({
                        message: '未选择要查看的数据',
                        type: 'warning'
                    });
                    return null;
                }
                if (!this.selectionData[0].processInstanceId) {
                    this.$message({
                        message: '此工单未在流程中，不能查看流程历史',
                        type: 'warning'
                    });
                    return null;
                }
                // this.taskListDate.imgSrc=this.prefix+'/microarch/activiti/trace/photo?processInstanceId='+ this.selectionData[0].processInstanceId;
                this.$myHttp({
                    method: 'get',
                    url: this.prefix + '/microarch/activiti/trace/photo?processInstanceId=' + this.selectionData[0].processInstanceId,
                    responseType: 'arraybuffer'
                }).then(res => {
                    // console.log('imgsrc---',res)
                    return 'data:image/png;base64,' + btoa(
                        new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
                    );
                }).then(data => {
                    that.taskListDate.imgSrc = data;
                });
                this.taskListDate.trackListUrl = '/microarch/activiti/task/trace/list/' + this.selectionData[0].processInstanceId;
                this.processInstanceId = this.selectionData[0].processInstanceId;
                this.dialogVisible = true;
            }
        },
        mounted: function () {
            this.$refs.orderList.findAllProject(1);
        },
        components: {
            myTable,
            taskList
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

