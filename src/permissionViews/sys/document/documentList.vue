<template>
    <div>
        <el-row>
            <el-col :span="24" style="background-color: white;padding:10px 20px;">

                <h2>
                    <div style="float: left;padding-top: 4px;padding-right: 5px;">
                        <img  :src="getNoticeUrl()"  width="16" height="16" />
                    </div>
                    <div>
                        <span style="float:left;height:32px;line-height: 32px;font-weight: normal;font-size: 14px;">信息管理</span>
                    </div>

                    <div class="tableBtn" style="float:right;padding:0;">
                        <el-button @click="addNewOrder" icon="el-icon-circle-plus-outline" size="small" type="primary">新增
                        </el-button>
                    </div>
                </h2>
                <el-form :model="form" label-width="80px" style="overflow: hidden;margin-bottom: 10px;">
                    <el-col :span="6" class="inputPadding" >
                        <el-form-item label="标题">
                            <el-input v-model="form.documentTitle" size="small" clearable></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6" class="inputPadding">
                        <el-form-item label="类型">
                            <el-select v-model="form.documentType" size="small" clearable>
                                <el-option
                                        v-for="item in documentTypeData"
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
                <my-table ref="documentList" :myTableData="myTableData"  @getSelectionData="getSelectionData"></my-table>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import myTable from '@/components/myTableSys';
    import util from '../../../libs/util';

    export default {
        components: {
            myTable
        },
        data () {
            return {
                myTableData: {
                    right:true,
                    url: '/microarch/sys/SysDocument/list',
                    dlUrl: '/microarch/sys/SysDocument/delete',
                    viewName: 'viewDocument',
                    editName: 'editDocument',
                    exportName: '信息管理.xlsx',
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
                            width: 22
                        },
                        {
                            headName: '标题',
                            headKey: 'documentTitle',
                            underline: true
                        },
                        {
                            headName: '类型',
                            headKey: 'documentType',
                            dirKey: true
                        },
                        {
                            headName: '是否有效',
                            headKey: 'documentEnable',
                            dirKey: true
                        },
                        {
                            headName: '备注',
                            headKey: 'documentDesc'
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
                    documentTitle: '',
                    documentType: ''
                },
                managerIdData: [],
                statusData: [],
                typeData: [],
                dirArry: ['documentType'],
                documentTypeData: [],
                condition: [], // 查询条件
                selectionData: []
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
                if (this.form.documentTitle) {
                    myentity.push({'field': 'documentTitle', 'opt': 'like', 'value': _this.form.documentTitle, 'assemble': 'and'});
                }
                if (this.form.documentType) {
                    myentity.push({'field': 'documentType', 'opt': 'like', 'value': _this.form.documentType, 'assemble': 'and'});
                }

                this.myTableData.where = myentity;
                this.$refs.documentList.findAllProject(1);
            },
            addNewOrder () {
                this.$router.push({
                    name: 'editDocument'
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
                    'name': 'viewDocument',
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
                this.$router.push({
                    'name': 'editOrder',
                    'params': {
                        'id': this.selectionData[0].id,
                        'row': this.selectionData[0]
                    }
                });
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
                        url: this.prefix + '/microarch/sys/SysDocument/del' + window.suffix,
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
                            this.$refs.documentList.findAllProject(1);
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
            }
        },
        mounted: function () {
            util.getSelectData(this, this.dirArry);
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

