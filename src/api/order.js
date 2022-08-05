// 订单相关的API函数

import request from '@/utils/request'

/**
 * 结算页面的生成订单 -根据购物车生成
 * @returns 
 */
export const createOrder = () => {
    return request('/member/order/pre', 'get')
}

/**再次购买
 * 结算页面的生成订单 -根据订单生成
 * @returns 
 */
export const repurchaseOrder = (orderId) => {
    return request(`/member/order/repurchase/${orderId}`, 'get')
}

/**
 * 添加收货地址
 * @param {Object} form  
 */
export const addAddress = (form) => {
    return request('/member/address','post',form)
}

/**
 * 编辑收货地址信息
 * @param {Object} form 
 */
export const editAddress = (form) => {
    return request(`/member/address/${form.id}`, 'put', form)
}

/**
 * 提交订单
 * @param {Object} params - 订单信息对象
 */
export const submitOrder = (params) => {
    return request('/member/order', 'post', params)
}

/**
 * 获取订单详情
 * @param {String} orderId -订单id
 * @returns 
 */
export const findOrderDetail = (orderId) => {
    return request(`/member/order/${orderId}`,'get')
}

/**
 * 
 * @param {String} page - 页码 
 * @param {String} pageSize - 没页条数 
 * @param {String} orderState - 订单状态，1为待付款、2为待发货、3为待收货、4为待评价、5为已完成、6为已取消，未传该参数或0为全部 
 * @returns 
 */
export const findOrderList = ({ page=1, pageSize=10, orderState=0 }) => {
    return request('/member/order', 'get', { page, pageSize, orderState })
}

/**
 * 取消订单
 * @param {String} orderId - 订单ID
 * @param {String} cancelReason - 取消原因
 * @returns Promise
 */
export const cancelOrder = ({orderId, cancelReason}) => {
    return request(`/member/order/${orderId}/cancel`, 'put', { cancelReason })
}

/**
 * 删除订单
 * @param {Array<string>} ids - 删除订单，id集合
 * @returns
 */
export const delteOrder = (orderId) => {
    return request('/member/order', 'delete', { ids:[orderId] })
}

/**
 * 确认收货
 * @param {String} orderId - 订单ID
 * @returns 
 */
export const confirmOrder = (orderId) => {
    return request(`/member/order/${orderId}/receipt`, 'put')
}

/**
 * 查看物流
 * @param {String} orderId - 订单ID
 * @returns
 */
export const logisticsOrder = (orderId) => {
    return request(`/member/order/${orderId}/logistics`, 'get')
}