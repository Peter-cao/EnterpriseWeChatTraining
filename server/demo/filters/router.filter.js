

const code = require('../configs/code');

const projectPath = require('../configs/config').projectPath;


function getFilesObj(files){
    files = files || [];
    const obj = {};
    files.forEach(file => {
        if(file.fieldname){
            if(obj[file.fieldname]){
                if(!(obj[file.fieldname] instanceof Array)){
                    obj[file.fieldname] = [obj[file.fieldname]];
                }
                obj[file.fieldname].push(file);
            }else{
                obj[file.fieldname] = file;
            }
        }
    });
    return obj
}


// 此规则需要自己定义
const rules = {
    default: function (ctx) {
        // 获取会话信息，是否含有会话
        const hasData = !!(ctx.session && ctx.session.userinfo);
        const files = ctx.request.files;

        const url = ctx.url;

        let rs = true;

        /*
        框架默认文件是以数组方式存储在ctx.request.files，为了方便根据key获取，重新组织放置到ctx.request.filesObj对象
        其中filesObj的key即为前端提交的input:file的name属性值
        比如：前端<input type="file" name="attachment"/>提交表单
        后端通过ctx.request.filesObj.attachment获取
        */
        ctx.request.filesObj = getFilesObj(files);

        // 统一会话校验，如果没有会话继续判断
        if (!hasData){
            // 如果请求地址是以access开头，一般是登录等接口不需要会话
            if(url.indexOf('/access/')>-1){
                rs = true;
            }else{
                // 否则提示会话超时的错误码信息
                ctx.body = code.get(10001);
                rs = false;
            }
        }

        return true;
    }
};

module.exports = rules;