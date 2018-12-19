const Koa = require('koa')
const app = new Koa()
// const views = require('koa-views')
const hbs = require('koa-hbs');
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const path = require('path');
const index = require('./routes/index')
const users = require('./routes/users')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

// app.use(views(__dirname + '/views', {
//   extension: 'hbs',
//   map: { hbs: 'handlebars' }
// }))


//模板引擎
app.use(hbs.middleware({
    viewPath: path.join(__dirname, '/views'),
    defaultLayout: 'layout',
    partialsPath: path.join(__dirname, '/views/partials'),
    contentHelperName: 'extend',//扩展代码原名是contentAs，是为了兼容之前的代码
    disableCache: true
}));

// app.use((ctx,next)=>{
//     console.log('__dirname'+path.join(__dirname, '/views'));
//     // console.log('__dirname'+__dirname);
// })
// logger
app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes())
app.use(users.routes())

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

module.exports = app
