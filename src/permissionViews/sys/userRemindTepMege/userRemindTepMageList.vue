<template>
    <div>
        <el-col :span="24" style="background-color: white;padding:10px 20px;">
            <h2>
                <div style="float: left;padding-top: 4px;padding-right: 5px;">
                    <img  :src="getNoticeUrl()"  width="16" height="16" />
                </div>
                <div>
                    <span style="float:left;height:32px;line-height: 32px;font-weight: normal;font-size: 14px;">用户提醒模板管理</span>
                </div>
                <div class="tableBtn" style="float:right;padding:0;">
                    <el-button @click="addUserRemindTepMage()" icon="el-icon-circle-plus-outline" size="small" type="primary">新增
                    </el-button>
                </div>
            </h2>
            <el-form ref="form" :model="form" label-width="80px" style="overflow: hidden;margin-bottom: 10px;">
                <el-col :span="6" :xs="20"  class="inputPadding">
                    <el-form-item label="模板名称">
                        <el-input v-model="form.chineseName" style="width: 95%" size="small"></el-input>
                    </el-form-item>

                </el-col>

                <el-col :span="6" :xs="20"  class="inputPadding">
                    <el-form-item label="模板类型">
                        <el-select v-model="form.templateType" placeholder="" size="small">
                            <el-option
                                    v-for="item in templateTypeData"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6" :xs="20" class="inputPadding">
                <el-button :span="3" :xs="20" type="primary" icon="el-icon-search" round @click="search()" size="small">查询</el-button>
                <el-button :span="3" :xs="20" type="primary" icon="el-icon-refresh" round @click="clearSearch()" size="small">重置</el-button>
                </el-col>
            </el-form>

            <my-table ref="tableProductLine" :myTableData="myTableData"></my-table>
        </el-col>
    </div>
</template>

<script>
    import util from '../../../libs/util';
    import myTable from '../../../components/myTableSys';
    export default {
        data () {
            return {
                myTableData: {
                    isHiddenView: 'true',
                    url: '/microarch/sys/sysUserTemplate/list',
                    dlUrl: '/microarch/sys/sysUserTemplate/del',
                    viewName: '',
                    editName: 'sys/editUserRemindTepMage',
                    exportName: '用户模板信息.xlsx',
                    actionWidth:90,
                    tableThead: [
                        {
                            headName: '序号',
                            headKey: 'pageIndex',
                            width: 30
                        },
                        {
                            headName: '模板类型',
                            headKey: 'templateValue',
                            underline: true
                        },
                        {
                            headName: '模板英文名称',
                            headKey: 'englishName'
                        },
                        {
                            headName: '模板名称',
                            headKey: 'chineseName'
                        }
                    ],
                    entity: {},
                    where: [],
                    conditions: [],
                    pageRequest: {},
                    myorderBy: 'lastmodifiedTime DESC'
                },
                templateTypeData: [],
                dirArry: ['templateType'],
                form: {
                    orgCode: '',
                    orgName: ''
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
                if (this.form.chineseName) {
                    myentity.push({'field': 'chineseName', 'opt': 'like', 'value': _this.form.chineseName, 'assemble': 'and'});
                }
                if (this.form.templateType) {
                    myentity.push({'field': 'templateType', 'opt': 'like', 'value': _this.form.templateType, 'assemble': 'and'});
                }
                this.myTableData.where = myentity;
                console.log('查询条件是', this.myTableData.where);
                this.$refs.tableProductLine.findAllProject(1);
            },
            clearSearch () {
                console.log(this.form.postType);
                this.form.chineseName = '';
                this.form.templateType = '';
            },
            addUserRemindTepMage: function () {
                this.$router.push({
                    name: 'sys/addUserRemindTepMage'
                });
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
        name: 'userRemindTepMageList'
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