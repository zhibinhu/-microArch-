<template>
    <div style="background-color: white">

    <div>

        <el-form ref="form" :model="form" label-width="100px">

            <el-row style="padding-left: 480px;padding-top:5px;padding-bottom: 10px;">
                <span style="font-size:24px;color: #333;padding-top: 10px;padding-bottom: 10px;">差旅费用报销申请单</span>
            </el-row>

            <el-row style="padding-left: 320px;" >
                <el-col :span="8" >
                    <el-form-item label="流水号" >
                       <div style="dispaly:inline-block;border-bottom: 1px solid;">{{form.orderCode}}</div>
                    </el-form-item>
                </el-col>
                <el-col :span="8"  >
                    <el-form-item label="单据类型">
                        <div style="dispaly:inline-block;border-bottom: 1px solid;">{{form.orderType}}</div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row style="padding-left: 320px;">
                <el-col :span="8">
                    <el-form-item label="报销申请日期" :span="12">
                        <div style="border-bottom: 1px solid "> {{form.applyDate | applyDateFil}}</div>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="报销人" prop="reimburseBy">
                        <div style="border-bottom: 1px solid">{{form.reimburseBy}}</div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row style="padding-left: 320px;">
                <el-col :span="8">
                    <el-form-item label="报销部门">
                        <div style="border-bottom: 1px solid">{{form.reimburseDept}}</div>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="费用类别" prop="feeType">
                        <div style="border-bottom: 1px solid">{{form.feeType}}</div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row style="padding-left: 320px;">

                <el-col :span="8" >
                    <el-form-item label="费用金额(元)" prop="feeAmount">
                        <div style="border-bottom: 1px solid"> {{form.feeAmount | rounding}}</div>
                    </el-form-item>
                </el-col>
                <el-col :span="8"  >
                    <el-form-item label="状态" prop="status">
                        <div style="border-bottom: 1px solid">{{form.status | statusFil}}</div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row style="padding-left: 320px;">
                <el-col :span="16">
                    <el-form-item label="备注" prop="remark">
                        <div style="border-bottom: 1px solid"> {{form.remark}}</div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row  style="padding-left: 180px;" v-show="showAttach">
                <el-col :span="24">
                    <template :span="20" slot="title">
                        <div class="moduleTit">
                            <h3>
                                <span class="infoTit">附件</span>
                            </h3>
                        </div>
                    </template>
                    <my-upload  :bisinessId="form.id" :viewPageFlag="viewFlag"></my-upload>
                </el-col>
            </el-row>
        </el-form>

    </div>
        <div style="padding-bottom: 10px;padding-top: 10px;text-align:center;">
            <!--<my-approval-btn ref="orderView" :businessKey="form.id" :processInstanceName="form.processInstanceName" :processKey="form.processKey" :processInstanceId="form.processInstanceId" :taskInstanceId="form.taskInstanceId" :currentNode="form.currentNode" :variables="form.variables"  :isFirstNode="form.isFirstNode" :taskType="taskType" :isWithDraw="isWithDraw" :activityId="activityId" :currentActivityId="currentActivityId" @processCallback="processCallback" @checkBeforeProcess="checkBeforeProcess" v-show="showApproval"></my-approval-btn>-->
            <!--
                processKey 流程图key
                woCode 工单编码-需在“工单与流程映射”中配置
                taskInstanceId 从待办，已办页面进入时获取任务ID 发起流程是没有可为空
                taskType    任务类型 已办还是待办 从待办已办进入时可以获取 发起流程是没有可为空
                variables    业务参数 配合流程图中配置的业务参数传入具体的值
                processCallback 审批完成之后业务回调方法
                checkBeforeProcess 审批之前业务校验
            -->
            <my-approval-btn ref="orderView"
                             :processKey="form.processKey"
                             :woCode="form.woCode"
                             :processInstanceName="form.processInstanceName"
                             :businessKey="form.id"
                             :taskInstanceId="form.taskInstanceId"
                             :pid = "form.processInstanceId"
                             :variables="variables"
                             :taskType="taskType"
                             @processCallback="processCallback"
                             @checkBeforeProcess="checkBeforeProcess"
                             v-show="showApproval">
            </my-approval-btn>
            <el-button @click="backList()" type="primary" size="small">返回
            </el-button>
        </div>
    </div>
</template>

<script>
    import orderList from './orderList';
    import Cookies from 'js-cookie';
    import myApprovalBtn from '@/components/myApprovalBtn';
    import myUpload from '@/components/myUpload';

    export default {
        components: {orderList, myApprovalBtn, myUpload},
        name: 'viewOrder',
        data () {
            return {
                form: {
                    orderName: '',
                    orderType: '',
                    status: '',
                    processInstanceId: '',
                    orderCode: '',
                    applyDate: '',
                    reimburseBy: '',
                    reimburseDept: '',
                    feeType: '',
                    feeAmount: '',
                    remark: '',
                    processKey: '',
                    woCode: '',
                    id: '',
                    taskInstanceId: '',
                    processInstanceName: '',
                    currentNode: '',
                    isFirstNode: false
                },
                showApproval: false,
                taskId: '',
                taskType: '',
                variables: {
                    cost: ''
                },
                fileList: [],
                autoUpload: true,
                uploadData: {},
                saveUploadData: [],
                uploadPercent: 0,
                uploadFlag: false,
                showAttach: true,
                viewFlag: 'view'
            };
        },
        created () {
            this.showApproval = this.$route.params.id != undefined;
            this.form.id = this.$route.params.id;
            this.form.processInstnceId = this.$route.params.row.processInstanceId;
            // this.form.processKey = "num_one";
            this.form.woCode = 'workOrder';
            if (this.$route.params.row != undefined && this.$route.params.row.pid != undefined) {
                this.showApproval = this.$route.params.row.businessKey != undefined;
                this.form.taskInstanceId = this.$route.params.row.id;
                this.form.id = this.$route.params.row.businessKey;
                this.taskType = this.$route.params.row.taskType;
                this.form.processInstanceName = this.$route.params.row.businessInfo;
                this.form.processInstnceId = this.$route.params.row.pid;
            }
            this.backfilleditData();
        },
        methods: {
            backfilleditData () {
                var dataId = this.form.id;
                this.form.variables = {'cost': 1000, 'count': 200};

                if (dataId) {
                    this.$myHttp({
                        method: 'post',
                        url: this.prefix + '/microarch/sys/sysorder/view',
                        data: {
                            'entity': {
                                'id': dataId
                            }
                        }
                    }).then(res => {
                        console.log('edit--------', res);
                        var backData = res.data.entity;
                        // this.form.orderName = backData.orderName;
                        this.form.orderType = backData.orderType;
                        this.form.status = backData.status;
                        this.form.processInstanceId = backData.processInstanceId;
                        this.form.orderCode = backData.orderCode;
                        this.form.applyDate = backData.applyDate;
                        this.form.reimburseBy = backData.reimburseBy;
                        this.form.reimburseDept = backData.reimburseDept;
                        this.form.feeType = backData.feeType;
                        this.form.feeAmount = backData.feeAmount;
                        this.form.remark = backData.remark;
                        this.variables.cost = backData.feeAmount;
                        this.variables.count = backData.feeAmount;
                        if (backData.attachList) {
                            this.showAttach = true
                            var attachList = backData.attachList;
                            var resArray = [];
                            for (var d = 0, len = attachList.length; d < len; d++) {
                                resArray.push({
                                    name: attachList[d].attachmentName,
                                    url: attachList[d].attachmentPath,
                                    id: attachList[d].id
                                });
                            }
                            this.fileList = resArray;
                        }else{
                            this.showAttach = false
                        }
                    });
                }
            },
            backList () {
                var _this = this;

                if (_this.$route.params.row.pid === undefined) {
                    _this.$router.push({
                        name: 'sysorder/orderList'
                    });
                } else {
                    if (_this.taskType == 'waitfor') {
                        _this.$router.push({
                            name: 'workFlow/toDoList'
                        });
                    } else if (_this.taskType == 'transated') {
                        _this.$router.push({
                            name: 'workFlow/haveList'
                        });
                    } else if (_this.taskType == 'read') {
                        _this.$router.push({
                            name: 'workFlow/encyclicList'
                        });
                    } else if (_this.taskType == 'readed') {
                        _this.$router.push({
                            name: 'workFlow/encyclicReadedList'
                        });
                    }
                }
            },
            /**
             * 业务提交之前校验
             * */
            checkBeforeProcess () {
                if (true) {
                    this.$refs.orderView.submit();
                } else {
                    this.$message({
                        message: '数据校验失败',
                        type: 'warning'
                    });
                }
            },
            /**
             * 流程审批之后业务数据更改
             * */
            processCallback (piid, optionType, taskType) {
                var _this = this;
                var dataId = _this.form.id;
                var status = '3';
                if (optionType == 'endProcess') {
                    status = '1';
                } else if (optionType == 'repelProcess') {
                    status = '2';
                }
                _this.$myHttp({
                    method: 'post',
                    url: _this.prefix + '/microarch/sys/sysorder/save',
                    data: {
                        'entity': {
                            'id': dataId,
                            'status': status,
                            'processInstanceId': piid,
                            'orderName': _this.form.orderName,
                            'orderType': _this.form.orderType,
                            'orderCode': _this.form.orderCode,
                            'applyDate': _this.form.applyDate,
                            'reimburseBy': _this.form.reimburseBy,
                            'reimburseDept': _this.form.reimburseDept,
                            'feeType': _this.form.feeType,
                            'feeAmount': _this.form.feeAmount,
                            'remark': _this.form.remark
                        }
                    }
                }).then(res => {
                    // 成功回调方法
                    // _this.$router.push({
                    //     name: 'orderList'
                    // });
                    if (taskType == 'transated') {
                        _this.$router.push({
                            name: 'workFlow/haveList'
                        });
                    } else if (taskType == 'waitfor') {
                        _this.$router.push({
                            name: 'workFlow/toDoList'
                        });
                    } else {
                        _this.$router.push({
                            name: 'sysorder/orderList'
                        });
                    }
                });
            }
        },
        filters: {
            statusFil: function (value) {
                const pattern = /(?=((?!\b)\d{3})+$)/g;
                if (value) {
                    if (value == '0') {
                        return '废除';
                    }
                    if (value == '1') {
                        return '生效';
                    }
                    if (value == '2') {
                        return '草稿';
                    }
                    if (value == '3') {
                        return '已提交';
                    }
                }
            },

            applyDateFil: function (value) {
                if (value) {
                    return value.substring(0, 10);
                }
            },
            rounding (value) {
                return parseFloat(value).toFixed(2);
            }
        }
    };
</script>

<style scoped>
    .el-select{width: 100%}
    .el-input__inner{color: #797979}
</style>