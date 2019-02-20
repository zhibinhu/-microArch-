<template>

    <div>
        <el-col :span="24" style="background-color: white;padding:10px 20px;">
            <h2>
                <div style="float: left;padding-top: 4px;padding-right: 5px;">
                    <img  :src="getNoticeUrl()"  width="16" height="16" />
                </div>
                <div>
                    <span style="float:left;height:32px;line-height: 32px;font-weight: normal;font-size: 14px;">流程规则</span>
                </div>
                <div class="tableBtn" style="float:right;padding:0;">
                    <el-button @click="addForm()" icon="el-icon-circle-plus-outline" size="small" type="primary">新增
                    </el-button>
                </div>
            </h2>
            <el-form ref="form" :model="form" label-width="80px" style="overflow: hidden;margin-bottom: 10px;">
                <el-col :span="6" :xs="20" class="inputPadding">
                    <el-form-item label="工单类型">
                        <el-input v-model="form.orderType" size="small" clearable></el-input>
                    </el-form-item>

                </el-col>

                <el-col :span="6" :xs="20" class="inputPadding">
                    <el-form-item label="流程名称">
                        <el-input v-model="form.processName" size="small" clearable></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="6" :xs="20" class="inputPadding">
                    <el-button :span="6" :xs="20" type="primary" icon="el-icon-search" round @click.enter="search()" size="small" style="margin-top: 4px;">查询</el-button>
                </el-col>
            </el-form>

            <my-table ref="tableProductLine" :myTableData="myTableData"></my-table>
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
                    actionWidth:90,
                    isHiddenView: 'true',
                    url: '/microarch/activiti/rule/list',
                    dlUrl: '/microarch/activiti/rule/del',
                    viewName: '',
                    editName: 'workFlow/custRule/custRuleEdit',
                    exportName: '流程规则信息.xlsx',
                    tableThead: [
                        {
                            headName: '序号',
                            headKey: 'pageIndex',
                            width: 22
                        },
                        {
                            headName: '工单类型',
                            headKey: 'orderType',
                            underline: true
                        },
                        {
                            headName: '流程名称',
                            headKey: 'processName'
                        },
                        {
                            headName: '流程key',
                            headKey: 'processKey'
                        },
                        {
                            headName: '版本',
                            headKey: 'processVersion'
                        },
                        {
                            headName: '节点编码',
                            headKey: 'nodeCode'

                        },
                        {
                            headName: '节点名称',
                            headKey: 'nodeName'
                        }
                    ],
                    entity: {},
                    where: [],
                    conditions: [],
                    pageRequest: {},
                    myorderBy: 'lastmodifiedTime DESC'
                },
                form: {
                    orderType: '',
                    processName: ''
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
        // applye2
        methods: {
            getNoticeUrl() {
                return require('@/images/task.png');
            },
            // 清除查询条件
            clearSearch () {
                this.form.orderType = '';
                this.form.processName = '';
            },
            // 搜索方法
            search () {
                var _this = this;
                var myentity = [];
                if (this.form.orderType) {
                    myentity.push({'field': 'orderType', 'opt': 'like', 'value': _this.form.orderType, 'assemble': 'and'});
                }
                if (this.form.processName) {
                    myentity.push({'field': 'processName', 'opt': 'like', 'value': _this.form.processName, 'assemble': 'and'});
                }
                this.myTableData.where = myentity;
                console.log('查询条件是', this.myTableData.where);
                this.$refs.tableProductLine.findAllProject(1);
                /* this.conditions=myconditions;
                this.mypage=0;
                this.mysize=10;
                */
                /* this.findAllProject(this.conditions,this.mypage,this.mysize,this.direction,this.field); */
            },
            addForm: function () {
                this.$router.push({
                    name: 'workFlow/custRule/custRuleEdit',
                    query: {
                        'addFlag': true
                    }
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
        name: 'custRuleList'
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