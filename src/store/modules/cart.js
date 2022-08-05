import { getNewCartGoods, mergeCart, findCart, insertCart, deleteCart, updateCart, checkAllCart } from "@/api/cart"

// 购物车模块
export default {
  namespaced: true,
  // 函数形式
  state() {
    return {
      // 购物车商品列表信息
      list: []
    }
  },
  getters: {
    // 有效商品列表
    validList(state) {
      // 有效商品：库存 > 0 stock    商品有效标识为true isEffective
      return state.list.filter(goods => goods.stock > 0 && goods.isEffective)
    },
    // 有效商品总件数
    validTotal(state, getters) {
      return getters.validList.reduce((p,c)=>p + c.count,0)
    },
    // 有效商品总金额
    validAmount(state, getters) {
      // return getters.validList.reduce((p, c) => p + c.count * 100 * c.nowPrice,0) / 100
      return getters.validList.reduce((p, c) => p + Math.round(c.count * 100) * c.nowPrice,0) / 100
    },
    // 无效商品列表
    invalidList(state) {
      // isEffective 为假  没有库存
      return state.list.filter(goods => goods.stock <= 0 || !goods.isEffective)
    },
    // 已选择商品列表
    selectedList(state, getters) {
      // 从有效的商品列表中查已选中的
      return getters.validList.filter(item=>item.selected)
    },
    // 已选择商品总件数
    selectedTotal(state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 已选择商品总金额
    selectedAmount(state, getters) {
      // return getters.validList.reduce((p, c) => p + c.count * 100 * c.nowPrice,0) / 100
      return getters.selectedList.reduce((p, c) => p + Math.round(c.count * 100) * c.nowPrice, 0) / 100
    },
    // 是否全选 
    isCheckAll(state, getters) {
      // 有效商品列表 和 已选中商品列表的长度一样
      return getters.validList.length !== 0 && getters.selectedList.length === getters.validList.length
    }
  },
  mutations: {
    // 加入购物车
    insertCart(state, payload) {
      // 约定加入购物车字段必须和后端一致 payload对象字段
      // id skuId name attrsText	picture price nowPrice selected stock count isEffective 
      // 插入数据的规则：
      // 1.先看有没有相同的商品
      // 2.有相同的商品：  查询数量 合并累加到payload字段  在保存在最新的位置  原来的商品需要删除
      // 3.没有相同的商品：保存在最新位置即可

      // 拿到相同索引
      const sameIndex = state.list.findIndex(goods => goods.skuId === payload.skuId)  //0,1,2,3...
      // 有  查询数量 合并累加
      if (sameIndex > -1) {
        const count = state.list[sameIndex].count
        payload.count += count
        // 删除原有商品
        state.list.splice(sameIndex, 1)
      }
      // 无  直接追加新的
      state.list.unshift(payload)
    },
    // 修改购物车商品
    updateCart(state,goods) {
      // goods  商品信息：nowPrice  stock isEffective
      // goods 商品对象的字段不固定 对象中有那些字段就改那些字段 字段的值合理才改
      // goods 商品对象中必须有skuId
      const updateGoods = state.list.find(item=>item.skuId === goods.skuId)
      for (const key in goods) {
        if (goods[key] !== undefined && goods[key] !== null && goods[key] !== '') {
          updateGoods[key] = goods[key]
        }
      }
    },
    // 删除购物车商品
    deleteCart(state,skuId) {
      const index = state.list.findIndex(item => item.skuId === skuId)
      state.list.splice(index,1)
    },
    // 设置购物车
    setCart(state, payload) {
      // payload为空数组就是清空 为有值就是设置
      state.list = payload
    }
  },
  actions: {
    // 加入购物车
    insertCart(ctx, payload) {
      return new Promise((resolve, reject) => {
        // rootState 总的state    state只是本模块的satte
        if (ctx.rootState.user.profile.token) {
        //   // 已登陆
          insertCart({ skuId: payload.skuId, count: payload.count }).then(() => {
            return findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登陆
          ctx.commit('insertCart', payload)
          resolve()
        }
      })
    },
    // 获取商品列表
    findCart(ctx) {
      return new Promise((resolve,reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登陆
          findCart().then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登陆
          // 同时发送请求 （有几件商品 发送几个请求）等所有请求成功 一并修改本地数据
          // Promise.all(promise数组).then((dataList)=>{})同时发送请求   所有成功的结果都会汇总在dataList
          // Promise.resolve()    Promise.reject()    new Promise()
          // Promise.race(promise数组).then((data)=>{})  同时发送请求 最快的请求成功 得到成功的结果
          const promiseArr = ctx.state.list.map(goods => {
            return getNewCartGoods(goods.skuId)
          })
          // dataList成功结果的集合 数据顺序和promiseArr顺序一致 它又是根据state.list而来
          Promise.all(promiseArr).then(dataList => {
            // console.log(dataList);
            // 更新本地购物车
            dataList.forEach((data,i) => {
              ctx.commit('updateCart',{skuId:ctx.state.list[i].skuId, ...data.result})
            })
            // 调用resolve 代表操作结束
            resolve()
          })
        }
      })
    },
    // 删除购物车 
    deleteCart(ctx, payload) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登陆
          deleteCart([payload]).then(() => {
            return findCart()
          }).then(data => {
          // 设置购物车
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登陆
          // 单条删除 payload --> skuId
          ctx.commit('deleteCart', payload)
          resolve()
        }
      })
    },
    // 修改购物车（选中状态 数量）
    updateCart(ctx, payload) {
      // payload 需要：必须有skuId 可能有selected count
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登陆
          updateCart(payload).then(() => {
              // 获取商品列表
            return findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登陆
          ctx.commit('updateCart', payload)
          resolve()
        }
      })
    },
    // 全选与取消全选
    checkAllCart(ctx, selected) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登陆
          const ids = ctx.getters.validList.map(item => item.skuId)
          checkAllCart({ selected, ids }).then(() => {
            // 获取商品列表
            return findCart()
          }).then(data => {
            // 设置购物车
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登陆
          // 全选的状态控制遍历出来的状态
          ctx.getters.validList.forEach(goods => {
            ctx.commit('updateCart',{ skuId:goods.skuId, selected })
          })
          resolve()
        }
      })
    },
    // 批量删除
    batchDeleteCart(ctx,isClear) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登陆
          const ids = ctx.getters[isClear ? 'invalidList' : 'selectedList'].map(item => item.skuId)
          deleteCart(ids).then(() => {
            return findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登陆
          // 找出选中的商品列表，遍历调用删除的mutations方法
          // isClear 为true时  删除的是无效列表  反之为选中的列表
          ctx.getters[isClear ? 'invalidList':'selectedList'].forEach(item => {
            ctx.commit('deleteCart',item.skuId)
          })
          resolve()
        }
      })
    },
    // 修改规格
    updateCartSku(ctx,{oldSkuId,newSku}) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登陆
          // 1.找出旧的商品信息
          // 2.删除这个旧的商品数据
          // 3.原先商品数量 + 新的skuId
          // 4.添加新的商品
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
          deleteCart([oldGoods.skuId]).then(() => {
            return insertCart({skuId:newSku.skuId, count:oldGoods.count})
          }).then(() => {
            return findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登陆
          // 1.找出旧的商品信息
          // 2.删除这个旧的商品数据
          // 3.根据新的sku信息和旧的商品信息,合并成一条新的购物车商品数据
          // 4.添加新的商品
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
          ctx.commit('deleteCart', oldSkuId)
          const { skuId, price: nowPrice, specsText: attrsText, inventory: stock } = newSku
          const newGoods = { ...oldGoods, skuId, nowPrice, attrsText, stock }
          ctx.commit('insertCart', newGoods)
          resolve()
        }
      })
    },
    // 合并购物车
    async mergeCart(ctx) {
      // 合并的参数
      const cartList = ctx.state.list.map(goods => {
        return {
          skuId: goods.skuId,
          selected: goods.selected,
          count:goods.count
        }
      })
      // console.log(cartList);
      await mergeCart(cartList)
      // 合并成功 清空本地购物车
      ctx.commit('setCart',[])
    }
  }
}
