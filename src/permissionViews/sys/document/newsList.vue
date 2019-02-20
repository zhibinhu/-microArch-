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
                        <el-button class="el-icon-back" size="small" type="primary"  @click="backList">返回</el-button>
                    </div>
                </h2>
                <el-form :model="form" label-width="80px" style="overflow: hidden;margin-bottom: 10px;">
                    <el-col :span="6" class="inputPadding" >
                        <el-form-item label="标题">
                            <el-input v-model="form.documentTitle" size="small" clearable></el-input>
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

    export default {
        components: {
            myTable
        },
        data () {
            return {
                myTableData: {
                    url: '/microarch/sys/SysDocument/list',
                    dlUrl: '/microarch/sys/SysDocument/delete',
                    editName: 'newsView',
                    hiddenAction: true,
                    tableThead: [
                        {
                            headName: '序号',
                            headKey: 'pageIndex',
                            width: 30
                        },
                        {
                            headName: '标题',
                            headKey: 'documentTitle',
                            underline: true
                        },
                        {
                            headName: '类型',
                            width: 50,
                            headKey: 'documentType',
                            dirKey: true
                        },
                        {
                            headName: '是否有效',
                            width: 30,
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
                    where: [],
                    conditions: [],
                    pageRequest: {},
                    sortBy: {},
                    myorderBy: 'createTime desc'
                },
                form: {
                    documentTitle: ''

                },
                type: ''
            };
        },
        created () {
            this.documentType = this.$route.params.type;
            if (this.documentType != '01' && this.documentType != '04') {
                this.myTableData.editName = 'viewDocument';
            }
            this.myTableData.where = [{'field': 'documentType', 'opt': '=', 'value': this.documentType, 'assemble': 'and'}];
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
                this.myTableData.where = myentity;
                this.$refs.documentList.findAllProject(1);
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
            backList () {
                var _this = this;

                _this.$router.push({
                    name: 'home_index'
                });
            }
        },
        mounted: function () {
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

