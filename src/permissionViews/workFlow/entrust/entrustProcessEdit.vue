<template>
    <el-col :span="24" style="background-color: white" >

        <h2 style="margin-top: 10px;margin-left: 10px;margin-bottom: 15px">
            流程委托
        </h2>

        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px" style="margin-top: 20px;margin-bottom: 20px" class="demo-ruleForm">
            <el-col :span="8" :xs="20" >
                <el-form-item label="工单类型" prop="woCode">
                    <el-input v-model="ruleForm.woName"  style="width:80%;" size="small" disabled></el-input>
                    <!--<el-select v-model="ruleForm.woCode" style="width:80%;" size="small" @change="changeOrder">-->
                        <!--<el-option-->
                                <!--v-for="item in orders"-->
                                <!--:key="item.value"-->
                                <!--:label="item.label"-->
                                <!--:value="item.value">-->
                        <!--</el-option>-->
                    <!--</el-select>-->
                </el-form-item>
            </el-col>

            <el-col :span="8" :xs="20" >
                <el-form-item label="委托人" prop="consigner">
                    <el-input v-model="ruleForm.consigner" style="display: none;"  size="small"></el-input>
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

            <el-col :span="8" :xs="20" >
                <el-form-item label="受委托人" prop="mandatary">
                    <el-input v-model="ruleForm.mandatary" style="display: none;"  size="small"></el-input>
                    <div @click="showMandataryDialog">
                        <el-input v-model="mandataryName"
                                  placeholder="请选择受委托人"
                                  ref="readersInput"
                                  clearable
                                  style="width: 80%" :readonly="readonly" size="small"></el-input>
                        <i style="padding-left: 3px;" @click="showMandataryDialog" class="el-icon-search" ></i>
                    </div>
                </el-form-item>
            </el-col>

            <el-col :span="8" :xs="20" >
                <el-form-item label="状态" prop="active">
                    <el-switch
                            size="small"
                            v-model="ruleForm.active"
                            :active-value="activeValue"
                            :inactive-value="inactiveValue"
                            active-text="激活"
                            inactive-text="关闭">
                    </el-switch>
                </el-form-item>
            </el-col>

            <el-col :span="8" :xs="20" >
                <el-form-item label="委托开始时间" prop="beginDate">
                    <el-date-picker
                            type="date"
                            placeholder="选择日期"
                            v-model="ruleForm.beginDate"
                            :picker-options="pickerOptions0"
                            style="width: 80%;"
                            format="yyyy-MM-dd"
                            @change="changeBeginDate"
                            size="small"></el-date-picker>
                </el-form-item>
            </el-col>

            <el-col :span="8" :xs="20" >
                <el-form-item label="委托结束时间" prop="endDate">
                    <el-date-picker
                            type="date"
                            placeholder="选择日期"
                            v-model="ruleForm.endDate"
                            format="yyyy-MM-dd"
                            :picker-options="pickerOptions1"
                            style="width: 80%;"
                            size="small"></el-date-picker>
                </el-form-item>
            </el-col>

            <el-col :span="8" :offset="7">
                <el-form-item>
                    <el-button @click="submitForm('ruleForm')" type="primary" style="margin-top: 20px;margin-bottom: 10px" round size="small">保存</el-button>
                    <el-button @click="close()"  style="margin-top: 20px;margin-bottom: 10px" round size="small">返回</el-button>
                </el-form-item>
            </el-col>

        </el-form>
        <el-dialog top="8vh" width="55%" title="请选择委托人"  class="ems-dialog" :visible.sync="dialogConsignerVisible" append-to-body :modal-append-to-body="false">
            <manager-list @getManagerName="showConsignerName" id="formStyle1"></manager-list>
        </el-dialog>
        <el-dialog top="8vh" width="55%" title="请选择受委托人" class="ems-dialog" :visible.sync="dialogMandataryVisible"  append-to-body :modal-append-to-body="false">
            <manager-list @getManagerName="showMandataryName" id="formStyle2"></manager-list>
        </el-dialog>
    </el-col>
</template>

<script>
    import managerList from '../../sys/user/managerList';

    export default {
        name: 'addEntrustProcess',
        components: {
            managerList
        },
        data () {
            return {
                ruleForm: {
                    id: '',
                    woCode: '',
                    woName: '全部',
                    consigner: '',
                    mandatary: '',
                    beginDate: '',
                    endDate: '',
                    active: 1
                },
                consignerName: '',
                mandataryName: '',
                readonly: true,
                rules: {
                    // woCode: [
                    //     { required: true, message: '请选择工单类型', trigger: 'change' }
                    // ],
                    consigner: [
                        { required: true, message: '请选择委托人', trigger: 'change' }
                    ],
                    mandatary: [
                        { required: true, message: '请选择受委托人', trigger: 'change' }
                    ],
                    beginDate: [
                        { required: true, message: '请选择委托开始时间', trigger: 'change' }
                    ]
                },
                orders: [],
                // 开始时间小于等于今天可选
                pickerOptions0: {
                    disabledDate (time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                // 结束时间小于等于开始时间可选  - 8.64e7
                pickerOptions1: {
                    disabledDate: (time) => {
                        return time.getTime() < Date.now() - 8.64e7 ||
                            time.getTime() < new Date(this.ruleForm.beginDate).getTime() - 8.64e7;
                    }
                },
                activeValue: 1,
                inactiveValue: 0,
                dialogConsignerVisible: false,
                dialogMandataryVisible: false

            };
        },
        created () {
            this.ruleForm.id = this.$route.params.id;
            this.backfilleditData();
            this.findOrder();
        },
        methods: {
            changeBeginDate (date) {
                if (new Date(date).getTime() > new Date(this.ruleForm.endDate).getTime()) {
                    this.ruleForm.endDate = '';
                }
            },
            backfilleditData () {
                var getDataId = this.ruleForm.id;
                if (getDataId) {
                    this.$myHttp({
                        method: 'post',
                        url: this.prefix + '/microarch/activiti/delegate/view',
                        data: {
                            'entity': {
                                'id': getDataId
                            }
                        }
                    }).then(res => {
                        var backData = res.data.entity;
                        this.ruleForm.woCode = backData.woCode;
                        this.ruleForm.woName = backData.woName;
                        this.ruleForm.consigner = backData.consigner;
                        this.ruleForm.mandatary = backData.mandatary;
                        this.ruleForm.beginDate = backData.beginDate;
                        this.ruleForm.endDate = backData.endDate;
                        this.ruleForm.active = backData.active;
                        this.consignerName = backData.consignerName;
                        this.mandataryName = backData.mandataryName;
                    });
                }
            },
            submitForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.checkInfo();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            saveProjectsInfo () {
                var _this = this;
                console.log('提交的数据：', this.ruleForm);
                var param = {};
                this.$myHttp({
                    method: 'POST',
                    url: this.prefix + '/microarch/activiti/delegate/save',
                    data: {'entity': this.ruleForm}
                }).then(res => {
                    this.$message({
                        showClose: true,
                        message: '保存成功！',
                        type: 'success'
                    });
                    this.$router.push({
                        name: 'workFlow/entrust/entrustProcessList'
                    });
                });
            },
            checkInfo () {
                var _this = this;
                console.log('提交的数据：', this.ruleForm);
                var param = {};
                this.$myHttp({
                    method: 'POST',
                    url: this.prefix + '/microarch/activiti/delegate/check',
                    data: {'entity': this.ruleForm}
                }).then(res => {
                    console.log(res);
                    var result = res.data;
                    if (result.check == 'Y') {
                        _this.saveProjectsInfo();
                    } else {
                        this.$message({
                            showClose: true,
                            message: result.message,
                            type: 'warning'
                        });
                    }
                });
            },
            close: function () {
                this.$router.push({
                    name: 'workFlow/entrust/entrustProcessList'
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
            changeOrder (value) {
                for (var j = 0, len = this.orders.length; j < len; j++) {
                    if (this.orders[j].value = value) {
                        this.ruleForm.woName = this.orders[j].label;
                    }
                }
            },
            showConsignerDialog () {
                this.dialogConsignerVisible = true;
                // 修改el-dialog样式
                setTimeout(function () {
                    document.getElementsByClassName('el-dialog__body')[0].style.padding = '0px 5px 30px 5px';
                    var formStyle = document.getElementById('formStyle1').getElementsByClassName('el-form-item');
                    for (var i = 0; i < formStyle.length; i++) {
                        formStyle[i].style.marginBottom = '5px';
                    }
                }, 0);
                // 解决表格表头错位的问题
                setTimeout(function () {
                    var curTable = document.getElementById('curTable');
                    var thGutter = curTable.getElementsByClassName('gutter')[0];
                    thGutter.style.display = 'table-cell';
                }, 500);
            },
            showMandataryDialog () {
                this.dialogMandataryVisible = true;
                // 修改el-dialog样式
                setTimeout(function () {
                    document.getElementsByClassName('el-dialog__body')[1].style.padding = '0px 5px 30px 5px';
                    var formStyle = document.getElementById('formStyle2').getElementsByClassName('el-form-item');
                    for (var i = 0; i < formStyle.length; i++) {
                        formStyle[i].style.marginBottom = '5px';
                    }
                }, 0);
                // 解决表格表头错位的问题
                setTimeout(function () {
                    var curTable = document.getElementById('curTable');
                    var thGutter = curTable.getElementsByClassName('gutter')[0];
                    thGutter.style.display = 'table-cell';
                }, 500);
            },
            showConsignerName (cName, userName) {
                this.ruleForm.consigner = userName;
                this.consignerName = cName;
                this.dialogConsignerVisible = false;
            },
            showMandataryName (cName, userName) {
                this.ruleForm.mandatary = userName;
                this.mandataryName = cName;
                this.dialogMandataryVisible = false;
            }
        }
    };
</script>

<style>
    .ems-dialog .el-dialog__header {
        padding: 8px 20px 8px;
        background: #9fc1e4;
    }
    .ems-dialog .el-dialog__headerbtn {
        position: absolute;
        top: 8px;
        right: 20px;
        padding: 0;
        background: 0 0;
        border: none;
        outline: 0;
        cursor: pointer;
        font-size: 16px;
    }
</style>