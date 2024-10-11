// responseWrapper.js

/**
 * 封装成功响应
 * @param {Object} data - 响应数据
 * @param {string} message - 成功消息
 * @param {number} code - 状态码
 * @returns {Object} 封装后的响应对象
 */
const successResponse = (data = null, message = 'Operation successful', code = 200) => ({
    success: true,
    code,
    data,
    message,
});

/**
 * 封装错误响应
 * @param {string} message - 错误消息
 * @param {number} code - 状态码
 * @param {Object} errors - 详细错误信息
 * @returns {Object} 封装后的错误响应对象
 */
const errorResponse = (message = 'Operation failed', code = 400, errors = null) => ({
    success: false,
    code,
    errors,
    message,
});

/**
 * Koa 中间件，用于统一处理响应
 */
const responseHandler = async (ctx, next) => {
    try {
        await next();
        // 如果没有显式设置状态，则默认为 200
        if (!ctx.body && ctx.status === 404) {
            ctx.body = successResponse(null, 'Not Found', 404);
        } else if (ctx.body && !ctx.body.success) {
            // 如果 body 已经设置但没有 success 字段，则封装它
            ctx.body = successResponse(ctx.body);
        }
    } catch (err) {
        // 错误处理
        ctx.status = err.status || 500;
        ctx.body = errorResponse(err.message, ctx.status, err.errors);
        // 确保将错误记录下来
        console.error(err);
    }
};

module.exports = {
    successResponse,
    errorResponse,
    responseHandler,
};