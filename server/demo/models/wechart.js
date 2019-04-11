

// 页面抓取相关工具集
const { fetch, jqlite } = require('chestnut-utils');
var Redis = require('ioredis');
const WXBizMsgCrypt = require('wxcrypt');
const { x2o,o2x  } = require('wxcrypt');

const corpid = 'wwba6d2647d5fdb7c8';
const secret = 'Teqv0WM277kHfyRREZQLskP7_3KPgkT-2P9i4uErdHg';
const token = 'm5K9y';
const encodingAESKey = 'f0oYmfZHPXwnhl0afQs8byn4e0ngIglIII94v1l3zKf';

module.exports = {
    async getAccessToken(ctx){
        var redis = new Redis();
        let accessToken = await redis.get('accessToken');
        if(accessToken){
            return accessToken
        }else{
            let rs = await fetch(`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpid}&corpsecret=${secret}`, {
                ctx: ctx,
                method: 'get',
            });
            let result = JSON.parse(rs.body);
            redis.set('accessToken', result.access_token, 'EX', 7200);//添加accessToken
            return result.access_token
        }
    },
    async sendMsg(ctx){
        let accessToken = await this.getAccessToken(ctx);
        let rs = await fetch(`https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${accessToken}`, {
            ctx: ctx,
            method: 'post',
            body: JSON.stringify({
                "touser" : "CaoKai",
                "msgtype" : "text",
                "agentid" : 1000002,
                "text" : {
                    "content" : "你的快递已到，请携带工卡前往邮件中心领取。\n出发前可查看<a href=\"http://work.weixin.qq.com\">邮件中心视频实况</a>，聪明避开排队。"
                },
                "safe":0
            })
        });
        let result = JSON.parse(rs.body)
        return result;
    },
    async getMsg(ctx){
        const crypto = new WXBizMsgCrypt(token, encodingAESKey, corpid);
        let msgSignature = ctx.request.query.msg_signature;
        let timestamp = ctx.request.query.timestamp;
        let nonce = ctx.request.query.nonce;
        if(ctx.request.method=='GET'){
            let echostr = ctx.request.query.echostr;
            let resutlt = crypto.verifyURL(msgSignature, timestamp, nonce, echostr);
            console.log(resutlt);
            return resutlt;
        }else{
            let result = crypto.decryptMsg(msgSignature, timestamp, nonce, ctx.request.body);
            result = x2o(result)
            console.log(result);
            if(result.xml.MsgType === 'text' && result.xml.Content==='值班'){
                let CreateTime = Date.parse(new Date()).toString().substr(0,10);
                let replyMsg = {
                    xml:{
                        ToUserName:result.xml.FromUserName,
                        FromUserName:result.xml.ToUserName,
                        CreateTime:CreateTime,
                        MsgType:'text',
                        Content:'测试专用!!'
                    }
                };
                replyMsg = o2x(replyMsg)
                console.log(replyMsg)
                let xml = crypto.encryptMsg(replyMsg, CreateTime, nonce)
                console.log(xml);
                return ctx.response.body = xml;
            }
            return {};
        }
        
    },
    async test(ctx){
        console.log(ctx.request.body)
    }
    
    
};