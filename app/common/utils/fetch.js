
import Alert from '@auicomp/alert/Alert.aui';

import { router } from '@auicomp/action/Action.aui';

import commLang from '@lang/comm';

var config;

var baseUrl = location.host;

var fetch = function (options) {

    var _successFuncCache = options.success,
        _errorFuncCache = options.error;

    // 自动补全url
    if(!/^https?\:\/\//.test(options.url)){
        options.url = config.serverBaseUrl + options.url;
    }

    if(!options.type) options.type = 'post';

    if (!options.dataType) options.dataType = 'json';

    if(options.url.indexOf(baseUrl)<0){
        options.xhrFields = {
            withCredentials: true
        };
        options.crossDomain = true;
    }
   
    options.success = function (data) {
        var args = arguments;
        if (options.dataType === 'json') {
                _successFuncCache&&_successFuncCache.apply(this, args);
        }

    };

    options.error = function () {
        var args = arguments;
        if(options.derror){
            options.derror.apply(this, arguments);
            return;
        }
        Alert.show({
            'content': commLang.errorContent,
            'showType':'error',
            'doOk': function () {
                _errorFuncCache&&_errorFuncCache.apply(this, args);
            }
        });
    };

    return $.ajax(options);
};

var util = {
    getQueryObj: function (pagePath) {
        if(!pagePath){
            pagePath = location.hash.replace('#', '');
        }
        var query = pagePath.split('?')[1] || '';
        var seg = query.split('&');
        var obj = {};
        for (var i = 0; i < seg.length; i++) {
            var s = seg[i].split('=');
            obj[s[0]] = router._unescape(s[1]);
        }
        return obj;
    },
    getQueryStr: function(obj){
        var ps = [];
        obj = obj || {};
        for(var k in obj){
            var v = obj[k];
            if(v===null || v==='' || v===undefined){
                continue;
            }else if(v instanceof Array){
                ps.push(k+'='+router._escape(v.join(',')));
            }else{
                ps.push(k+'='+router._escape(v));
            }
        }
        return ps.join('&');
    }
};

fetch.goTo = function(p, params, isForce){
    var query = util.getQueryStr(params);
    if(query.length>0) p = p + (p.indexOf('?')>-1?'&':'?') + query;
    location.href = p;
    router.go({
        path: p.replace('#', ''),
        isForce: !!isForce
    });
};


fetch.formatPagination = function(){
    var args = arguments, info = {};
    for(var i=0, len=args.length;i<len;i++){
        Object.assign(info, args[i]);
    }
    info.pageSize = info.pageSize || 10;
    info.pageNum = info.pageNum || 1;
    return info;
};

fetch.formatOrder = function(orderObj, value){
    var values = value.split(','), k = values[0], v = values[1];
    orderObj[k] = Number(v);
};

/**
 * 
 * @param   {Object|Array}  obj    [组成表单数据的元素，当为Object的时候key就是提交的name，value就是提交值；当为Array的时候每个元素必须是原生DOM对象，且必须有name]
 * @return  {FormData} 返回FormData对象
 * 注：当提交的包含文件对象，
 * 1.文件对象的文件获取方式为fileInputElement.files[0]，fileInputElement为原生file对象
 * 2.ajax请求必须设置contentType: false, processData: false,
 * 比如：
 * fetch({
        url: 'interface/admin/test',
        type: 'post',
        data: fetch.getFormData({'testfile': document.querySelector('#file').files[0]}),
        contentType: false,
        processData: false,
        success: function(rs){
        console.log(rs);
        }
    });
    这时候在服务端获取文件方式为：
    const files = ctx.request.files;
    /*
    [ { fieldname: 'testfile',
    originalname: '日志.txt',
    encoding: '7bit',
    mimetype: 'text/plain',
    destination: 'D:\\work\\develop\\workspace\\web\\appnest\\server\\static\\uploads\\',
    filename: 'ad01ffbc608c55eb69e17f5ff8cc05b8',
    path: 'D:\\work\\develop\\workspace\\web\\appnest\\server\\static\\uploads\\ad01ffbc608c55eb69e17f5ff8cc05b8',
    size: 107 } ]
 */
fetch.getFormData = function(obj){
    var formData = new FormData();
    if(obj instanceof Array){
        for(var i=0, len=obj.length;i<len;i++){
            var v = obj[i], k = v.getAttribute('name');
            formData.append(k, v.files&&v.files.length>0?v.files[0]:v.value);
        }
    }else{
        for(var k in obj){
            formData.append(k, obj[k]);
        }
    }
    
    return formData;
};

fetch.getBlob = function(content, type){
    var blob = new Blob([content], { type: type || "text/plain"});
    return blob;
};

fetch.getQueryObj = function(){
    var params = util.getQueryObj();
    delete params.random;
    return params;
};

fetch.reload = function(){
    var params = router.getQueryObj();
    // params.random = Math.random();
    var p = location.hash.split('?')[0];
    fetch.goTo(p, params, true);
};

fetch.redirect = function(url, params){
    if(url.indexOf('http')!==0){
        url = Global.serverBaseUrl + url;
    }
    params = params || {};
    var ps = [];
    for(var k in params){
        ps.push(k+'='+escape(params[k]));
    }
    if(ps.length>0) url += '?' + ps.join('&');
    location.href = url;
};

fetch.extends = function(targetObj, newObj){
    for(var k in targetObj){
        if(newObj[k]!==null&&newObj[k]!==undefined){
            targetObj[k] = newObj[k];
        }
    }
};

fetch.config = function(c){
    config = c;
};

module.exports = fetch;