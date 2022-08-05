// 分类模块
import { topCategory } from '@/api/constants'
import { findAllCategory } from '@/api/category'
export default {
  namespaced: true,
  // 函数形式
  state() {
    return {
      // 分类信息集合，依赖topCategory重新设置保证初始化就有数据
      list: topCategory.map(item => ({ name: item }))
    }
  },
  // 修改分类的函数
  mutations: {
    //payload 所有的分类集合
    setList(state, payload) {
      state.list = payload
    },
    // 定义show hide函数 控制当前分类的二级分类的显示隐藏
    show(state,item) {
      const currCategory = state.list.find(category =>  category.id === item.id )
      currCategory.open = true
    },
    hide(state, item) {
      const currCategory = state.list.find(category =>  category.id === item.id )
      currCategory.open = false
    }
  },
  // 获取分类函数
  actions: {
    async getList({ commit }) {
      // 获取分类数据
      const data = await findAllCategory()
      // 给每个分类加上控制二级分类显示隐藏的数据 open
      data.result.forEach(top => {
        top.open = false
      })
      // console.log(data.result);
      // 修改分类数据
      commit('setList',data.result)
    }
  }
}
