<template>
    <div>
        <el-row style="background: #fff;padding:10px 0;min-width:900px;min-height: 600px;overflow-x:auto;">
            <el-col :span="9" style="border-right:1px solid #ccc;min-height: 600px;">
                <div style="min-width:336px;overflow:hidden;">
                    <el-form ref="form" label-width="80px" size="small">
                        <el-form-item label="角色名称" style="float:left;width:228px;overflow:hidden;">
                            <el-input v-model="roleName" placeholder="请输入角色名称" clearable></el-input>
                        </el-form-item>
                        <div style="padding-left: 10px;float:left;">
                            <el-button type="primary" @click="queryRole" icon="el-icon-search" round size="small">查询</el-button>
                        </div>
                    </el-form>
                </div>
                <div>
                    <div v-if="allRoles.length==0" style="text-align:center;">暂无查询结果</div>
                    <div v-else>
                        <el-radio-group v-model="selectedRole" class="radioBox" @change="showResourcesTree(selectedRole)">
                            <div class="radioStyle" v-if="item.roleCode=='admin'" v-for="(item,index) in allRoles"><el-radio  :disabled="true" :label="item.id">{{item.roleName+'('+item.roleCode+')'}}</el-radio></div>
                            <div class="radioStyle" v-if="item.roleCode!='admin'" v-for="(item,index) in allRoles"><el-radio :label="item.id">{{item.roleName+'('+item.roleCode+')'}}</el-radio></div>
                        </el-radio-group>
                    </div>
                </div>
            </el-col>
            <el-col :span="15">
                <div>
                    <el-form ref="formResources" label-width="80px">
                        <el-form-item label="资源列表">
                            <el-button type="primary" round size="small"  icon="el-icon-circle-plus-outline" @click="saveRoleResources">保存</el-button>
                        </el-form-item>
                        <div class="resourcesList">
                            <el-tree
                                    :data="resourcesListData"
                                    show-checkbox
                                    :default-checked-keys="checkedItems"
                                    :default-expanded-keys="keysArr"
                                    node-key="id"
                                    ref="tree"
                                    highlight-current
                                    @check="checkedStatusChange"
                                    @check-change="nodeStatusChange"
                                    :props="defaultProps">
                            </el-tree>
                        </div>
                    </el-form>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                message: '角色权限分配',
                roleName: '',
                selectedRole: '',
                allRoles: [],
                resourcesListData: [],
                defaultProps: {
                    children: 'childrens',
                    label: 'text'
                },
                checkedItems: [], // 初始化回显需要全勾选的id
                halfCheckedItems: [], // 初始化回显需要半勾选的id
                roleCheckedItems: [], // 存储所有勾选和半勾选节点id
                halfCheckedKeys: [], // 存储半勾选节点id
                keysArr: []// 默认展开哪些节点
            };
        },
        mounted () {
            this.showAllRoles();// 展示所有角色
            var that = this;
            document.onkeydown = function (event) {
                // console.log('keyCode---',event.keyCode)
                if (event.keyCode == '13') {
                    that.queryRole();
                }
            };
        },
        methods: {
            queryRole () {
                var roleName = this.roleName.replace(/^(\s)*|(\s)*$/, '');
                this.showAllRoles(roleName);
                this.selectedRole = '';
            },
            showAllRoles (roleName) {
                var params = {
                    where: [
                        {
                            'field': 'roleName',
                            'value': roleName != undefined ? roleName : ''
                        },
                        {
                            'field': 'status',
                            'value': 'Y'
                        }
                    ]
                };
                this.$myHttp({
                    method: 'POST',
                    url: this.permissionPrefix + '/microarch/sys/sysrole/list',
                    data: params

                }).then(res => {
                    // console.log('allRoles----',res);
                    if (res.data) {
                        this.allRoles = res.data.rows;
                        this.showResourcesTree();// 展示所有资源树
                    }
                });
            },
            showResourcesTree (roleId) {
                // console.log('roleId-----',roleId)
                var params = {
                    entity: {
                        'id': roleId != undefined ? roleId : ''
                    }
                };
                this.checkedItems = [];
                this.$myHttp({
                    method: 'POST',
                    url: this.permissionPrefix + '/microarch/sys/sysroleresource/findTree',
                    data: params
                }).then(res => {
                    // console.log('resourcesTree------',res);
                    if (res.data) {
                        var treeData = JSON.parse(res.data.ext);
                        console.log('treeDDA--', treeData);
                        this.resourcesListData = [];
                        this.resourcesListData = treeData;
                        for (var i = 0; i < this.resourcesListData.length; i++) {
                            this.keysArr.push(this.resourcesListData[i].id);
                        }
                        if (roleId != undefined) {
                            this.halfCheckedKeys = [];// 清空半勾选数组
                            this.roleCheckedItems = [];// 清空要保存的id数组
                            this.forEachTreeData(treeData);// 勾选相应角色所拥有的权限
                            var that = this;
                            // 回显半勾选状态的节点
                            // console.log('this.checkedItems---',this.checkedItems)
                            setTimeout(function () {
                                // console.log('this.halfCheckedKeys1111----',that.halfCheckedKeys)
                                for (var i = 0; i < that.halfCheckedKeys.length; i++) {
                                    var halfNode = that.$refs.tree.getNode(that.halfCheckedKeys[i]);
                                    halfNode.indeterminate = true;
                                    // console.log('haldNode---',halfNode);
                                    var level = halfNode.level;

                                    while (level != 0) {
                                        halfNode.indeterminate = true;
                                        halfNode.checked = false;
                                        halfNode = halfNode.parent;
                                        level--;
                                    }
                                }
                            }, 0);
                        } else {
                            this.forEachTreeData(treeData, 1);// 勾选管理员角色所拥有的权限
                            // console.log('this.checkedItems---',this.checkedItems)
                        }
                    }
                });
            },
            forEachTreeData (obj, adminRole) {
                if (adminRole == undefined) {
                    if (obj instanceof Array) {
                        for (var k = 0; k < obj.length; k++) {
                            if (obj[k].checked == 'true') {
                                this.checkedItems.push(obj[k].id);
                                this.roleCheckedItems.push(obj[k].id);
                            } else if (obj[k].checked == 'half') {
                                // this.halfCheckedItems.push(obj.id);///回显时用到的数组
                                this.halfCheckedKeys.push(obj[k].id);// 点击保存前用到的数组
                                this.roleCheckedItems.push(obj[k].id);
                                // console.log('obj---', obj[k])
                            }
                            if (obj[k].childrens && obj[k].childrens.length > 0) {
                                this.forEachTreeData(obj[k].childrens);
                            }
                        }
                    }
                } else {
                    if (obj instanceof Array) {
                        for (var k = 0; k < obj.length; k++) {
                            this.checkedItems.push(obj[k].id);
                            if (obj[k].childrens && obj[k].childrens.length > 0) {
                                this.forEachTreeData(obj[k].childrens, 1);
                            }
                        }
                    }
                }
                return this.checkedItems;
            },
            saveRoleResources () {
                if (this.selectedRole == '') {
                    this.$message({
                        message: '请选择您要保存的资源所对应的角色',
                        type: 'warning'
                    });
                } else {
                    var params = {
                        entity: {
                            'id': this.selectedRole,
                            'resourceIds': this.roleCheckedItems
                        }
                    };
                    console.log('this.roleCheckedItems----', this.roleCheckedItems);
                    this.$myHttp({
                        method: 'POST',
                        url: this.permissionPrefix + '/microarch/sys/sysroleresource/save',
                        data: params
                    }).then(res => {
                    // console.log('resources---role---',res);
                        if (res.data.code == '10000') {
                            this.$message({
                                message: '保存成功',
                                type: 'success'
                            });
                        }
                    });
                }
            },
            checkedStatusChange (checkedNode, statusObj) {
                console.log('checkedNode---', checkedNode, 'statusObj---', statusObj);
                var curClickNode = this.$refs.tree.getNode(checkedNode.id);
                var level = curClickNode.parent.level;
                var curClickNodePar = curClickNode.parent;

                while (level != 0) {
                    var allSelectedFlag = true;
                    for (var i = 0; i < curClickNodePar.childNodes.length; i++) {
                        if (curClickNodePar.childNodes[i].checked == false) {
                            allSelectedFlag = false;// 如果本节点列表不是全勾选
                        }
                    }
                    if (allSelectedFlag) {
                        curClickNodePar.indeterminate = false;
                    } else {
                        curClickNodePar.indeterminate = true;
                    }
                    if (this.halfCheckedKeys.indexOf(curClickNodePar.data.id) == -1 && curClickNodePar.indeterminate == true) {
                        this.halfCheckedKeys.push(curClickNodePar.data.id);// 储存半勾选状态的节点Id
                    }
                    curClickNodePar = curClickNodePar.parent;
                    level--;
                }
                for (var i = 0; i < statusObj.checkedKeys.length; i++) { // 如果半勾选状态的节点变成了全勾选，就移出半勾选数组
                    for (var j = 0; j < this.halfCheckedKeys.length; j++) {
                        if (statusObj.checkedKeys[i] == this.halfCheckedKeys[j]) {
                            this.halfCheckedKeys.splice(j, 1);
                        }
                    }
                }
                this.roleCheckedItems = statusObj.checkedKeys.concat(this.halfCheckedKeys);
                // console.log('allCheckedChangeids--halfCheckedKeys222---',this.halfCheckedKeys)

                // console.log('leafParentNode----',this.$refs.tree.getNode(checkedNode.id).parent);
                // console.log('this.roleCheckedItems----',this.roleCheckedItems)
            },
            nodeStatusChange (nodeObj, checkOrnot, childCheck) {
                // console.log('nodeObj--',nodeObj,'checkOrnot--',checkOrnot,'childCheck--',childCheck)
            }
        }
    };
</script>
<style>
.radioStyle{
    padding:10px;
}
.radioBox{
    max-height: 550px;
    overflow-y: auto;
    width: 100%;
}
.resourcesList{
    margin:10px;
}
</style>