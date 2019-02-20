<template>

    <div>
        <el-col :span="24" style="background-color: white;padding:10px 20px;">
            <h2>
                <div style="float: left;padding-top: 4px;padding-right: 5px;">
                    <img  :src="getNoticeUrl()"  width="16" height="16" />
                </div>
                <div>
                    <span style="float:left;height:32px;line-height: 32px;font-weight: normal;font-size: 14px;">工单和流程映射</span>
                </div>
                <div class="tableBtn" style="float:right;padding:0;">
                    <el-button @click="addForm()" size="small" type="primary">新增工单
                    </el-button>
                </div>
            </h2>
            <el-form ref="form" :model="form" label-width="80px" style="margin-top: 20px;margin-bottom: 20px">
                <el-col :span="6" :xs="20">
                    <el-form-item label="单据类型">
                        <el-select v-model="form.woType" placeholder="" size="small" style="width: 95%">
                            <el-option
                                    v-for="item in woTypeData"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="5" :xs="20">
                    <el-form-item label="流程名称">
                        <el-input v-model="form.procName" clearable style="width: 95%" size="small"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="6" :xs="20" class="inputPadding">
                    <el-button :span="2" :xs="20" type="primary" icon="el-icon-search" round @click="search()" size="small">查询</el-button>
                    <el-button :span="2" :xs="20" type="primary" icon="el-icon-refresh" round @click="clearSearch()" size="small">重置</el-button>
                </el-col>
            </el-form>

            <my-table ref="tableProductLine" :myTableData="myTableData"></my-table>
        </el-col>
       <!--changeck   @row-click="changeck"    -->
    </div>
</template>

<script>
            import myTable from '../../../components/myTableSys';
            import util from '../../../libs/util';
            export default {
                data () {
            return {
                        myTableData: {
                            right:true,
                            isHiddenView: 'true',
                            actionWidth:90,
                            url: '/microarch/activiti/mapping/list',
                            dlUrl: '/microarch/activiti/mapping/del',
                            viewName: '',
                            editName: 'workFlow/mapping/formCnfEdit',
                            exportName: '工单和流程映射信息.xlsx',
                            tableThead: [
                                {
                                    headName: '选择',
                                    headKey: '',
                                    selectionCheckbox: true,
                                    radio: true,
                                    selection: true,
                                    isHidden: true,
                                    fixedColumn: true
                                },
                                {
                                    headName: '序号',
                                    headKey: 'pageIndex',
                                    width: 22
                                },
                                {
                                    headName: '流程名称',
                                    headKey: 'procName',
                                    underline: true

                                },
                                {
                                    headName: '流程key',
                                    headKey: 'procKey'
                                },
                                {
                                    headName: '版本',
                                    headKey: 'procVersion'
                                },
                                {
                                    headName: '单据类型',
                                    headKey: 'woName',
                                    underline: true

                                },
                                {
                                    headName: 'URL',
                                    headKey: 'woUrl'

                                }
                            ],
                            entity: {},
                            where: [],
                            conditions: [],
                            pageRequest: {},
                            myorderBy: 'lastmodifiedTime DESC'
                        },
                        woTypeData: [],
                        // dirArry:['postType','status'],
                        dirArry: ['woType'],
                        form: {
                            procName: '',
                            woCode: ''
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
                        console.log(this.form.postType);
                        this.form.woType = '';
                        this.form.procName = '';
            },
            // 搜索方法
            search () {
                        var _this = this;
                        var myentity = [];
                        if (this.form.woType) {
                            myentity.push({'field': 'woCode', 'opt': 'like', 'value': _this.form.woType, 'assemble': 'and'});
                        }
                        if (this.form.procName) {
                            myentity.push({'field': 'procName', 'opt': 'like', 'value': _this.form.procName, 'assemble': 'and'});
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
                            name: 'workFlow/mapping/formCnfAdd',
                            query: {
                                'addFlag': true
                            }
                        });
            },
            getSelectionData (val) {
                        this.multipleSelection = val;
            }
    },

    mounted: function () {
            // 获取当前页面所需数据字典数据
            util.getSelectData(this, this.dirArry);
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