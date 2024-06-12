// api.js
import axios from 'axios';

// 设置基础URL
const BASE_URL = 'http://localhost:5000';

// GET请求封装
const request_get = (url, params = {}, callback, errorCallback) => {
    axios.get(`${BASE_URL}/${url}`, { params })
        .then(response => {
            callback(response.data);
        })
        .catch(error => {
            if (errorCallback) {
                errorCallback(`GET request failed: ${error.message}`);
            }
        });
};

// POST请求封装
const request_post = (url, data = {}, callback, errorCallback) => {
    axios.post(`${BASE_URL}/${url}`, data)
        .then(response => {
            callback(response.data);
        })
        .catch(error => {
            if (errorCallback) {
                errorCallback(`POST request failed: ${error.message}`);
            }
        });
};

export { request_get, request_post };