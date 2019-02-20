
<template>

    <el-col :span="24">

        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" style="margin-top: 0px;margin-bottom: 20px" class="demo-ruleForm">
            <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item style="padding:0 20px;background: #fff;" name="1">
                    <template slot="title">
                        <div class="moduleTit">
                            <h3>
                                <span class="infoTit">组织管理</span>
                            </h3>
                        </div>
                    </template>
                    <el-col :span="8" :xs="20" >
                        <el-form-item label="组织编码" prop="orgCode">
                            <el-input v-model="ruleForm.orgCode" style="width: 95%" disabled size="small"></el-input>
                        </el-form-item>

                    </el-col>

                    <el-col :span="8" :xs="20">
                        <el-form-item label="组织名称" prop="orgName">
                            <el-input v-model="ruleForm.orgName" style="width: 95%" size="small"></el-input>
                        </el-form-item>

                    </el-col>

                    <el-col :span="8" :xs="20">
                        <el-form-item label="上级组织" prop="pidName">
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
                                <el-input ref="pidName" v-model="ruleForm.pidName" slot="reference" placeholder="请输入所在部门" style="width: 95%" readOnly size="small" @focus="showTree" clearable></el-input>
                            </el-popover>
                        </el-form-item>

                    </el-col>

                    <el-col :span="8" :xs="20">
                        <el-form-item label="组织简称" prop="orgShortName">
                            <el-input v-model="ruleForm.orgShortName" style="width: 95%" size="small"></el-input>
                        </el-form-item>

                    </el-col>

                    <el-col :span="8" :xs="20">
                        <el-form-item label="状态">
                            <el-switch
                                    v-model="ruleForm.status"
                                    active-text="启用"
                                    inactive-text="禁用">
                            </el-switch>
                        </el-form-item>

                    </el-col>

                    <el-col :span="8" :xs="20">
                        <el-form-item label="组织类型" prop="type">
                            <el-select v-model="ruleForm.type" placeholder="请选择组织类型" style="width: 95%" size="small">
                                <el-option
                                        v-for="item in orgTypeData"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-collapse-item>
            </el-collapse>

            <div style="text-align:center;position: fixed;width:calc(100% - 235px);;bottom:20px;">
                <el-button @click="submitForm('ruleForm')" icon="el-icon-circle-plus-outline" type="primary" style="margin-top: 20px;margin-bottom: 10px" round size="small">保存</el-button>
                <el-button @click="close()"  style="margin-top: 20px;margin-bottom: 10px" icon="el-icon-back" round size="small">返回</el-button>
            </div>
        </el-form>
    </el-col>
</template>

<script>
    import util from '../../../libs/util';
    export default {
        name: 'projectManagement-page',
        components: {
        },
        data () {
            return {
                pidData: [],
                /* State: true, */
                orgTypeData: [],
                dirArry: ['orgType'],
                ruleForm: {
                    orgCode: '',
                    orgName: '',
                    orgShortName: '',
                    status: true,
                    pid: '',
                    pidName: '',
                    type: '',
                    typeName: ''
                },
                rules: {
                    orgCode: [
                        { required: true, message: '请输入组织编码', trigger: 'change' }
                    ],
                    orgName: [
                        { required: true, message: '请输入组织名称', trigger: 'change' }
                    ],
                    orgShortName: [
                        { required: true, message: '请输入组织简称', trigger: 'change' }
                    ],
                    pidName: [
                        { required: true, message: '请选择上级组织', trigger: 'change' }
                    ],
                    type: [
                        { required: true, message: '请选择组织类型', trigger: 'change' }
                    ]
                },
                radio: '1',
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
                activeNames: ['1']
            };
        },
        methods: {
            submitForm (formName) {
                if (this.ruleForm.pid == this.ruleForm.id) {
                    this.$message({
                        showClose: true,
                        message: '上级组织不可是当前组织！',
                        type: 'warning'
                    });
                    return;
                }
                console.log('this.ruleForm.pid', this.ruleForm.pid, 'id', this.ruleForm.id);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.saveProjectsInfo();
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
                if (this.ruleForm.status == true) {
                    this.ruleForm.status = 'Y';
                } else {
                    this.ruleForm.status = 'N';
                }
                this.$myHttp({
                    method: 'POST',
                    url: this.prefix + '/microarch/sys/sysorg/save',
                    data: {'entity': this.ruleForm}

                }).then(res => {
                    // orgApp.orgListSave().then(res=>{
                    // 成功回调方法
                    _this.$router.push({
                        name: 'sys/org/organizationList'
                    });
                    this.$message({
                        showClose: true,
                        message: '保存成功！',
                        type: 'success'
                    });
                });
            },

            close: function () {
                this.$router.push({
                    name: 'sys/org/organizationList'
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
                    console.log('res data------', res);
                    let resData = JSON.parse(res.data.ext);
                    console.log('res-tree data------', resData);
                    this.firstTreeId = resData.id;
                    this.myTreeData = [];
                    this.myTreeData.push(resData);
                    setTimeout(function () {
                        that.$refs.tree.store.nodesMap[that.firstTreeId].expanded = true;
                    }, 100);
                    // console.log('myTreeData---------',this.myTreeData)
                });
            },
            handleNodeClick (data) {
                // console.log("wxasdasdasdadasda",data);
                this.ruleForm.pidName = data.text;
                this.ruleForm.pid = data.id;
                this.$refs.pidName.focus();
                this.$refs.pidName.blur();
                document.body.click();
            },
            handleChange (val) {
                console.log('val---', val);
            }
        },
        created () {
            // 组织单位
            util.getSelectData(this, this.dirArry);
            var _this = this;
            if (this.$route.params.id) {
                sessionStorage.setItem('edit_dataId', this.$route.params.id);
            }
            var getDataId = sessionStorage.getItem('edit_dataId');
            var dataId = this.$route.params.id ? this.$route.params.id : getDataId;
            if (dataId) {
                this.$myHttp({
                    method: 'POST',
                    url: this.prefix + '/microarch/sys/sysorg/view',
                    /* url: "http://192.168.99.24:6004/channel/view", */
                    data: {
                        'entity': {
                            'id': dataId
                        }
                    }
                }).then(res => {
                    // 成功回调方法
                    _this.ruleForm = res.data.entity;
                    if (res.data.entity.status == 'Y' || res.data.entity.status == 'true') {
                        _this.ruleForm.status = true;
                    } else if (res.data.entity.status == 'N' || res.data.entity.status == 'false') {
                        _this.ruleForm.status = false;
                    }
                    if (res.data.entity.pid) {
                        this.ruleForm.pid = res.data.entity.pid;
                        this.$myHttp({
                            method: 'POST',
                            url: this.prefix + '/microarch/sys/sysorg/findAllOrgs',
                            data: {}
                        }).then(Res => {
                            // 成功回调方法
                            for (var i = 0; i < Res.data.rows.length; i++) {
                                if (res.data.entity.pid == Res.data.rows[i].id) {
                                    this.ruleForm.pidName = Res.data.rows[i].orgName;
                                }
                            }
                        });
                    }
                    console.log('kankanyoumeiyoupod2', this.ruleForm.pid);
                });
            }
        }
    };
</script>

<style>
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
</style>
