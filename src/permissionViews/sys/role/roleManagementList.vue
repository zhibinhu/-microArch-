<template>
    <div>
        <el-col :span="24" style="background-color: white;padding:10px 20px;">
            <h2>
                <div style="float: left;padding-top: 4px;padding-right: 5px;">
                    <img  :src="getNoticeUrl()"  width="16" height="16" />
                </div>
                <div>
                    <span style="float:left;height:32px;line-height: 32px;font-weight: normal;font-size: 14px;">角色管理</span>
                </div>
                <div class="tableBtn" style="float:right;padding:0;">
                    <el-button v-hasPermission="'addRole'" @click="addRoleManagement()" icon="el-icon-circle-plus-outline" size="small" type="primary">新增
                    </el-button>
                    <el-button v-hasPermission="'enableRole'" @click="enableRoleManagement('Y')" icon="el-icon-circle-check-outline" size="small" type="primary">启用
                    </el-button>
                    <el-button v-hasPermission="'unableRole'" @click="enableRoleManagement('N')" icon="el-icon-circle-close-outline" size="small" type="primary">停用
                    </el-button>
                </div>
            </h2>
            <el-form ref="form" :model="form" label-width="80px"  style="overflow: hidden;margin-bottom: 10px;">
                <el-col :span="6" :xs="20" class="inputPadding">
                    <el-form-item label="角色编码">
                        <el-input v-model="form.roleCode" clearable style="width: 95%" size="small" ></el-input>
                    </el-form-item>

                </el-col>

                <el-col :span="6" :xs="20" class="inputPadding">
                    <el-form-item label="角色名称">
                        <el-input v-model="form.roleName" clearable size="small" style="width: 95%"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="6" :xs="20" class="inputPadding">
                    <el-form-item label="角色状态">
                        <el-select v-model="form.status" placeholder="请选择项目类型" size="small" clearable style="width: 95%">
                            <el-option label="启用" value="Y"></el-option>
                            <el-option label="停用" value="N"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6" :xs="20" class="inputPadding">
                <el-button :span="6" :xs="20" icon="el-icon-search" type="primary" round @click="search()" size="small" style="margin-top:4px;">查询</el-button>
                </el-col>
            </el-form>

            <my-table ref="tableRoleLine" :myTableData="myTableData" @getSelectionData="getSelectionData"></my-table>
        </el-col>

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
                        deleteApply: '/microarch/sys/sysroleuser/checkRoleIdExist',
                        deleteValue: 'id',
                        deleteMessage: '该角色已存在用户，无法删除！'
                    },
                    url: '/microarch/sys/sysrole/list',
                    dlUrl: '/microarch/sys/sysrole/delete',
                    viewName: 'sys/detailRoleManagement',
                    editName: 'sys/editRoleManagement',
                    exportName: '角色信息.xlsx',
                    tableThead: [
                        {
                            headName: '选择',
                            headKey: '',
                            selectionCheckbox: true,
                            isHidden: true,
                            fixedColumn: true
                        },
                        {
                            headName: '角色编码',
                            headKey: 'roleCode',
                            underline: true
                        },
                        {
                            headName: '角色名称',
                            headKey: 'roleName'
                        },
                        {
                            headName: '角色状态',
                            headKey: 'status',
                            orgStatus: true,
                            dirKey: true
                        }
                    ],
                    entity: {},
                    where: [],
                    pageRequest: {},
                    myorderBy: 'lastmodifiedTime DESC'
                },
                form: {
                    roleCode: '',
                    roleName: ''
                    // status:'',
                },
                total: 1,
                pageNumber: 1,
                pageSize: 10,
                condition: [], // 查询条件
                selectionData: []
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
                this.selectionData = val;
                console.log('selectionData-----', this.selectionData);
            },
            search () {
                var _this = this;
                var myentity = [];
                if (this.form.roleCode) {
                    myentity.push({'field': 'roleCode', 'opt': 'like', 'value': _this.form.roleCode, 'assemble': 'and'});
                }
                if (this.form.roleName) {
                    myentity.push({'field': 'roleName', 'opt': 'like', 'value': _this.form.roleName, 'assemble': 'and'});
                }
                if (this.form.status) {
                    myentity.push({'field': 'status', 'opt': 'like', 'value': _this.form.status, 'assemble': 'and'});
                }
                this.myTableData.where = myentity;
                console.log('查询条件是', this.myTableData.where);
                this.$refs.tableRoleLine.findAllProject(1);
                /* this.conditions=myconditions;
                 this.mypage=0;
                 this.mysize=10; */

                /* this.findAllProject(this.conditions,this.mypage,this.mysize,this.direction,this.field); */
            },
            addRoleManagement: function () {
                this.$router.push({
                    name: 'sys/addRoleManagement'
                });
            },

            enableRoleManagement (statusVal) {
                if (this.selectionData != '' && this.selectionData != null) {
                    var arr = [];
                    for (var i = 0; i < this.selectionData.length; i++) {
                        arr.push(this.selectionData[i].id);
                    }
                    var ids = arr.length > 1 ? arr.join(',') : arr[0];
                    console.log('ids-------', ids);
                    this.$myHttp({
                        method: 'post',
                        url: this.permissionPrefix + '/microarch/sys/sysrole/updateStatus?ids=' + ids + '&status=' + statusVal
                    }).then(res => {
                        console.log('resstatus---------', res);
                        if (res.data && statusVal == 'Y') {
                            this.$message({
                                message: '启用成功',
                                type: 'success'
                            });
                            this.$refs.tableRoleLine.findAllProject(1);
                        } else if (res.data && statusVal == 'N') {
                            this.$message({
                                message: '停用成功',
                                type: 'success'
                            });
                            this.$refs.tableRoleLine.findAllProject(1);
                        }
                    });
                } else {
                    this.$message({
                        message: '请选择数据！',
                        type: 'success'
                    });
                }
            }
        },
        mounted () {
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