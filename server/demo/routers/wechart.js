const routerUtil = require('chestnut-router');
const router = routerUtil.create('/wechart');// 代表父目录为/access

const wechartController = require('../controllers/wechart');

const fetch = require('chestnut-utils').fetch;

module.exports = router
    .get('/getAccessToken', wechartController.getAccessToken)
    .get('/sendMsg', wechartController.sendMsg)
    .get('/getMsg', wechartController.getMsg)
    
    