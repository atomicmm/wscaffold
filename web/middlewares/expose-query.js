// 将query中的值解压到ctx.data中

module.exports = (ctx, next) => {
    ctx.data = Object.assign({}, ctx.data, ctx.request.query)

    return next()
}
