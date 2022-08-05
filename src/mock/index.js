import Mock from 'mockjs'
import qs from 'qs'

// 基本配置
Mock.setup({
    // 随机延迟
    timeout: '500-1000'
})

// 拦截接口  /my/test
// 1.拦截地址规则，需要匹配到它
// 2.请求方式
// 3.返回数据（函数返回数据）
Mock.mock(/\/my\/test/, 'get', () => {
    // 模拟数据的逻辑 目标：5条数据  [{id:'',name:''},...]
    const arr = []
    for (let i = 0; i < 5; i++){
        // arr.push(Mock.mock('@id'))
        arr.push(Mock.mock({
            id: '@id',
            name: '@cname',
            image:'@image(200x100)'
        }))
    }
    return { msg: '获取数据成功', result: arr }
})

// 模拟我的收藏
Mock.mock(/\/member\/collect/, 'get', (config) => {
    // 假设35条数据
    // config  提交过来的参数
    // console.log(config);
    const queryString = config.url.split('?')[1]
    const queryObject = qs.parse(queryString)
    const items = []
    for (let i = 0; i < +queryObject.pageSize; i++){
        items.push(Mock.mock({
            id: '@id',
            // '@ctitle(10,20)'  中文的文字 10 - 20 个
            name: '@ctitle(10,20)',
            desc: '@ctitle(4,10)',
            price: '@float(100,200,2,2)',
            //网络图片 http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_6.jpg
            picture:`http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_${Mock.mock('@integer(1,8)')}.jpg`
        }))
    }
    return {
        msg:'获取收藏商品成功',
        result: {
            counts: 35,
            pageSize: +queryObject.pageSize,
            page: +queryObject.page,
            items
        }
    }
})
// 模拟我的足迹
Mock.mock(/\/member\/browseHistory/, 'get', (config) => {
    // 假设35条数据
    // config  提交过来的参数
    // console.log(config);
    const queryString = config.url.split('?')[1]
    const queryObject = qs.parse(queryString)
    const items = []
    for (let i = 0; i < +queryObject.pageSize; i++){
        items.push(Mock.mock({
            id: '@id',
            // '@ctitle(10,20)'  中文的文字 10 - 20 个
            name: '@ctitle(10,20)',
            desc: '@ctitle(4,10)',
            price: '@float(100,200,2,2)',
            //网络图片 http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_6.jpg
            picture:`http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_${Mock.mock('@integer(1,8)')}.jpg`
        }))
    }
    return {
        msg:'获取收藏商品成功',
        result: {
            counts: 35,
            pageSize: +queryObject.pageSize,
            page: +queryObject.page,
            items
        }
    }
})