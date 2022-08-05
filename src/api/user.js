// 用户相关的接口

import request from '@/utils/request'

/**
 * 账号密码登陆
 * @param {String} account -账号 
 * @param {String} password -密码 
 * @returns Promise
 */
export const userAccountLogin = ({ account, password }) => {
    return request('/login', 'post', { account, password })
}

/**
 * 获取手机号的短信验证码
 * @param {String} mobile -手机号 
 * @returns 
 */
export const userMobileLoginMsg = (mobile) => {
    return request('/login/code', 'get', { mobile })
}

/**
 * 获取手机号登陆
 * @param {String} mobile -手机号  默认123456
 * @param {String} code -短信验证码 
 * @returns 
 */
export const userMobileLogin = ({ mobile, code }) => {
    return request('/login/code', 'post', { mobile, code })
}

/**
 * QQ登陆
 * @param {String} unionId -QQ唯一标识 openId
 * @param {String} 客户端类型 1：pc
 * @returns 
 */
export const userQQLogin = ( unionId, source=1 ) => {
    return request('/login/social', 'post', { unionId, source })
}

/**
 * 获取QQ绑定的时候短信验证码
 * @param {String} mobile -手机号
 * @returns 
 */
export const userQQBindCode = (mobile) => {
    return request('/login/social/code','get',{mobile})
}

/**
 * QQ登陆绑定账号
 * @param {String}  unionId -唯一标识
 * @param {Number}  mobile -手机号
 * @param {Number}  code -验证码
 * @returns 
 */
export const userQQBindLogin = ({ unionId, mobile, code }) => {
    return request('/login/social/bind', 'post', { unionId, mobile, code })
}

/**
 * 校验用户名是否唯一
 * @param {String} account -账号 
 * @returns Promise
 */
export const userAccountCheck = (account) => {
    return request('/register/check', 'get', { account })
}

/**
 * 获取QQ完善信息的时候短信验证码
 * @param {String} mobile -手机号
 * @returns 
 */
export const userQQPatchCode = (mobile) => {
    return request('/register/code', 'get', { mobile })
}

/**
 * QQ登陆完善信息
 * @param {String}  unionId -唯一标识
 * @param {Number}  mobile -手机号
 * @param {Number}  code -验证码
 * @param {Number}  account -用户名
 * @param {Number}  password -密码
 * @returns 
 */
export const userQQPatchLogin = ({ unionId, mobile, code, account, password }) => {
    return request(`/login/social/${unionId}/complement`, 'post', { unionId, mobile, code, account, password })
}

// 解绑
// https://pcapi-xiaotuxian-front-devtest.itheima.net/login/social/unbind/?mobile=15997765241 