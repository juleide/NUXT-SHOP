import axios from 'axios';
import qs from 'qs';

const service = axios.create({
    baseURL: process.server ? `http://47.115.85.237:3000` : '/api',
    // baseURL: '/api',
    // timeout: 60000, //响应时长可根据业务需求自行设置
    responseType: "json",
    withCredentials: false,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    }
})

//请求拦截器
service.interceptors.request.use(config => {
    let METHOD = config.method.toUpperCase();
    if (METHOD === "POST" || METHOD === "PUT" || METHOD === "DELETE") {
        config.data = qs.stringify(config.data);
    }
    
    return config
}, error => {
    return Promise.reject(error)
});

//响应拦截器
service.interceptors.response.use(response => {
    /** 以下可根据返回的code值来做用户权限操作*/
    return response
}, error => {
    return Promise.reject(error)
})

export { service }

export default service