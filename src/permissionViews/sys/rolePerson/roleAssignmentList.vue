<template>
    <div>
        <el-dialog title="选择用户" @close="backSize" :visible.sync="dialogVisible" :append-to-body="true" :modal-append-to-body="false" width="70%">
            <div id="formStyle" style="height: 400px">
                <el-form ref="formRule" label-width="80px">
                    <el-col :span="8" class="inputPadding">
                        <el-form-item label="登录名">
                            <el-input v-model="formRule.userName" placeholder="请输入登录名" clearable size="small"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" class="inputPadding">
                        <el-form-item label="姓名">
                            <el-input v-model="formRule.cname" placeholder="请输入姓名" clearable size="small"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2" class="inputPadding">
                        <el-button type="primary" icon="el-icon-search" size="small" round @click="startQuery">查询</el-button>
                    </el-col>
                    <el-col :span="6" class="inputPadding">
                        <el-button type="primary" icon="el-icon-refresh" size="small" round @click="resetDialog" style="margin-left: 8px">重置</el-button>
                    </el-col>
                <el-table
                        ref="multipleTable"
                        :data="tableDataContain"
                        border
                        tooltip-effect="dark"
                        style="width: 100%"
                        :header-cell-style="{padding:'5px 0',background:'#dfebf9',fontSize:'12px'}"
                        :cell-style="{fontSize:'12px',padding:'5px 0'}"
                        max-height="300"
                        @selection-change="handleSelectionChangeContain">
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column
                            v-if="false"
                            prop="id"
                            label="id">
                    </el-table-column>
                    <el-table-column
                            prop="userName"
                            label="登录名"
                            width='130px'>
                    </el-table-column>
                    <el-table-column
                            prop="cname"
                            label="姓名">
                    </el-table-column>
                    <el-table-column
                            prop="orgs"
                            label="所在部门"
                            width='150px'>
                    </el-table-column>
                    <el-table-column
                            prop="mobile"
                            label="联系电话"
                            width='130px'>
                    </el-table-column>
                    <el-table-column
                            prop="email"
                            label="Email"
                            width='130px'
                            :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column
                            prop="status"
                            label="状态">
                    </el-table-column>
                    <el-table-column
                            prop="position"
                            label="角色"
                            width="150"
                            :show-overflow-tooltip="true">
                    </el-table-column>
                </el-table>
                <el-pagination
                        class="setMinWidth"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageNumber"
                        :page-sizes="[10, 20, 30, 40,50,100]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
                </el-form>
                <div class="tableBtn" align="right">
                    <el-button type="primary" size="medium" icon="el-icon-circle-plus-outline" @click="addNewUser">确认</el-button>
                </div>
            </div>
        </el-dialog>
        <el-row style="background: #fff;padding:10px 0;min-width:900px;min-height: 600px;overflow-x:auto;">
            <el-col :span="9" style="border-right:1px solid #ccc;min-height: 600px;">
                <div style="min-width:336px;overflow:hidden;height:40px">
                    <el-form ref="form" label-width="80px" size="small">
                        <el-form-item label="角色名称" style="float:left;width:228px;overflow:hidden;">
                            <el-input v-model="roleName" placeholder="请输入角色名称" clearable></el-input>
                        </el-form-item>
                        <div style="padding-left: 10px;float:left;">
                            <el-button type="primary" @click="queryRole" icon="el-icon-search" round size="small">查询</el-button>
                        </div>
                    </el-form>
                </div>
                <div>
                    <div v-if="allRoles.length==0" style="text-align:center;">暂无查询结果</div>
                    <div v-else>
                        <el-radio-group v-model="selectedRole" class="radioBox" @change="showMytableRole(selectedRole)">
                            <div class="radioStyle" v-if="item.roleCode=='admin'" v-for="(item,index) in allRoles"><el-radio  :disabled="true" :label="item.id">{{item.roleName+'('+item.roleCode+')'}}</el-radio></div>
                            <div class="radioStyle" v-if="item.roleCode!='admin'" v-for="(item,index) in allRoles"><el-radio :label="item.id">{{item.roleName+'('+item.roleCode+')'}}</el-radio></div>
                        </el-radio-group>
                    </div>
                </div>
            </el-col>
            <el-col :span="15">
                <el-button v-hasPermission="'roleAddPerson'" @click="addRoleManage()" icon="el-icon-circle-plus-outline" size="small" round type="primary" style="marginLeft : 10px">新增
                </el-button>
                <el-button v-hasPermission="'delRolePerson'" @click="deleteRoleManage()" icon="el-icon-delete" size="small" type="danger" round style="">删除
                </el-button>
                <div class="resourcesList">
                    <el-row>
                        <el-table
                                ref="multipleTable"
                                :data="tableData"
                                border
                                tooltip-effect="dark"
                                style="width: 100%"
                                :header-cell-style="{padding:'5px 0',background:'#dfebf9',fontSize:'12px'}"
                                :cell-style="{fontSize:'12px',padding:'5px 0'}"
                                max-height="500"
                                @selection-change="handleSelectionChange">
                            <el-table-column
                                    type="selection"
                                    width="55">
                            </el-table-column>

                            <el-table-column
                                    prop="userName"
                                    label="登录名">
                            </el-table-column>
                            <el-table-column
                                    prop="cname"
                                    label="姓名">
                            </el-table-column>
                            <el-table-column
                                    prop="orgNames"
                                    label="组织">
                            </el-table-column>
                            <el-table-column
                                    prop="mobile"
                                    label="联系电话">
                            </el-table-column>
                        </el-table>
                    </el-row>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                userName: '',
                cname: '',
                form: {},
                formRule: {},
                dialogVisible: false,
                tableDataContain: [],
                pageNumber: 1,
                pageSize: 10,
                total: 1,
                roleId: '',
                tableData: [],
                multipleSelection: [],
                multipleSelectionContain: [],
                message: '角色权限分配',
                roleName: '',
                selectedRole: '',
                allRoles: [],
                resourcesListData: [],
                defaultProps: {
                    children: 'childrens',
                    label: 'text'
                },
                checkedItems: [],
                roleCheckedItems: [],
                condition: []
            };
        },
        mounted () {
            this.showAllRoles();// 展示所有角色
            console.log('allRoles', this.allRoles);
            var that = this;
            document.onkeydown = function (event) {
                // console.log('keyCode---',event.keyCode)
                if (event.keyCode == '13') {
                    that.startQuery();
                    that.queryRole();
                }
            };
        },
        methods: {
            queryList (currentPage, currentSize, conditions) {
                var params = {
                    'where': conditions,
                    'pageNum': 0,
                    'pageSize': 10,
                    'orderBy': 'id asc'
                };
                // userManage.queryList(params).then(res=>{
                params.where = conditions || [];
                params.pageNum = currentPage - 1;
                params.pageSize = currentSize;

                this.$myHttp({
                    method: 'post',
                    url: this.permissionPrefix + '/microarch/sys/sysuser/list',
                    data: params
                }).then(res => {
                    console.log('res---------userList---', res);
                    if (res.data && res.data.rows) {
                        this.tableDataContain = [];
                        this.total = parseInt(res.data.total);
                        for (var i = 0; i < res.data.rows.length; i++) {
                            var rowContent = {};
                            rowContent.id = res.data.rows[i].id ? res.data.rows[i].id : '';
                            rowContent.userName = res.data.rows[i].userName ? res.data.rows[i].userName : '';
                            rowContent.cname = res.data.rows[i].cname ? res.data.rows[i].cname : '';
                            rowContent.orgs = res.data.rows[i].orgs && res.data.rows[i].orgs[0] ? res.data.rows[i].orgs[0].orgName : '';
                            rowContent.mobile = res.data.rows[i].mobile ? res.data.rows[i].mobile : '';
                            rowContent.email = res.data.rows[i].email ? res.data.rows[i].email : '';
                            rowContent.status = res.data.rows[i].status == 'Y' ? '启用' : res.data.rows[i].status == 'N' ? '停用' : '';
                            rowContent.position = res.data.rows[i].roleNames ? res.data.rows[i].roleNames : '';
                            this.tableDataContain.push(rowContent);
                        }
                        // var _this=this;
                        // setTimeout(function(){
                        //     _this.hideRadioLabel();//隐藏radiobutton的label数字
                        // },0)
                    }
                });
            },
            handleSizeChange (val) {
                console.log(`每页 ${val} 条`);
                this.pageSize = val;
                this.pageNumber = 1;
                this.queryList(1, val, this.condition);
            },
            handleCurrentChange (val) {
                console.log(`当前页: ${val}`);
                this.pageNumber = val;
                this.queryList(val, this.pageSize, this.condition);
            },
            handleSelectionChange (val) {
                this.multipleSelection = val;
            },

            handleSelectionChangeContain (val) {
                console.log('ceshiyixai', val);
                this.multipleSelectionContain = val;
            },
            backSize () {
                this.pageNumber = 1;
                this.pageSize = 10;
            },
            addRoleManage () {
                var _this = this;
                if (this.roleId) {
                    // this.$myHttp({
                    //     method: 'POST',
                    //     url: this.permissionPrefix+'/microarch/sys/sysuser/list',
                    //     data: {"where": []}
                    //
                    // }).then(Res => {
                    //     console.log(Res);
                    //     this.tableDataContain = Res.data.rows
                    // })
                    var condition = [];
                    this.queryList(1, 10, condition);
                    _this.dialogVisible = true;
                    setTimeout(function () {
                        document.getElementsByClassName('el-dialog__body')[0].style.padding = '0px 5px 30px 5px';
                        var formStyle = document.getElementById('formStyle').getElementsByClassName('el-form-item');
                        for (var i = 0; i < formStyle.length; i++) {
                            formStyle[i].style.marginBottom = '5px';
                        }
                    }, 100);
                } else {
                    this.$message({
                        message: '请选择角色！'
                    });
                }
            },
            deleteRoleManage () {
                var _this = this;
                var arr = [];
                for (var i = 0; i < this.multipleSelection.length; i++) {
                    arr.push(this.multipleSelection[i].id);
                }

                var params = {
                    'entity': {
                        'id': this.roleId,
                        'userIds': arr
                    }
                };

                this.$myHttp({
                    method: 'POST',
                    url: this.permissionPrefix + '/microarch/sys/sysroleuser/delete',
                    data: params

                }).then(res => {
                    // _this.tableDataChange = false;
                    this.$message({
                        showClose: true,
                        message: '删除成功！',
                        type: 'success'
                    });
                    setTimeout(function () {
                        _this.showMytableRole(_this.roleId);
                    }, 100);
                });
            },
            queryRole () {
                var roleName = this.roleName.replace(/^(\s)*|(\s)*$/, '');
                this.showAllRoles(roleName);
                this.selectedRole = '';
            },
            startQuery () {
                var _this = this;
                var condition = [];
                var userName = '';
                var cname = '';
                if (_this.formRule.userName) {
                    userName = _this.formRule.userName.replace(/^(\s)*|(\s)*$/g, '');
                }
                if (_this.formRule.cname) {
                    var cname = _this.formRule.cname.replace(/^(\s)*|(\s)*$/g, '');
                }
                console.log('213123', userName);
                if (userName != '') {
                    var userNameObj = {
                        'field': 'userName',
                        'value': userName
                    };
                    condition.push(userNameObj);
                }
                if (cname != '') {
                    var cnameObj = {
                        'field': 'cname',
                        'value': cname
                    };
                    condition.push(cnameObj);
                }
                console.log('condition======', condition);
                this.condition = condition;
                this.queryList(1, 10, condition);
                this.pageNumber = 1;
                this.pageSize = 10;
            },
            resetDialog () {
                var _this = this;
                console.log('重置功能——————', _this.formRule.cname);
                setTimeout(function () {
                    _this.formRule.cname = '';
                    _this.formRule.userName = '';
                }, 100);
            },
            showAllRoles (roleName) {
                var params = {
                    where: [
                        {
                            'field': 'roleName',
                            'value': roleName != undefined ? roleName : ''
                        },
                        {
                            'field': 'status',
                            'value': 'Y'
                        }
                    ]
                };
                this.$myHttp({
                    method: 'POST',
                    url: this.permissionPrefix + '/microarch/sys/sysrole/list',
                    data: params

                }).then(res => {
                    // console.log('allRoles----',res);
                    if (res.data) {
                        this.allRoles = res.data.rows;
                        this.showMytableRole();// 展示所有资源树
                    }
                });
            },

            showMytableRole (roleId) {
                console.log('roleId-----', roleId);
                this.roleId = roleId;
                this.$myHttp({
                    method: 'POST',
                    url: this.permissionPrefix + '/microarch/sys/sysroleuser/find',
                    data: {entity: {'id': this.roleId}}
                }).then(res => {
                    this.tableData = res.data.rows;
                    console.log('res1231313213-----', res);
                });
            },
            checkedStatusChange (checkedNode, statusObj) {
                // console.log('checkedNode---',checkedNode,'statusObj---',statusObj);
                this.roleCheckedItems = statusObj.checkedKeys;
                // console.log('this.roleCheckedItems---',this.roleCheckedItems)
            },
            addNewUser () {
                var _this = this;
                var arr = [];
                for (var i = 0; i < this.multipleSelectionContain.length; i++) {
                    arr.push(this.multipleSelectionContain[i].id);
                }
                var params = {
                    'entity': {
                        'id': this.roleId,
                        'userIds': arr
                    }
                };

                this.$myHttp({
                    method: 'POST',
                    url: this.permissionPrefix + '/microarch/sys/sysroleuser/save',
                    data: params

                }).then(res => {
                    this.$message({
                        showClose: true,
                        message: '保存成功！',
                        type: 'success'
                    });
                    setTimeout(function () {
                        _this.showMytableRole(_this.roleId);
                    }, 100);
                });

                this.dialogVisible = false;
                this.selectionData = '';
            }
        }
    };
</script>
<style>
    .inputPadding{
        padding:0 15px;
    }
    .radioStyle{
        padding:10px;
    }
    .radioBox{
        max-height: 550px;
        overflow-y: auto;
        width: 100%;
    }
    .resourcesList{
        margin:10px;
    }
    .el-dialog__body {
        padding: 1px 15px;
        color: #606266;
        line-height: 24px;
        font-size: 14px;
    }
</style>