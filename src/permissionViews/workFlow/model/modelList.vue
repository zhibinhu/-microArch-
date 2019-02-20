<template>

    <div>
        <el-row>

            <el-col :span="24" style="background-color: white;padding:10px 20px;">
                <h2>
                    <div style="float: left;padding-top: 4px;padding-right: 5px;">
                        <img  :src="getNoticeUrl()"  width="16" height="16" />
                    </div>
                    <div>
                        <span style="float:left;height:32px;line-height: 32px;font-weight: normal;font-size: 14px;">模型管理</span>
                    </div>
                    <div style="float:right;padding:0;">
                        <el-button @click="modelAdd()" icon="el-icon-circle-plus-outline" size="small" type="primary">新增</el-button>
                        <el-button @click="deploy()" icon="el-icon-upload" size="small" type="primary">部署</el-button>
                        <el-button @click="modelConfig()" icon="el-icon-setting" size="small" type="primary">配置</el-button>
                        <el-button @click="modelExp()" icon="el-icon-download" size="small" type="primary">导出</el-button>
                    </div>
                </h2>
                <el-form ref="form" :model="form" label-width="80px" style="overflow: hidden;margin-bottom: 10px;">
                    <el-col :span="6" :xs="20" class="inputPadding">
                        <el-form-item label="模型KEY">
                            <el-input v-model="form.key" size="small" clearable></el-input>
                        </el-form-item>

                    </el-col>

                    <el-col :span="6" :xs="20" class="inputPadding">
                        <el-form-item label="模型名称">
                            <el-input v-model="form.name" size="small" clearable></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6" :xs="20" class="inputPadding">
                        <el-button :span="6" :xs="20" type="primary" icon="el-icon-search" round @click.enter="search()" size="small" style="margin-top: 4px;">查询</el-button>
                    </el-col>
                </el-form>

                <my-table @getSelectedData="getSelectedData" ref="actReModelTable" :myTableData="myTableData"></my-table>
            </el-col>

        </el-row>
    </div>

</template>

<script>
    import myTable from '../../../components/myTableSys';
    export default {
        data () {
            return {
                myTableData: {
                    right:true,
                    actionWidth:90,
                    url: '/microarch/activiti/model/list',
                    dlUrl: '/microarch/activiti/model/delete',
                    viewName: '',
                    editName: 'workFlow/model/modelEdit',
                    isHiddenView: true,
                    exportName: '模型信息.xlsx',
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
                            headName: '模型KEY',
                            headKey: 'key'

                        },
                        {
                            headName: '模型名称',
                            headKey: 'name'
                        },

                        {
                            headName: '版本号',
                            headKey: 'version',
                            width: 35
                        },
                        {
                            headName: '发布时间',
                            headKey: 'deploymentTime',
                            unSort: true
                        },
                        {
                            headName: '创建时间',
                            headKey: 'createTime'
                        },
                        {
                            headName: '更新时间',
                            headKey: 'lastUpdateTime'
                        }

                    ],
                    entity: {},
                    where: [],
                    conditions: [],
                    pageRequest: {},
                    myorderBy: 'lastUpdateTime DESC',
                    selectedMenuId: '',
                    selectedMenu: '',
                    radio: ''
                },
                form: {
                    key: '',
                    name: ''
                },
                total: 1,
                pageNumber: 1,
                pageSize: 10,
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
            getSelectedData (val) {
                this.myTableData.radio = val.id;
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
                this.myTableData.where = myentity;
                this.$refs.actReModelTable.findAllProject(1);
            },
            deploy () {
                if (this.checkValue()) {
                    this.$confirm('是否确定部署?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$myHttp({
                            method: 'GET',
                            url: this.prefix + '/microarch/activiti/model/deploy/' + this.myTableData.radio,
                            data: {'procDefId': this.myTableData.radio}
                        }).then(res => {
                            // 成功回调方法
                            var that = this;
                            var tipType = 'success';
                            if (res.data.success) {
                                tipType = 'success';
                            } else {
                                tipType = 'warning';
                            }
                            this.$message({
                                showClose: true,
                                message: '' + res.data.msg,
                                type: tipType
                            });
                            this.$refs.actReModelTable.findAllProject(1);
                        });
                    }).catch(() => {
                    });
                }
            },
            modelAdd () {
                this.$router.push({
                    name: 'workFlow/model/modelEdit'
                });
            },
            modelConfig () {
                if (this.checkValue()) {
                    var url = this.prefix + '/microarch/modeler.html?modelId=/' + this.myTableData.radio;
                    window.open(url, '_blank', 'toolbar=yes, width=1300, height=900');
                }
            },
            modelExp () {
                if (this.checkValue()) {
                    let url = this.prefix + '/microarch/activiti/model/export/' + this.myTableData.radio;
                    window.open(url, '_blank', 'toolbar=no, width=880, height=900');
                    this.$message({
                        showClose: true,
                        message: '导出成功！',
                        type: 'success'
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
