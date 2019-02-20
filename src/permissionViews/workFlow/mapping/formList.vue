<template>
    <div>
        <el-button @click="addForm()" size="small" type="primary"
                   style="margin-top: 20px;margin-bottom: 10px">配置业务表单
        </el-button>
       <!--changeck   @row-click="changeck"    -->
        <my-table  @getSelectionData ="getSelectionData" ref="tableProductLine" :myTableData="myTableData"  ></my-table>
    </div>
</template>

<script>
    import myTable from '../../../components/myTableSys';
    export default {
        data () {
            return {
                myTableData: {
                    hiddenAction: true,
                    url: '/microarch/activiti/model/modelList',
                    dlUrl: '',
                    viewName: '',
                    editName: '',
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
                            headKey: 'id',
                            width: 28
                        },
                        {
                            headName: '流程名称',
                            headKey: 'name'
                        },
                        {
                            headName: 'KEY',
                            headKey: 'key'

                        },
                        {
                            headName: '版本号',
                            headKey: 'version',
                            width: 35
                        },
                        {
                            headName: '创建时间',
                            headKey: 'createTime'

                        },
                        {
                            headName: '更新时间',
                            headKey: 'lastUpdateTime'

                        }

                    ],

                    entity: {},
                    where: [],
                    conditions: [],
                    pageRequest: {},
                    myorderBy: 'id DESC',
                    selectedMenuId: '',
                    selectedMenu: '',
                    multipleSelection: []

                },
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
        // applye2
        methods: {
            search () {
                var _this = this;
                var myentity = [];
                if (this.form.priority) {
                    myentity.push({'field': 'priority', 'opt': 'like', 'value': _this.form.priority, 'assemble': 'and'});
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

            toSign: function () {
                this.$router.push({
                    name: 'toSign'
                });
            },
            toDo: function () {
                this.$router.push({
                    name: 'toDo'
                });
            },
            getMenuId (val) {
                console.log('getMenu-----', val);
                this.selectedMenu = val;
                this.selectedMenuId = val.id;
            },
            addForm: function () {
                this.$router.push({
                    name: 'workFlow/mapping/addForm',
                    'params': {
                        routeParams: this.multipleSelection

                    }
                });
            },
            getSelectionData (val) {
                this.multipleSelection = val;
                /** if(val!=null){
                  console.log("===",val[0].id)
                }**/
                console.log('getSelectionData==', this.multipleSelection[0].id);
            }

        },
        mounted: function () {},
        filters: {

        }
    };
</script>

