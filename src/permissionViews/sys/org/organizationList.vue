<template>
    <div>
        <el-row>

        <el-col :span="24" style="background-color: white;padding:10px 20px;">
            <h2>
                <div style="float: left;padding-top: 4px;padding-right: 5px;">
                    <img  :src="getNoticeUrl()"  width="16" height="16" />
                </div>
                <div>
                    <span style="float:left;height:32px;line-height: 32px;font-weight: normal;font-size: 14px;">组织管理</span>
                </div>
                <div class="tableBtn" style="float:right;padding:0;">
                    <el-button @click="toOrganizationAndManage()" v-hasPermission="'addOrganization'" icon="el-icon-circle-plus-outline" size="small" type="primary">新增
                    </el-button>
                </div>
            </h2>
            <el-form ref="form" :model="form" label-width="80px" style="overflow: hidden;margin-bottom: 10px;">
                <el-col :span="6" :xs="20" class="inputPadding">
                    <el-form-item label="组织编码">
                        <el-input v-model="form.orgCode" size="small" clearable></el-input>
                    </el-form-item>

                </el-col>

                <el-col :span="6" :xs="20" class="inputPadding">
                    <el-form-item label="组织名称">
                        <el-input v-model="form.orgName" size="small" clearable></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="6" :xs="20" class="inputPadding">
                    <el-form-item label="组织简称">
                        <el-input v-model="form.orgShortName" size="small" clearable></el-input>
                    </el-form-item>

                </el-col>
                <el-col :span="6" :xs="20" class="inputPadding">
                <el-button :span="6" :xs="20" type="primary" icon="el-icon-search" round @click.enter="search()" size="small" style="margin-top: 4px;">查询</el-button>
                </el-col>
            </el-form>

            <my-table ref="tableProductLine" :myTableData="myTableData"></my-table>
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
                    deleVerification: {
                        deleteApply: '/microarch/sys/sysorg/checkOrgIdExist',
                        deleteValue: 'id',
                        deleteMessage: '该组织目录下存在其他组织，请先删除子组织！'
                    },
                    url: '/microarch/sys/sysorg/list',
                    dlUrl: '/microarch/sys/sysorg/delete',
                    viewName: 'sys/detailOrganization',
                    editName: 'sys/editOrganization',
                    exportName: '组织信息.xlsx',
                    tableThead: [
                        {
                            headName: '序号',
                            headKey: 'pageIndex',
                            width: 22
                        },
                        {
                            headName: '组织编码',
                            headKey: 'orgCode',
                            underline: true
                        },
                        {
                            headName: '组织名称id',
                            headKey: 'pid',
                            isHidden: 'true'
                        },
                        {
                            headName: '组织名称',
                            headKey: 'orgName'
                        },
                        {
                            headName: '组织简称',
                            headKey: 'orgShortName'
                        },
                        {
                            headName: '上级组织',
                            headKey: 'pidName'
                        },
                        {
                            headName: '状态',
                            headKey: 'status',
                            width: 30,
                            orgStatus: true,
                            dirKey: true

                        },
                        {
                            headName: '类型',
                            headKey: 'typeName',
                            width: 30
                        }
                    ],
                    entity: {},
                    where: [],
                    conditions: [],
                    pageRequest: {},
                    myorderBy: 'lastmodifiedTime DESC'
                },
                form: {
                    orgCode: '',
                    orgName: '',
                    orgShortName: ''
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
            search () {
                var _this = this;
                var myentity = [];
                if (this.form.orgCode) {
                    myentity.push({'field': 'orgCode', 'opt': 'like', 'value': _this.form.orgCode, 'assemble': 'and'});
                }
                if (this.form.orgName) {
                    myentity.push({'field': 'orgName', 'opt': 'like', 'value': _this.form.orgName, 'assemble': 'and'});
                }
                if (this.form.orgShortName) {
                    myentity.push({'field': 'orgShortName', 'opt': 'like', 'value': _this.form.orgShortName, 'assemble': 'and'});
                }
                this.myTableData.where = myentity;
                console.log('查询条件是', this.myTableData.where);
                this.$refs.tableProductLine.findAllProject(1);
                /* this.conditions=myconditions;
                 this.mypage=0;
                 this.mysize=10; */

                /* this.findAllProject(this.conditions,this.mypage,this.mysize,this.direction,this.field); */
            },

            toOrganizationAndManage: function () {
                this.$router.push({
                    name: 'sys/addOrganization'
                });
            }
        },
        mounted: function () {
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