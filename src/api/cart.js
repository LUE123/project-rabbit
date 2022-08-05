// 封装购物车相关的API函数
import request from '@/utils/request'

/**
 * 获取商品最新价格  库存 是否有效
 * @param {String} skuId -
 * @returns 
 */
export const getNewCartGoods = (skuId) => {
    return request(`goods/stock/${skuId}`, 'get')
}

/**
 * 获取商品对应的sku数据
 * @param {String} skuId - SKU id 
 * @returns 
 */
export const getGoodsSku = (skuId) => {
    return request(`/goods/sku/${skuId}`, 'get')
}

/**
 * 合并购物车
 * @param {Array<Object>} cartList - 购物车信息列表      {Array<Object>}对象类型的数组 就是数组里面是对象
 * @param {String} Object.skuId - SKU id  
 * @param {Boolean} Object.selected - 选中状态  
 * @param {Integer} Object.count - 数量
 */
export const mergeCart = (cartList) => {
    return request('/member/cart/merge', 'post', cartList)
}

/**
 * 获取购物车列表
 * @returns 
 */
export const findCart = () => {
    return request('/member/cart','get')
}

/**
 * 加入购物车
 * @param {String} skuId - SKU id  
 * @param {Integer} count - 数量
 * @returns 
 */
export const insertCart = ({skuId,count}) => {
    return request('/member/cart', 'post', { skuId, count })
}

/**
 * 删除购物车商品支持批量
 * @param {Array<string>} ids - skuId的集合 
 * @returns 
 */
export const deleteCart = (ids) => {
    return request('/member/cart','delete',{ids})
}

/**
 * 修改购物车商品（状态 数量）
 * @param {string} ids - skuId的集合 
 * @param {Boolean} selected - 选中状态 
 * @param {Integer} count - 数量 
 * @returns 
 */
export const updateCart = ({skuId, selected, count }) => {
    return request(`/member/cart/${skuId}`,'put',{selected, count})
}

/**
 * 全选反选
 * @param {Boolean} selected - 选中状态
 * @param {Array<string>} ids - 有效商品skuId集合
 * @returns Promise
 */
export const checkAllCart = ({selected, ids}) => {
    return request('/member/cart/selected','put',{selected, ids})
}