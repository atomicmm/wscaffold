const { readdirSync } = require('fs')
const { resolve } = require('path')

// 组合Page对象
exports.renderPage = (totalElement, offset = 0, limit = 15, items = []) => {
    return {
        totalNum: totalElement,
        pageSize: limit,
        currentPage: Math.ceil(offset / limit) + 1,
        countPage: Math.ceil(totalElement / limit),
        items
    }
}

//输出Page fields
exports.buildPageFields = itemType => `
    totalNum:Int!
    pageSize:Int!
    countPage:Int!
    currentPage:Int!
    items:[${itemType}]
`

//解析JS文件
exports.readJSModule = modulePath => readdirSync(resolve(process.cwd(), modulePath))
    .filter(name => /\.js$/.test(name))
    .map(f => resolve(process.cwd(), modulePath, f))