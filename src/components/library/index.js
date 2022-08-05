// 扩展vue原有功能：全局组件 自定义指令 挂载原型方法
// 这就是插件
// vue2.0插件写法要素：导出一个对象，有install函数，默认传入了Vue构造函数，Vue基础之上扩展
// vue3.0插件写法要素：导出一个对象，有install函数，默认传入了app应用实例，app基础之上扩展

// 默认图片
import defaultImg from '@/assets/images/200.png'
// // 骨架效果
// import XtxSkeleton from './xtx-skeleton.vue'
// // 轮播图
// import XtxCarousel from './xtx-carousel.vue'
// // 查看更多
// import XtxMore from './xtx-more.vue'
// // 面包屑
// import XtxBread from './xtx-bread.vue'
// import XtxBreadItem from './xtx-bread-item.vue'

// 批量注册组件
// 使用 require 提供的函数 context 加载某一个目录下的所有.vue 后缀的文件。
// 然后 context 函数会返回一个导入函数 importFn
// 它又一个属性 keys() 获取所有的文件路径
// 通过文件路径数组，通过遍历数组，再使用 importFn 根据路径导入组件对象
// 遍历的同时进行全局注册即可
// context(目录名称，是否加载子目录，加载文件的匹配（可以正则）)

// 拿到目录下的所匹配的所有.vue 后缀的文件
const importFn = require.context('./',false,/\.vue$/) //当前目录 没有子目录  .vue结尾的文件

import Message from './Message'

export default {
    install(app) {
        // 在app上扩展 app提供 component directive函数
        // 如果要挂载原型 app.config.glglobalProperties 方式
        // app.component(XtxSkeleton.name, XtxSkeleton)
        // app.component(XtxCarousel.name, XtxCarousel)
        // app.component(XtxMore.name, XtxMore)
        // app.component(XtxBread.name, XtxBread)
        // app.component(XtxBreadItem.name, XtxBreadItem)

        // 根据keys()批量注册 遍历 
        importFn.keys().forEach(path => {
            // 相当于 import XtxMore from './xtx-more.vue' 导入组件
            const component = importFn(path).default //使用importFn导入每一个路径
            // 注册
            app.component(component.name,component)
        })

        // 定义指令
        defineDirective(app)

        // 定义一个原型函数
        app.config.globalProperties.$message = Message
    }
}

// 定义指令
const defineDirective = (app) => {
    // 1.图片懒加载 v-lazy  指令directive
    // 原理：先储存图片地址 不能先放在src上（放在src上直接发请求了） 当图片进入可视区 将src地址换成存储地址
    app.directive('lazy', {
        // vue2.0监听使用指令的DOM是否创建好 钩子函数：inserted
        // vue3.0的指令拥有的勾子函数和组件一样 使用指令的DOM是否创建好 钩子函数：mounted
        // el -->传入的dom
        mounted(el,binding) {  
            // 2.创建一个观察对象 来观察当前使用指令的元素
            const observe = new IntersectionObserver(([{isIntersecting}]) => {
                if (isIntersecting) {
                    // 停止观察
                    observe.unobserve(el)
                    // console.log('进入可视区');
                    // 3.把指令的值设置给el的src属性  binding.value 就是指令的值
                    // 4.处理图片加载失败  error是图片加载失败的事件  load是图片加载成功
                    el.onerror = () => {
                        // 加载失败 设置默认图
                        el.src = defaultImg
                    }
                    el.src = binding.value
                }
             }, {
                threshold:0.01
            })
            // 开启观察
            observe.observe(el)
        },
    })
}