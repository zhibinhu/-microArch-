<template>
    <div>
        <el-row>
            <el-col :span="24" style="background-color: white;padding:10px 20px;">

                <h2>
                    <div style="float: left;padding-top: 4px;padding-right: 5px;"><img  :src="getNoticeUrl()"  width="16" height="16" /></div><div><span style="float:left;height:32px;line-height: 32px;font-weight: normal;font-size: 14px;">扩展字段信息</span></div>

                    <!--<span style="float:left;height:32px;line-height: 32px;font-weight: normal;font-size: 14px;">扩展字段管理</span>-->
                    <div class="tableBtn" style="float:right;padding:0;">
                        <el-button @click="addNewOrder" icon="el-icon-circle-plus-outline" size="small" type="primary">新增
                        </el-button>
                    </div>
                </h2>
                <el-form :model="form" label-width="100px" style="overflow: hidden;margin-bottom: 10px;">
                    <el-col :span="6" class="inputPadding" >
                        <el-form-item label="扩展对象">
                            <el-select v-model="form.cfObjCode"  size="small" clearable>
                                <el-option
                                        v-for="item in objects"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6" class="inputPadding">
                        <el-form-item label="字段类型">
                            <el-select size="small" v-model="form.cfCfieldType"   clearable style="width:100%;">
                                <el-option label="文本类型" value="Text"></el-option>
                                <el-option label="日期类型" value="Date"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" class="inputPadding">
                        <el-form-item label="字段显示名">
                            <el-input v-model="form.cfCfieldLabel" size="small" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :xs="20" class="inputPadding">
                        <el-button :span="6" :xs="20" type="primary" icon="el-icon-search" round @click.enter="search()" size="small" style="margin-top: 4px;">查询</el-button>
                    </el-col>
                </el-form>
                <my-table ref="cfieldsList" :myTableData="myTableData"  @getSelectionData="getSelectionData"></my-table>
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
                    url: '/microarch/sys/cfields/list',
                    dlUrl: '/microarch/sys/cfields/delete',
                    viewName: 'sys/cfieldsView',
                    editName: 'sys/cfieldsEdit',
                    exportName: '扩展字段信息.xlsx',
                    tableThead: [
                        {
                            headName: '序号',
                            headKey: 'pageIndex',
                            width: 22
                        },
                        {
                            headName: '字段显示名',
                            headKey: 'cfCfieldLabel',
                            underline: true
                        },
                        {
                            headName: '数据库字段',
                            headKey: 'cfCfieldColumn'
                        },
                        {
                            headName: '字段显示类型',
                            headKey: 'cfCfieldType'
                        },
                        {
                            headName: '扩展对象',
                            headKey: 'cfObjName'
                        },
                        {
                            headName: '排序号',
                            headKey: 'sort'
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
                    cfCfieldLabel: '',
                    cfCfieldColumn: '',
                    cfObjCode: '',
                    cfCfieldType: '',
                    cfCfieldName: ''
                },
                managerIdData: [],
                statusData: [],
                typeData: [],
                typeOptions: [
                    {
                        value: '01',
                        label: '公告'
                    }, {
                        value: '02',
                        label: '用户手册'
                    }, {
                        value: '03',
                        label: '模版'
                    }
                ],
                condition: [], // 查询条件
                selectionData: [],
                objects: []
            };
        },
        methods: {
            getNoticeUrl() {
                return require('@/images/task.png');
            },
            getSelectionData (val) {
                this.selectionData = val;
            },
            search () {
                var _this = this;
                var data = {};
                var myentity = [];
                if (this.form.cfCfieldLabel) {
                    myentity.push({'field': 'cfCfieldLabel', 'opt': 'like', 'value': _this.form.cfCfieldLabel, 'assemble': 'and'});
                }
                if (this.form.cfObjCode) {
                    myentity.push({'field': 'cfObjCode', 'opt': 'like', 'value': _this.form.cfObjCode, 'assemble': 'and'});
                }
                if (this.form.cfCfieldType) {
                    myentity.push({'field': 'cfCfieldType', 'opt': 'like', 'value': _this.form.cfCfieldType, 'assemble': 'and'});
                }
                this.myTableData.where = myentity;
                this.$refs.cfieldsList.findAllProject(1);
            },
            addNewOrder () {
                this.$router.push({
                    name: 'sys/cfieldsEdit'
                });
            },
            findObject () {
                var that = this;
                this.$myHttp({
                    method: 'post',
                    url: this.permissionPrefix + '/microarch/sys/sysDictHead/findByDcode',
                    data: {
                        'entity': {
                            'dtype': 'ExtendedTable'
                        }
                    }
                }).then(resp => {
                    var resArry = [];
                    for (var d = 0, len = resp.data.entity.sysDicts.length; d < len; d++) {
                        resArry.push({
                            value: resp.data.entity.sysDicts[d].dkey,
                            label: resp.data.entity.sysDicts[d].dvalue
                        });
                    }
                    that.objects = resArry;
                });
            }
        },
        mounted: function () {
            this.findObject();
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

