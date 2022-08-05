import { createStore } from 'vuex'

// 引入vuex持久化插件
import createPersistedstate from 'vuex-persistedstate'

import cart from '@/store/modules/cart'
import user from '@/store/modules/user'
import category from '@/store/modules/category'

export default createStore({
  modules: {
    user,
    cart,
    category
  },
  // 配置插件  默认存储在localStorage
  plugins: [createPersistedstate({
    // 本地存储的名字
    key: 'erabbit-client-pc-store',
    // 指定需要存储的模块
    paths: ['user', 'cart']
  })
  ]
})
