<template>
    <div>
        <el-row>
                <div class="bgColor">
                    <el-row>
                        <h2>
                            <div style="float: left;padding-top: 4px;padding-right: 5px;"><img  :src="getNoticeUrl()"  width="16" height="16" /></div><div><span style="float:left;height:32px;line-height: 32px;font-weight: normal;font-size: 14px;">字典项管理</span></div>

                            <div class="tableBtn" style="float:right;padding:0;">
                                <el-button type="primary" v-hasPermission="'addDict'"  icon="el-icon-circle-plus-outline" size="small" @click="addNewDict">新增</el-button>
                            </div>
                        </h2>
                        <el-form ref="form" label-width="80px">
                            <el-col :span="8" class="inputPadding">
                                <el-form-item label="字典编码">
                                    <el-input v-model="form.dtype" clearable placeholder="请输入字典编码" clearable size="small"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8" class="inputPadding">
                                <el-form-item label="字典名称">
                                    <el-input v-model="form.dname" clearable placeholder="请输入字典名称" clearable size="small"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8" class="inputPadding">
                                <el-button type="primary" icon="el-icon-search" size="small" round @click="startQuery" style="margin-top:4px;">查询</el-button>
                                <el-button type="primary" icon="el-icon-refresh" size="small" round @click="resetQuery" style="margin-top:4px;">重置</el-button>
                            </el-col>
                        </el-form>
                    </el-row>
                </div>
                <div class="commonTable" style="padding: 0px 20px 10px 20px;background: rgb(255, 255, 255);">
                    <my-table ref="dictTable" :myTableData="mytableData" @getSelectionData="getSelectionData"></my-table>
                </div>
        </el-row>
    </div>
</template>


<script>
    import myTable from '../../../components/myTableSys';
    export default {
        data () {
            return {
                mytableData: {
                    right:true,
                    url: '/microarch/sys/sysDictHead/find',
                    dlUrl: '/microarch/sys/sysDictHead/del',
                    viewName: 'sys/detailDictManagement',
                    editName: 'sys/dictManagement',
                    dictManagementName: 'sys/detailDictManagement',
                    exportName: '字典信息.xlsx',
                    tableThead: [
                        {
                            headKey: '',
                            isHidden: true
                        },
                        {
                            headName: '序号',
                            headKey: 'pageIndex',
                            width: 22
                        },
                        {
                            headName: '字典编码',
                            headKey: 'dtype',
                            underline: true
                        },
                        {
                            headName: '字典名称',
                            headKey: 'dname'
                        },
                        {
                            headName: '字典描述',
                            headKey: 'memo'
                        }
                    ],
                    entity: {},
                    where: [],
                    pageRequest: {},
                    myorderBy: 'lastmodifiedTime DESC',
                    isHiddenView: true,
                    isShowManageDict: true
                },
                form: {
                    dtype: '',
                    dname: ''
                }
            };
        },
        components: {
            myTable
        },
        methods: {
            getNoticeUrl() {
                return require('@/images/task.png');
            },
            getSelectionData (val) {

            },
            startQuery () {
                var _this = this;
                var myentity = [];
                if (this.form.dtype) {
                    myentity.push({'field': 'dtype', 'opt': 'like', 'value': _this.form.dtype, 'assemble': 'and'});
                }
                if (this.form.dname) {
                    myentity.push({'field': 'dname', 'opt': 'like', 'value': _this.form.dname, 'assemble': 'and'});
                }
                this.mytableData.where = myentity;
                console.log('查询条件是', this.mytableData.where);
                this.$refs.dictTable.findAllProject(1);
            },
            resetQuery () {
                this.form.dtype = '';
                this.form.dname = '';
            },
            addNewDict () {
                this.$router.push({
                    name: 'sys/addDictManagement'
                });
            },
            delDict () {

            },
            updateDict () {

            }

        },
        mounted: function () {
            var that = this;
            document.onkeydown = function (event) {
                console.log('keyCode---', event.keyCode);
                if (event.keyCode == '13') {
                    that.startQuery();
                }
            };
        }

    };
</script>
<style scoped>
    .bgColor{
        background:#fff;
        padding:10px 20px;
    }
    .inputPadding{
        padding:0 15px;
    }
    .tableBtn{
        padding:0px 0 5px 0px;
    }
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
</style>