<template>
    <div style="display: inline;text-align: left;">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="checkSubmit('submit')"  v-show="submitVisable" size="small" >提交审批</el-button>
        <el-button type="primary" icon="el-icon-remove-outline" @click="checkSubmit('return')"  v-show="returnVisable" size="small" >退回</el-button>

        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="seekOpinion()"  v-show="seekVisable" size="small" >征询</el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="showReferTo()" v-show="referToVisable" size="small"  >转发</el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="withDrawProcess()" v-show="withDrawVisable" size="small"  >取回</el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="repelProcess()" v-show="repelVisable" size="small">撤销审批</el-button>
        <!--<el-button type="primary" icon="el-icon-circle-plus-outline" @click="endProcess()" v-show="endVisable" size="small">结束审批</el-button>-->
        <el-button type="primary" icon="el-icon-search" @click="popHistory()" v-show="hisVisable" size="small">流程追踪</el-button>

        <el-dialog title="流程办理" :visible.sync="dialogVisible" :modal-append-to-body="false" width="600px" append-to-body class="popApproval" :before-close="handleClose">
            <fieldset>
                <legend>{{showPopName}}</legend>

                <el-form :model="form" style="margin-bottom: 15px;">
                    <el-form-item label="当前节点" :label-width="formLabelWidth">
                        <el-input v-model="form.currentNode" style="display: none;"></el-input>
                        {{form.currentNodeName}}
                        <!--<el-input v-model="form.currentNodeName" size="small" style="width: 90%"></el-input>-->
                    </el-form-item>
                    <el-form-item label="下一节点"
                                  :rules="[
                                      { required: true, message: '下一节点不能为空'}
                                    ]"
                                  :label-width="formLabelWidth">
                        <el-radio-group v-model="form.optionType" size="small" @change="changeRadio" v-show="showRadioNode">
                            <el-radio v-for="(item,index) in optionList" :key="item.index" :label="item.id" style="float: left;">{{item.name}}</el-radio>
                        </el-radio-group>
                        <el-checkbox-group
                                v-model="parallelTypes" @change="changeCheckbox" v-show="showCheckboxNode">
                            <el-checkbox v-for="(item,index) in parallelOptions" :label="item.id" :key="item.index">{{item.name}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="自审批节点" :label-width="formLabelWidth" v-show="showAutoApproval">
                        {{autoNode.name}}
                    </el-form-item>
                    <el-form-item label="处理人"
                                  :rules="[
                                      { required: true, message: '处理人不能为空'}
                                    ]"
                                  :label-width="formLabelWidth" v-show="showUser">
                        <el-select v-model="approvers" :multiple="isMultiple" placeholder="请选择" @change="changeUser" style="width: 90%">
                            <el-option
                                    v-for="item in approverOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <!--item.approver[0].value-->
                    <el-form-item label="处理人"
                                  :rules="[
                                      { required: true, message: '处理人不能为空'},
                                    ]"
                                  v-show="showParallelUser"  :label-width="formLabelWidth">
                        <el-select v-model="item.parallelUser"  v-for="(item, index) in parallelList" :key="index"
                                   :multiple="item.isMultiple" :placeholder="item.name"  style="width: 90%;padding-top: 5px;">
                            <el-option
                                    v-for="item in item.approver"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="传阅人" :label-width="formLabelWidth" v-show="showEncyclic">
                        <el-input v-model="readers" size="small" style="display: none;"></el-input>
                        <div @click="showDialog">
                            <el-input v-model="readerName"
                                      placeholder="请选择传阅人"
                                      ref="readersInput"
                                      clearable
                                      style="width: 85%" :readonly="readonly"></el-input>
                            <i style="padding-left: 3px;" @click="showDialog" class="el-icon-search" ></i>
                        </div>

                    </el-form-item>
                    <el-form-item label="会签意向" :label-width="formLabelWidth" v-show="showCountersign">
                        <el-radio-group v-model="form.countersign" size="small">
                            <el-radio  label="true">同意</el-radio>
                            <el-radio  label="false">不同意</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="紧急程度" :label-width="formLabelWidth">
                        <el-radio-group v-model="form.urgency" size="small">
                            <el-radio  label="50">一般</el-radio>
                            <el-radio  label="100">紧急</el-radio>
                            <el-radio  label="150">特急</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <!--<el-form-item label="提醒方式" :label-width="formLabelWidth">-->
                        <!--<el-checkbox v-model="form.remindType" label="1">邮件提醒</el-checkbox>-->
                    <!--</el-form-item>-->
                    <el-form-item label="审批意见"
                                  :label-width="formLabelWidth" v-show="showOpinion">
                        <el-input type="textarea" :rows="2"  v-model="form.opinion" size="small" style="width: 90%"  @keyup.native="wordStatic" @oninput.native="wordStatic"></el-input>
                        <div class="weui_textarea_counter">
                            <span id="num" style="color: red;">0</span>/200
                            <span style="font-size: 12px;color: #2b85e4;margin-right: 5px;margin-left: 5px;cursor:pointer;"  @click="saveOpioion">
                                设置为常用意见
                              </span>
                            <el-dropdown>
                              <span class="el-dropdown-link" style="font-size: 12px;color: #2b85e4;cursor:pointer;">
                                常用意见<i class="el-icon-arrow-down el-icon--right"></i>
                              </span>
                                <el-dropdown-menu slot="dropdown" style="font-size: 12px;">
                                    <el-dropdown-item v-for="(item,index) in commonOpinions" style="font-size: 8px;"
                                                      :key="index" @click.native="changeOpinion(item.value)">{{item.value}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown></div>
                    </el-form-item>
                </el-form>
            </fieldset>
            <div slot="footer">
                <el-button type="primary" @click="confirmProcess">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog top="8vh" width="55%" title="请选择传阅人"  class="popApproval" :visible.sync="dialogReadVisible" append-to-body :modal-append-to-body="false">
            <!--<manager-list @getManagerName="showManagerName" id="formStyle1"></manager-list>-->
            <user-select-list @getManagerName="showManagerName" id="formStyle1"></user-select-list>
        </el-dialog>
        <el-dialog title="征询" :visible.sync="dialogSeekVisible" :modal-append-to-body="false" append-to-body width="600px" class="popApproval">
            <fieldset>
                <legend>征询操作</legend>

                <el-form :model="form" style="margin-bottom: 15px;">
                    <el-form-item label="当前节点" :label-width="formLabelWidth">
                        <el-input v-model="form.currentNode" style="display: none;"></el-input>
                        {{currentNode}}
                        <!--<el-input v-model="form.currentNodeName" size="small" style="width: 90%"></el-input>-->
                    </el-form-item>
                    <el-form-item label="审批动作" :label-width="formLabelWidth"
                                  :rules="[
                                      { required: true, message: '审批动作不能为空'}
                                    ]">
                        <el-radio-group v-model="form.optionType" size="small" @change="changeSeekRadio" >
                            <el-radio v-for="(item,index) in optionList" :key="item.index" :label="item.id">{{item.name}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="处理人" :label-width="formLabelWidth" v-show="showSeekUser"
                                  :rules="[
                                      { required: true, message: '处理人不能为空'}
                                    ]">
                        <el-input v-model="seeker" size="small" style="display: none;"></el-input>
                        <div @click="showSeekDialog">
                            <el-input v-model="seekerName"
                                      placeholder="请选择征询人"
                                      ref="seekerInput"
                                      clearable
                                      style="width: 90%" :readonly="readonly"></el-input>
                            <i style="padding-left: 3px;" @click="showSeekDialog"class="el-icon-search" v-show="showSeekerQuery"></i>
                        </div>
                    </el-form-item>

                    <el-form-item label="审批意见" :label-width="formLabelWidth"
                                  :rules="[
                                      { required: true, message: '审批意见不能为空'}
                                    ]">
                        <el-input type="textarea" :rows="2"  v-model="form.seekOpinion" size="small" style="width: 90%" @keyup.native="wordSeekStatic" @oninput.native="wordSeekStatic"></el-input>
                        <div class="weui_textarea_counter"><span id="num2" style="color: red;">0</span>/200
                            <span style="font-size: 12px;color: #2b85e4;margin-right: 5px;margin-left: 5px;cursor:pointer;" @click="saveSeekOpioion">
                                设置为常用意见
                            </span>
                            <el-dropdown>
                              <span class="el-dropdown-link" style="font-size: 12px;color: #2b85e4;cursor:pointer;">
                                常用意见<i class="el-icon-arrow-down el-icon--right"></i>
                              </span>
                                <el-dropdown-menu slot="dropdown" style="font-size: 12px;">
                                    <el-dropdown-item v-for="(item,index) in commonOpinions" style="font-size: 8px;"
                                                      :key="index" @click.native="changeSeekOpinion(item.value)">{{item.value}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>

                    </el-form-item>
                </el-form>
            </fieldset>
            <div slot="footer">
                <el-button type="primary" @click="confirmSeek">确 定</el-button>
                <el-button @click="cancelSeek">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog top="8vh" width="55%" title="请选择征询人" class="popApproval" :visible.sync="dialogSelectSeekVisible"  append-to-body :modal-append-to-body="false">
            <manager-list @getManagerName="showSeekName" id="formStyle"></manager-list>
        </el-dialog>
        <el-dialog title="流程追踪" :visible.sync="dialogHisVisible" :modal-append-to-body="false" append-to-body  width="1000px" >
            <task-list :taskListDate="taskListDate" :processInstanceId="processInstanceId"></task-list>
        </el-dialog>
        <el-dialog top="8vh" width="55%" title="请选择转发人" class="popApproval" :visible.sync="dialogSelectReferToVisible"  append-to-body :modal-append-to-body="false">
            <manager-list @getManagerName="showReferToName" id="formStyletyleRefer"></manager-list>
        </el-dialog>
    </div>
</template>


<script>
    import Cookies from 'js-cookie';
    import taskList from '@/permissionViews/workFlow/trackList'
    import managerList from '@/permissionViews/sys/user/managerList';
    import userSelectList from '@/permissionViews/workFlow/userSelectList';
    export default {
        components: {
            userSelectList,
            taskList, managerList
        },
        name: 'myApprovalBtn',
        props: {
            businessKey: {
                type: String
            },
            processInstanceName: {
                type: String
            },
            processKey: {
                type: String,
                default: ''
            },
            taskInstanceId: {
                type: String,
                default: ''
            },
            variables: {
                type: Object
            },
            taskType: {
                type: String
            },
            woCode:{
                type: String
            },
            pid:{
                type: String
            }
        },
        data() {
            return {
                taskListDate:{
                    imgSrc:'',
                    trackListUrl:'',
                    showHisStatus:false
                },
                dialogVisible: false,
                dialogSeekVisible:false,
                form: {
                    currentNode:'',
                    currentNodeName: '',
                    optionType: '',
                    optionName: '',
                    transition: '',
                    reader: '',
                    urgency: '50',
                    remindType: true,
                    opinion: '',
                    seekOpinion:'',
                    countersign:'true'
                },
                showPopName:'',
                formLabelWidth: '100px',
                showRadioNode:true,
                showCheckboxNode:true,
                submitVisable: true,
                returnVisable: false,
                isRetuen:false,
                processInstanceId:'',
                businessName:'',
                businessId:'',
                processDid:'',
                taskId:'',
                withdrawId:'',
                goId:'',
                nextId:'',
                params:'',
                optionList:[],
                approvers:[],
                parallelUser:'',
                readers:'',
                readerName:'',
                seeker:'',
                seekerName:'',
                readersOptions:[],
                parallelTypes:[],
                parallelOptions:[],
                showUser:false,
                dialogHisVisible:false,
                hisVisable:false,
                hisPath:'',
                isMultiple:false,
                isReadMultiple:false,
                approverOptions: [],
                autoNode:{},
                showAutoApproval:false,
                autoMap:{},
                showOpinion:true,
                showEncyclic:true,
                showParallelUser:false,
                endVisable:false,
                repelVisable:false,
                seekVisable:false,
                isBack:false,
                isStart:false,
                withDrawVisable:false,
                referToVisable:false,
                currentNode:'',
                isFirstNode:false,
                isWithDraw:false,
                activityId:'',
                currentActivityId:'',
                seekIndex:0,
                parallelList:[],
                parallelStart:'',
                dialogReadVisible:false,
                dialogSelectSeekVisible:false,
                dialogSelectReferToVisible:false,
                referToUser:'',
                readonly:true,
                showSeekUser:false,
                showSeekerQuery:true,
                showcommonOpinion:true,
                commonOpinions: [],
                commonOpinion:'',
                showCountersign:false,
                isParallel:false,
                submitEnable:true,
                seekEnable:true,
                withDrawEnable:true,
                referToEnable:true,
                repelEnable:true,
                hisEnable:true
            }

        },
        watch: {
            businessKey: function(curVal,oldVal) {
                this.businessId = curVal;
            },
            taskInstanceId: function(curVal,oldVal) {
                this.taskId = curVal;
            },
            pid:function(curVal,oldVal){
                this.processInstanceId = curVal
                if (this.processInstanceId) {
                    this.hisVisable = true;
                    this.submitVisable = false
                } else {
                    this.hisVisable = false;
                }
            },
            taskType: function(curVal,oldVal) {
                this.taskType = curVal;
                if(this.taskType == "transated") {
                    this.getTransatedTask(this.taskId)
                }else if(this.taskType == "waitfor") {
                    this.getWaitforTask(this.taskId)
                }else if(this.taskType == "read"){
                    this.getReadTask(this.taskId)
                }else if(this.taskType == "readed"){
                    this.getReadTask(this.taskId)
                }else{
                    this.seekVisable = false
                    this.hisVisable = false
                }
            }
        },
        created() {
            this.taskId = this.taskInstanceId
            this.businessName = this.processInstanceName
            this.businessId = this.businessKey
            this.processDid = this.processKey
            this.processInstanceId = this.pid
            this.$myHttp({
                method: 'GET',
                url: this.prefix+'/microarch/activiti/btnConfig',
                data: {}
            }).then(res => {
                this.submitEnable = res.data.submitEnable
                this.seekEnable = res.data.seekEnable
                this.withDrawEnable = res.data.withDrawEnable
                this.referToEnable = res.data.referToEnable
                this.repelEnable = res.data.repelEnable
                this.hisEnable = res.data.hisEnable
                this.showHisApprovalStatus = res.data.showHisApprovalStatus
                this.taskListDate.showHisStatus = res.data.showHisApprovalStatus
                if(this.taskType == "transated") {
                    this.getTransatedTask(this.taskId)
                }else if(this.taskType == "waitfor") {
                    this.getWaitforTask(this.taskId)
                }else if(this.taskType == "read"){
                    this.getReadTask(this.taskId)
                }else if(this.taskType == "readed"){
                    this.getReadTask(this.taskId)
                }else{
                    this.seekVisable = false
                    if(this.processInstanceId) {
                        this.hisVisable = true
                        this.submitVisable = false
                    }else {
                        this.hisVisable = false
                    }
                }
            })
        },
        methods: {
            /**
             * 审批之前业务校验
             * 引入此组件的业务页面需要实现此方法
             * */
            checkSubmit(type) {
                if('return' == type) {
                    this.isRetuen = true
                    this.showPopName = "退回操作"
                }else{
                    this.showPopName = "审批操作"
                    this.isRetuen = false
                }
                this.$emit("checkBeforeProcess")
            },
            /**
             * 根据任务ID
             * 显示待办详细信息
             * 初始化相关的参数
             * */
            getWaitforTask(id){
                var _this = this;
                this.$myHttp({
                    method: 'GET',
                    url: this.prefix+'/microarch/activiti/task/waitfor/'+id,
                    data: {}
                }).then(res => {
                    _this.businessId = res.data.businessKey
                    _this.businessName = res.data.businessInfo
                    _this.processDid = res.data.processKey
                    _this.processInstanceId = res.data.pid
                    _this.form.urgency = res.data.priority
                    _this.taskId = res.data.id
                    _this.currentNode = res.data.name
                    _this.activityId = res.data.activityId
                    _this.isFirstNode = res.data.activityId == 'apply'
                    if(this.taskInstanceId != undefined && this.taskInstanceId != '') {
                        this.hisVisable = true && this.hisEnable
                        this.submitVisable = true && this.submitEnable
                        this.endVisable = true
                        this.seekVisable = true && this.seekEnable
                        this.referToVisable = true && this.referToEnable
                        this.returnVisable = true
                    }
                    if(this.isFirstNode){
                        this.repelVisable = true && this.repelEnable
                        this.submitVisable = true && this.submitEnable
                        this.hisVisable = true && this.hisEnable
                        this.seekVisable = false
                        this.showOpinion = false
                        this.showcommonOpinion = false
                        this.referToVisable = false && this.referToEnable
                        this.returnVisable = false
                    }

                    if(res.data.isSeeking){
                        this.repelVisable = false
                        this.submitVisable = false
                        this.seekVisable = true && this.seekEnable
                        this.referToVisable = false
                        this.returnVisable = false
                    }
                })
            },
            /**
             * 根据任务ID和任务类型
             * 显示已办详细信息
             * 初始化相关的参数
             * */
            getTransatedTask(id){
                var _this = this;
                this.$myHttp({
                    method: 'GET',
                    url: this.prefix+'/microarch/activiti/task/transated/'+id,
                    data: {}
                }).then(res => {
                    _this.businessId = res.data.businessKey
                    _this.businessName = res.data.businessInfo
                    _this.processDid = res.data.processKey
                    _this.processInstanceId = res.data.pid
                    _this.taskId = res.data.id
                    _this.form.urgency = res.data.priority
                    _this.currentNode = res.data.taskName
                    _this.isFirstNode = res.data.activityId == 'apply'
                    _this.isWithDraw = res.data.callBack == "true"
                    _this.withdrawId = res.data.taskId
                    _this.activityId = res.data.activityId
                    _this.currentActivityId = res.data.currentActivityId
                    _this.seekVisable = false
                    _this.hisVisable = true && this.hisEnable
                    _this.submitVisable = false
                    if(_this.isWithDraw) {
                        _this.withDrawVisable = true && this.withDrawEnable
                    }

                })
            },
            /**
             * 根据任务ID和任务类型
             * 显示待阅已阅详细信息
             * 初始化相关的参数
             * */
            getReadTask(id){
                var _this = this;
                this.$myHttp({
                    method: 'GET',
                    url: this.prefix+'/microarch/activiti/task/read/'+id,
                    data: {}
                }).then(res => {
                    _this.businessId = res.data.businessKey
                    _this.businessName = res.data.businessInfo
                    _this.processDid = res.data.processKey
                    _this.processInstanceId = res.data.processInstanceId
                    _this.taskId = res.data.taskId
                    _this.submitVisable = false
                    _this.hisVisable = true && this.hisEnable
                    _this.seekVisable = false
                    _this.showOpinion = false
                    _this.showcommonOpinion = false
                })
            },
            /**
             * 办理按钮事件
             * 判断是否是新发起流程:
             * 1 如果是先发起再显示办理页面
             * 2 如果是已经在流程中 直接显示办理页面
             * */
            submit() {
                var _this = this;
                var param = {};
                param.businessKey = _this.businessId || _this.businessKey ;
                param.processInstanceName = _this.processInstanceName || _this.businessName;
                param.processKey = _this.processDid;
                if(param.processKey == undefined || param.processKey.length === 0){
                    param.woCode = this.woCode;
                }
                param.userName = sessionStorage.getItem('userName'); // Cookies.get('user');
                param.variables = _this.variables;
                if(!_this.isRetuen) {
                    if(this.taskInstanceId) {
                        _this.isStart = false
                        _this.form.currentNodeName = _this.currentNode
                        _this.transactProcess(_this.taskInstanceId,_this.processInstanceId)
                    }else{
                        this.$myHttp({
                            method: 'POST',
                            url: this.prefix+'/microarch/activiti/startWorkflow' + window.suffix,
                            data: param
                        }).then(data => {
                            _this.isStart = true
                            _this.form.currentNodeName = data.data.taskName
                            _this.isFirstNode = true
                            _this.transactProcess(data.data.taskId,data.data.processInstanceId)
                        })
                    }
                }else{
                    _this.isStart = false
                    _this.form.currentNodeName = _this.currentNode
                    this.returnTransactProcess(_this.taskInstanceId,_this.processInstanceId)
                }
            },
            /**
             * 显示审批信息
             * */
            transactProcess(taskId, processInstanceId) {
                this.processInstanceId = processInstanceId;
                this.taskId = taskId;
                this.showAutoApproval = false
                this.showRadioNode = true
                this.showUser = false
                this.optionList = []
                this.form.optionType = ""
                this.parallelTypes = []
                this.showParallelUser = false
                this.parallelList = []
                this.showCountersign = false
                this.autoMap = {}
                this.nextId = ""
                this.approvers = ''
                this.readers = ''
                this.readerName = ''
                var _this = this;
                var param = {};
                param.businessKey = _this.businessId;
                param.processKey = _this.processDid;
                param.taskId = taskId
                param.woCode = this.woCode;
                param.processInstanceId = processInstanceId
                param.variables = _this.variables;
                param.userName = sessionStorage.getItem('userName'); // Cookies.get('user');
                this.$myHttp({
                    method: 'POST',
                    url: this.prefix+'/microarch/activiti/transact' + window.suffix,
                    data: param
                }).then(resp => {
                    // _this.form.urgency = resp.data.approval.priority
                    _this.optionList = resp.data.activityList

                    if(_this.optionList != undefined && _this.optionList.length == 0) {
                        _this.showRadioNode = false
                    }
                    // if(resp.data.backActivityList != undefined && resp.data.backActivityList.length >0 ){
                    //     _this.optionList = _this.optionList.concat(resp.data.backActivityList)
                    // }

                    if(resp.data.parallelActivityList.length >0){
                        _this.showCheckboxNode = true
                        if(resp.data.parallelActivityList[0].item.length>0) {
                            _this.parallelOptions = resp.data.parallelActivityList[0].item
                            _this.parallelStart = resp.data.parallelActivityList[0].id
                        }
                    }
                    if(resp.data.commonOpinions != undefined && resp.data.commonOpinions.length >0){
                        var resArry = []
                        for(var d=0,len = resp.data.commonOpinions.length; d < len; d++){
                            resArry.push({
                                value: resp.data.commonOpinions[d].opinion
                            })
                        }
                        _this.commonOpinions = resArry
                    }

                    if(resp.data.approval.countersign) {
                        _this.showCountersign = true
                    }
                    if(_this.isFirstNode) {
                        this.showOpinion = false
                    }
                    _this.dialogVisible = true

                    if(_this.optionList != undefined && _this.optionList.length > 0) {

                        if(_this.optionList[0].isAuto) {
                            _this.changeRadio(_this.optionList[0].autoApproval.autoNodeId)
                        }
                        _this.changeRadio(_this.optionList[0].id)
                        _this.form.optionType = _this.optionList[0].id
                    }else if(resp.data.parallelActivityList[0].item.length>0) {
                        _this.parallelTypes = []
                        for(var i=0; i < _this.parallelOptions.length; i ++){
                            _this.parallelOptions[i].parallelUser = ''
                        }
                        var checkLists = []
                        for(var i=0; i < _this.parallelOptions.length; i ++){
                            _this.changeCheckbox([_this.parallelOptions[i].id])
                            _this.parallelTypes[i] = _this.parallelOptions[i].id
                        }
                    }
                }).catch(_ => {
                    this.$message({
                        message: '单据异常，不可操作，请重新刷新单据或者联系管理员。',
                        type: 'warning'
                    });
                });
            },
            /**
             * 显示退回审批信息
             * */
            returnTransactProcess(taskId, processInstanceId) {
                this.processInstanceId = processInstanceId;
                this.taskId = taskId;
                this.showCheckboxNode = false,
                this.showAutoApproval = false
                this.showUser = false
                this.showRadioNode = true
                this.optionList = []
                this.form.optionType = ""
                this.parallelTypes = []
                this.showParallelUser = false
                this.parallelList = []
                this.showCountersign = false
                this.autoMap = {}
                this.nextId = ""
                this.approvers = ''
                this.readers = ''
                this.readerName = ''
                var _this = this;
                _this.isBack = true
                var param = {};
                param.businessKey = _this.businessId;
                param.processKey = _this.processDid;
                param.taskId = taskId
                param.woCode = this.woCode;
                param.processInstanceId = processInstanceId
                param.variables = _this.variables;
                param.userName = sessionStorage.getItem('userName'); // Cookies.get('user');
                this.$myHttp({
                    method: 'POST',
                    url: this.prefix+'/microarch/activiti/transact' + window.suffix,
                    data: param
                }).then(resp => {
                    if(resp.data.backActivityList.length >0 ){
                        this.optionList = resp.data.backActivityList
                    }
                    if(resp.data.commonOpinions != undefined && resp.data.commonOpinions.length >0){
                        var resArry = []
                        for(var d=0,len = resp.data.commonOpinions.length; d < len; d++){
                            resArry.push({
                                value: resp.data.commonOpinions[d].opinion
                            })
                        }
                        _this.commonOpinions = resArry
                    }
                    _this.dialogVisible = true
                }).catch(_ => {
                    this.$message({
                        message: '单据异常，不可操作，请重新刷新单据或者联系管理员。',
                        type: 'warning'
                    });
                });
            },
            /**
             * 确认审批事件
             * 选择审批路径
             * 确认审批人，填写审批意见等信息之后确认提交审批
             * */
            confirmProcess(){
                var _this = this;
                var users = {};
                var param = {};
                param.businessKey = _this.businessId || _this.businessKey;
                param.processInstanceId = _this.processInstanceId;
                param.processInstanceName = _this.processInstanceName || _this.businessName;
                param.processKey = _this.processDid;
                param.taskId = _this.taskId;
                param.taskName = _this.form.currentNodeName;
                param.priority = _this.form.urgency;
                param.goId = _this.goId;
                param.opinion = _this.form.opinion;
                param.email = _this.form.remindType ? "1" : "0";
                param.userName = sessionStorage.getItem('userName'); // Cookies.get('user');
                param.isStartTask = _this.isStart;
                if(_this.isBack) {
                    param.backId = _this.nextId;
                    param.optionType = 'back'
                    param.optionText = '退回'
                }else{
                    param.nextId = _this.nextId;
                    param.optionType = 'submit'
                    param.optionText = '提交审批'
                    if(this.isRetuen) {
                        param.optionType = 'back'
                        param.optionText = '退回'
                    }
                }

                if(_this.parallelList.length >0 && _this.isParallel) {
                    users = {};

                    if( _this.parallelList.length < _this.parallelOptions.length ) {
                        this.$message({
                            message: '并发流向未全部选择！',
                            type: 'warning'
                        });
                        return null;
                    }else{
                        for(var i=0 ; i< _this.parallelList.length; i++) {
                            if (_this.isParallel) {
                                if (_this.parallelList[i].parallelUser == '') {
                                    this.$message({
                                        message: "流向 " + _this.parallelList[i].name + '处理人为空，请选择处理人！',
                                        type: 'warning'
                                    })
                                    return null;
                                } else {
                                    users[_this.parallelList[i].id] = [_this.parallelList[i].parallelUser]
                                }
                            }
                        }
                    }

                    param.nextId = _this.parallelStart
                }else{

                    if(this.optionList == undefined || this.optionList.length == 0 ){
                        this.$message({
                            message: '流程异常，请联系管理员',
                            type: 'warning'
                        });
                        return null;
                    }
                    if(_this.nextId != 'end') {
                        if(_this.approvers == undefined || _this.approvers == "") {
                            this.$message({
                                message: '流程异常，请联系管理员',
                                type: 'warning'
                            });
                            return null;
                        }
                        if(_this.approvers instanceof Array) {
                            param.candidateUserIds = _this.approvers;
                            if(_this.approvers.length == 0) {
                                this.$message({
                                    message: '处理人为空，请选择处理人',
                                    type: 'warning'
                                });
                                return null;
                            }
                        }else{
                            param.candidateUserIds = [_this.approvers];
                        }

                        if(_this.isBack) {
                            users[param.backId] = param.candidateUserIds
                        }else{
                            users[param.nextId] = param.candidateUserIds
                        }
                    }
                }
                if(_this.parallelList.length ==0 && _this.nextId == ''){
                    this.$message({
                        message: '请选择流向',
                        type: 'warning'
                    });
                    return null;
                }
                //传入自动审批节点办理人-update czq
                param.autoNodes = [];
                if(_this.showAutoApproval){
                    users[_this.autoNode.id] = [sessionStorage.getItem('userName')];
                    param.autoNodes.push(_this.autoNode.id);
                }
                param.candidateUserIds= users;
                param.encyclicUserIds=[_this.readers];
                // if(_this.showEncyclic){
                //     if(_this.isReadMultiple){
                //         param.encyclicUserIds=_this.readers;
                //     }
                // }

                param.businessUrl = "";
                if( _this.showCountersign) {
                    param.agree = _this.form.countersign == 'true' ? true : false
                    param.countersign = true
                }

                // 强制执行签收动作
                this.$myHttp({
                    method: 'POST',
                    url: this.prefix+'/microarch/activiti/claim?taskId='+_this.taskId+'&userName='+sessionStorage.getItem('userName'), // Cookies.get('user');,
                    data: param
                }).then(res => {
                    this.$myHttp({
                        method: 'POST',
                        url: this.prefix+'/microarch/activiti/send' + window.suffix,
                        data: param
                    }).then(res => {
                        this.dialogVisible = false;
                        // 审批完成之后回调业务方法去修改业务状态，可以根据不同的操作进行相应的修改
                        // 引入此组件的业务页面中需要实现回调的方法，完成业务数据修改
                        var option = 'submitProcess'
                        if(_this.nextId == 'end'){
                            option = 'endProcess'
                        }
                        _this.$emit("processCallback",_this.processInstanceId,option,_this.taskType)
                        _this.$parent.$emit('getMessageCount');
                    }).catch(_ => {
                        this.$message({
                            message: '单据异常，不可操作，请重新刷新单据或者联系管理员。',
                            type: 'warning'
                        });
                    });
                })

            },
            /**
             * 审批页面取消操作
             * 判断是否发起还未提交，此时已经发起流程产生流程实例，待办
             * 取消时调用删除流程的服务，删除流程实例和相关的待办
             */
            cancel(){
                var _this = this;
                if(_this.isStart ) {
                    this.$myHttp({
                        method: 'GET',
                        url: this.prefix+'/microarch/activiti/instance/delete/'+_this.processInstanceId,
                        data: {}
                    }).then(res => {
                        this.dialogVisible = false;
                    })
                }else{
                    this.dialogVisible = false;
                }
            },

            /**
             * 审批页面点击关闭 X
             * 判断是否发起还未提交，此时已经发起流程产生流程实例，待办
             * 取消时调用删除流程的服务，删除流程实例和相关的待办
             */
            handleClose() {
                var _this = this;
                _this.$confirm('确认关闭？')
                    .then(_ => {
                        if(_this.isStart ) {
                            this.$myHttp({
                                method: 'GET',
                                url: this.prefix+'/microarch/activiti/instance/delete/'+_this.processInstanceId,
                                data: {}
                            }).then(res => {
                                _this.dialogVisible = false;
                            })
                        }else{
                            _this.dialogVisible = false;
                        }
                    });
            },
            changeUser(val) {
                if(!this.isMultiple) {
                    this.approvers = val
                }
            },
            changeRead(val) {
                if(!this.isReadMultiple) {
                    this.readers = val
                }
            },
            changeOpinion(val){
                this.form.opinion = val
                this.wordStatic()
            },
            changeSeekOpinion(val){
                this.form.seekOpinion = val
                this.wordSeekStatic()
            },
            saveOpioion() {
                if(this.form.opinion == ''){
                    this.$message({
                        message: '未填写审批意见',
                        type: 'warning'
                    });
                    return null;
                }
                var param = {}
                param.opinion = this.form.opinion
                param.userName = sessionStorage.getItem('userName')
                this.$myHttp({
                    method: 'POST',
                    url: this.prefix+'/microarch/activiti/saveCommonOpinion',
                    data: param
                }).then(res => {
                    this.$message({
                        message: '设置成功',
                        type: 'success'
                    });
                    this.commonOpinions.unshift({"value":this.form.opinion})
                })
            },
            saveSeekOpioion() {
                if(this.form.seekOpinion == ''){
                    this.$message({
                        message: '未填写审批意见',
                        type: 'warning'
                    });
                    return null;
                }
                var param = {}
                param.opinion = this.form.seekOpinion
                param.userName = sessionStorage.getItem('userName')
                this.$myHttp({
                    method: 'POST',
                    url: this.prefix+'/microarch/activiti/saveCommonOpinion',
                    data: param
                }).then(res => {
                    this.$message({
                        message: '设置成功',
                        type: 'success'
                    });
                    this.commonOpinions.unshift({"value":this.form.seekOpinion})
                })
            },
            /**
             * 传阅人
             * */
            showManagerName(cName,userName){
                this.readers=userName;
                this.readerName=cName;
                this.dialogReadVisible=false;
            },
            showDialog(){
                this.dialogReadVisible = true;
                setTimeout(function () {
                    document.getElementsByClassName('el-dialog__body')[1].style.padding='0px 5px 30px 5px';
                    var formStyle=document.getElementById('formStyle1').getElementsByClassName('el-form-item');
                    for(var i=0;i<formStyle.length;i++){
                        formStyle[i].style.marginBottom='5px';
                    }
                },0)
                //解决表格表头错位的问题
                setTimeout(function () {
                    var curTable=document.getElementById('curTable');
                    var thGutter=curTable.getElementsByClassName('gutter')[0];
                    thGutter.style.display='table-cell';
                },500);
            },
            showSeekDialog() {
                if(!this.isBack){
                    this.dialogSelectSeekVisible = true;

                    //解决表格表头错位的问题
                    setTimeout(function () {
                        var curTable=document.getElementById('curTable');
                        var thGutter=curTable.getElementsByClassName('gutter')[0];
                        thGutter.style.display='table-cell';
                    },500);
                }
            },
            showSeekName(cName,userName) {
                this.seeker=userName;
                this.seekerName=cName;
                this.dialogSelectSeekVisible=false;
            },
            /**
             * 转发人选择
             * */
            showReferTo() {
                this.dialogSelectReferToVisible = true
                setTimeout(function () {
                    document.getElementsByClassName('el-dialog__body')[0].style.padding='5px 5px 30px 5px';
                    var formStyle=document.getElementById('formStyletyleRefer').getElementsByClassName('el-form-item');
                    for(var i=0;i<formStyle.length;i++){
                        formStyle[i].style.marginBottom='5px';
                    }
                },0)
                //解决表格表头错位的问题
                setTimeout(function () {
                    var curTable=document.getElementById('curTable');
                    var thGutter=curTable.getElementsByClassName('gutter')[0];
                    thGutter.style.display='table-cell';
                },500);
            },
            showReferToName(cName,userName) {
                this.referToUser=userName;
                this.dialogSelectReferToVisible=false;
                this.referTo()
            },
            /**
             * 切换流向事件
             * 每次切换流向先清空之前已选的信息
             * 重新根据选择的流向加载相关的信息
             * */
            changeRadio(val) {
                var _this = this;
                var optionList = _this.optionList
                _this.approverOptions = []
                _this.approvers = []
                _this.isBack = false
                _this.isMultiple=false
                _this.showAutoApproval = false
                _this.parallelTypes = []
                _this.showParallelUser = false
                if(_this.autoMap.nextNode) {
                    if(_this.autoMap.nextNode == val) {
                        _this.showAutoApproval = true
                    }
                }
                _this.isParallel = false
                if(val != 'end') {
                    for(var j = 0,len=optionList.length; j < len; j++) {
                        if(optionList[j].id === val) {
                            var resArry = [];
                            if(optionList[j].isAuto) {
                                var autos = optionList[j].autoApproval.autoNextActivitiList
                                _this.autoNode.id = optionList[j].autoApproval.autoNodeId;
                                _this.autoNode.name = optionList[j].autoApproval.autoNode;
                                for(var k = 0,len=optionList.length; k < len; k++ ) {
                                    if(optionList[k].id == val) {
                                        optionList.remove(k)
                                        break
                                    }
                                }
                                for(var c = 0,len=autos.length; c < len; c++ ) {
                                    optionList.push(autos[c])

                                }
                                _this.optionList = optionList
                                _this.showAutoApproval = true
                                _this.autoMap.nextNode = autos[0].id
                            }else{
                                if(optionList[j].item.selectItems instanceof Array) {
                                    for(var d=0,len = optionList[j].item.selectItems.length; d < len; d++){
                                        resArry.push({
                                            label: optionList[j].item.selectItems[d].fullName,
                                            value: optionList[j].item.selectItems[d].userName
                                        })
                                    }
                                }else{
                                    if(optionList[j].item instanceof Array) {
                                        resArry.push({
                                            label: optionList[j].item[0].fullName,
                                            value: optionList[j].item[0].userName
                                        })
                                    }else{
                                        resArry.push({
                                            label: optionList[j].item.fullName,
                                            value: optionList[j].item.userName
                                        })
                                    }


                                    _this.approvers = resArry[0].value
                                }

                                _this.approverOptions = resArry;
                                if(optionList[j].item.selectType == 'M') {
                                    _this.isMultiple = true;
                                }else if(optionList[j].item.selectType == 'S') {
                                    _this.isMultiple = false;
                                }
                                _this.showUser = true
                            }

                            break;
                        }
                    }
                    _this.nextId = val
                    if(!_this.isBack) {
                        if(!_this.isMultiple) {
                            _this.approvers = _this.approverOptions.length == 0 ? '' :  _this.approverOptions[0].value; // optionList[0].item.selectItems[0].userName == undefined ? optionList[0].item : optionList[0].item.selectItems[0].userName
                        }else {
                            _this.approvers = [_this.approverOptions[0].value]
                        }
                    }
                    _this.showUser = true;

                }else{
                    _this.approvers = ''
                    _this.nextId = val
                    _this.showUser = false;
                }
            },

            changeSeekRadio(val) {
                var _this = this;
                var optionList = _this.optionList
                _this.approverOptions = []
                _this.approvers = []
                _this.isBack = false
                _this.isMultiple=false
                _this.showAutoApproval = false
                _this.parallelTypes = []
                _this.showParallelUser = false
                _this.showSeekerQuery = false
                _this.showSeekUser = false
                _this.seeker = ''
                _this.seekerName=''
                for(var j = 0,len=optionList.length; j < len; j++) {
                    if(optionList[j].id === val) {
                        if(optionList[j].isBack) {
                            _this.showSeekerQuery = true
                            _this.seeker = optionList[j].item[0].userName
                            _this.seekerName=optionList[j].item[0].fullName
                            _this.isBack = true
                            _this.showSeekerQuery = false
                            _this.showSeekUser = true

                        }else{
                            _this.showSeekerQuery = true
                            _this.showSeekUser = true

                        }
                        break;
                    }
                }
                _this.nextId = val
            },
            /**
             * 切换并发流向事件
             * 每次切换流向先清空之前已选的非并发流向的信息
             * 已选的并发流向的信息不变
             * */
            changeCheckbox(val) {
                var _this = this;
                var optionList = _this.parallelOptions
                _this.approverOptions = []
                _this.approvers = ''
                _this.isBack = false
                _this.isMultiple=false
                _this.showAutoApproval = false
                _this.showUser = false
                _this.form.optionType = ''
                _this.isParallel = true
                if(val != 'end') {
                    var array = _this.parallelList;
                    if(val.length >0 && array.length >val.length) {
                        for (var o = 0; o < array.length; o++) {
                            for(var i=0; i <val.length;i++) {
                                if(val[i] != array[o].id) {
                                    array.remove(array[o])
                                }
                            }
                        }
                    }
                    if(val.length >0) {
                        for(var i=0; i <val.length;i++) {
                            if(array.length >0) {
                                for (var o = 0; o < array.length; o++) {
                                    if (val[i] == array[o].id) {
                                    } else {
                                        for (var j = 0; j < optionList.length; j++) {
                                            // for(var i=0; i <val.length;i++){
                                            if (optionList[j].id === val[i]) {
                                                var resObj = {};
                                                resObj.name = "请选择" + optionList[j].name
                                                // parallelList
                                                resObj.id = val[i]
                                                resObj.parallelUser = ''
                                                var resArry = []
                                                if (optionList[j].item.selectItems instanceof Array) {
                                                    for (var d = 0, len = optionList[j].item.selectItems.length; d < len; d++) {
                                                        resArry.push({
                                                            label: optionList[j].item.selectItems[d].fullName,
                                                            value: optionList[j].item.selectItems[d].userName
                                                        })
                                                    }
                                                } else {
                                                    if (optionList[j].item instanceof Array) {
                                                        resArry.push({
                                                            label: optionList[j].item[0].fullName,
                                                            value: optionList[j].item[0].userName
                                                        })
                                                    } else {
                                                        resArry.push({
                                                            label: optionList[j].item.fullName,
                                                            value: optionList[j].item.userName
                                                        })
                                                    }
                                                }
                                                resObj.approver = resArry
                                                if (optionList[j].item.selectType == 'M') {
                                                    resObj.isMultiple = true;
                                                    resObj.selectType = 'M';
                                                } else if (optionList[j].item.selectType == 'S') {
                                                    resObj.isMultiple = false;
                                                    resObj.selectType = 'S';
                                                }
                                                resObj.showUser = true
                                                array.push(resObj)
                                            }
                                        }
                                    }
                                }
                            }else {
                                for (var j = 0; j < optionList.length; j++) {
                                    // for(var i=0; i <val.length;i++){
                                    if (optionList[j].id === val[i]) {
                                        var resObj = {};
                                        resObj.name = "请选择" + optionList[j].name
                                        // parallelList
                                        resObj.parallelUser = ''
                                        resObj.id = val[i]
                                        var resArry = []
                                        if (optionList[j].item.selectItems instanceof Array) {
                                            for (var d = 0, len = optionList[j].item.selectItems.length; d < len; d++) {
                                                resArry.push({
                                                    label: optionList[j].item.selectItems[d].fullName,
                                                    value: optionList[j].item.selectItems[d].userName
                                                })
                                            }
                                        } else {
                                            if (optionList[j].item instanceof Array) {
                                                resArry.push({
                                                    label: optionList[j].item[0].fullName,
                                                    value: optionList[j].item[0].userName
                                                })
                                            } else {
                                                resArry.push({
                                                    label: optionList[j].fullName,
                                                    value: optionList[j].userName
                                                })
                                            }
                                        }
                                        resObj.approver = resArry
                                        if (optionList[j].item.selectType == 'M') {
                                            resObj.isMultiple = true;
                                            resObj.selectType = 'M';
                                        } else if (optionList[j].item.selectType == 'S') {
                                            resObj.isMultiple = false;
                                            resObj.selectType = 'S';
                                        }
                                        resObj.showUser = true
                                        array.push(resObj)
                                    }

                                }
                            }

                        }

                    }else {
                        array=[]
                    }

                    _this.parallelList = array
                    if(array.length >0) {
                        _this.showParallelUser = true
                        for(var k=0; k <array.length; k ++) {
                            if (array[k].selectType == 'M') {
                                _this.parallelList[k].parallelUser = [array[k].approver[0].value]
                            } else if (array[k].selectType == 'S') {
                                _this.parallelList[k].parallelUser = array[k].approver[0].value
                            }
                        }

                    }else {
                        _this.showParallelUser = false
                    }

                }
            },
            /**
             * 结束流程
             * 将流程直接指定到结束节点
             * */
            endProcess(){
                var _this = this;
                var param = {};
                param.processInstanceId = _this.processInstanceId;
                param.optionType = 'endProcess'
                param.optionText = '结束流程'
                _this.$confirm('确认结束流程？')
                    .then(_ => {
                        this.$myHttp({
                            method: 'POST',
                            url: this.prefix+'/microarch/activiti/instance/effect?processInstanceId=' + _this.processInstanceId,
                            data: param
                        }).then(res => {
                            _this.$emit("processCallback", _this.processInstanceId, 'endProcess',_this.taskType)
                        })
                    }).catch(_ => {});
            },
            /**
             * 撤销审批
             * 删除流程信息 业务表单从流程中剥离
             * */
            repelProcess(){
                var _this = this;
                var param = {};
                param.optionType = 'repelProcess'
                param.optionText = '撤销流程'
                _this.$confirm('确认撤销流程？')
                    .then(_ => {
                        this.$myHttp({
                            method: 'GET',
                            url: this.prefix + '/microarch/activiti/undo/' + _this.processInstanceId,
                            params: param
                        }).then(res => {
                            this.$message({
                                message: '撤销成功',
                                type: 'success'
                            });
                            _this.$emit("processCallback", null, 'repelProcess',_this.taskType)
                        }).catch(_ => {
                            this.$message({
                                message: '单据异常，不可操作，请重新刷新单据或者联系管理员。',
                                type: 'warning'
                            });
                        });
                    }).catch(_ => {})
            },
            /**
             * 取回
             * 从已办箱中取回，只有对应的待办未签收时才能取回
             * */
            withDrawProcess() {
                var _this = this;
                var param = {};
                param.optionType = 'callBackProcess'
                param.optionText = '取回'
                param.taskId = _this.withdrawId
                param.withdrawId = _this.taskId
                param.processInstanceId = _this.processInstanceId
                param.nextId = _this.activityId
                param.priority = _this.form.urgency
                param.userName = sessionStorage.getItem('userName')
                _this.$confirm('确认取回？')
                    .then(_ => {
                        this.$myHttp({
                            method: 'POST',
                            url: this.prefix+'/microarch/activiti/callBack',
                            data: param
                        }).then(res => {
                            this.$message({
                                message: '取回成功',
                                type: 'success'
                            });
                            _this.$emit("processCallback", _this.processInstanceId, 'callBackProcess',_this.taskType)
                        }).catch(_ => {
                            this.$message({
                                message: '单据异常，不可操作，请重新刷新单据或者联系管理员。',
                                type: 'warning'
                            });
                        });
                    }).catch(_ => {})
            },

            /**
             * 转发
             * 将自己的待办转发给别人
             * */
            referTo() {
                var _this = this;
                var param = {};
                param.optionType = 'ReferToProcess'
                param.optionText = '转发'
                param.businessKey = _this.businessId || _this.businessKey;
                param.processInstanceId = _this.processInstanceId;
                param.processInstanceName = _this.processInstanceName || _this.businessName;
                param.processKey = _this.processDid;
                param.taskId = _this.taskId;
                param.taskName = _this.form.currentNodeName;
                param.priority = _this.form.urgency;
                param.goId = _this.goId;
                param.opinion = _this.form.opinion;
                param.email = _this.form.remindType ? "1" : "0";
                param.userName = sessionStorage.getItem('userName'); // Cookies.get('user');
                param.nextId = _this.activityId;
                var users = {};
                param.candidateUserIds = [_this.referToUser];
                users[param.nextId] = param.candidateUserIds
                param.candidateUserIds= users;
                _this.$confirm('确认转发？')
                    .then(_ => {
                        this.$myHttp({
                            method: 'POST',
                            url: this.prefix+'/microarch/activiti/forwarding',
                            data: param
                        }).then(res => {
                            this.$message({
                                message: '转发成功',
                                type: 'success'
                            });
                            _this.$emit("processCallback", _this.processInstanceId, 'callBackProcess',_this.taskType)
                        }).catch(_ => {
                            this.$message({
                                message: '单据异常，不可操作，请重新刷新单据或者联系管理员。',
                                type: 'warning'
                            });
                        });
                    }).catch(_ => {})
            },
            /**
             * 征询页面展示
             * */
            seekOpinion() {
                var _this = this;
                var param = {};
                _this.form.seekOpinion = ''
                _this.nextId = ''
                _this.seeker = ''
                _this.seekerName=''
                param.businessKey = _this.businessId;
                param.processInstanceId = _this.processInstanceId;
                param.processInstanceName = _this.processInstanceName || _this.businessName;
                param.processKey = _this.processDid;
                param.taskId = _this.taskId;
                param.taskName = _this.currentNode;
                param.priority = _this.form.urgency;
                param.goId = _this.goId;
                param.nextId = _this.nextId;
                param.opinion = _this.form.seekOpinion;
                param.userName = sessionStorage.getItem('userName'); // Cookies.get('user');
                param.seekIndex= _this.seekIndex;
                _this.$confirm('确认征询？')
                    .then(_ => {
                        this.$myHttp({
                            method: 'POST',
                            url: this.prefix+'/microarch/activiti/seekOpinion',
                            data: param
                        }).then(res => {
                            console.log(res.data.activityList+"=============")
                            _this.optionList = res.data.activityList
                            _this.seekIndex = res.data.seekIndex
                            if(res.data.backActivityList.length >0 ){
                                _this.optionList = _this.optionList.concat(res.data.backActivityList)
                            }
                            _this.showSeekUser = false
                            _this.form.optionType = ''
                            _this.dialogSeekVisible = true
                            if(res.data.commonOpinions.length >0){
                                var resArry = []
                                for(var d=0,len = res.data.commonOpinions.length; d < len; d++){
                                    resArry.push({
                                        value: res.data.commonOpinions[d].opinion
                                    })
                                }
                                _this.commonOpinions = resArry
                            }
                        })
                    }).catch(_ => {
                })
            },
            /**
             * 征询确认
             * */
            confirmSeek()  {
                var _this = this;
                var param = {};
                var users = {};
                param.businessKey = _this.businessId;
                param.processInstanceId = _this.processInstanceId;
                param.processInstanceName = _this.processInstanceName || _this.businessName;
                param.processKey = _this.processDid;
                param.taskId = _this.taskId;
                param.taskName = _this.currentNode;
                param.priority = _this.form.urgency;
                param.goId = _this.goId;
                param.nextId = _this.nextId;
                param.opinion = _this.form.seekOpinion;
                param.userName = sessionStorage.getItem('userName'); // Cookies.get('user');
                param.seekIndex= _this.seekIndex;
                if(param.nextId == "") {
                    this.$message({
                        message: '未选择流向，请选择！',
                        type: 'warning'
                    });
                    return null;
                }
                if(_this.seeker instanceof Array) {
                    param.candidateUserIds = _this.seeker;
                    if(_this.seeker.length == 0) {
                        this.$message({
                            message: '处理人为空，请选择处理人',
                            type: 'warning'
                        });
                        return null;
                    }
                }else{
                    if(_this.seeker == "") {
                        this.$message({
                            message: '处理人为空，请选择处理人',
                            type: 'warning'
                        });
                        return null;
                    }else{
                        param.candidateUserIds = [_this.seeker];
                    }
                }

                var content = _this.form.seekOpinion ;
                content = content.replace(/\ +/g, ""); //去掉空格
                content = content.replace(/[ ]/g, "");    //去掉空格
                content = content.replace(/[\r\n]/g, ""); //去掉回车换行
                var s= content.length;
                if(s == 0) {
                    this.$message({
                        message: '请填写审批意见！',
                        type: 'warning'
                    });
                    return null;
                }
                users[param.nextId] = param.candidateUserIds
                param.candidateUserIds= users;
                param.optionType = 'seeking'
                param.optionText = '征询'
                this.$myHttp({
                    method: 'POST',
                    url: this.prefix+'/microarch/activiti/seekSubmit',
                    data: param
                }).then(res =>{
                    _this.dialogSeekVisible = false
                    _this.$emit("processCallback", _this.processInstanceId, 'seekingProcess',_this.taskType)
                }).catch(_ => {
                    this.$message({
                        message: '单据异常，不可操作，请重新刷新单据或者联系管理员。',
                        type: 'warning'
                    });
                });

            },
            cancelSeek() {
                this.dialogSeekVisible = false
            },
            /**
             * 流程追踪事件
             * 显示流程图及审批历史
             * */
            popHistory() {
                this.$myHttp({
                    method:'get',
                    url:this.prefix+"/microarch/activiti/trace/photo?processInstanceId="+this.processInstanceId,
                    responseType: 'arraybuffer'
                }).then(res=>{
                    // console.log('imgsrc---',res)
                    return 'data:image/png;base64,' + btoa(
                        new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
                    )
                }).then(data => {
                    this.taskListDate.imgSrc = data
                });
                this.taskListDate.trackListUrl ='/microarch/activiti/task/trace/list/'+this.processInstanceId
                // this.taskListDate.imgSrc = this.prefix+"/microarch/activiti/trace/photo?processInstanceId="+this.processInstanceId

                this.dialogHisVisible = true
            },
            /**
             * 审批意见字数限制，字数超过200时不能输入，自动删除多余的字
             * */
            wordStatic() {
                var maxl=200
                var content = this.form.opinion ;

                // content = content.replace(/\n|\r/gi, "")
                content = content.replace(/\ +/g, ""); //去掉空格
                content = content.replace(/[ ]/g, "");    //去掉空格
                content = content.replace(/[\r\n]/g, ""); //去掉回车换行
                var numContent = document.getElementById('num') ;
                var s= content.length;
                if(s>maxl) {
                    this.form.opinion = content.substr(0,maxl-1);
                } else{
                    numContent.innerText = content.length;
                }
            },
            wordSeekStatic() {
                var maxl=200
                var content = this.form.seekOpinion ;

                // content = content.replace(/\n|\r/gi, "")
                content = content.replace(/\ +/g, ""); //去掉空格
                content = content.replace(/[ ]/g, "");    //去掉空格
                content = content.replace(/[\r\n]/g, ""); //去掉回车换行
                var numContent = document.getElementById('num2')  ;
                var s= content.length;
                if(s>maxl) {
                    this.form.seekOpinion = content.substr(0,maxl-1);
                } else{
                    numContent.innerText = content.length;
                }
            },
            tagClose(tagName) {
                this.$router.back(-1);
                this.$store.commit('removeTag', tagName);
                this.$store.commit('closePage', tagName);
            }
        },
        mounted: function (event) {

        }
    }

    /**
     * 原生js方法，根据数组下标移除数组的元素
     * */
    Array.prototype.remove=function(obj){
        for(var i =0;i <this.length;i++){
            var temp = this[i];
            if(!isNaN(obj)){
                temp=i;
            }
            if(temp == obj){
                for(var j = i;j <this.length;j++){
                    this[j]=this[j+1];
                }
                this.length = this.length-1;
            }
        }
    }
    Object.defineProperty(Array.prototype, "remove", { enumerable:false });
</script>

<style>
    .popApproval .el-dialog__header {
        padding: 8px 20px 8px;
        background: #9fc1e4;
    }
    .popApproval .el-dialog__headerbtn {
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
    .popApproval .el-dialog__body {
        padding: 30px 20px;
        padding-bottom: 0px;
        padding-top: 5px;
        color: #606266;
        line-height: 24px;
        font-size: 14px;
    }
    .popApproval .el-dialog__footer {
        padding: 10px 20px 20px;
        padding-top: 0px;
        text-align: right;
        box-sizing: border-box;
    }
    .popApproval .el-form-item__label {
        text-align: right;
        float: left;
        font-size: 14px;
        color: #606266;
        line-height: 30px;
        padding: 0 12px 0 0;
        box-sizing: border-box;
    }
    .popApproval .el-form-item__content {
        line-height: 30px;
        position: relative;
        font-size: 14px;
    }
    .popApproval .el-form-item {
        font-size: 14px;
        padding-left: 10px;
        padding-right: 20px;
    }
    .popApproval .el-radio__label {
        margin-bottom: 10px;
    }
    .popApproval .el-radio+.el-radio {
        margin-left: 0px;
    }
    .ems-dialog .el-dialog__body {
        padding:0px 5px 30px 5px;
    }
    .popApproval .el-radio {
        color: #606266;
        font-weight: 500;
        line-height: 1.5;
        cursor: pointer;
        white-space: nowrap;
        outline: 0;
        margin-right: 20px;
    }
    fieldset {
        padding:10px;
        margin:10px;
        color:#333;
        border:#06c dashed 1px;
    }
    legend {
        color:#06c;
        font-weight:800;
        background:#fff;
        border:#b6b6b6 solid 1px;
        padding:3px 6px;
    }
</style>