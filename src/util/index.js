
//对象深拷贝函数
function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}
export {
    deepCopy
} 