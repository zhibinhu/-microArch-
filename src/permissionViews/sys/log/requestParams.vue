<template>

    <el-dialog title="请求参数" :visible.sync="dialogParamsVisible" :modal-append-to-body="false" append-to-body  width="1000px" >
        <div>
            <vue-json-viewer
                    :value="jsonData"
                    :expand-depth=5
                    copyable
                    boxed
                    sort
            ></vue-json-viewer>
        </div>
    </el-dialog>



</template>

<script>
    import VueJsonViewer from 'vue-json-viewer';

    export default {

        data () {
            return {
                jsonData: '',
                dialogParamsVisible: false
            }
        },

        components: {
            VueJsonViewer
        },
        created: function () {
        },
        watch: {

        },

        methods: {
            init(val) {
                this.dialogParamsVisible = true;
                if (typeof val == 'string') {
                    try {
                        this.jsonData = JSON.parse(val);
                    } catch(e) {
                        var json = {"params":val}
                        this.jsonData = json
                    }
                }
                this.$nextTick(()=>{
                    //可以写自己的逻辑
                })
            }
        },
        mounted: function () {

        },

        filters:  {

        }

    }
</script>