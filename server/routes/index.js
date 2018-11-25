const router = require('koa-router')()
const controller = require('../controller/index.js')

router.get('/article',controller.getArticle)
router.post('/login',controller.getLogin)

module.exports = router