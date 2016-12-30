const debug = require('debug')('wscaffold')
const Boom = require('boom')

const { every, isEmpty, isString, forEach, trim } = require('lodash')

// 用于router执行前进行参数校验
module.exports = configs => {

    return (ctx, next) => {
        doValidate(configs, ctx);

        return next();
    }

};

function doValidate(configs, ctx) {
    if (!isEmpty(configs.query)) {
        forEach(configs.query, (val, key) => {
            const result = validateField(ctx.request.query[key], val, `query/${key}`)
            if (result.needToRefresh) ctx.request.query[key] = val.trim || configs.trim ? trim(result.value) : result.value
        })
    }

    if (!isEmpty(configs.params)) {
        forEach(configs.params, (val, key) => {
            const result = validateField(ctx.params[key], val, `params/${key}`)
            if (result.needToRefresh) ctx.params[key] = val.trim || configs.trim ? trim(result.value) : result.value
        })
    }

    if (!isEmpty(configs.body)) {
        forEach(configs.body, (val, key) => {
            const result = validateField(ctx.request.body[key], val, `body/${key}`)
            if (result.needToRefresh) ctx.request.body[key] = val.trim || configs.trim ? trim(result.value) : result.value
        })
    }

}

/**
 * 校验单个域，如果configs里有提供ifError，则返回值，否则会抛出校验异常
 */
function validateField(value, configs, fieldName) {
    if (configs.validators) {
        const valResult = every(configs.validators, valFn => valFn(value))

        //校验失败
        if (!valResult) {
            if (!configs.ifError) {
                debug(`Validate [${fieldName}] with value:[${value}] ERROR`)
            }

            if (configs.ifError) return {
                needToRefresh: true,
                value: configs.ifError
            }

            throw new Boom.badRequest(`field[${fieldName}] validation error`)
        }

        return {
            needToRefresh: false,
            value
        }
    }
}
