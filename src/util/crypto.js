import CryptoJS from 'crypto-js';
function generateMD5TimestampId(salt = '') {
    // 获取当前时间戳
    var timestamp = new Date().getTime().toString(); 
    // 如果有提供盐值，将其与时间戳拼接
    var dataToHash = timestamp + (salt || '');
    // 使用crypto库计算拼接后数据的MD5哈希值
    var hash = CryptoJS.MD5(dataToHash);
    // 取哈希值的前6位
    var id = hash.toString().slice(0, 6);
    return id;
}
export {
    generateMD5TimestampId
}