<template>
    <div>
        <el-row>
            <el-col :span="24" style="background-color: white;padding:10px 20px;">
                <h2>
                    <div style="float: left;padding-top: 4px;padding-right: 5px;">
                        <img  :src="getNoticeUrl()"  width="16" height="16" />
                    </div>
                    <div>
                        <span style="float:left;height:32px;line-height: 32px;font-weight: normal;font-size: 14px;">流程委托</span>
                    </div>
                    <div class="tableBtn" style="float:right;padding:0;">
                        <el-button @click="addEntrustProcess()" icon="el-icon-circle-plus-outline" size="small" type="primary" >添加委托
                        </el-button>
                    </div>
                </h2>
                <el-form :model="form" label-width="80px" style="overflow: hidden;margin-bottom: 10px;">

                <el-col :span="6" :xs="20" class="inputPadding">
                    <el-form-item label="委托人">
                        <el-input v-model="form.consigner" style="display: none;"  size="small"></el-input>
                        <div @click="showConsignerDialog">
                            <el-input v-model="consignerName"
                                      placeholder="请选择传委托人"
                                      ref="readersInput"
                                      clearable
                                      style="width: 80%" :readonly="readonly" size="small"></el-input>
                            <i style="padding-left: 3px;" @click="showConsignerDialog" class="el-icon-search" ></i>
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="6" :xs="20" class="inputPadding">
                    <el-button :span="6" :xs="20" type="primary" icon="el-icon-search" round @click.enter="search()" size="small" style="margin-top: 4px;">查询</el-button>
                    <el-button type="primary" icon="el-icon-refresh" size="small" round @click="resetDialog" style="margin-left: 8px">重置</el-button>
                </el-col>
            </el-form>
            <my-table ref="tableProductLine" :myTableData="myTableData"></my-table>

            </el-col>
            <el-dialog top="8vh" width="80%" title="请选择委托人"  class="ems-dialog" :visible.sync="dialogConsignerVisible" append-to-body :modal-append-to-body="false">
                <manager-list @getManagerName="showConsignerName" id="formStyle1"></manager-list>
            </el-dialog>
        </el-row>
    </div>
</template>

<script>
    import myTable from '../../../components/myTableSys';
    import managerList from '../../sys/user/managerList';

    export default {
        name: 'entrustProcessList',
        data () {
            return {
                myTableData: {
                    right:true,
                    actionWidth:90,
                    url: '/microarch/activiti/delegate/list',
                    dlUrl: '/microarch/activiti/delegate/del',
                    viewName: 'workFlow/entrustProcessView',
                    editName: 'workFlow/entrustProcessView',
                    isHiddenEdit:true,
                    editBtnHidden:true,
                    exportName: '任务委派信息.xlsx',
                    tableThead: [
                        {
                            headName: '序号',
                            headKey: 'pageIndex',
                            width: 22
                        },
                        {
                            headName: '工单类型',
                            headKey: 'woName'
                        },
                        {
                            headName: '委托人',
                            headKey: 'consignerName',
                            width: 50
                        },
                        {
                            headName: '受委托人',
                            headKey: 'mandataryName',
                            width: 50
                        },
                        {
                            headName: '开始日期',
                            headKey: 'beginDateText'
                        },
                        {
                            headName: '结束日期',
                            headKey: 'endDateText'
                        },
                        {
                            headName: '运行标志',
                            headKey: 'activeText',
                            width: 50
                        }
                    ],
                    entity: {},
                    where: [],
                    conditions: [],
                    pageRequest: {},
                    myorderBy: 'lastmodifiedTime DESC'
                },
                form: {
                    consigner: ''
                },
                orders: [],
                total: 1,
                pageNumber: 1,
                pageSize: 10,
                condition: [], // 查询条件
                dialogConsignerVisible: false,
                consignerName: '',
                readonly: true

            };
        },
        components: {
            myTable, managerList
        },
        created () {
            this.findOrder();
        },
        methods: {
            getNoticeUrl() {
                return require('@/images/task.png');
            },
            search () {
                var _this = this;
                var myentity = [];
                if(!this.consignerName) {
                    this.form.consigner = ''
                }
                if (this.form.consigner) {
                    myentity.push({'field': 'consigner', 'opt': '=', 'value': _this.form.consigner, 'assemble': 'and'});
                }
                this.myTableData.where = myentity;
                console.log('查询条件是', this.myTableData.where);
                this.$refs.tableProductLine.findAllProject(1);
            },
            addEntrustProcess () {
                this.$router.push({
                    name: 'workFlow/addEntrustProcess'
                });
            },
            findOrder () {
                var that = this;
                this.$myHttp({
                    method: 'post',
                    url: this.permissionPrefix + '/microarch/sys/sysDictHead/findByDcode',
                    data: {
                        'entity': {
                            'dtype': 'BPM_ORDER_TYPE'
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
                    that.orders = resArry;
                });
            },
            showConsignerDialog () {
                this.dialogConsignerVisible = true;
            },

            showConsignerName (cName, userName) {
                this.form.consigner = userName;
                this.consignerName = cName;
                this.dialogConsignerVisible = false;
            },
            resetDialog () {
                var _this = this;
                setTimeout(function () {
                    _this.form.consigner = '';
                    _this.consignerName = '';

                }, 100);
            }
        },
        mounted: function () {},
        filters: {}
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