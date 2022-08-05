// 提供商品相关的api函数

import request from '@/utils/request'

/**
 * 获取商品详情
 * @param {String} id - 商品ID 
 * @returns 
 */
export const findGoods = (id) => {
    return request('/goods', 'get', { id })
}

/**
 * 获取相关推荐商品 | 猜你喜欢商品
 * @param {String} id - 商品ID 传入就是相关推荐 不传就是猜你喜欢
 * @param {Integer} limit -商品数量
 * @returns 
 */
export const findRelevantGoods = ({ id, limit = 16 }) => {
    return request('/goods/relevant', 'get', { id, limit })
}

/**
 * 获取热销榜数据
 * @param {String} id - 商品ID 
 * @param {Integer} limit -商品数量
 * @param {Integer} type - 1:'24小时热销榜',2:'周热销榜',3:'总热销榜'
 * @returns 
 */
export const findGoodsHot = ({ id, limit = 3, type = 1 }) => {
    return request('/goods/hot', 'get', { id, limit, type })
}

/** https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate
 * 获取商品评价信息
 * @param {String} id - 商品ID 
 * @returns 
 */
export const findGoodsCommentInfo = (id) => {
    // axios 遇到https开头的地址就不会拼接baseUrl
    return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`, 'get',)
}

/** 
 * 获取商品评价列表
 * @param {String} id - 商品ID 
 * @param {Object} params -  
 * @returns 
 */
export const findGoodsCommentList = (id,params) => {
    // axios 遇到https开头的地址就不会拼接baseUrl
    return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate/page`, 'get', params)
}