
/**
 * 将数据预先写入ctx.data中
 */
module.exports = (data) => {

    return (ctx, next) => {
        ctx.data = Object.assign({}, ctx.data, data);

        return next()
    }
}
