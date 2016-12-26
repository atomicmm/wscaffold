const debug = require('debug')('wscaffold')

const { groupBy, find, forEach } = require('lodash')
const Router = require('koa-router')
const { readJSModule } = require('../utils')

const prepare = require('../web/middlewares/prepare-data')
const validation = require('../web/middlewares/validation')

const BASE_SUFFIX = '.js'
const CONFIG_SUFFIX = '.config.js'

/**
 * @param app koa instance
 * @param routerPath 相对于process.cwd()的router路径
 *
 * .js --->router主文件
 * .config.js --->该router的配置文件(校验器，静态数据，中间件)
 */
function buildRouter(app, routerPath) {

    const modules = groupBy(readJSModule(routerPath))
    debug(`find ${Object.keys(modules).length} router-modules in ${routerPath}`)

    forEach(modules, (files, baseName) => {
        //debug(`begin to build router moudle [${baseName}]`)
        let configFile = files.find(file => file === `${baseName}${CONFIG_SUFFIX}`)
        let baseFile = files.find(file => file === `${baseName}${BASE_SUFFIX}`)

        // router instance
        let config = {}
        let moduleMiddlewares = [] //整个模块的全局middlewares

        if (configFile) {
            config = require(path.resolve(rootPath, configFile))
        }

        const router = ('prefix' in config) ?
            (new Router({ prefix: config.prefix })) :
            (new Router())

        // middlewares栈顺序：config.middlewares->config.prepre->config.validation->handler

        if ('middlewares' in config) {
            moduleMiddlewares.push(...config.middlewares)
        }

        const endpoints = require(path.resolve(rootPath, baseFile))
        forEach(endpoints, ep => {
            let middlewares = [...moduleMiddlewares] //单个endpoint

            if ('configs' in config) {
                let endponitConfig = findByPathAndMethod(config.configs, ep.path, ep.method) || {}
                if ('prepare' in endponitConfig) {
                    middlewares.push(prepare(endponitConfig.prepare))
                }

                if ('validation' in endponitConfig) {
                    middlewares.push(validation(endponitConfig.validation))
                }
            }

            middlewares.push(ep.handler)
                //debug(`${ep.method}->${ep.path} has [${middlewares.length} middlewares...]`)
            router[ep.method](ep.path, ...middlewares)
        })

        app.use(router.routes())
        app.use(router.allowedMethods({
            throw: true
        }))
    })

    debug(`router-modules parsed...`)

}

/**
 * 在配置中根据method和path搜索节点
 */
function findByPathAndMethod(configs, path, method) {
    return find(configs, { path, method })
}

module.exports = { buildRouter }
