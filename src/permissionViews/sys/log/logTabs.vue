<template>
    <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="用户访问日志" name="first">
            <login-log-list></login-log-list>
        </el-tab-pane>
        <el-tab-pane label="用户操作日志" name="second">
            <operate-log-list></operate-log-list>
        </el-tab-pane>
    </el-tabs>
</template>


<script>

    import LoginLogList from "./loginLogList";
    import OperateLogList from "./operateLogList";
    export default {
        components: {OperateLogList, LoginLogList},
        data() {
            return {
                activeName: 'first'
            };
        },
        methods: {
            handleClick(tab, event) {
                activeName: tab.name
            }
        }

        // sys/log/operateLogList  sys/log/loginLogList
    };
</script>