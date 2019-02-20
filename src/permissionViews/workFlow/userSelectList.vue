<template>
    <div style="position: relative;">
        <el-row>
        <el-col :span="24">
            <div class="bgColor">
                <el-row>
                    <el-form ref="form" label-width="60px">
                        <el-col :span="7" class="inputPadding">
                            <el-form-item label="登录名">
                                <el-input v-model="userName" placeholder="请输入登录名" clearable size="small"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" class="inputPadding">
                            <el-form-item label="姓名">
                                <el-input v-model="cname" placeholder="请输入姓名" clearable size="small"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" class="inputPadding">
                            <el-form-item label="部门">
                                <el-popover
                                        placement="bottom"
                                        width="100%"
                                        trigger="click">
                                    <el-tree
                                            :data="myTreeData"
                                            :props="defaultProps"
                                            node-key="id"
                                            :default-expanded-keys="[firstTreeId]"
                                            @node-click="handleNodeClick"
                                            highlight-current
                                            ref="tree"
                                            id="tree"
                                            >
                                    </el-tree>
                                    <el-input v-model="orgName" placeholder="请选择部门" clearable v-on:change="change" size="small" readOnly slot="reference"  @focus="getTree"></el-input>
                                </el-popover>
                            </el-form-item>
                        </el-col>


                        <el-col :span="3" class="inputPadding" style="margin-top: 5px;">
                            <el-button type="primary" size="small" icon="el-icon-search" round @click="startQuery">查询</el-button>
                        </el-col>
                    </el-form>
                </el-row>
            </div>
            <div class="commonTable">
                <!--表格展示列表show-summary-->
                <el-table
                id="curTable"
                :data="ourtableData"
                border
                stripe
                :header-cell-style="{padding:'4px 0',background:'#dfebf9',fontSize:'12px'}"
                :cell-style="{fontSize:'12px',padding:'4px 0'}"
                @selection-change="handleSelectionChange"
                @row-click="selectCurrentLine"
                style="width: 100%">
                <el-table-column
                        width="139"
                        prop="userName"
                        label="登录名">
                </el-table-column>
                <el-table-column
                        prop="cname"
                        label="姓名">
                </el-table-column>
                <el-table-column
                        prop="department"
                        label="所在部门">
                </el-table-column>
                <el-table-column
                        width="139"
                        prop="mobile"
                        label="联系电话">
                </el-table-column>
               <el-table-column label="操作" width="80px" align="center">
                   <template slot-scope="scope">
                       <a href="javascript:;" @click="confirmSelect(scope.row.cname,scope.row.userName)">确认</a>
                   </template>
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
            </div>
        </el-col>
        </el-row>
    </div>
</template>
<script>
    import util from '@/libs/util';
    export default {
        components: {

        },
        data () {
            return {
                ourtableData: [],
                id: '',
                userName: '',
                cname: '',
                orgIds:[],
                orgName: '',
                statusValue: '',
                pageNumber: 1,
                pageSize: 10,
                total: 1,
                radio: '',
                radioName: 'a1',
                radioLabel: false,
                managerName: '',
                condition: [],
                statusData: [],
                dirArry: ['status'],
                account: '',
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
                treeShowFlag: false
            };
        },
        mounted () {
            // this.queryList(1, 10);/// 初始化查询用户列表
            var that = this;
            document.onkeydown = function (event) {
                if (event.keyCode == '13') {
                    that.startQuery();
                }
            };
            // 解决表格表头错位的问题
            window.onresize = function () {
                setTimeout(function () {
                    var curTable = document.getElementById('curTable');
                    var thGutter = curTable.getElementsByClassName('gutter')[0];
                    thGutter.style.display = 'table-cell';
                }, 500);
            };
            // 获取当前页面所需数据字典数据
            util.getSelectData(this, this.dirArry);
            this.showTreeData();
        },
        methods: {
            getCurrentRow (val, account) {
                console.log('val---', val);
                this.managerName = val;
                this.account = account;
            },
            queryList (currentPage, currentSize, conditions) {
                if(conditions == undefined) {
                    conditions = []
                }
                var statusValueObj = {
                    'field': 'status',
                    "opt": "=",
                    'value':  'Y'
                };
                conditions.push(statusValueObj);
                var entity = {
                    'orgIds': this.orgIds
                };
                var params = {
                    'entity':entity,
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
                    url: this.permissionPrefix + '/microarch/sys/syscommon/findUsersByOrgOrUserName',
                    data: params
                }).then(res => {
                    console.log('res---------userList---', res);
                    if (res.data && res.data.rows) {
                        this.ourtableData = [];
                        this.total = parseInt(res.data.total);
                        for (var i = 0; i < res.data.rows.length; i++) {
                            var rowContent = {};
                            rowContent.id = res.data.rows[i].id ? res.data.rows[i].id : '';
                            rowContent.userName = res.data.rows[i].userName ? res.data.rows[i].userName : '';
                            rowContent.cname = res.data.rows[i].cname ? res.data.rows[i].cname : '';
                            rowContent.department = res.data.rows[i].orgs && res.data.rows[i].orgs[0] ? res.data.rows[i].orgs[0].orgName : '';
                            rowContent.mobile = res.data.rows[i].mobile ? res.data.rows[i].mobile : '';
                            rowContent.email = res.data.rows[i].email ? res.data.rows[i].email : '';
                            rowContent.status = res.data.rows[i].status == 'Y' ? '启用' : res.data.rows[i].status == 'N' ? '停用' : '';
                            rowContent.role = res.data.rows[i].roleNames ? res.data.rows[i].roleNames : '';
                            this.ourtableData.push(rowContent);
                        }
                        var that = this;
                        setTimeout(function () {
                            that.hideRadioLabel();// 隐藏radiobutton的label数字
                        }, 0);
                    }
                });
                setTimeout(function () {
                    var curTable = document.getElementById('curTable');
                    var thGutter = curTable.getElementsByClassName('gutter')[0];
                    thGutter.style.display = 'table-cell';
                }, 500);
            },
            handleSelectionChange (val) {
                this.multipleSelection = val;
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
                console.log('condition======', condition);
                this.condition = condition;
                this.queryList(1, 10, condition);
                this.pageNumber = 1;
                this.pageSize = 10;
            },
            confirmSelection () {
                this.$emit('getManagerName', this.managerName, this.account);
            },
            hideRadioLabel () {
                var labels = document.getElementsByClassName('el-radio__label');
                for (var i = 2; i < labels.length; i++) {
                    if (!isNaN(labels[i].innerText)) {
                        labels[i].style.display = 'none';
                    }
                }
            },
            selectCurrentLine (row, event, column) {
                // console.log('row--',row,'event--',event,'column--',column)
                this.getCurrentRow(row.cname, row.userName);
                this.radio = row.id;
                // this.$emit('getManagerName',this.managerName,this.userName)
            },
            confirmSelect (cname, userName) {
                this.managerName = cname;
                this.account = userName;
                this.$emit('getManagerName', cname, userName);
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
                    console.log('catch-------', err);
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
            handleNodeClick (data) {
                console.log(data);
                this.orgName = data.text
                this.orgIds = [data.id]
                // this.queryList(1, 10, condition);
            },
            getTree() {
                this.treeShowFlag = !this.treeShowFlag;
            },
            change(val) {
                if(val == '') {
                    this.orgIds = []
                }
            }
        }
    };
</script>
<style scoped>
    .el-message-box{
        width:600px;
        height:600px;
    }
    .commonTable{
        max-height:485px;
        overflow-y:auto;
        position:relative;
    }
    .inputPadding{
        padding-left:10px;
    }
    .setMinWidth{

    }
    .el-dialog__body{
        padding-bottom:10px;
    }
    .commonTable .el-radio__label{
        display:none;
    }
    .el-button.is-circle {
        padding: 7px;
    }

    .el-tooltip {

        height: 28px;
    }
</style>