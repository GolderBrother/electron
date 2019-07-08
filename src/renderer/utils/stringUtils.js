/*
 * @Description: 字符串工具 
 * @Author: james.zhang 
 * @Date: 2019-07-08 21:37:43 
 * @Last Modified by: james.zhang
 * @Last Modified time: 2019-07-08 22:54:23
 */

// 补0
export const addZero = (num) => {
    num = Number(num);
    return num > 9 ? num : `0${num}`;
}