// 检测请求是不是XHR...

module.exports = (ctx, next) => {
    ctx.request.xhr = (ctx.request.get('X-Requested-With') === 'XMLHttpRequest')

    return next();
}
