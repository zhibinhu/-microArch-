<template>
    <div>
        <el-row>
            <el-col :span="4" class="treeList">
                <div class="treeTitle">组织结构<span ref="hideBtn" @click="hideTree"><i class="el-icon-caret-left"></i></span></div>
                <!--<my-tree :data="myTreeData" :name="menuName" class="treeShow" id="treeParentBox"></my-tree>-->
                <el-tree
                        :data="myTreeData"
                        :props="defaultProps"
                        node-key="id"
                        :default-expanded-keys="[firstTreeId]"
                        @node-click="handleNodeClick"
                        @node-expand="resizeTreeFont"
                        highlight-current
                        ref="tree"
                        id="tree"
                        class="treeShow">
                </el-tree>
            </el-col>
            <el-col :span="20">
                <div class="bgColor">
                    <span class="showBtnSpan" ref="showBtn" @click="showTree"><i class="el-icon-caret-right"></i></span>
                <el-row>
                    <h2>
                        <div style="float: left;padding-top: 4px;padding-right: 5px;">
                            <img  :src="getNoticeUrl()"  width="16" height="16" />
                        </div>
                        <div>
                            <span style="float:left;height:32px;line-height: 32px;font-weight: normal;font-size: 14px;">用户管理</span>
                        </div>
                        <div class="tableBtn" style="float:right;padding:0;">
                            <el-button type="primary" v-hasPermission="'addUser'" icon="el-icon-circle-plus-outline"  size="small" @click="addNewUser">新增</el-button>
                            <el-button type="primary" v-hasPermission="'enableUser'" icon="el-icon-circle-check-outline" size="small" @click="enableData('Y')">启用</el-button>
                            <el-button type="primary" v-hasPermission="'unableUser'" icon="el-icon-circle-close-outline" size="small" @click="enableData('N')">停用</el-button>
                        </div>
                    </h2>
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
                                <el-option :label="item.label" :value="item.value" :key="item.value" v-for="(item,index) in statusData"></el-option>
                                <!--<el-option label="全部" value="A"></el-option>-->
                                <!--<el-option label="停用" value="N"></el-option>-->
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" class="inputPadding">
                        <el-button type="primary" size="small" icon="el-icon-search" round @click="startQuery" style="margin-top:4px;">查询</el-button>
                    </el-col>
                    </el-form>
                </el-row>
                </div>
                <div class="commonTable" style="padding:0 20px 10px 20px;background: #fff;">
                    <!--<div class="tableBtn">-->
                        <!--<el-button type="primary" v-hasPermission="'addUser'" icon="el-icon-circle-plus-outline"  size="small" @click="addNewUser">新增</el-button>-->
                        <!--<el-button type="primary" v-hasPermission="'enableUser'" icon="el-icon-circle-check-outline" size="small" @click="enableData('Y')">启用</el-button>-->
                        <!--<el-button type="primary" v-hasPermission="'unableUser'" icon="el-icon-circle-close-outline" size="small" @click="enableData('N')">停用</el-button>-->
                    <!--</div>-->
                    <div class="tableBtnControl">
                        <el-button v-show="false"  id="viewOrNot" type="primary" v-hasPermission="'userViewBtn'">查看</el-button>
                        <el-button v-show="false"  id="editOrNot" type="primary" v-hasPermission="'userEditBtn'">编辑</el-button>
                        <el-button v-show="false"  id="delOrNot" type="primary" v-hasPermission="'userDelBtn'">删除</el-button>
                    </div>
                    <my-table ref="userTable" :myTableData="mytableData" @getSelectionData="getSelectionData"></my-table>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script type="text/javascript">
    import myTable from '../../../components/myTableSys';
    import util from '../../../libs/util';
    export default {
        components: {
            myTable
        },
        data () {
            return {
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
                    right:true,
                    deleVerification: {
                        deleteApply: '/microarch/sys/sysuser/checkFullNameExist',
                        deleteValue: 'cname',
                        deleteMessage: '该用户已在其他位置启用，无法删除！'
                    },
                    url: '/microarch/sys/sysuser/list',
                    dlUrl: '/microarch/sys/sysuser/delete',
                    viewName: 'sys/lookUser',
                    editName: 'sys/editUser',
                    exportName: '用户信息.xlsx',
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
                            fixedColumn: true,
                            underline: true,
                            width: 40
                        },
                        {
                            headName: '姓名',
                            headKey: 'cname',
                            fixedColumn: true,
                            width: 38
                        },
                        {
                            headName: '所在部门',
                            headKey: 'orgNames',
                            userDepartment: true
                        },
                        {
                            headName: '移动电话',
                            headKey: 'mobile'
                        },
                        {
                            headName: 'Email',
                            headKey: 'email',
                            isNeedTips: true
                        },
                        {
                            headName: '状态',
                            headKey: 'status',
                            userStatus: true,
                            dirKey: true,
                            width: 38
                        }
                        // {
                        //     headName: '角色',
                        //     headKey: 'roleNames',
                        //     userRoleFlag:true,
                        //     showToolTipFlag:true
                        // },
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
                selectionData: [],
                statusData: [],
                dirArry: ['status']

            };
        },
        created () {

        },
        watch: {
        },
        mounted () {
            // 表格内部按钮权限控制
            this.$set(this.mytableData, 'viewBtnHidden', !document.getElementById('viewOrNot'));
            this.$set(this.mytableData, 'editBtnHidden', !document.getElementById('editOrNot'));
            this.$set(this.mytableData, 'delBtnHidden', !document.getElementById('delOrNot'));

            this.showTreeData();// 展示机构树
            // 获取当前页面所需数据字典数据
            util.getSelectData(this, this.dirArry);
            var that = this;
            document.onkeydown = function (event) {
                console.log('keyCode---', event.keyCode);
                if (event.keyCode == '13') {
                    that.startQuery();
                }
            };
        },
        methods: {
            getNoticeUrl() {
                return require('@/images/task.png');
            },
            getSelectionData (val) {
                this.selectionData = val;
                console.log('selectionDaata-----', this.selectionData);
            },
            handleNodeClick (data) {
                console.log(data);
                var entity = {
                    'orgIds': [data.id]
                };
                this.mytableData.url = '/microarch/sys/syscommon/findUsersByOrg';
                this.mytableData.entity = entity;
                this.userName = '';
                this.cname = '';
                this.statusValue = '';
                // console.log('entity------',entity)
                this.$refs.userTable.findAllProject(1);
            },
            showTreeData () {
                var that = this;
                this.$myHttp({
                    method: 'post',
                    url: this.permissionPrefix + '/microarch/sys/sysorg/listTree'
                }).then(res => {
                    console.log('res-tree', res);
                    if (res.data) {
                        let resData = JSON.parse(res.data.ext);
                        // console.log('res-tree data------',resData)
                        this.firstTreeId = resData.id;
                        this.myTreeData = [];
                        this.myTreeData.push(resData);
                        setTimeout(function () {
                            that.$refs.tree.store.nodesMap[that.firstTreeId].expanded = true;
                            that.resizeTreeFont();
                        }, 0);

                        // console.log('myTreeData---------',this.myTreeData)
                    }
                }).catch(function (err) {
                    console.log('hhhhhhhhhcatch-------', err);
                });
            },
            // 修改树形菜单字体大小
            resizeTreeFont () {
                setTimeout(function () {
                    let nodelabel = document.getElementById('tree').getElementsByClassName('el-tree-node__label');
                    for (var i = 0; i < nodelabel.length; i++) {
                        nodelabel[i].style.fontSize = '12px';
                    }
                }, 0);
            },
            enableData (statusVal) {
                var arr = [];
                var arrUserName = [];
                var currentLoginPerson = sessionStorage.getItem('userName');
                for (var i = 0; i < this.selectionData.length; i++) {
                    arr.push(this.selectionData[i].id);
                    arrUserName.push(this.selectionData[i].userName);
                }
                var ids = arr.join(',');
                if (ids == '' && statusVal == 'Y') {
                    this.$message({
                        message: '请选择您要启用的用户',
                        type: 'warning'
                    });
                    return false;
                } else if (ids == '' && statusVal == 'N') {
                    this.$message({
                        message: '请选择您要停用的用户',
                        type: 'warning'
                    });
                    return false;
                }
                if (statusVal == 'N' && arrUserName.indexOf(currentLoginPerson) > -1) {
                    this.$message({
                        message: '您选择的用户中包含当前登录的用户,请重新选择',
                        type: 'warning'
                    });
                    return false;
                }
                // console.log('ids-------',ids)
                this.$myHttp({
                    method: 'post',
                    url: this.permissionPrefix + '/microarch/sys/sysuser/updateStatus?ids=' + ids + '&status=' + statusVal
                }).then(res => {
                    console.log('resstatus---------', res);
                    if (res.data && statusVal == 'Y') {
                        this.$message({
                            message: '启用成功',
                            type: 'success'
                        });
                        this.$refs.userTable.findAllProject(1);
                    } else if (res.data && statusVal == 'N') {
                        this.$message({
                            message: '停用成功',
                            type: 'success'
                        });
                        this.$refs.userTable.findAllProject(1);
                    }
                });
            },
            // queryList(currentPage,currentSize,condition){
            //     var params={
            //         "commonQuery": {
            //             "conditions": [
            //                 ],
            //             "page": {
            //                 "number": 0,
            //                 "size": 10
            //             },
            //             "sort": {
            //                 "field": "id",
            //                 "updown": "up"
            //             }
            //         }
            //     }
            //     // userManage.queryList(params).then(res=>{
            //     params.commonQuery.conditions=this.condition?this.condition:[];
            //     params.commonQuery.page.number=currentPage-1;
            //     params.commonQuery.page.size=currentSize;
            //
            //     this.$myHttp({
            //         method: 'post',
            //         url: this.permissionPrefix+'/microarch/sys/sysuser/list',
            //         data:params
            //     }).then(res => {
            //         // console.log('res---------userList---',res)
            //         if(res.data && res.data.rows) {
            //             this.ourtableData=[];
            //             this.total=parseInt(res.data.totalElements);
            //             for (var i = 0; i < res.data.rows.length; i++) {
            //                   var rowContent={};
            //                   rowContent.userName=res.data.rows[i].userName?res.data.rows[i].userName:'';
            //                   rowContent.cname=res.data.rows[i].cname?res.data.rows[i].cname:'';
            //                   rowContent.department=res.data.rows[i].orgs[0]?res.data.rows[i].orgs[0].orgShortName:'';
            //                   rowContent.mobile=res.data.rows[i].mobile?res.data.rows[i].mobile:'';
            //                   rowContent.email=res.data.rows[i].email?res.data.rows[i].email:'';
            //                   rowContent.status=res.data.rows[i].status=="Y"?"启用":res.data.rows[i].status=="N"?"停用":"";
            //                   rowContent.role=res.data.rows[i].role?res.data.rows[i].role:'';
            //                   this.ourtableData.push(rowContent);
            //             }
            //         }
            //     })
            // },
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
                this.$refs.userTable.adjustTableHead();// 使表格表头竖线对齐
            },
            showTree () {
                var parNode = this.$refs.hideBtn.parentNode.parentNode;
                var showBtn = this.$refs.showBtn;
                var elColList = showBtn.parentNode.parentNode;
                parNode.style.display = 'block';
                showBtn.style.display = 'none';
                elColList.className = 'el-col el-col-20';
                this.$refs.userTable.adjustTableHead();// 使表格表头竖线对齐
            },
            addNewUser () {
                this.$router.push({
                    name: 'sys/editUser',
                    query: {
                        'addFlag': true
                    }
                });
            },
            deleteApply (row) {
                console.log('wxz', row);
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
        font-size:13px;
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

    h2{
        overflow: hidden;
        padding: 0;
        padding-bottom: 10px;
        border-bottom: 1px solid #ddd;
        margin-bottom: 10px;
    }
    .bgColor{
        background:#fff;
        /*padding:20px 0;*/
        padding:10px 20px;
        position:relative;
    }
    .bg-purple-dark{
        font-size:16px;
        padding:10px 0 10px 15px;
        position:relative;
    }
    .tableBtn{
        padding:10px 0 5px 0px;
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
    .el-tree-node__label{
        font-size:12px;
    }
</style>