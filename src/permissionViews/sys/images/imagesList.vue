<template>
    <div>
        <el-row>
            <el-col :span="24" style="background-color: white;padding:10px 20px;">

                <h2>
                    <div style="float: left;padding-top: 4px;padding-right: 5px;">
                        <img  :src="getNoticeUrl()"  width="16" height="16" />
                    </div>
                    <div>
                        <span style="float:left;height:32px;line-height: 32px;font-weight: normal;font-size: 14px;">图片管理</span>
                    </div>
                    <div class="tableBtn" style="float:right;padding:0;">
                        <el-button @click="addNewOrder" icon="el-icon-circle-plus-outline" size="small" type="primary">新增
                        </el-button>
                    </div>
                </h2>
                <el-form :model="form" label-width="80px" style="overflow: hidden;margin-bottom: 10px;">
                    <el-col :span="6" class="inputPadding" >
                        <el-form-item label="标题">
                            <el-input v-model="form.name" size="small" clearable></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6" class="inputPadding">
                        <el-form-item label="类型">
                            <el-select v-model="form.type" size="small" clearable>
                                <el-option
                                        v-for="item in typeOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :xs="20" class="inputPadding">
                        <el-button :span="6" :xs="20" type="primary" icon="el-icon-search" round @click.enter="search()" size="small" style="margin-top: 4px;">查询</el-button>
                    </el-col>
                </el-form>
                <my-table ref="imagesList" :myTableData="myTableData"></my-table>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import myTable from '@/components/myTableSys';

    export default {
        components: {
            myTable
        },
        data () {
            return {
                myTableData: {
                    right:true,
                    url: '/microarch/sys/images/list',
                    dlUrl: '/microarch/sys/images/delete',
                    viewName: 'sys/imagesView',
                    editName: 'sys/imagesEdit',
                    exportName: '轮播图信息.xlsx',
                    tableThead: [
                        {
                            headName: '选择',
                            headKey: '',
                            selectionCheckbox: true,
                            isHidden: true,
                            fixedColumn: true
                        },
                        {
                            headName: '序号',
                            headKey: 'pageIndex',
                            width: 22
                        },
                        {
                            headName: '标题',
                            headKey: 'name',
                            underline: true
                        },
                        {
                            headName: '类型',
                            headKey: 'typeText'
                        },
                        {
                            headName: '是否有效',
                            headKey: 'statusText'
                        },
                        {
                            headName: '备注',
                            headKey: 'remark'
                        }
                    ],
                    entity: {},
                    ext: [],
                    conditions: [],
                    pageRequest: {},
                    sortBy: {},
                    myorderBy: 'createTime desc'
                },
                form: {
                    name: '',
                    type: ''
                },
                managerIdData: [],
                statusData: [],
                typeData: [],
                typeOptions: [
                    {
                        value: '01',
                        label: '首页轮播'
                    },
                    {
                        value: '02',
                        label: '其他'
                    }
                ],
                condition: [], // 查询条件
                selectionData: []
            };
        },
        methods: {
            getNoticeUrl() {
                return require('@/images/task.png');
            },
            search () {
                var _this = this;
                var data = {};

                var myentity = [];
                if (this.form.name) {
                    myentity.push({'field': 'name', 'opt': 'like', 'value': _this.form.name, 'assemble': 'and'});
                }
                if (this.form.type) {
                    myentity.push({'field': 'type', 'opt': '=', 'value': _this.form.type, 'assemble': 'and'});
                }

                this.myTableData.where = myentity;
                this.$refs.imagesList.findAllProject(1);
            },
            addNewOrder () {
                this.$router.push({
                    name: 'sys/imagesEdit'
                });
            }
        },
        mounted: function () {
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

