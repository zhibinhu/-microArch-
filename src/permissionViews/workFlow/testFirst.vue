<template>
    <div>
        1、 子组件:
        <span>{{inputName}}</span><br>

        2、接收父值
        <span>   {{this.$route.params.routeParams}}</span><br>

        3、时间格式化
        <span>  {{date | formatDate}}</span>


    </div>

</template>

<script>
    /**
    export default {
        // 接受父组件的值 测试
        props: {
            inputName: String,
            required: true
        }
    }**/

    import {formatDate} from '../date.js';
    export default {
        date () {
            return {
                date: 1496311370052
            };
        },
        filters: {
            formatDate (time) {
                var date = new Date(time);
                return formatDate(date, 'yyyy-MM-dd hh:mm');
            }
        }

    };
</script>

