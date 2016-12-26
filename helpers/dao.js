const debug = require('debug')('wscaffold')

const { readJSModule } = require('../utils')

/**
 * @param sequelize 数据库实例
 * @param modelPath 相对于process.cwd()的model目录
 *
 * 导入某个文件夹下的Dao们
 */
function importDao(sequelize, modelPath) {

    return readJSModule(modelPath)
        .map(i => sequelize.import(i))
        .reduce((holder, curr) => {
            debug(`initial dao---->`, curr.name)
            holder[curr.name] = curr
            return holder
        }, {})
}

module.exports = { importDao }
