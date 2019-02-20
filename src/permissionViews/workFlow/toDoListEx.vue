<template>
    <div>

        <el-col :span="24" style="background-color: white">
            <el-form ref="form" :model="form" label-width="80px" style="margin-top: 20px;margin-bottom: 20px">

                <el-col :span="6"  class="inputPadding">
                    <el-form-item label="申请人">
                        <el-input v-model="form.applye" style="width: 95%" size="small"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6"  class="inputPadding">
                    <el-form-item label="紧急程度">
                        <el-select v-model="form.priority" placeholder="请选择" clearable size="small">
                            <el-option label="一般" value="50"></el-option>
                            <el-option label="紧急" value="100"></el-option>
                            <el-option label="特急" value="150"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6" class="inputPadding">
                    <el-form-item label="状态">
                        <el-select v-model="form.status" placeholder="请选择" clearable size="small">
                            <el-option label="待办" value="0"></el-option>
                            <el-option label="签收" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>&nbsp;&nbsp;

                <el-button :span="4" :xs="20" type="primary" @click="search()" size="small">查询</el-button>
                <!--
                <el-button :span="4" :xs="20" type="primary" @click="clearSearch()" size="small">重置</el-button>
                -->
            </el-form>
        </el-col>


        <el-button @click="toDo()" size="small" type="primary"
                   style="margin-top: 20px;margin-bottom: 10px">查看
        </el-button>
        <el-button @click="toDo()" size="small" type="primary"
                   style="margin-top: 20px;margin-bottom: 10px">流程跟踪
        </el-button>



        <my-table ref="tableProductLine" :myTableData="myTableData"></my-table>
    </div>
</template>


<script>
    import myTable from '../../components/myTableSys';
    import Cookies from 'js-cookie';
    export default {
        data () {
            return {
                myTableData: {
                    // url:'/activiti/task/haveList/'+Cookies.get('userName'),
                    url: '/microarch/activiti/task/toDoListEx/liuhu', // +Cookies.get('userName'),
                    dlUrl: '',
                    viewName: 'viewOrder',
                    editName: 'viewOrder',
                    isHiddendelete: true,
                    isHiddenView: true,
                    tableThead: [
                        {
                            headName: '序号',
                            headKey: 'taskId',
                            width: 30
                        },
                        {
                            headName: '优先级',
                            headKey: 'priority'
                        },

                        {
                            headName: '业务名称',
                            headKey: 'businessInfo'
                        },
                        {
                            headName: '当前节点',
                            headKey: 'name'
                        },
                        {
                            headName: '开始时间',
                            headKey: 'createTime'
                        }

                        /**

                        {
                            headName: '办理节点',
                            headKey: 'taskName'
                        },
                        {
                            headName: '开始时间',
                            headKey: 'startTime'
                        },
                        {
                            headName: '结束时间',
                            headKey: 'endTime'
                        }**/

                    ],
                    entity: {'assignee': 'liuhu'},
                    where: [],
                    conditions: [],
                    pageRequest: {},
                    myorderBy: 'id DESC'
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

        methods: {
            search () {
                var _this = this;
                var myentity = [];
                if (this.form.applye) {
                    // myentity.push({"field":'t.assignee_',"opt": "like","value":_this.form.applye,"assemble": "and"});

                    myentity.push({'field': 'u.FIRST_', 'opt': 'like', 'value': _this.form.applye, 'assemble': 'and'});
                }
                if (this.form.priority) {
                    myentity.push({'field': 't.PRIORITY_', 'opt': 'like', 'value': _this.form.priority, 'assemble': 'and'});
                }
                /** if (this.form.status) {
                    myentity.push({"field":'status',"opt": "like","value":_this.form.status,"assemble": "and"});

                }**/

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
            }

        },
        mounted: function () {},
        filters: {

        }

    };
</script>