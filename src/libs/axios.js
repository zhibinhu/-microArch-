import axios from 'axios';
import {router} from '../router';
axios.interceptors.request.use(function (config) {
    // console.log('config-------------',config)
    if (sessionStorage.getItem('token')) {
        config.headers.Authorization = 'Sys ' + sessionStorage.getItem('token');
        // config.headers["Content-Type"]='application/json';
    }
    return config;
}, function (error) {
    console.log('error---request---', error);
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
// console.log('interceptors-----',response)
    return response;
}, function (error) {
    console.log('error-----========--------', error);
    console.log('error-----========--------', error.statusCode);
    return Promise.reject(checkStatus(error));
});
function checkStatus (response) {
    // 有响应时校验状态
    if (response) {
        // -10自己定义，连接错误的status
        const status = response.status || -10;
        if (status === 200 || status === 304 || status === 400) {
            return response.data;
        } else {
            let errorInfo = '';
            switch (status) {
                case -1:
                    errorInfo = '远程服务响应失败，请稍后重试';
                    break;
                case 400:
                    errorInfo = '400:错误请求';
                    break;
                case 401:
                    errorInfo = '401:访问令牌无效或过期';
                    break;
                case 403:
                    errorInfo = '403：拒绝访问';
                    break;
                case 404:
                    errorInfo = '404:资源不存在';
                    break;
                case 405:
                    errorInfo = '405:请求方法不允许';
                    break;
                case 408:
                    errorInfo = '408:请求超时';
                    break;
                case 500:
                    errorInfo = '500:访问服务失败';
                    break;
                case 501:
                    errorInfo = '501:未实现';
                    break;
                case 502:
                    errorInfo = '502:无效网关';
                    break;
                case 503:
                    errorInfo = '503:服务不可用';
                    break;
                case 504:
                    errorInfo = '504:网关超时';
                    break;
                default:
                    errorInfo = `连接错误${status}`;
            }
            return {status, msg: errorInfo};
        }
    }
    return {status: -404, msg: '网关异常'};
}
export default axios;
