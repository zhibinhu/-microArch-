<template>
    <div style="background-color: white">
        <div>
            <el-form ref="form" :model="form" :rules="dataRule" label-width="120px">
                <el-row style="padding-left: 480px;padding-top:5px;padding-bottom: 10px;">
                    <span style="font-size:24px;color: #333;padding-top: 10px;padding-bottom: 10px;">差旅费用报销申请单</span>
                </el-row>

                <el-row style="padding-left: 200px;">
                    <el-col :span="8">
                        <el-form-item label="流水号">
                            <el-input v-model="form.orderCode" placeholder="自动生成" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="单据类型">
                            <el-input v-model="form.orderType" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row style="padding-left: 200px;">
                    <el-col :span="8">
                        <el-form-item label="报销申请日期" :span="12">
                            <el-date-picker v-model="form.applyDate" type="date"  format="yyyy-MM-dd"  value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="报销人" prop="status">
                            <el-input v-model="form.reimburseBy" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row style="padding-left: 200px;">
                    <el-col :span="8">
                        <el-form-item label="报销部门">
                            <el-select v-model="form.reimburseDept" style="width:100%;">
                                <el-option
                                        v-for="item in deptOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="费用类别" prop="status">
                            <el-select v-model="form.feeType" style="width:100%;">
                                <el-option
                                        v-for="item in feeOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row style="padding-left: 200px;">
                    <el-col :span="8">
                        <el-form-item label="费用金额(元)" prop="feeAmount">
                            <el-input v-model="form.feeAmount"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="状态">
                            <el-select v-model="form.status" style="width:100%;"  :disabled="true">
                                <el-option
                                        v-for="item in statusOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row style="padding-left: 200px;">
                    <el-col :span="16">
                        <el-form-item label="备注" prop="remark">
                            <el-input v-model="form.remark" type="textarea" :rows="3"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row  style="padding:0 20px;">
                    <el-col :span="24">
                        <template :span="20" slot="title">
                            <div class="moduleTit">
                                <h3>
                                    <span class="infoTit">附件</span>
                                </h3>
                            </div>
                        </template>
                        <my-upload  :bisinessId="form.id" :uploadPath="uploadPath" :attachmentTypesCode="attachmentTypesCode" ref="list"></my-upload>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div style="padding-top: 10px;padding-top: 10px;text-align:center;">
            <!--
                 businessKey 发起流程时必须传入 业务id
                 processInstanceName 流程实例名称（业务单据名称） 发起流程时必须传入
                 processKey 流程图key
                 woCode 工单编码-需在“工单与流程映射”中配置
                 taskInstanceId 从待办，已办页面进入时获取任务ID 发起流程是没有可为空
                 taskType    任务类型 已办还是待办 从待办已办进入时可以获取 发起流程是没有可为空
                 variables    业务参数 配合流程图中配置的业务参数传入具体的值
                 processCallback 审批完成之后业务回调方法
                 checkBeforeProcess 审批之前业务校验
             -->
            <my-approval-btn ref="orderEdit"
                             :businessKey="form.id"
                             :processInstanceName="form.processInstanceName"
                             :processKey="form.processKey"
                             :woCode="form.woCode"
                             :taskInstanceId="form.taskInstanceId"
                             :variables="variables"
                             :taskType="taskType"
                             @processCallback="processCallback"
                             @checkBeforeProcess="checkBeforeProcess"
                             v-show="showApproval">
            </my-approval-btn>
            <div style="display: inline;margin-left: 10px;">
                <el-button @click="saveOrder()" type="primary" size="small" :disabled="saveDisabled">保存
                </el-button>
                <el-button @click="backList()" type="primary" size="small">返回
                </el-button>
                <!--<el-button type="primary" @click="startProcess()" icon="el-icon-circle-plus-outline" size="small" v-show="isShowStart" style="margin-top: 20px;margin-bottom: 10px" >启动</el-button>-->
            </div>
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
        name: 'editOrder',
        data () {
            return {
                form: {
                    orderName: '',
                    orderType: '差旅报销单',
                    status: '2',
                    processInstanceId: '',
                    orderCode: '',
                    applyDate: this.dateFormatter(new Date(), false),
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
                    currentNode: ''
                },
                attachmentTypesCode:'encType',
                statusOptions: [{
                    value: '0',
                    label: '废除'
                }, {
                    value: '1',
                    label: '生效'
                }, {
                    value: '2',
                    label: '草稿'
                }, {
                    value: '3',
                    label: '已提交'
                }],
                deptOptions: [{
                    value: '系统技术部',
                    label: '系统技术部'
                }, {
                    value: '软件开发部',
                    label: '软件开发部'
                },

                {
                    value: '需求与质量部',
                    label: '需求与质量部'
                },
                {
                    value: 'SAP咨询部',
                    label: 'SAP咨询部'
                }, {
                    value: 'SAP业务部',
                    label: 'SAP业务部'
                }],
                feeOptions: [{
                    value: '交通费',
                    label: '交通费'
                }, {
                    value: '住宿费',
                    label: '住宿费'
                }, {
                    value: '其他',
                    label: '其他'
                }
                ],
                value: '',
                showApproval: false,
                taskType: '',
                variables: {
                    cost: ''
                },
                dataRule: {
                    feeAmount: [
                        { pattern: /^[0-9]{1}\d*(.\d{1,2})?$|^0.\d{1,2}$/, message: '输入正确的金额' }
                    ]
                },
                saveDisabled: false,
                uploadPath: 'workorder',
                fileList: [],
                autoUpload: true,
                uploadData: {},
                saveUploadData: [],
                uploadPercent: 0,
                uploadFlag: false
            };
        },
        created () {
            this.showApproval = this.$route.params.id != undefined;
            this.form.id = this.$route.params.id;
            // this.form.processKey = "num_one";
            this.form.woCode = 'workOrder';
            if (this.$route.params.row != undefined && this.$route.params.row.pid != undefined) {
                this.form.id = this.$route.params.row.businessKey;
                this.showApproval = this.$route.params.row.businessKey != undefined;
                this.form.taskInstanceId = this.$route.params.row.id;
                this.taskType = this.$route.params.row.taskType;
            }
            this.form.processInstanceName = '差旅费用报销申请 【' + sessionStorage.getItem('userName') + ' ' + this.form.feeAmount + '元】';
            this.backfilleditData();

            this.$myHttp({
                method: 'get',
                url: this.prefix + '/microarch/sys/sysuser/getUserByUserName/?userName=' + sessionStorage.getItem('userName') + window.suffix,
                data: {}
            }).then(res => {
                var backData = res.data;
                if (res.status == '200') {
                    this.form.reimburseBy = backData;
                } else {
                    this.form.reimburseBy = sessionStorage.getItem('userName');
                }
            });
        },
        methods: {
            backfilleditData () {
                var dataId = this.form.id;
                if (dataId) {
                    this.$myHttp({
                        method: 'post',
                        url: this.prefix + '/microarch/sys/sysorder/view' + window.suffix,
                        data: {
                            'entity': {
                                'id': dataId
                            }
                        }
                    }).then(res => {
                        var backData = res.data.entity;
                        // this.form.orderName = backData.orderName;
                        this.form.orderType = backData.orderType;
                        this.form.status = backData.status;
                        this.form.processInstanceId = backData.processInstanceId;
                        this.form.processInstanceName = '差旅费用报销申请 【' + sessionStorage.getItem('userName') + ' ' + backData.feeAmount + '元】';
                        this.form.orderCode = backData.orderCode;
                        this.form.applyDate = backData.applyDate;
                        this.form.reimburseBy = backData.reimburseBy;
                        this.form.reimburseDept = backData.reimburseDept;
                        this.form.feeType = backData.feeType;
                        this.form.feeAmount = backData.feeAmount;
                        this.form.remark = backData.remark;
                        this.variables.cost = backData.feeAmount;
                        if (backData.attachList) {
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
                        }
                        if (this.$route.params.row.pid == undefined) {
                            if (backData.status != '2') {
                                this.showApproval = false;
                            }
                        }
                        if (this.$route.params.row.pid != undefined && backData.status == '2') {
                            this.form.taskInstanceId = '';
                            this.taskType = '';
                        }
                    });
                }
            },
            saveOrder () {
                var _this = this;
                var dataId = _this.form.id;
                var attachList = this.$refs.list.dataList;
                this.saveDisabled = true;
                this.$myHttp({
                    method: 'post',
                    url: this.prefix + '/microarch/sys/sysorder/save' + window.suffix,
                    data: {
                        'entity': {
                            'id': dataId,
                            'status': this.form.status,
                            'processInstanceId': this.form.processInstanceId,
                            'orderName': this.form.orderName,
                            'orderType': this.form.orderType,
                            'orderCode': this.form.orderCode,
                            'applyDate': this.form.applyDate,
                            'reimburseBy': this.form.reimburseBy,
                            'reimburseDept': this.form.reimburseDept,
                            'feeType': this.form.feeType,
                            'feeAmount': this.form.feeAmount,
                            'remark': this.form.remark,
                            'attachList': attachList
                        }
                    }
                }).then(res => {
                    // 成功回调
                    _this.form.id = res.data.entity.id;
                    _this.form.orderName = res.data.entity.orderName;
                    _this.form.orderType = res.data.entity.orderType;
                    _this.form.orderCode = res.data.entity.orderCode;
                    _this.form.reimburseBy = res.data.entity.reimburseBy;
                    _this.form.reimburseDept = res.data.entity.reimburseDept;
                    _this.form.feeType = res.data.entity.feeType;
                    _this.form.feeAmount = res.data.entity.feeAmount;
                    _this.form.remark = res.data.entity.remark;
                    this.form.processInstanceName = '差旅费用报销申请 【' + sessionStorage.getItem('userName') + ' ' + res.data.entity.feeAmount + '元】';
                    this.variables.cost = res.data.entity.feeAmount;
                    this.form.id = res.data.entity.id;
                    this.showApproval = true;
                    if (_this.$route.params.row != undefined && _this.$route.params.row.pid != undefined && res.data.entity.status == '2') {
                        this.form.taskInstanceId = '';
                        this.taskType = '';
                    }
                    this.$message({
                        message: '保存成功',
                        type: 'success',
                        duration: 1500,
                        onClose: () => {

                        }
                    });
                    this.saveDisabled = false;
                });
            },

            backList () {
                var _this = this;

                if (_this.$route.params.row === undefined || _this.$route.params.row.pid === undefined) {
                    _this.$router.push({
                        name: 'sysorder/orderList'
                    });
                } else {
                    if (_this.taskType == 'waitfor' || _this.$route.params.row.taskType == 'waitfor') {
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
                    this.$refs.orderEdit.submit();
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
                    url: _this.prefix + '/microarch/sys/sysorder/save' + window.suffix,
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
                    if (taskType == 'waitfor') {
                        _this.$router.push({
                            name: 'workFlow/toDoList'
                        });
                    } else {
                        _this.$router.push({
                            name: 'sysorder/orderList'
                        });
                    }
                });
            },

            dateFormatter (str) { // 默认返回yyyy-MM-dd HH-mm-ss
                var hasTime = arguments[1] != false;// 可传第二个参数false，返回yyyy-MM-dd
                var d = new Date(str);
                var year = d.getFullYear();
                var month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
                var day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
                var hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
                var minute = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
                var second = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
                if (hasTime) {
                    return [year, month, day].join('-') + ' ' + [hour, minute, second].join(':');
                } else {
                    return [year, month, day].join('-');
                }
            }
        }
    };
</script>

<style scoped>
    .el-select {
        width: 100%
    }

    .el-input__inner {
        color: #797979
    }
</style>