<template>
    <div>
        <el-row>
            <el-col :span="4" class="treeList">
                <div class="treeTitle">树形组织结构图<span ref="hideBtn" @click="hideTree"><i class="el-icon-caret-left"></i></span></div>
                <!--<my-tree :data="myTreeData" :name="menuName" class="treeShow" id="treeParentBox"></my-tree>-->
                <el-tree
                        :data="myTreeData"
                        :props="defaultProps"
                        node-key="id"
                        :default-expanded-keys="[firstTreeId]"
                        @node-click="handleNodeClick"
                        highlight-current
                        ref="tree"
                        class="treeShow">
                </el-tree>
            </el-col>
            <el-col :span="20">
                <div class="bgColor">
                    <span class="showBtnSpan" ref="showBtn" @click="showTree"><i class="el-icon-caret-right"></i></span>
                    <el-row>
                        <el-form ref="form" label-width="80px">
                            <el-col :span="6" class="inputPadding">
                                <el-form-item label="登录名">
                                    <el-input v-model="userName" placeholder="请输入登录名" clearable size="small"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6" class="inputPadding">
                                <el-form-item label="姓名">
                                    <el-input v-model="cname" placeholder="请输入姓名" clearable size="small"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6" class="inputPadding">
                                <el-form-item label="状态">
                                    <el-select v-model="statusValue" placeholder="请选择状态" clearable size="small">
                                        <el-option label="启用" value="Y"></el-option>
                                        <el-option label="全部" value="A"></el-option>
                                        <el-option label="停用" value="N"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6" class="inputPadding">
                                <el-button type="primary" size="small" round @click="startQuery">查询</el-button>
                            </el-col>
                        </el-form>
                    </el-row>
                </div>
                <div class="commonTable">
                    <my-table ref="userTable" :myTableData="mytableData" @getSelectionData="getSelectionData"></my-table>
                    <div class="tableBtn">
                        <el-button type="primary" icon="el-icon-circle-plus-outline" size="small" @click="addNewUser">保存</el-button>
                        <el-button type="" icon="el-icon-circle-plus-outline" size="small" @click="close">返回</el-button>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script type="text/javascript">
    import myTable from '../../../components/myTableSys';
    export default {
        components: {
            myTable
        },
        data () {
            return {
                roleId: '',
                myTreeData: [
                    {
                        id: '1',
                        text: '',
                        childrens: [
                            {
                                id: 12,
                                pid: 1,
                                text: ''
                            }
                        ]
                    }
                ],
                defaultProps: {
                    children: 'childrens',
                    label: 'text'
                },
                firstTreeId: '',
                treeShowFlag: false,
                userName: '',
                cname: '',
                statusValue: '',
                mytableData: {
                    url: '/microarch/sys/sysuser/list',
                    dlUrl: '/microarch/sys/sysuser/delete',
                    viewName: 'lookUser',
                    editName: 'editUser',
                    tableThead: [
                        {
                            headName: '选择',
                            headKey: '',
                            selectionCheckbox: true,
                            isHidden: true,
                            fixedColumn: true
                        },
                        {
                            headName: '登录名',
                            headKey: 'userName',
                            fixedColumn: true
                        },
                        {
                            headName: '姓名',
                            headKey: 'cname',
                            fixedColumn: true
                        },
                        {
                            headName: '所在部门',
                            headKey: 'orgs',
                            userDepartment: true
                        },
                        {
                            headName: '移动电话',
                            headKey: 'mobile'
                        },
                        {
                            headName: 'Email',
                            headKey: 'email'
                        },
                        {
                            headName: '状态',
                            headKey: 'status',
                            userStatus: true
                        },
                        {
                            headName: '角色',
                            headKey: 'roles',
                            userRoleFlag: true
                        }
                    ],
                    entity: {},
                    where: [],
                    pageRequest: {},
                    myorderBy: 'id asc'
                },
                loading: false,
                total: 1,
                pageNumber: 1,
                pageSize: 10,
                condition: [], // 查询条件
                showEmail: true,
                selectionData: []

            };
        },
        created () {

        },
        watch: {
        },
        mounted () {
            this.showTreeData();// 展示机构树
        },
        methods: {
            getSelectionData (val) {
                this.selectionData = val;
                console.log('selectionDaata-----', this.selectionData);
            },
            handleNodeClick (data) {
                console.log(data);
                var whereCondition = [{
                    'field': 'orgs.id',
                    'opt': '=',
                    'value': data.id
                }];
                this.mytableData.url = '/microarch/sys/common/findUsersByOrg';
                this.mytableData.where = whereCondition;
                this.userName = '';
                this.cname = '';
                this.statusValue = '';
                console.log('whereCondition------', whereCondition);
                this.$refs.userTable.findAllProject(1);
            },
            showTreeData () {
                var that = this;
                this.$myHttp({
                    method: 'post',
                    url: this.permissionPrefix + '/microarch/sys/sysorg/listTree'
                }).then(res => {
                    let resData = JSON.parse(res.data);
                    // console.log('res-tree data------',resData)
                    this.firstTreeId = resData.id;
                    this.myTreeData = [];
                    this.myTreeData.push(resData);
                    setTimeout(function () {
                        that.$refs.tree.store.nodesMap[that.firstTreeId].expanded = true;
                    }, 0);
                    // console.log('myTreeData---------',this.myTreeData)
                });
            },
            startQuery () {
                var condition = [];
                var userName = this.userName.replace(/^(\s)*|(\s)*$/g, '');
                var cname = this.cname.replace(/^(\s)*|(\s)*$/g, '');
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
                if (this.statusValue != '') {
                    var statusValueObj = {
                        'field': 'status',
                        'value': this.statusValue != 'A' ? this.statusValue : ''
                    };
                    condition.push(statusValueObj);
                }
                this.mytableData.where = condition;
                this.$refs.userTable.findAllProject(1);
                // this.condition=condition;
                // console.log('condition======',condition)
                // this.queryList(1,10,condition);
                // this.pageNumber=1;
                // this.pageSize=10;
            },
            // handleSelectionChange(val) {
            //     this.multipleSelection = val;
            // },
            // handleSizeChange(val) {
            //     console.log(`每页 ${val} 条`);
            //     this.pageSize=val;
            //     this.pageNumber=1;
            //     this.queryList(1,val);
            // },
            // handleCurrentChange(val) {
            //     console.log(`当前页: ${val}`);
            //     this.pageNumber=val;
            //     this.queryList(val,this.pageSize);
            // },
            hideTree () {
                var parNode = this.$refs.hideBtn.parentNode.parentNode;
                var showBtn = this.$refs.showBtn;
                var elColList = showBtn.parentNode.parentNode;
                parNode.style.display = 'none';
                showBtn.style.display = 'inline-block';
                elColList.className = 'el-col el-col-24';
            },
            showTree () {
                var parNode = this.$refs.hideBtn.parentNode.parentNode;
                var showBtn = this.$refs.showBtn;
                var elColList = showBtn.parentNode.parentNode;
                parNode.style.display = 'block';
                showBtn.style.display = 'none';
                elColList.className = 'el-col el-col-20';
            },
            addNewUser () {
                var arr = [];
                for (var i = 0; i < this.selectionData.length; i++) {
                    arr.push(this.selectionData[i].id);
                }
                var params = {
                    'entity': {
                        'id': this.$route.params.roleId,
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

                    this.$router.push({
                        name: 'roleAssignmentList'
                    });
                });
            },
            close () {
                this.$router.back(-1);
            }

        }

    };
</script>
<style scoped>
    .treeList{
    }
    .treeTitle{
        border:1px solid #ccc;
        height:30px;
        line-height:30px;
        text-align:center;
        font-size:14px;
        font-weight:bold;
        margin-right:10px;
        background:#fff;
        position: relative;
        min-width:120px;
    }
    .treeTitle span,.showBtnSpan{
        position:absolute;
        top:0px;
        right:0px;
        cursor:pointer;
        width:14px;
        height:100%;
        background:#eee;
    }
    .treeTitle i.el-icon-caret-left,i.el-icon-caret-right{
        margin-top:8px;
    }
    .treeShow{
        border:1px solid #ccc;
        margin-right:10px;
        background:#fff;
    }
    .showBtnSpan{
        display:none;
        left:0;
        background:#dad3d3;
        height:28px;
        top:0px;
    }
    .bgColor{
        background:#fff;
        padding:20px 0;
        position:relative;
    }
    .bg-purple-dark{
        font-size:16px;
        padding:10px 0 10px 15px;
        position:relative;
    }
    .tableBtn{
        padding:0px 0 50px 46%;
        margin:0px 0 20px 20px;
    }
    .inputPadding{
        padding:0 15px;
    }
    .searchStatus{
        background-color: #f5f7fa;
        color: #909399;
        vertical-align: middle;
        text-align:center;
        display: inline-block;
        position: relative;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        padding: 0px;
        white-space: nowrap;
        width:30%;
        height:36px;
        line-height:36px;
        float:left;
        font-size:14px;
        border-right:0;
        border-top-right-radius:0px;
        border-bottom-right-radius:0px;
    }
    .el-table,.bgColor{
        table-layout: fixed;
        border-collapse: separate;
        min-width:700px;
        overflow:auto;
    }
    .el-pagination{
        background:#fff;
        min-width:700px;
    }
    .el-form-item{
        margin-bottom:0;
    }
</style>