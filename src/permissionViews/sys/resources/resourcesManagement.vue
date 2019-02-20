<template>
    <div style="background: #fff;padding:10px 20px;">
        <h2>
            <div style="float: left;padding-top: 4px;padding-right: 5px;">
                <img  :src="getNoticeUrl()"  width="16" height="16" />
            </div>
            <div>
                <span style="float:left;height:32px;line-height: 32px;font-weight: normal;font-size: 14px;">资源管理</span>
            </div>
            <div class="tableBtn" style="float:right;padding:0;">
                <el-button type="primary" v-hasPermission="'addResources'"  icon="el-icon-circle-plus-outline" size="small" @click="addNewResource">新增</el-button>
                <el-button type="primary" v-hasPermission="'editResources'" icon="el-icon-edit-outline" size="small" @click="updateResource">修改</el-button>
                <el-button type="primary" v-hasPermission="'delResources'" icon="el-icon-delete" size="small" @click="deleteResource">删除</el-button>
            </div>
        </h2>
        <tree-table v-if="treeTableFlag" :data="treeTableData" :columns="columns" @getMenuId="getMenuId" border/>
    </div>
</template>
<script>
    import treeTable from './treeTable';
export default {
    data () {
            return {
                'message': 'hello resourcesManagement.vue',
                treeTableFlag: false,
                columns: [
                    {
                        text: '编码',
                        value: 'resCode',
                        width: 120
                    },
                    {
                        text: '资源名称',
                        value: 'text',
                        width: 200
                    },
                    {
                        text: '上级资源',
                        value: 'pResName'
                    },
                    {
                        text: '图标',
                        value: 'icon',
                        iconFlag: true
                    },
                    {
                        text: '资源类型',
                        value: 'resType'
                    },
                    {
                        text: '排序号',
                        value: 'resOrder'
                    },
                    {
                        text: '资源URL',
                        value: 'resUrl'
                    },
                    {
                        text: '授权标识',
                        value: 'authority'
                    }
                ],
                treeTableData: [],
                selectedMenuId: '',
                selectedMenu: ''

            };
    },
    components: { treeTable },
    mounted () {
            this.showTreeTableData();// 获取树形表格数据
    },
    methods: {
            getNoticeUrl() {
                return require('@/images/task.png');
            },
            showTreeTableData () {
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
                    method: 'POST',
                    url: this.permissionPrefix + '/microarch/sys/sysresource/listTree',
                    data: params

                }).then(res => {
                    console.log('res-tree-table-----', JSON.parse(res.data.ext));
                    this.treeTableData = [];
                    if (res.data.ext) {
                        this.treeTableData = JSON.parse(res.data.ext);
                        this.treeTableFlag = true;
                    }
                });
            },
            addNewResource () {
                this.$router.push({
                    name: 'sys/resourcesAdd'
                });
            },
            getMenuId (val) {
            // console.log('getMenu-----',val);
                this.selectedMenu = val;
                this.selectedMenuId = val.id;
            },
            updateResource () {
                if (this.selectedMenu != '') {
                    this.$router.push({
                        'name': 'sys/resourcesEdit',
                        'params': {
                            'selectedResourcesId': this.selectedMenuId
                        }
                    });
                } else {
                    this.$message({
                        message: '请先选择您要修改的节点',
                        type: 'warning'
                    });
                    return false;
                }
            },
            deleteResource () {
                var that = this;
                if (this.selectedMenu == '') {
                    this.$message({
                        message: '请先选择您要删除的节点',
                        type: 'warning'
                    });
                    return false;
                }
                if (!this.selectedMenu.childrens || this.selectedMenu.childrens.length == 0) {
                    this.$confirm('此操作将永久删除该资源, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$myHttp({
                            method: 'POST',
                            url: this.permissionPrefix + '/microarch/sys/sysresource/delete',
                            data: {
                                'entity': {
                                    'id': this.selectedMenu.id
                                }
                            }
                        }).then(res => {
                        // console.log('resdelete-------',res);
                            if (res.data.code == '10000') {
                                this.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                                this.treeTableFlag = false;
                                this.showTreeTableData();
                                this.selectedMenu = '';
                                setTimeout(function () {
                                    that.treeTableFlag = true;
                                }, 1000);
                            }
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                } else {
                    this.$message({
                        message: '该节点下有子节点，不可直接删除',
                        type: 'warning'
                    });
                }
            }

    }

};
</script>
<style scoped>
    h2{
        overflow: hidden;
        padding: 0;
        padding-bottom: 10px;
        border-bottom: 1px solid #ddd;
        margin-bottom: 10px;
    }

</style>