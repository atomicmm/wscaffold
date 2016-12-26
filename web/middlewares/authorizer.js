const debug = require('debug')('wscaffold')

// session登录检查
module.exports = tokenKey => (ctx, next) => {

    if (!ctx.session || !ctx.session[tokenKey]) {
        ctx.body = {
            errors: [{
                message: '会话超时，请重新登录',
                state: "-80"
            }]
        }
        return
    }

    return next()
}
