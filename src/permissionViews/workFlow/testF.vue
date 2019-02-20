<template>
    <div>
        父组件:
        <input type="text" v-model="name">
        <br>
        <br>
        <!-- 引入子组件 -->
        <child :inputName="name"></child>

        <el-button @click="toSign()" size="small" type="primary"
                   style="margin-top: 20px;margin-bottom: 10px">设置业务表单
        </el-button>

    </div>



</template>
<script>
    import child from './testFirst';
    export default {
        components: {
            child
        },
        data () {
            return {
                name: ''
            };
        },
        methods: {
            toSign: function () {
                this.$router.push({
                    name: 'testFirst',

                    params: {
                        routeParams: this.name
                    }

                });
            }
        }
    };
</script>