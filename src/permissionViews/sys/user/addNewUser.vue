<template>
    <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item style="padding:0 20px;background: #fff;" name="1">
                    <template slot="title">
                        <div class="moduleTit">
                        <h3>
                            <span class="infoTit">用户基本信息</span>
                        </h3>
                        </div>
                    </template>
                    <div class="moduleWhite" style="margin-top:20px;">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="所在部门" prop="deparment">
                                <el-popover
                                        placement="bottom"
                                        width="100%"
                                        trigger="click">
                                    <el-tree
                                            :data="myTreeData"
                                            :props="defaultProps"
                                            node-key="id"
                                            :default-expanded-keys="[firstTreeId]"
                                            @node-click="handleNodeClick"
                                            ref="tree"
                                            class="treeShow">
                                    </el-tree>
                                    <el-input ref="departmentInput" v-model="ruleForm.deparment" slot="reference" placeholder="请输入所在部门" readOnly size="small" @focus="showTree" clearable></el-input>
                                </el-popover>
                            </el-form-item>
                            <el-form-item label="性别" prop="gender">
                                <el-radio-group v-model="ruleForm.gender" size="small">
                                    <el-radio label="男">男</el-radio>
                                    <el-radio label="女">女</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <div class="sliceLine"></div>
                            <el-form-item label="固定电话" prop="tel">
                                <el-input v-model="ruleForm.tel" placeholder="请填写固定电话" size="small" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="用户类型" prop="userType">
                                <el-select size="small" v-model="ruleForm.userType" placeholder="请选择用户类型" @change="chooseMust" clearable style="width:100%;">
                                    <el-option label="内部" value="内部"></el-option>
                                    <el-option label="外部" value="外部"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="用户编码" prop="userCode">
                                <el-input v-model="ruleForm.userCode" placeholder="请输入用户编码" size="small" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="登录名" prop="userName">
                                <el-input v-model="ruleForm.userName" placeholder="请输入登录名" size="small" :clearable="clearable" :disabled="disabled"></el-input>
                            </el-form-item>
                            <el-form-item label="出生日期">
                                <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.birthday" size="small" clearable style="width: 100%;"></el-date-picker>
                            </el-form-item>
                            <div class="sliceLine"></div>
                            <el-form-item label="邮件" prop="email">
                                <el-input v-model="ruleForm.email" placeholder="请填写邮件" size="small" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="主管" prop="mainManager">
                                <div @click="showDialog">
                                <el-input v-model="ruleForm.mainManager" placeholder="请输入主管" size="small" ref="managerInput" clearable></el-input>
                                </div>
                            </el-form-item>
                            <div style="padding-left: 60px;" v-show="resetVisable">
                                 <el-button type="warning" size="medium" @click="resetPassword()">重置密码</el-button>
                            </div>
                            <el-dialog top="8vh"
                                       width="55%"
                                       class="popUserCust"
                                       title="请选择主管"
                                       :visible.sync="dialogTableVisible"
                                       :append-to-body="true"
                                       :modal-append-to-body="false">
                                <manager-list @getManagerName="showManagerName" id="formStyle"></manager-list>
                            </el-dialog>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="姓名" prop="cname">
                                <el-input v-model="ruleForm.cname" placeholder="请输入姓名" size="small" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="移动电话" prop="mobile">
                                <el-input v-model="ruleForm.mobile" placeholder="请填写移动电话" size="small" clearable></el-input>
                            </el-form-item>
                            <div class="sliceLine"></div>
                            <el-form-item label="状态" prop="status">
                                <el-switch
                                        :disabled="loginPersonFlag"
                                        size="small"
                                        v-model="ruleForm.status"
                                        active-text="启用"
                                        inactive-text="停用">
                                </el-switch>
                            </el-form-item>
                            <!--<el-form-item label="状态" prop="status">-->
                                <!--<el-radio-group v-model="ruleForm.status" size="small">-->
                                    <!--<el-radio label="启用">启用</el-radio>-->
                                    <!--<el-radio label="停用">停用</el-radio>-->
                                <!--</el-radio-group>-->
                            <!--</el-form-item>-->
                            <el-form-item label="职位" prop="position">
                                <el-select v-model="ruleForm.position" placeholder="请选择职位" style="width:100%;" size="small" clearable>
                                    <el-option v-for="(item,index) in allPost" :key="index" :label="item.postName+'('+item.typeName+')'" :value="item.postCode"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    </div>
                    </el-collapse-item>
                    <hr/>
                    <el-collapse-item style="padding:0 20px;background: #fff;" name="2">
                        <template slot="title">
                            <div class="moduleTit">
                                <h3>
                                    <span class="infoTit">用户角色信息</span>
                                </h3>
                            </div>
                        </template>
                        <div class="moduleWhite" style="margin-top:20px;">
                    <el-row>
                        <el-col :span="10">
                            <ul class="roleUl" id="roleUlTable">
                                <li style="background: #edf2f8;">
                                     <!--<span class="checkselect">  <el-checkbox v-model="checkAll" @change="handleCheckAllChange"></el-checkbox></span>-->
                                     <span class="selectName">角色名称</span>
                                     <span class="roleCodeSpan">角色编码</span>
                                     <span class="btnAction">
                                         <el-button type="success" size="mini" icon="el-icon-plus"  circle @click="addRole">
                                         </el-button>
                                     </span>
                                </li>
                                <li class="firstRole" v-for="(item,index) in roleData" style="background:#fff;">
                                    <!--<span class="checkselect">-->
                                        <!--<el-checkbox class="checkedBox" v-model="item.checked"></el-checkbox>-->
                                    <!--</span>-->
                                    <span class="selectName">
                                        <el-select  v-if="index==0" :value="item.valueRole=defaultRole?defaultRole.value:''" disabled size="small" style="width:80%;">
                                            <el-option
                                                    :label="defaultRole?defaultRole.label:'一般用户'"
                                                    :value="defaultRole?defaultRole.value:''">
                                            </el-option>
                                        </el-select>
                                        <el-select v-else v-model="item.valueRole" @change="showRoleCode" placeholder="请选择" size="small" style="width:80%;">
                                            <el-option
                                                    v-for="(items,i) in roleOptions"
                                                    :key="items.value"
                                                    :label="items.label"
                                                    :value="items.value">
                                            </el-option>
                                         </el-select>
                                    </span>
                                    <span class="roleCodeSpan">
                                        {{item.valueRole?item.valueRole.split('|')[1]:''}}
                                    </span>
                                    <span class="btnAction">
                                        <p class="transFace" v-if="index==0" style="opacity:0.5;background: #fff;" :dir="item.valueRole?item.valueRole.split('|')[0]:''"></p>
                                        <p class="transFace" v-else @click="delRole($event)" :dir="item.valueRole?item.valueRole.split('|')[0]:''"></p>
                                        <el-button
                                                class="delLine"
                                                size="mini"
                                                type="danger"
                                                circle
                                                title="删除"
                                                >
                                                <i class="el-icon-delete"
                                                   style="font-size: 11px"></i>
                                        </el-button>
                                    </span>
                                </li>
                            </ul>

                        </el-col>
                    </el-row>
                        </div>
                    </el-collapse-item>
                <hr/>
                <el-collapse-item style="padding:0 20px;background: #fff;margin-bottom: 50px;" name="3">
                    <template slot="title">
                        <div class="moduleTit">
                            <h3>
                                <span class="infoTit">用户扩展信息</span>
                            </h3>
                        </div>
                    </template>
                    <div class="moduleWhite" style="margin-top:20px;">
                        <my-custom-items cfObjCode="SYS_USER_EXT_" ref="custom" :mid="ruleForm.id" :dataUrl="extDataUrl">
                        </my-custom-items>
                    </div>
                </el-collapse-item>
                <hr/>
                <hr/>
            </el-collapse>
            <div style="text-align:center;position: fixed;width:calc(100% - 235px);;bottom:20px;">
                <el-button type="primary"  icon="el-icon-circle-plus-outline" size="medium" round @click="submitForm('ruleForm')">保存</el-button>
                <el-button class="el-icon-back" size="medium" round @click="goBack">返回</el-button>
            </div>

        </el-form>


    </div>
</template>
<script>
import managerList from './managerList';
import myCustomItems from '@/components/myCustomItems';

export default {
    components: {managerList, myCustomItems},
    data () {
        var checkUserNameRepeat = (rule, value, callback) => {
            var value = value.toString().replace(/^(\s)*|(\s)*$/g, '');
            if (value == this.comUserName) {
                callback();
                return true;
            }
            this.$myHttp({
                method: 'post',
                url: this.permissionPrefix + '/microarch/sys/sysuser/checkUserNameExist',
                data: {
                    'entity': {
                        'userName': value
                    }
                }
            }).then(res => {
                // console.log('value---',value)
                // console.log('res---',res)
                if (res.data) {
                    if (res.data.ext) {
                        callback(new Error('登录名重复,请修改'));
                    } else {
                        callback();
                        return true;
                    }
                }
            });
        };
        var checkUserCodeRepeat = (rule, value, callback) => {
            var value = value.toString().replace(/^(\s)*|(\s)*$/g, '');
            if (value == this.comUserCode) {
                callback();
                return true;
            }
            this.$myHttp({
                method: 'post',
                url: this.permissionPrefix + '/microarch/sys/sysuser/checkUserCodeExist',
                data: {
                    'entity': {
                        'userCode': value
                    }
                }
            }).then(res => {
                // console.log('value---',value)
                // console.log('res---',res)
                if (res.data) {
                    if (res.data.ext) {
                        callback(new Error('用户编码重复,请修改'));
                    } else {
                        callback();
                        return true;
                    }
                }
            });
        };
        var checkPhone = (rule, value, callback) => {
            const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/;
            if (!value) {
                callback();
                return true;
                // return callback(new Error('电话号码不能为空'))
            }
            setTimeout(() => {
                // Number.isInteger是es6验证数字是否为整数的方法,但是我实际用的时候输入的数字总是识别成字符串
                // 所以我就在前面加了一个+实现隐式转换

                if (!Number.isInteger(+value)) {
                    callback(new Error('请输入数字值'));
                } else {
                    if (phoneReg.test(value)) {
                        callback();
                    } else {
                        callback(new Error('移动电话号码格式不正确'));
                    }
                }
            }, 100);
        };
        var checkEmail = (rule, value, callback) => {
            const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
            if (!value) {
                callback();
                return true;
                // return callback(new Error('邮箱不能为空'))
            }
            setTimeout(() => {
                if (mailReg.test(value)) {
                    callback();
                } else {
                    callback(new Error('请输入正确的邮箱格式'));
                }
            }, 100);
        };
        var checkTel = (rule, value, callback) => {
            const telReg = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
            var value = value.replace(/^(\s)*|(\s)*$/g, '');
            if (!value) {
                callback();
                return true;
            } else {
                if (telReg.test(value)) {
                    callback();
                } else {
                    callback(new Error('固定电话号码格式不正确'));
                }
            }
        };
        return {
            loginPersonFlag:false,
            disabled:false,
            clearable:true,
            resetVisable:false,
            ruleForm: {
                id: '',
                deparment: '',
                departmentId: [],
                status: true,
                cname: '',
                gender: '男',
                userName: '',
                mobile: '',
                tel: '',
                birthday: '',
                email: '',
                userCode: '',
                userType: '',
                mainManager: '',
                position: '',
                roles: []
            },
            rules: {
                deparment: [
                    {required: true, message: '请输入所在部门', trigger: 'blur'},
                    {min: 1, max: 250, message: '长度在 1 到 250个字符', trigger: 'blur'}
                ],
                status: [
                    {required: true, message: '请选择状态', trigger: 'change'}
                ],
                cname: [
                    {required: true, message: '请输入姓名', trigger: 'blur'},
                    {min: 1, max: 250, message: '长度在 1 到 250 个字符', trigger: 'blur'}
                ],
                gender: [
                    {required: false, message: '请选择性别', trigger: 'blur'}
                ],
                userName: [
                    {required: true, message: '请输入登录名', trigger: 'blur'},
                    {validator: checkUserNameRepeat, trigger: 'blur'}
                ],
                mobile: [
                    {required: false, validator: checkPhone, trigger: 'blur'}
                ],
                tel: [
                    {required: false, validator: checkTel, trigger: 'blur'}
                ],
                birthday: [
                    {required: false, message: '请输入出生日期', trigger: 'blur'}
                ],
                email: [
                    {required: false, validator: checkEmail, reg: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/, trigger: 'blur'}
                ],
                userCode: [
                    {required: false, message: '请输入用户编码', trigger: 'blur'},
                    {validator: checkUserCodeRepeat, trigger: 'blur'}
                ],
                userType: [
                    {required: true, message: '请选择用户类型', trigger: 'change'}
                ],
                mainManager: [
                    {required: false, message: '请输入主管', trigger: 'blur'}
                ],
                position: [
                    {required: false, message: '请输入职位', trigger: 'change'}
                ]

            },
            roleOptions: [
                //     {
                //     value: '选项1',
                //     label: '黄金糕'
                // }, {
                //     value: '选项2',
                //     label: '双皮奶'
                // }, {
                //     value: '选项3',
                //     label: '蚵仔煎'
                // }, {
                //     value: '选项4',
                //     label: '龙须面'
                // }, {
                //     value: '选项5',
                //     label: '北京烤鸭'
                // }
            ],
            roleData2: [
                {
                    'headName': '角色名称',
                    'width': '180'
                },
                {
                    'headName': '角色编码',
                    'width': '180'
                }

            ],
            roleData: [{
                'valueRole': ''
            }
            ],
            checkAll: false,
            myTreeData: [
                {
                    id: '1',
                    menuName: '订单管理33',
                    // menuCode: '30',
                    childrens: [
                        {
                            id: 12,
                            pid: 1,
                            text: ''
                        }
                    ]
                }
            ],
            defaultProps: {
                children: 'childrens',
                label: 'text'
            },
            firstTreeId: '',
            menuName: 'text', // 显示菜单名称的属性
            allPost: [],
            selectedRoleIds: [],
            dialogTableVisible: false,
            tableData: [],
            center: 'center',
            dataId: '',
            comUserName: '', // 编辑时带过来的登录名
            comUserCode: '', // 编辑时带过来的用户编码
            defaultRole: null, // 选中默认角色
            activeNames: ['1', '2'],
            extDataUrl: '/microarch/sys/userext/view'
        };
    },
    mounted () {
        this.findAllpost();// 查找所有岗位
        this.findAllRoles();// 查找所有角色
    },
    created () {
        this.ruleForm.id = this.$route.params.id;
        if(this.ruleForm.id) {
            this.disabled = true
            this.clearable = false
            this.resetVisable = true
        }
    },
    methods: {
        backfilleditData () {
            var loginPerson=sessionStorage.getItem('userName');
            if (this.$route.params.id) {
                sessionStorage.setItem('edit_dataId', this.$route.params.id);
            }
            var getDataId = sessionStorage.getItem('edit_dataId');
            this.dataId = this.$route.params.id ? this.$route.params.id : getDataId;
            if (this.dataId) {
                this.$myHttp({
                    method: 'post',
                    url: this.permissionPrefix + '/microarch/sys/sysuser/view',
                    data: {
                        'entity': {
                            'id': this.dataId
                        }
                    }
                }).then(res => {
                    console.log('edit--------', res);
                    var backData = res.data.entity;
                    this.ruleForm.deparment = backData.orgs && backData.orgs[0] ? backData.orgs[0].orgName : '';
                    this.ruleForm.departmentId.push(backData.orgs && backData.orgs[0] ? backData.orgs[0].id : '');
                    this.ruleForm.status = backData.status == 'Y' ? true : backData.status == 'N' ? false : '';
                    this.ruleForm.cname = backData.cname ? backData.cname : '';
                    this.ruleForm.gender = backData.gender;
                    this.ruleForm.userName = backData.userName ? backData.userName : '';
                    this.ruleForm.mobile = backData.mobile ? backData.mobile : '';
                    this.ruleForm.tel = backData.tel ? backData.tel : '';
                    this.ruleForm.birthday = backData.birthday ? backData.birthday.split(' ')[0] : '';
                    this.ruleForm.email = backData.email ? backData.email : '';
                    this.ruleForm.userCode = backData.userCode ? backData.userCode : '';
                    this.ruleForm.userType = backData.userType ? backData.userType : '';
                    this.ruleForm.mainManager = backData.directManager ? backData.directManager : '';
                    this.ruleForm.position = backData.position ? backData.position : '';
                    this.comUserName = backData.userName ? backData.userName : '';
                    this.comUserCode = backData.userCode ? backData.userCode : '';
                    if (backData.userType == '内部') {
                        this.rules.mainManager[0].required = true;
                        this.rules.position[0].required = true;
                    }
                    if(this.ruleForm.userName==loginPerson){
                        this.loginPersonFlag=true;
                    }
                    console.log('backData.roles====', backData.roles);
                    if (backData.roles && backData.roles.length) {
                        this.roleData = [this.defaultRole ? this.defaultRole : ''];
                        for (var i = 0; i < backData.roles.length; i++) {
                            if (backData.roles[i].roleCode == 'everyone' || backData.roles[i].roleCode == 'EVERYONE' || backData.roles[i].roleName == '一般用户') { // 如果是一般用户就不用再展示一遍
                                continue;
                            }
                            var obj = {
                                'valueRole': backData.roles[i].id + '|' + backData.roles[i].roleCode
                            };
                            this.roleData.push(obj);
                        }
                    }
                });
            }
        },
        showDialog (event) {
            if (event.target.tagName == 'I' || event.target.tagName == 'SPAN') {
                return;
            }
            this.dialogTableVisible = true;
            // 修改el-dialog样式
            setTimeout(function () {
                document.getElementsByClassName('el-dialog__body')[0].style.padding = '0px 5px 30px 5px';
                var formStyle = document.getElementById('formStyle').getElementsByClassName('el-form-item');
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
        showManagerName (val) {
            this.ruleForm.mainManager = val;
            this.dialogTableVisible = false;
            this.$refs.managerInput.focus();
            this.$refs.managerInput.blur();
        },
        submitForm (formName) {
            var that = this;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // alert('submit!');
                    that.saveUser();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        saveUser () {
            var transFaces = document.getElementsByClassName('transFace');
            for (var i = 0; i < transFaces.length; i++) {
                var selfDir = transFaces[i].getAttribute('dir');
                // console.log('selfDir---',selfDir)
                if (selfDir != undefined && selfDir != '') {
                    this.ruleForm.roles.push(selfDir);
                }
            }
            this.ruleForm.roles = this.delRepeatRoleid(this.ruleForm.roles);
            // console.log('ruleForm.roles======',this.ruleForm.roles)
            if (this.$route.query.addFlag) { // 新增用户
                var params = {
                    entity: {
                        'orgIds': this.ruleForm.departmentId,
                        'userName': this.ruleForm.userName,
                        'cname': this.ruleForm.cname,
                        'gender': this.ruleForm.gender,
                        'birthday': this.ruleForm.birthday,
                        'tel': this.ruleForm.tel,
                        'mobile': this.ruleForm.mobile,
                        'email': this.ruleForm.email,
                        'userCode': this.ruleForm.userCode,
                        'status': this.ruleForm.status == true ? 'Y' : 'N',
                        'userType': this.ruleForm.userType,
                        'directManager': this.ruleForm.mainManager,
                        'position': this.ruleForm.position,
                        'roleIds': this.ruleForm.roles
                    }
                };
            } else { // 编辑用户
                var params = {
                    entity: {
                        'id': this.dataId,
                        'orgIds': this.ruleForm.departmentId,
                        'userName': this.ruleForm.userName,
                        'cname': this.ruleForm.cname,
                        'gender': this.ruleForm.gender,
                        'birthday': this.ruleForm.birthday,
                        'tel': this.ruleForm.tel,
                        'mobile': this.ruleForm.mobile,
                        'email': this.ruleForm.email,
                        'userCode': this.ruleForm.userCode,
                        'status': this.ruleForm.status == true ? 'Y' : 'N',
                        'userType': this.ruleForm.userType,
                        'directManager': this.ruleForm.mainManager,
                        'position': this.ruleForm.position,
                        'roleIds': this.ruleForm.roles
                    }
                };
            }
            console.log('params---bianji---', params);
            this.$myHttp({
                method: 'post',
                url: this.permissionPrefix + '/microarch/sys/sysuser/save',
                data: params
            }).then(res => {
                // console.log('save---res--user--',res);
                // this.$message({
                //     message:'保存成功',
                //     type:'success'
                // });

                var data = this.$refs['custom'].getData();
                data['userId'] = res.data.entity.id;
                data['extType'] = 'basic';
                this.$myHttp({
                    method: 'post',
                    url: this.prefix + '/microarch/sys/userext/save' + window.suffix,
                    data: {
                        'entity': data
                    }
                }).then(res => {
                    // 成功回调
                    this.$message({
                        message: '保存成功',
                        type: 'success'
                    });
                    this.$router.push({
                        name: "sys/user/userManagement"
                    });
                });
            });
        },
        delRepeatRoleid (arr) {
            // 数组去重方法
            var obj = {};
            var newArr = [];
            for (var i = 0; i < arr.length; i++) {
                if (!obj[arr[i]]) {
                    newArr.push(arr[i]);
                    obj[arr[i]] = 1;
                }
            };
            // console.log('newArr--',newArr);
            return newArr;
        },
        resetForm (formName) {
            this.$refs[formName].resetFields();
        },
        tableRowClassName ({row, rowIndex}) {
            if (rowIndex === 1) {
                return 'warning-row';
            } else if (rowIndex === 3) {
                return 'success-row';
            }
            return '';
        },
        handleSelectionChange (val) {
            this.multipleSelection = val;
        },
        addRole () {
            this.roleData.push({
                'valueRole': ''
            });
        },
        delRole (event) {
            var currentDir = event.target.getAttribute('dir');
            var currentEle = event.target.parentNode.parentNode;
            var k = '';
            // console.log('currentDir---',currentDir);
            currentEle.parentNode.removeChild(currentEle);
            // for(var i=0;i<this.ruleForm.roles.length;i++){
            //     if(currentDir==this.ruleForm.roles[i]){
            //         k=i;
            //     }
            // }
            // if(k!=''){
            //     this.ruleForm.roles.splice(k,1);
            // }
            // console.log('ruleForm--ROLEs====',this.ruleForm.roles)
        },
        handleCheckAllChange (val) {
            if (val) {
                for (var i = 0; i < this.roleData.length; i++) {
                    this.roleData[i].checked = true;
                }
            } else {
                for (var i = 0; i < this.roleData.length; i++) {
                    this.roleData[i].checked = false;
                }
            }
        },
        goBack () {
            this.$router.push({
                name: 'sys/user/userManagement'
            });
        },
        showTree () {
            this.showTreeData();
        },
        showTreeData () {
            var that = this;
            this.$myHttp({
                method: 'post',
                url: this.permissionPrefix + '/microarch/sys/sysorg/listTree'
            }).then(res => {
                if (res.data) {
                    let resData = JSON.parse(res.data.ext);
                    this.firstTreeId = resData.id;
                    this.myTreeData = [];
                    this.myTreeData.push(resData);
                    setTimeout(function () {
                        that.$refs.tree.store.nodesMap[that.firstTreeId].expanded = true;
                    }, 100);
                    // console.log('myTreeData---------',this.myTreeData)
                }
            });
        },
        handleNodeClick (data) {
            // console.log(data);
            this.ruleForm.deparment = data.text;
            this.ruleForm.departmentId = [data.id];
            this.$refs.departmentInput.focus();
            this.$refs.departmentInput.blur();
            document.body.click();
        },
        findAllpost () {
            var that = this;
            this.$myHttp({
                method: 'post',
                url: this.permissionPrefix + '/microarch/sys/syspost/findAllPosts'
            }).then(res => {
                console.log('post-----', res);
                let sysDict = JSON.parse(localStorage.getItem('sysDict'));
                for (var i = 0; i < sysDict.length; i++) {
                    if (sysDict[i].dtype == 'postType') {
                        var postTypeNameArr = sysDict[i].sysDicts;
                    }
                }
                if (res.data && res.data.rows) {
                    res.data.rows.forEach((item, index) => {
                        var post = {
                            'postName': '',
                            'id': ''
                        };
                        post.postName = item.postName;
                        post.postCode = item.postCode;
                        postTypeNameArr.forEach((items, i) => {
                            if (items.dkey == item.postType) {
                                post.typeName = items.dvalue;
                            }
                        });
                        that.allPost.push(post);
                    });
                }
            });
        },
        chooseMust (val) {
            console.log('val====', val);
            if (val == '内部') {
                this.rules.mainManager[0].required = true;
                this.rules.position[0].required = true;
            } else {
                this.rules.mainManager[0].required = false;
                this.rules.position[0].required = false;
            }
        },
        findAllRoles () {
            // options
            var that = this;
            this.$myHttp({
                method: 'post',
                url: this.permissionPrefix + '/microarch/sys/sysrole/findAllRoles'
            }).then(res => {
                // console.log('roles-----',res)
                this.roleOptions = [];
                if (res.data && res.data.rows) {
                    res.data.rows.forEach((item) => {
                        var obj = {};
                        obj.value = item.id + '|' + item.roleCode;
                        obj.label = item.roleName;
                        this.roleOptions.push(obj);
                        if (obj.label == '一般用户') {
                            this.defaultRole = (obj);
                        }
                    });
                    /// 数据回显
                    if (this.$route.query.addFlag) {
                        sessionStorage.removeItem('edit_dataId');
                    } else {
                        // 如果点击了编辑按钮回显数据
                        this.backfilleditData();
                    }
                }
            });
        },
        // 重置密码
        resetPassword() {
            var that = this;
            this.$myHttp({
                method: 'post',
                url: this.permissionPrefix + '/microarch/sys/sysuser/resetPassword?id='+this.dataId
            }).then(res => {
                if (res.data && res.data.entity) {
                    this.$message({
                        message: '密码重置成功！',
                        type: 'success',
                        duration: 1500
                    });

                }
            });
        },
        renderHeader (h) {
            return (
                <el-button type="success" size="mini" icon="el-icon-plus" circle onClick={this.addOperData}></el-button>
            );
        },
        addOperData () {
            this.tableData.push({});
        },
        showRoleCode (val) {
            console.log('roleVal-----', val);
            // this.ruleForm.roles.push(val.split('|')[0]);
        },
        handleChange (val) {
            console.log('val---', val);
        }

    }
};
</script>
<style scoped>
 hr{
     height:0px;
     border:0px solid #ccc;
     margin:10px 0;
 }
 .roleUl{
     width:500px;
     height:auto;
     border:1px solid #ccc;
     border-bottom: 0;
     margin-top:5px;
     min-width:370px;
     margin-bottom:10px;
     overflow:hidden;
 }
 .roleUl li{
     border-bottom:1px solid #ccc;
     font-size:14px;
     text-align:center;
     min-width:370px;
     height:44px;
 }
 .roleUl li span{
     display:inline-block;
     padding:5px 0 7px 0;
     height:100%;
     box-sizing: border-box;
     float:left;
 }
 .roleUl li span.checkselect{
     width:50px;
     padding-left:10px;
 }
 .roleUl li span.selectName{
      width:200px;
      line-height: 33px;
      border-right:1px solid #ccc;
  }
    .roleCodeSpan{
        width:200px;
        line-height: 33px;
        border-right:1px solid #ccc;
        margin-left: 15px;
        top: -5px;
    }
    span.btnAction{
        margin-left:24px;
        top:-3px;
        position: relative;
    }
    .tree{
        position:absolute;
        top:0
    }
.transFace{
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    z-index:2;
    cursor:pointer;
}
/**优化界面***/
.moduleWhite2{
    background: #fff;
    /*padding:10px;*/
}
.moduleTit h3{
    border-bottom: 1px solid #ccc;
    font-weight:normal;
    font-size:16px;
    color:#333;
    line-height: 25px;
    margin-bottom: 20px;
    padding:10px 0;
}
 .moduleTit h3 span.infoTit{
     font-size:14px;
     padding-left:15px;
     border-left: 5px solid #2d8cf0;
 }
 .moduleTit h3 span.infoIcon{
     float:right;
     font-size:20px;
     padding-right: 20px;
     cursor: pointer;
 }
.sliceLine{
    border-top:1px dashed #ddd;
    margin-bottom:22px;
}
</style>
<style>
    .popUserCust .el-dialog__header {
        padding: 8px 20px 8px;
        background: #9fc1e4;
    }
    .popUserCust .el-dialog__headerbtn {
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