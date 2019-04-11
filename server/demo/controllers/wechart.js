const code = require('../configs/code');

// access对应的数据处理模型
const wechartModel = require('../models/wechart');


module.exports = {
    async getAccessToken(ctx){
        const rs = await wechartModel.getAccessToken(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(20000); 
        }
    },
    async sendMsg(ctx){
        const rs = await wechartModel.sendMsg(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(20000); 
        }
    },
    async getMsg(ctx){
        const rs = await wechartModel.getMsg(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(20000); 
        }
    },
    async test(ctx){
        const rs = await wechartModel.test(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(20000); 
        }
    },
    
};