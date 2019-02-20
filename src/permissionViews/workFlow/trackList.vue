<template>

    <div>

        <img :src="taskListDate.imgSrc" width="80%" height="80%" />
        <!--changeck   @row-click="changeck"    -->
        <my-table  @getSelectionData ="getSelectionData" ref="tableProductLine" :myTableData="myTableData"  ></my-table>
    </div>


</template>

<script>
    import myTable from '../../components/myTableSys'
    export default {
        props: {
            processInstanceId: {
                type: String
            }
        },
        data () {
            return {
                routeParamsDate:[],
                pid:'',
                myTableData:{
                    hiddenAction:true,
                    url: '',  //this.$route.params.routeParamsPid,
                    dlUrl: '',
                    viewName: '',
                    editName: '',
                    tableThead: [
                        {
                            headName: '序号',
                            headKey: 'pageIndex',
                            align:'center',
                            width: 20
                        },
                        {
                            headName: '处理人',
                            headKey: 'assignee',
                            width: 55,
                            unSort:true
                        },
                        {
                            headName: '审批节点',
                            headKey: 'name',
                            unSort:true,
                            showToolTipFlag:true,
                            width: 80
                        },

                        {
                            headName: "审批动作",
                            headKey: "option",
                            width: 50,
                            unSort:true
                        },
                        // {
                        //     headName: '任务开始时间',
                        //     headKey: 'startTime',
                        //     width: 60,
                        //     unSort:true
                        // },
                        {
                            headName: '审批时间',
                            headKey: 'endTime',
                            width: 70,
                            unSort:true
                        },
                        {
                            headName: '审批内容',
                            headKey: 'comments',
                            showToolTipFlag:true,
                            unSort:true
                        }
                    ],

                    entity: {},
                    where:[],
                    conditions: [],
                    pageRequest: {},
                    myorderBy: 'id DESC',
                    selectedMenuId:'',
                    selectedMenu:'',
                    multipleSelection:[],
                    pid:'',
                    taskId:'',
                    hiddenPagination:true
                },
                form:{
                    orgCode:'',
                    orgName:''
                },
                total:1,
                pageNumber:1,
                pageSize:10,
                condition:[],//查询条件
                iconImg: "",//存放src的变量
            }


        },

        components: {
            myTable
        },
        created: function () {
            this.pid = this.processInstanceId
            this.myTableData.url = '/microarch/activiti/task/trace/list/'+this.pid
            this.myTableData.tableThead[3].headKey = this.taskListDate.showHisStatus ? 'approvalStatus' : 'option'
            this.myTableData.tableThead[3].headName = this.taskListDate.showHisStatus ? '审批状态' : '审批动作'
        },
        watch: {
            processInstanceId(curVal, oldVal) {
                console.log(curVal, oldVal);
                console.log(this.myTableData.url);
                this.myTableData.url = '/microarch/activiti/task/trace/list/'+curVal
                this.$refs.tableProductLine.findAllProject();

            }
        },
        //applye2
        methods: {
            search(){
                var _this = this;
                var myentity=[];
                if (this.form.priority) {
                    myentity.push({"field":'priority',"opt": "like","value":_this.form.priority,"assemble": "and"});
                }

                this.myTableData.where=myentity;
                console.log("查询条件是",this.myTableData.where);
                this.$refs.tableProductLine.findAllProject(1);
                /* this.conditions=myconditions;
                this.mypage=0;
                this.mysize=10;
                */
                /* this.findAllProject(this.conditions,this.mypage,this.mysize,this.direction,this.field);*/
            },


            getMenuId(val){
                console.log('getMenu-----',val);
                this.selectedMenu=val;
                this.selectedMenuId=val.id;
            },

            getSelectionData(val) {
                this.multipleSelection = val;
                /**if(val!=null){
                  console.log("===",val[0].id)
                }**/
                console.log("getSelectionData==",this.multipleSelection[0].id)
            }
        },
        mounted: function () {
            //this.routeParamsDate = this.$route.params.routeParams;
            this.taskId=this.$route.params.routeParams;
            this.pid=this.$route.params.routeParamsPid;
            this.myTableData.url=this.taskListDate.trackListUrl;
            if(this.processInstanceId != '') {
                this.myTableData.url= '/microarch/activiti/task/trace/list/'+ this.processInstanceId
            }
            this.$refs.tableProductLine.findAllProject();
            console.log('litan',this.taskListDate.trackListUrl)
            console.log('this.taskListDate----,',this.taskListDate)
        },

        filters:  {
        },
        props:['taskListDate','processInstanceId'],

    }
</script>