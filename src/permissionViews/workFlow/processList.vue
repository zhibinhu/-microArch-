<template>
    <div>
        <el-row>

            <el-col :span="24" style="background-color: white;padding:10px 20px;">
                <h2>
                    <div style="float: left;padding-top: 4px;padding-right: 5px;">
                        <img  :src="getNoticeUrl()"  width="16" height="16" />
                    </div>
                    <div>
                        <span style="float:left;height:32px;line-height: 32px;font-weight: normal;font-size: 14px;">流程管理</span>
                    </div>
                    <div style="float:right;padding:0;">
                        <div style=" float: left;">
                            <el-upload
                                    :action="UploadUrl()"
                                    :headers="tokenHeader"
                                    :on-preview="handlePreview"
                                    :on-remove="handleRemove"
                                    :before-remove="beforeRemove"
                                    :on-success="afterSuccess"
                                    :show-file-list="showList"
                                    multiple
                                    :limit="2"
                                    :on-exceed="handleExceed">
                                <el-button icon="el-icon-circle-plus-outline" size="small" type="primary"
                                           style="margin-right: 15px;">流程导入
                                </el-button>
                            </el-upload>
                        </div>
                        <el-button @click="convert()" icon="el-icon-circle-plus-outline" size="small" type="primary">
                            转换为模型
                        </el-button>
                        <el-button @click="activation()" icon="el-icon-circle-plus-outline" size="small" type="primary">
                            激活
                        </el-button>
                        <!--<el-button @click="hangUp()" icon="el-icon-circle-plus-outline" size="small" type="primary">挂起-->
                        <!--</el-button>-->
                    </div>
                </h2>
                <el-form ref="form" :model="form" label-width="80px" style="overflow: hidden;margin-bottom: 10px;">
                    <el-col :span="5" :xs="20" class="inputPadding">
                        <el-form-item label="模型名称">
                            <el-input v-model="form.modelName" size="small" clearable></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="5" :xs="20" class="inputPadding">
                        <el-form-item label="流程KEY">
                            <el-input v-model="form.key" size="small" clearable></el-input>
                        </el-form-item>

                    </el-col>

                    <el-col :span="5" :xs="20" class="inputPadding">
                        <el-form-item label="流程名称">
                            <el-input v-model="form.name" size="small" clearable></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="5" :xs="20" class="inputPadding">
                        <el-form-item label="版本号">
                            <el-input-number size="small" v-model="form.version" label="版本号"></el-input-number>
                        </el-form-item>
                    </el-col>

                    <el-col :span="3" :xs="20" class="inputPadding">
                        <el-button :span="6" :xs="20" type="primary" icon="el-icon-search" round @click.enter="search()"
                                   size="small" style="margin-top: 4px;">查询
                        </el-button>
                    </el-col>
                </el-form>

                <my-table ref="actReProcdefTable" :myTableData="myTableData" @getSelectedData="getSelectedData" ></my-table>

            </el-col>

        </el-row>
    </div>

</template>

<script>
    import myTable from '../../components/myTableSys';

    export default {
        data () {
            return {
                tokenHeader: {
                    'Authorization': 'Sys ' + sessionStorage.getItem('token')
                },
                myTableData: {
                    url: '/microarch/activiti/process/list',
                    dlUrl: '/microarch/activiti/process/delete',
                    viewName: '',
                    editName: '',
                    hiddenAction: true,
                    exportName: '流程信息.xlsx',
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
                            align: 'center'
                        },
                        {
                            headName: '流程KEY',
                            headKey: 'key'
                        },
                        {
                            headName: '流程名称',
                            headKey: 'name'
                        },
                        {
                            headName: '模型名称',
                            headKey: 'modelName'
                        },
                        {
                            headName: '版本号',
                            headKey: 'version',
                            width: 35
                        },
                        {
                            headName: '描述',
                            headKey: 'description'
                        },
                        {
                            headName: '部署时间',
                            headKey: 'deploymentTime'
                        },
                        {
                            headName: '状态',
                            headKey: 'isSuspended',
                            width: 35,
                            processStatus: true
                        }
                    ],
                    entity: {},
                    where: [],
                    conditions: [],
                    pageRequest: {},
                    myorderBy: 'id DESC',
                    selectedMenuId: '',
                    selectedMenu: '',
                    multipleSelection: [],
                    radio: ''
                },
                form: {
                    modelName:'',
                    key: '',
                    name: '',
                    version: ''
                },
                total: 1,
                pageNumber: 1,
                pageSize: 10,
                showList: false,
                condition: []// 查询条件
            };
        },
        components: {
            myTable
        },
        methods: {
            getNoticeUrl() {
                return require('@/images/task.png');
            },
            search () {
                var _this = this;
                var myentity = [];
                if (this.form.modelName) {
                    myentity.push({'field': 'modelName', 'opt': 'like', 'value': _this.form.modelName, 'assemble': 'and'});
                }
                if (this.form.key) {
                    myentity.push({'field': 'key', 'opt': 'like', 'value': _this.form.key, 'assemble': 'and'});
                }
                if (this.form.name) {
                    myentity.push({'field': 'name', 'opt': 'like', 'value': _this.form.name, 'assemble': 'and'});
                }
                if (this.form.version) {
                    myentity.push({'field': 'version', 'opt': '=', 'value': _this.form.version, 'assemble': 'and'});
                }
                this.myTableData.where = myentity;
                this.$refs.actReProcdefTable.findAllProject(1);
            },
            getSelectedData (val) {
                this.myTableData.radio = val.id;
            },
            handleRemove (file, fileList) {
                console.log(file, fileList);
            },
            handlePreview (file) {
                console.log(file);
            },
            handleExceed (files, fileList) {
                this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove (file, fileList) {
                return this.$confirm(`确定移除 ${file.name}？`);
            },
            UploadUrl () {
                return this.prefix + '/microarch/activiti/process/uploadProc';
            },
            convert () {
                if (this.checkValue()) {
                    this.$confirm('是否确定转换为模型?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$myHttp({
                            method: 'GET',
                            url: this.prefix + '/microarch/activiti/process/convert/' + this.myTableData.radio,
                            data: {'procDefId': this.myTableData.radio}
                        }).then(res => {
                            // 成功回调方法
                            this.$message({
                                showClose: true,
                                message: '' + res.data.msg,
                                type: 'success'
                            });
                        });
                    }).catch(() => {
                    });
                }
            },
            activation () {
                this.$myHttp({
                    method: 'GET',
                    url: this.prefix + '/microarch/activiti/process/update/active?procDefId=' + this.myTableData.radio,
                    data: {'procDefId': this.myTableData.radio}

                }).then(res => {
                    // 成功回调方法
                    this.$router.push({
                        name: 'workFlow/processList'
                    });

                    this.$refs.actReProcdefTable.findAllProject(1);

                    this.$message({
                        showClose: true,
                        message: '' + res.data.msg,
                        type: 'success'
                    });
                });
            },
            hangUp () {
                this.$myHttp({
                    method: 'GET',
                    url: this.prefix + '/microarch/activiti/process/update/suspend?procDefId=' + this.myTableData.radio,
                    data: {'procDefId': this.myTableData.radio}

                }).then(res => {
                    // 成功回调方法
                    this.$router.push({
                        name: 'workFlow/processList'
                    });

                    this.$refs.actReProcdefTable.findAllProject(1);

                    this.$message({
                        showClose: true,
                        message: '' + res.data.msg,
                        type: 'success'
                    });
                });
            },
            afterSuccess (response, file, fileList) {
                if (response.code == '2000') {
                    this.$message({
                        showClose: true,
                        message: response.message,
                        type: 'success'
                    });
                    this.$refs.actReProcdefTable.findAllProject(1);
                } else {
                    this.$message({
                        showClose: true,
                        message: response.message,
                        type: 'warning'
                    });
                    this.$refs.actReProcdefTable.findAllProject(1);
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
        mounted: function () {
        },
        filters: {}
    };
</script>
<style scoped>
    h2 {
        overflow: hidden;
        padding: 0;
        padding-bottom: 10px;
        border-bottom: 1px solid #ddd;
        margin-bottom: 10px;
    }

    .el-form-item {
        margin-bottom: 0;
    }

    .inputPadding {
        padding: 0 15px;
    }
</style>
