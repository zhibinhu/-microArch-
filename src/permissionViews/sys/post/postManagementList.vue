<template>
    <div>
        <el-col :span="24" style="background-color: white;padding:10px 20px;">
            <h2>
                <div style="float: left;padding-top: 4px;padding-right: 5px;">
                    <img  :src="getNoticeUrl()"  width="16" height="16" />
                </div>
                <div>
                    <span style="float:left;height:32px;line-height: 32px;font-weight: normal;font-size: 14px;">岗位管理</span>
                </div>
                <div class="tableBtn" style="float:right;padding:0;">
                    <el-button v-hasPermission="'addPost'" @click="addPostManage()" icon="el-icon-circle-plus-outline" size="small" type="primary">新增
                    </el-button>
                </div>
            </h2>
            <el-form ref="form" :model="form" label-width="80px" style="overflow: hidden;margin-bottom: 10px;">
                <el-col :span="6" :xs="20" class="inputPadding">
                    <el-form-item label="岗位编码">
                        <el-input v-model="form.postCode" clearable size="small"></el-input>
                    </el-form-item>

                </el-col>

                <el-col :span="6" :xs="20" class="inputPadding">
                    <el-form-item label="岗位名称">
                        <el-input v-model="form.postName" clearable size="small"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="6" :xs="20" class="inputPadding">
                    <el-form-item label="状态">
                        <el-select v-model="form.status" placeholder="请选择状态" size="small" clearable>
                            <el-option
                                    v-for="item in statusData"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <!--<el-col :span="4" :xs="20" class="inputPadding">-->
                    <!--<el-form-item label="岗位类型">-->
                    <!--<el-select v-model="form.postType" placeholder="请选择岗位类型" size="small">-->
                        <!--<el-option-->
                                <!--v-for="item in postTypeData"-->
                                <!--:key="item.value"-->
                                <!--:label="item.label"-->
                                <!--:value="item.value">-->
                        <!--</el-option>-->
                    <!--</el-select>-->
                    <!--</el-form-item>-->
                <!--</el-col>-->
                <el-col :span="6" :xs="20" class="inputPadding">
                <el-button :span="2" :xs="20" type="primary" icon="el-icon-search" round @click="search()" size="small" style="margin-top: 4px;">查询</el-button>
                <el-button :span="2" :xs="20" type="primary" icon="el-icon-refresh" round @click="clearSearch()" size="small" style="margin-top: 4px;">重置</el-button>
                </el-col>
            </el-form>

            <my-table ref="tablePostLine" :myTableData="myTableData"></my-table>
        </el-col>

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
                    url: '/microarch/sys/syspost/list',
                    dlUrl: '/microarch/sys/syspost/delete',
                    viewName: 'sys/detailPostManagement',
                    editName: 'sys/editPostManagement',
                    exportName: '岗位信息.xlsx',
                    tableThead: [
                        {
                            headName: '序号',
                            headKey: 'pageIndex',
                            width: 22
                        },
                        {
                            headName: '岗位编码',
                            headKey: 'postCode',
                            underline: true
                        },
                        {
                            headName: '岗位名称',
                            headKey: 'postName'
                        },
                        {
                            headName: '排序号',
                            headKey: 'orderNum'
                        },
                        {
                            headName: '状态',
                            headKey: 'status',
                            orgStatus: true,
                            width: 50,
                            dirKey: true
                        },
                        {
                            headName: '岗位分类',
                            headKey: 'postType',
                            dirKey: true
                        }
                    ],
                    entity: {},
                    where: [],
                    conditions: [],
                    pageRequest: {},
                    myorderBy: 'lastmodifiedTime DESC'
                },
                postTypeData: [],
                statusData: [],
                // dirArry:['postType','status'],
                dirArry: ['status'],
                form: {
                    postCode: '',
                    postName: '',
                    postType: '',
                    status: ''
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
                if (this.form.postCode) {
                    myentity.push({'field': 'postCode', 'opt': 'like', 'value': _this.form.postCode, 'assemble': 'and'});
                }
                if (this.form.postName) {
                    myentity.push({'field': 'postName', 'opt': 'like', 'value': _this.form.postName, 'assemble': 'and'});
                }
                // if (this.form.postType) {
                //     myentity.push({"field":'postType',"opt": "like","value":_this.form.postType,"assemble": "and"});
                // }
                if (this.form.status) {
                    myentity.push({'field': 'status', 'opt': 'like', 'value': _this.form.status, 'assemble': 'and'});
                }
                this.myTableData.where = myentity;
                console.log('查询条件是', this.myTableData.where);
                this.$refs.tablePostLine.findAllProject(1);
                /* this.conditions=myconditions;
                 this.mypage=0;
                 this.mysize=10; */

                /* this.findAllProject(this.conditions,this.mypage,this.mysize,this.direction,this.field); */
            },

            clearSearch () {
                console.log(this.form.postType);
                this.form.postCode = '';
                this.form.postName = '';
                // this.form.postType = '';
                this.form.status = '';
            },

            addPostManage: function () {
                this.$router.push({
                    name: 'sys/addPostManagement'
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