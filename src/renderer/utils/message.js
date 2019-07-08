/*
 * @Description: 消息提示框统一封装 
 * @Author: james.zhang 
 * @Date: 2019-07-08 22:34:00 
 * @Last Modified by: james.zhang
 * @Last Modified time: 2019-07-08 22:53:58
 */
import Vue from 'vue'
const vueInstance = new Vue();
export function openMessage({
    onClose,
    duration = 1000,
    ...restOptions
}) {
    // 调用message之前先关闭所有存在的，避免出现很多个消息框
    vueInstance.$message.closeAll();
    vueInstance.$message({
        showClose: true,
        duration,
        ...onClose,
        ...restOptions
    });
}