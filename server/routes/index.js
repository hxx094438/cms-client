const router = require('koa-router')()
const controller = require('../controller/index.js')

router.get('/article',controller.getArticle)
router.get('/login',controller.getLogin)


module.exports = router