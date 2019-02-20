<template>
    <div style="position: relative;">
        <el-row>
            <el-col :span="24">
                <div class="bgColor">
                    <el-row>
                        <el-form ref="form" label-width="80px">
                            <el-col :span="7" class="inputPadding">
                                <el-form-item label="流程key">
                                    <el-input v-model="key" placeholder="请输入流程key" clearable size="small"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" class="inputPadding">
                                <el-form-item label="流程名称">
                                    <el-input v-model="name" placeholder="请输入流程名" clearable size="small"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" class="inputPadding">
                                <el-form-item label="版本号">
                                    <el-input-number v-model="version" label="版本号" size="small"></el-input-number>
                                    <!--<el-input v-model="version" placeholder="请输入版本号" clearable size="small"></el-input>-->
                                </el-form-item>
                            </el-col>
                            <el-col :span="3" class="inputPadding">
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
                            :header-cell-style="{padding:'1px 0',background:'#dfebf9',fontSize:'12px'}"
                            :cell-style="{fontSize:'12px',padding:'8px 0'}"
                            @selection-change="handleSelectionChange"
                            @row-click="selectCurrentLine"
                            style="width: 100%">
                        <!--<el-table-column label="选择" width="55" :fixed="true">-->
                            <!--<template slot-scope="scope">-->
                                <!--<el-radio v-model="radio" :label="scope.row.id" :name="radioName" @change.native="getCurrentRow(scope.row.name,scope.row.version,scope.row.key)"></el-radio>-->
                            <!--</template>-->
                        <!--</el-table-column>-->
                        <el-table-column
                                width="240"
                                prop="key"
                                sortable
                                label="流程key">
                        </el-table-column>
                        <el-table-column
                                width="240"
                                prop="name"
                                sortable
                                label="流程名">
                        </el-table-column>
                        <el-table-column
                                width="110"
                                prop="version"
                                sortable
                                label="版本号">
                        </el-table-column>
                        <el-table-column
                                width="110"
                                prop="isSuspended"
                                sortable
                                label="状态">
                        </el-table-column>
                        <el-table-column
                                width="90"
                                label="操作">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    type="primary"
                                    title="选择"
                                    @click="handlesubmit(scope.row)"><i class="el-icon-circle-check" style="font-size: 11px"></i>
                            </el-button>
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
        <!--<div style="text-align: right;position:absolute;bottom:-15px;right:20px;">-->
            <!--<el-button type="primary" size="medium" @click="confirmSelection">确认</el-button>-->
        <!--</div>-->
    </div>
</template>
<script>
    import util from '../../../libs/util';
    export default {
        components: {

        },
        data () {
            return {
                ourtableData: [],
                id: '',
                key: '',
                backKey: '',
                name: '',
                version: '',
                isSuspended: '',
                pageNumber: 1,
                pageSize: 10,
                total: 1,
                radio: '',
                radioName: 'a1',
                radioLabel: false,
                procName: '',
                condition: [],
                procVersion: ''
            };
        },
        mounted () {
            this.queryList(1, 10);/// 初始化查询用户列表
            var that = this;
            document.onkeydown = function (event) {
                // console.log('keyCode---',event.keyCode)
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
            // util.getSelectData(this,this.dirArry)
        },
        methods: {
            getCurrentRow (val, procVersion, key) {
                this.procName = val;
                this.procVersion = procVersion;
                this.backKey = key;
            },
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
                    url: this.prefix + '/microarch/activiti/process/list',
                    data: params
                }).then(res => {
                    if (res.data && res.data.rows) {
                        this.ourtableData = [];
                        this.total = parseInt(res.data.total);
                        for (var i = 0; i < res.data.rows.length; i++) {
                            var rowContent = {};
                            rowContent.id = res.data.rows[i].id ? res.data.rows[i].id : '';
                            rowContent.key = res.data.rows[i].key ? res.data.rows[i].key : '';
                            rowContent.name = res.data.rows[i].name ? res.data.rows[i].name : '';
                            rowContent.version = res.data.rows[i].version ? res.data.rows[i].version : '';
                            rowContent.isSuspended = res.data.rows[i].isSuspended == 1 ? '激活' : '挂起';
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
                var key = this.key.replace(/^(\s)*|(\s)*$/g, '');
                var name = this.name.replace(/^(\s)*|(\s)*$/g, '');
                var version = this.version;
                if (key != '') {
                    var keyObj = {
                        'field': 'key',
                        'value': key
                    };
                    condition.push(keyObj);
                }
                if (name != '') {
                    var nameObj = {
                        'field': 'name',
                        'value': name
                    };
                    condition.push(nameObj);
                }
                if (version != '') {
                    var versionObj = {
                        'field': 'version',
                        'opt': '=',
                        'value': version
                    };
                    condition.push(versionObj);
                }
                this.condition = condition;
                this.queryList(1, 10, condition);
                this.pageNumber = 1;
                this.pageSize = 10;
            },
            confirmSelection () {
                this.$emit('getManagerName', this.procName, this.procVersion, this.backKey);
            },
            handlesubmit (row) {
                var _this = this;
                // _this.choicekey = row.key;
                // console.log("kankan",_this.choicekey);
                this.$emit('getManagerName', row.name, row.version, row.key);
            },
            hideRadioLabel () {
                var labels = document.getElementsByClassName('el-radio__label');
                for (var i = 2; i < labels.length; i++) {
                    // if(!isNaN(labels[i].innerText)){
                    labels[i].style.display = 'none';
                    // }
                }
            },
            selectCurrentLine (row, event, column) {
                this.getCurrentRow(row.name, row.version, row.key);
                this.radio = row.id;
                // this.$emit('getManagerName',this.managerName,this.userName)
            }
        }
    };
</script>
<style scoped>
    .el-message-box{
        width:800px;
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
</style>