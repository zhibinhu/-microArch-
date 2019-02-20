<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="18" :offset="3">
                <div class="grid-content bg-purple">
                <div class="menuBackground">
                    <div>
                    <el-form v-if="radioVal==1" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" size="small" class="demo-ruleForm">
                        <el-form-item label="类型">
                            <el-radio-group v-model="radioVal">
                                <el-radio :label="1">目录</el-radio>
                                <el-radio :label="2">菜单</el-radio>
                                <el-radio :label="3">按钮</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="菜单名称" prop="name">
                            <el-input v-model="ruleForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="编码" prop="menuCode">
                            <el-input v-model="ruleForm.menuCode" placeholder="唯一且不为空，例如sys"></el-input>
                        </el-form-item>
                        <el-form-item label="上级菜单" prop="preMenu">
                                <el-popover
                                        placement="bottom"
                                        width="100%"
                                        trigger="click">
                                    <el-tree
                                            :data="myTreeData"
                                            :props="defaultProps"
                                            node-key="id"
                                            :default-expanded-keys="firstTreeId"
                                            @node-click="handleNodeClick"
                                            ref="tree"
                                            class="treeShow">
                                    </el-tree>
                                    <el-input ref="preMenuInput1" v-model="ruleForm.preMenu" readOnly slot="reference" @focus="showTree"></el-input>
                                </el-popover>
                        </el-form-item>
                        <el-form-item label="资源URL" prop="menuUrl">
                            <el-input v-model="ruleForm.menuUrl"></el-input>
                        </el-form-item>
                        <el-form-item label="菜单状态" prop="menuStatus">
                            <el-switch
                                    v-model="ruleForm.menuStatus"
                                    active-text="启用"
                                    inactive-text="停用">
                            </el-switch>
                        </el-form-item>
                        <el-form-item label="菜单序号" prop="menuIndex">
                            <el-input v-model="ruleForm.menuIndex" type="number" min="0"></el-input>
                        </el-form-item>
                        <el-form-item label="图标" prop="menuIcon">
                            <el-popover
                                    placement="bottom"
                                    width="390"
                                    trigger="click">
                                <icon-list @getIconClass="getIconClass"></icon-list>
                            <el-input ref="iconEle" v-model="ruleForm.menuIcon" readOnly slot="reference"></el-input>
                            </el-popover>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
                            <el-button @click="backPath">返回</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                    <div>
                        <el-form v-if="radioVal==2" :model="ruleFormMenu" :rules="rulesMenu" ref="ruleFormMenu" label-width="100px" size="small" class="demo-ruleForm">
                            <el-form-item label="类型">
                                <el-radio-group v-model="radioVal">
                                    <el-radio :label="1">目录</el-radio>
                                    <el-radio :label="2">菜单</el-radio>
                                    <el-radio :label="3">按钮</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="菜单名称" prop="name">
                                <el-input v-model="ruleFormMenu.name"></el-input>
                            </el-form-item>
                            <el-form-item label="编码" prop="menuCode">
                                <el-input v-model="ruleFormMenu.menuCode" placeholder="唯一且不为空，例如sys_menuUser"></el-input>
                            </el-form-item>
                            <el-form-item label="上级菜单" prop="preMenu">
                                <el-popover
                                        placement="bottom"
                                        width="100%"
                                        trigger="click">
                                    <el-tree
                                            :data="myTreeData"
                                            :props="defaultProps"
                                            node-key="id"
                                            :default-expanded-keys="firstTreeId"
                                            @node-click="handleNodeClick"
                                            ref="tree2"
                                            class="treeShow">
                                    </el-tree>
                                <el-input ref="preMenuInput2" v-model="ruleFormMenu.preMenu" readOnly slot="reference" @focus="showTree"></el-input>
                                </el-popover>
                            </el-form-item>
                            <el-form-item label="资源URL" prop="menuUrl">
                                <el-input v-model="ruleFormMenu.menuUrl"></el-input>
                            </el-form-item>
                            <el-form-item label="菜单状态" prop="menuStatus">
                                <el-switch
                                        v-model="ruleFormMenu.menuStatus"
                                        active-text="启用"
                                        inactive-text="停用">
                                </el-switch>
                            </el-form-item>
                            <el-form-item label="菜单描述" prop="menuDes">
                                <el-input v-model="ruleFormMenu.menuDes"></el-input>
                            </el-form-item>
                            <el-form-item label="菜单序号" prop="menuIndex">
                                <el-input v-model="ruleFormMenu.menuIndex" type="number" min="0"></el-input>
                            </el-form-item>
                            <el-form-item label="图标" prop="menuIcon">
                                <el-popover
                                        placement="bottom"
                                        width="390"
                                        trigger="click">
                                    <icon-list @getIconClass="getIconClass"></icon-list>
                                <el-input ref="iconEleMenu" v-model="ruleFormMenu.menuIcon" readOnly slot="reference"></el-input>
                                </el-popover>
                            </el-form-item>
                            <!--<el-form-item label="授权标识" prop="menuFlag">-->
                                <!--<el-input v-model="ruleFormMenu.menuFlag" placeholder="例如：sys:user:info"></el-input>-->
                            <!--</el-form-item>-->
                            <el-form-item>
                                <el-button type="primary" @click="submitForm('ruleFormMenu')">保存</el-button>
                                <el-button @click="backPath">返回</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div>
                        <el-form v-if="radioVal==3" :model="ruleFormBtn" :rules="rulesBtn" ref="ruleFormBtn" label-width="100px" size="small" class="demo-ruleForm">
                            <el-form-item label="类型">
                                <el-radio-group v-model="radioVal">
                                    <el-radio :label="1">目录</el-radio>
                                    <el-radio :label="2">菜单</el-radio>
                                    <el-radio :label="3">按钮</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="菜单名称" prop="name">
                                <el-input v-model="ruleFormBtn.name"></el-input>
                            </el-form-item>
                            <el-form-item label="编码" prop="menuCode">
                                <el-input v-model="ruleFormBtn.menuCode" placeholder="唯一且不为空，例如sys_user_add"></el-input>
                            </el-form-item>
                            <el-form-item label="上级菜单" prop="preMenu">
                                <el-popover
                                        placement="bottom"
                                        width="100%"
                                        trigger="click">
                                    <el-tree
                                            :data="myTreeData"
                                            :props="defaultProps"
                                            node-key="id"
                                            :default-expanded-keys="firstTreeId"
                                            @node-click="handleNodeClick"
                                            ref="tree3"
                                            class="treeShow">
                                    </el-tree>
                                <el-input ref="preMenuInput3" v-model="ruleFormBtn.preMenu" readOnly slot="reference" @focus="showTree"></el-input>
                                </el-popover>
                            </el-form-item>
                            <el-form-item label="资源URL" prop="menuUrl">
                                <el-input v-model="ruleFormBtn.menuUrl"></el-input>
                            </el-form-item>
                            <el-form-item label="菜单状态" prop="menuStatus">
                                <el-switch
                                        v-model="ruleFormBtn.menuStatus"
                                        active-text="启用"
                                        inactive-text="停用">
                                </el-switch>
                            </el-form-item>
                            <el-form-item label="菜单序号" prop="menuIndex">
                                <el-input v-model="ruleFormBtn.menuIndex" type="number" min="0"></el-input>
                            </el-form-item>
                            <el-form-item label="授权标识" prop="menuFlag">
                                <el-input v-model="ruleFormBtn.menuFlag" placeholder="例如：sys:user:info"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitForm('ruleFormBtn')">保存</el-button>
                                <el-button @click="backPath">返回</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import iconList from '../iconList';
    export default {
        components: {
            iconList
        },
        data () {
            /// 验证并去掉前后空格
            var noBlank = (rule, value, callback) => {
                var blankReg = /^(\s)*|(\s)*$/;
                // console.log('value----',value)
                var result = value.toString().replace(blankReg, '');
                if (result == '') {
                    callback(new Error('请输入非空字符'));
                    return false;
                } else {
                    callback();
                    return result;
                }
            };
            /// 检查编码是否已存在
            var checkResourcesCode = (rule, value, callback) => {
                var blankReg = /^(\s)*|(\s)*$/;
                // console.log('value----',value)
                var result = value.toString().replace(blankReg, '');
                var radioValType = this.radioVal == 1 ? 'directory' : this.radioVal == 2 ? 'menu' : 'button';
                if (this.oldResourcesCode == result && this.editType == radioValType) { // 判断是否是编辑页面进来时带过来的编码
                    callback();
                } else {
                    this.$myHttp({
                        method: 'post',
                        url: this.permissionPrefix + '/microarch/sys/sysresource/checkResourceCodeExist',
                        data: {
                            'entity': {
                                'resCode': result
                            }
                        }
                    }).then(res => {
                        console.log('rescode-------', res);
                        if (res.data.ext) {
                            callback(new Error('该编码已存在，请修改'));
                        } else {
                            callback();
                            return result;
                        }
                    });
                }
            };
            return {
                radioVal: 1,
                ruleForm: {
                    name: '',
                    menuCode: '',
                    preMenu: '',
                    preMenuId: '',
                    menuUrl: '',
                    menuStatus: true,
                    menuIndex: '',
                    menuIcon: ''

                },
                rules: {
                    name: [
                        {required: true, message: '请输入菜单名称', trigger: 'blur'},
                        {min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur'},
                        {validator: noBlank, trigger: 'blur'}
                    ],
                    menuCode: [
                        {required: true, message: '请输入编码', trigger: 'blur'},
                        {validator: noBlank, trigger: 'blur'},
                        {validator: checkResourcesCode, trigger: 'blur'}
                    ],
                    preMenu: [
                        {required: true, message: '请输入上级菜单', trigger: 'blur'},
                        {validator: noBlank, trigger: 'blur'}
                    ],
                    menuUrl: [
                        {required: true, message: '请输入资源URL', trigger: 'blur'},
                        {validator: noBlank, trigger: 'blur'}
                    ],
                    menuIndex: [
                        {required: true, message: '请输入序号', trigger: 'blur'},
                        {validator: noBlank, trigger: 'blur'}
                    ],
                    menuIcon: [
                        {required: true, message: '请输入图标', trigger: 'blur'},
                        {validator: noBlank, trigger: 'blur'}
                    ]
                },
                ruleFormMenu: {
                    name: '',
                    menuCode: '',
                    preMenu: '',
                    preMenuId: '',
                    menuStatus: true,
                    menuUrl: '',
                    menuDes: '',
                    menuIndex: '',
                    menuIcon: ''
                    // menuFlag:''
                },
                rulesMenu: {
                    name: [
                        {required: true, message: '请输入菜单名称', trigger: 'blur'},
                        {min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur'},
                        {validator: noBlank, trigger: 'blur'}
                    ],
                    menuCode: [
                        {required: true, message: '请输入编码', trigger: 'blur'},
                        {validator: noBlank, trigger: 'blur'},
                        {validator: checkResourcesCode, trigger: 'blur'}
                    ],
                    preMenu: [
                        {required: true, message: '请输入上级菜单', trigger: 'blur'},
                        {validator: noBlank, trigger: 'blur'}
                    ],
                    menuUrl: [
                        {required: true, message: '请输入资源URL', trigger: 'blur'},
                        {validator: noBlank, trigger: 'blur'}
                    ],
                    menuIndex: [
                        {required: true, message: '请输入序号', trigger: 'blur'},
                        {validator: noBlank, trigger: 'blur'}
                    ],
                    menuIcon: [
                        {required: true, message: '请输入图标', trigger: 'blur'},
                        {validator: noBlank, trigger: 'blur'}
                    ]
                },
                ruleFormBtn: {
                    name: '',
                    menuCode: '',
                    preMenu: '',
                    preMenuId: '',
                    menuUrl: '',
                    menuStatus: true,
                    menuIndex: '',
                    menuFlag: ''
                },
                rulesBtn: {
                    name: [
                        {required: true, message: '请输入菜单名称', trigger: 'blur'},
                        {min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur'},
                        {validator: noBlank, trigger: 'blur'}
                    ],
                    menuCode: [
                        {required: true, message: '请输入编码', trigger: 'blur'},
                        {validator: noBlank, trigger: 'blur'},
                        {validator: checkResourcesCode, trigger: 'blur'}
                    ],
                    preMenu: [
                        {required: true, message: '请输入上级菜单', trigger: 'blur'},
                        {validator: noBlank, trigger: 'blur'}
                    ],
                    menuUrl: [
                        {required: true, message: '请输入资源URL', trigger: 'blur'},
                        {validator: noBlank, trigger: 'blur'}
                    ],
                    menuIndex: [
                        {required: true, message: '请输入序号', trigger: 'blur'},
                        {validator: noBlank, trigger: 'blur'}
                    ]
                },
                myTreeData: [{
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
                }],
                defaultProps: {
                    children: 'childrens',
                    label: 'text'
                },
                firstTreeId: [],
                selectedResourcesId: '',
                oldResourcesCode: '',
                editType: '', // 编辑时进来的类型
                isRootNode: false, // 判断是否为根节点
                isRootNodeMenu: false// 判断根节点是否为菜单

            };
        },
        mounted () {
            console.log('this.$route.name---', this.$route.name);
            if (this.$route.name == 'sys/resourcesEdit') {
                this.backfillData();// 如果使点击修改进来的就回显数据
            }
        },
        methods: {
            backfillData () {
                // console.log('selectedResourcesId----',this.$route.params.selectedResourcesId)
                if (this.$route.params.selectedResourcesId) {
                    sessionStorage.setItem('selectedResourcesId', this.$route.params.selectedResourcesId);
                    this.selectedResourcesId = this.$route.params.selectedResourcesId;
                } else {
                    this.selectedResourcesId = sessionStorage.getItem('selectedResourcesId');
                }
                if (this.selectedResourcesId) {
                    this.$myHttp({
                        method: 'post',
                        url: this.permissionPrefix + '/microarch/sys/sysresource/view',
                        data: {
                            'entity': {
                                'id': this.selectedResourcesId
                            }
                        }
                    }).then(res => {
                        console.log('resources--------', res);
                        if (res.data) {
                            var getData = res.data.entity;
                            this.oldResourcesCode = getData.resCode;
                            this.editType = getData.resType;
                            if (getData.resType == 'directory') {
                                this.isRootNode = getData.pid == '0';

                                this.radioVal = 1;
                                this.ruleForm.name = getData.resName;
                                this.ruleForm.menuCode = getData.resCode;
                                this.ruleForm.preMenuId = getData.pid;
                                this.ruleForm.preMenu = this.isRootNode ? '一级资源' : getData.pname;
                                this.ruleForm.menuUrl = getData.resUrl;
                                this.ruleForm.menuStatus = getData.flag == 'Y';
                                this.ruleForm.menuIndex = getData.resOrder;
                                this.ruleForm.menuIcon = getData.icon;
                            } else if (getData.resType == 'menu') {
                                this.isRootNodeMenu = getData.pid == '0';

                                this.radioVal = 2;
                                this.ruleFormMenu.name = getData.resName;
                                this.ruleFormMenu.menuCode = getData.resCode;
                                this.ruleFormMenu.preMenuId = getData.pid;
                                this.ruleFormMenu.preMenu = this.isRootNodeMenu ? '一级资源' : getData.pname;
                                this.ruleFormMenu.menuUrl = getData.resUrl;
                                this.ruleFormMenu.menuStatus = getData.flag == 'Y';
                                this.ruleFormMenu.menuDes = getData.memo;
                                this.ruleFormMenu.menuIndex = getData.resOrder;
                                this.ruleFormMenu.menuIcon = getData.icon;
                                // this.ruleFormMenu.menuFlag=getData.authority;
                            } else if (getData.resType == 'button') {
                                this.radioVal = 3;
                                this.ruleFormBtn.name = getData.resName;
                                this.ruleFormBtn.menuCode = getData.resCode;
                                this.ruleFormBtn.preMenuId = getData.pid;
                                this.ruleFormBtn.preMenu = getData.pname;
                                this.ruleFormBtn.menuUrl = getData.resUrl;
                                this.ruleFormBtn.menuStatus = getData.flag == 'Y';
                                this.ruleFormBtn.menuIndex = getData.resOrder;
                                this.ruleFormBtn.menuFlag = getData.authority;
                            }
                        }
                    });
                }
            },
            backPath () {
                this.$router.back(-1);
            },
            submitForm (formName) {
                var that = this;
                if (this.radioVal == '1') {
                    var params = {
                        entity: {
                            'id': this.selectedResourcesId,
                            'resType': 'directory',
                            'resName': this.ruleForm.name,
                            'resCode': this.ruleForm.menuCode,
                            'pid': this.ruleForm.preMenuId != '0' ? this.ruleForm.preMenuId : '0',
                            'resUrl': this.ruleForm.menuUrl,
                            'flag': this.ruleForm.menuStatus == true ? 'Y' : 'N',
                            'resOrder': this.ruleForm.menuIndex,
                            'icon': this.ruleForm.menuIcon
                        }
                    };
                } else if (this.radioVal == '2') {
                    var params = {
                        entity: {
                            'id': this.selectedResourcesId,
                            'resType': 'menu',
                            'resName': this.ruleFormMenu.name,
                            'resCode': this.ruleFormMenu.menuCode,
                            'resUrl': this.ruleFormMenu.menuUrl,
                            'pid': this.ruleFormMenu.preMenuId != '0' ? this.ruleFormMenu.preMenuId : '0',
                            'flag': this.ruleFormMenu.menuStatus == true ? 'Y' : 'N',
                            'memo': this.ruleFormMenu.menuDes,
                            'resOrder': this.ruleFormMenu.menuIndex,
                            'icon': this.ruleFormMenu.menuIcon
                            // "authority":this.ruleFormMenu.menuFlag
                        }
                    };
                } else {
                    var params = {
                        entity: {
                            'id': this.selectedResourcesId,
                            'resType': 'button',
                            'resName': this.ruleFormBtn.name,
                            'resCode': this.ruleFormBtn.menuCode,
                            'pid': this.ruleFormBtn.preMenuId,
                            'resUrl': this.ruleFormBtn.menuUrl,
                            'flag': this.ruleFormBtn.menuStatus == true ? 'Y' : 'N',
                            'resOrder': this.ruleFormBtn.menuIndex,
                            'authority': this.ruleFormBtn.menuFlag
                        }
                    };
                }
                // console.log('this.$route-----',this.$route)
                if (this.$route.name == 'resourcesEdit') {
                    params.entity.id = this.selectedResourcesId;
                }
                this.$refs[formName].validate((valid) => {
                    console.log('params--resources----', params);
                    if (valid) {
                        that.$myHttp({
                            method: 'post',
                            url: that.permissionPrefix + '/microarch/sys/sysresource/save',
                            data: params
                        }).then(res => {
                        // console.log('menuresources------',res)
                            if (res.data.code == '10000') {
                                that.$message({
                                    message: '保存成功',
                                    type: 'success'
                                });
                                that.$router.back(-1);
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            showTree () {
                var that = this;
                var params = {
                    'where': [{
                        'field': 'id',
                        'opt': '>',
                        'value': '1'
                    }],
                    'pageNum': 0,
                    'pageSize': 10,
                    'orderBy': 'id asc'
                };
                this.$myHttp({
                    method: 'post',
                    url: this.permissionPrefix + '/microarch/sys/sysresource/getTree',
                    data: params
                }).then(res => {
                    let resData = JSON.parse(res.data.ext);
                    console.log('res-tree data------', resData);
                    for (var i = 0; i < resData.length; i++) {
                        this.firstTreeId.push(resData[i].id);
                        console.log('firstTreeId---', this.firstTreeId);
                    }
                    this.myTreeData = [];
                    this.myTreeData = resData;
                    setTimeout(function () {
                        if (that.radioVal == 1) {
                            for (var i = 0; i < that.firstTreeId.length; i++) {
                                that.$refs.tree.store.nodesMap[that.firstTreeId[i]].expanded = true;
                            }
                        } else if (that.radioVal == 2) {
                            for (var i = 0; i < that.firstTreeId.length; i++) {
                                that.$refs.tree2.store.nodesMap[that.firstTreeId[i]].expanded = true;
                            }
                        } else {
                            for (var i = 0; i < that.firstTreeId.length; i++) {
                                that.$refs.tree3.store.nodesMap[that.firstTreeId[i]].expanded = true;
                            }
                        }
                    }, 1000);
                    // console.log('myTreeData---------',this.myTreeData)
                });
            },
            handleNodeClick (data) {
            // console.log(data);
                if (data.resType == 'button') {
                    this.$message('按钮节点不可作为上级菜单！');
                } else {
                    if (this.radioVal == 1) {
                        this.ruleForm.preMenu = data.text;
                        this.ruleForm.preMenuId = data.id;
                        this.$refs.preMenuInput1.focus();
                        this.$refs.preMenuInput1.blur();
                    } else if (this.radioVal == 2) {
                        this.ruleFormMenu.preMenu = data.text;
                        this.ruleFormMenu.preMenuId = data.id;
                        this.$refs.preMenuInput2.focus();
                        this.$refs.preMenuInput2.blur();
                    } else {
                        this.ruleFormBtn.preMenu = data.text;
                        this.ruleFormBtn.preMenuId = data.id;
                        this.$refs.preMenuInput3.focus();
                        this.$refs.preMenuInput3.blur();
                    }
                }
            },
            getIconClass (val) {
                if (this.radioVal == 1) {
                    this.ruleForm.menuIcon = val;
                    this.$refs.iconEle.focus();
                    this.$refs.iconEle.blur();
                } else if (this.radioVal == 2) {
                    this.ruleFormMenu.menuIcon = val;
                    this.$refs.iconEleMenu.focus();
                    this.$refs.iconEleMenu.blur();
                } else {
                    this.ruleFormBtn.menuIcon = val;
                }
            }

        }
    };
</script>
<style scoped>
.menuBackground{
    background:#fff;
    margin:0 auto;
    padding:20px;
}

</style>