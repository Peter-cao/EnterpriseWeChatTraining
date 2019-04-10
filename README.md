# 框架背景

框架综合使用了Agile系列框架和chestnut系列框架，实现全栈前后端代码同构开发。

前端支持webpack和requirejs构建项目。后端也可在生产环境中使用webpack打包压缩和代码混淆。

## Agile系列框架

[agile-ce框架](https://github.com/nandy007/agile-ce)：提供基于jQuery的MVVM框架，用于界面与数据分离

[agile-ui框架](https://github.com/nandy007/agile-ui)：提供标准JS DOM的原生扩展，实现UI组件化开发。

[aui-loader框架](https://github.com/nandy007/aui-loader)：提供*.aui文件的编译，生成符合agile-ui框架定义的组件类，可以在webpack和requirejs中使用。

[aui-h5框架](https://github.com/nandy007/aui-h5)：基于agile-ui框架封装的h5组件，能够快速方便的构建web应用。


## chestnut系列框架

chestnut框架是基于Nodejs的KOA2框架进行封装的web服务快速开发框架。

[chestnut-utils框架](https://github.com/nandy007/chestnut-utils)：提供数据库（mysql，postgresql、oracle、sqlserver）基本操作封装、网络请求类封装（页面抓取）、页面内容拣选（基于cheerio的服务端类jQuery框架）封装、常用编解码封装等。

[chestnut-router框架](https://github.com/nandy007/chestnut-router)：提供基于KOA2路由的封装，简化调用。

[chestnut-app框架](https://github.com/nandy007/chestnut-app)：综合其他chestnut框架，提供快速搭建web服务框架。


Tips：

1. oracledb可通过源码方式编译安装https://oracle.github.io/node-oracledb/INSTALL.html#github

第一步：克隆源码工程

```bash
cd your-dir-path
git clone https://github.com/oracle/node-oracledb.git

```


第二步：添加submodule模块

```bash

cd node-oracledb
git submodule init
git submodule update

```

第三步：源码编译到指定项目

```bash

cd your-project-dir
npm install your-dir-path/node-oracledb

```

# 框架结构

整个框架采用webpack进行构建，同时也包含requirejs中的使用示例。

## 目录说明

### build目录

webpack配置文件目录。包含app和server两个文件分别构建前端代码和后端代码。

请注意看内部说明和注释。


### app目录

前端源码目录，其子目录按照子项目排列，每个子项目需要创建一个自己的目录。

每一个项目目录结构包含：

**assets**：资源目录，一般存放公共的图片、css、less（统一变量定义和皮肤定义）资源等。皮肤使用请参考*pages/Frame.aui*文件

**components**：项目用到的aui组件，一般是粒度较细的组件。需要符合agile-ui框架规则，具体参考*pages/Frame.aui*文件内说明

**pages**：项目的页面级的aui组件，一般是路由跳转页对应的文件，粒度较粗，需要符合agile-ui框架规则，具体看*pages/Frame.aui*文件内说明

**resources**：国际化资源目录，其子目录为各个语言目录，语言目录下放置语言配置文件

**routers**：路由配置文件，路由配置需要符合aui-h5框架的路由规则。具体参考*routers/index.js*内的文件说明

**main.js**：入口文件之一，请注意看内部说明和注释。

**aui.js**：入口文件之一，用于requirejs构建*.aui加载器，请注意看内部说明和注释。


注：每个app项目根目录下的子文件（js后缀）的都是入口文件。打包规则可以看webpack.config.app.js文件


### server目录

后端代码目录，整个结构需要符合chestapp-app框架要求（取决于config文件配置），其子目录按照子项目排列，每个子项目需要创建一个自己的目录。

后端服务符合MVC架构。

每一个项目目录结构包含：

**models**：M层代码，处理数据逻辑。

**controllers**：C层代码，业务控制层逻辑。

**routers**：访问路由配置

**views**：V层代码，页面展现逻辑，由于现在一般以富客户端形式开发，页面展现在app中编写，一般views用不到，或者少用

**static**：静态文件目录，存放一些静态资源

**filters**：过滤器配置，与routers/*.js配合使用。可在路由中使用过滤器，也可以配置默认过滤器，具体看*router.filter.js*文件


**configs**：配置文件，其中config.js为配置入口，config.default.js为开发环境配置，config.prod.js为生产环境配置。codes目录为错误码配置文件，内含国际化语言配置。

注意看config.*.js文件说明。

配置文件中的rootPath配置后，可以不用配置routerPath、viewPath、staticPath，默认配置指向${rootPath}/routers、${rootPath}/views、${rootPath}/static目录，也可以自行配置。

**utils**：工具类，比如数据库分页的封装等。

**app.js**：服务端入口文件，名称不可改动，调用chestnut-app框架初始化web服务。


### public目录

开发时的静态资源目录，最终打包后到dist下每个项目目录的static目录下。

public目录跟app和server目录一样，下面的子目录也是每个项目的静态资源。一般为公共的js、css和图片等。

app开发时的编译文件也指向public目录，具体可以看*webpack.config.app.js*配置


### logs目录

服务端日志目录，按照项目名和日期生成文件，注意备份和清理。


### uploads目录

文件上传临时目录，注意清理。

### dist目录

app和server最终编译后的目录，也是按照项目目录排放


### environment目录

build需要依赖的环境目录，一般不需要关心


### scripts目录

运行需要的脚本目录，一般不需要关心


# 如何使用

## 安装

执行下面命令拷贝工程到本地：

```bash
git clone https://github.com/nandy007/project_h5.git
```

进入到project_h5目录，执行下面命令安装：

```bash
npm install
```

## 开发

### 启动前端服务

```bash
npm run app ${projectName}
```

请将${projectName}替换为具体的项目目录名称，比如：

```bash
npm run app demo
```

如果要启动指定多个项目，可用空格隔开，比如：

```bash
npm run app demo test
```

即启动demo项目，如果不指定，则所有app项目均启动。当项目超过3个时不建议同时启动。

前端启动统一端口为3100，可自行在webpack.config.app.js中修改。

启动后前端资源访问地址相对路径为：http://127.0.0.1:3100/${projectName}/

比如：前端项目demo的访问地址为：http://127.0.0.1:3100/demo/index.html

资源访问路径取决于webpack.config.app中的配置，请详细看配置，了解构建后的目录结构


### 启动后端服务

```bash
npm run server ${projectName} ${port}
```

请将${projectName}替换为具体的项目目录名称，必须指定项目！！！

${port}为调试端口，可以不加，默认为5858，如果启动多个server，必须指定调试端口，否则会冲突！！！

后端服务的启动端口在各个项目的config.*.js文件中定义。

启动后，后端接口访问相对路径为：http://127.0.0.1:${port}/${projectPath}，

比如demo项目的login接口访问地址：http://127.0.0.1:7001/demo/access/login


## 打包

### 打包前端

```bash
npm run pack:app ${projectName}
```

请将${projectName}替换为具体的项目目录名称。若不指定，则打包所有app项目。

### 打包后端

```bash
npm run pack:server ${projectName}
```

请将${projectName}替换为具体的项目目录名称。若不指定，则打包所有server项目。


### 打包全部

```bash
npm run pack
```

同时打包app、server下的所有项目。


## 生产环境启动

只有打包后才存在生产环境的启动。

启动脚本：

```bash
npm run start ${projectName}
```
请将${projectName}替换为具体的项目目录名称，必须指定项目！！！

打包后启动的生产环境前后端代码在同一项目下，一个项目启动一个端口，端口在config.prod.js中配置


# 在require.js中使用

require.js中使用agile框架主要是指将编写的*.aui文件可用于require.js中，以及一些前端路由机制在require.js中的使用。

aui-loader框架既是webpack中aui的加载器，也是require.js中的加载器。

所以，再require.js中配置aui的加载器为aui-loader/dist/aui.js即可。

但是单独的加载器中是不包含aui-h5组件的，为了能够在加载器中默认加载aui-h5组件，我们在demo示例中增加app/demo/aui.js文件将aui-loader和aui-h5的部分组件打包成一个文件

在public/demo/amd.html中调用，在public/demo/assets/js/main.js进行配置使用此文件


# 开发技巧

## aui组件相关


### 组件定义

1. 组件定义必须包含是一个具有结构化的函数/类

2. 可以使用es6（使用export default导出class）或者es5（使用module.exports = Function.prototype）来定义

3. 类中必须定义静态的属性tag为标签名，实际调用的标签即为aui-tag

4. ui标签可以不写，可以在created或者其他事件中往this.$el来innerHTML进行实例化

5. 当组件存在ui，且被调用时存在子元素，这时候子元素是无效的，比如frame组件的ui改为：

```html
<ui><div>test</div></ui>
```
        
   当调用

   ```html
   <aui-frame><div>子组件</div></aui-frame>
   ```

   实际看到的是
   
   ```html
   <aui-frame><div>test</div></aui-frame>
   ```
   
   如果需要显示子组件，可以在ui定义中使用
   
   ```html
   <child></child>
   ```
   
   来占位替代，该标签在哪出现则显示在哪，比如frame的ui改为：

```html
<ui><div>test<child></child></div></ui>
```
   这时候调用
   
   ```html
   <aui-frame><div>子组件</div></aui-frame>
   ```

   时，实际看到的就是
   
   ```html
   <aui-frame><div>test<div>子组件</div></div></aui-frame>
   ```


6. style标签默认是标准css语法，当设置type="less"时可以编写less语法；当设置type="sass"时可以编写sass语法，建议使用less，比如：

```html
        <style type="less">
        @width: 100px;

        aui-frame{
            div{
                width: @width;
            }
        }

        </style>
```

        解析结果为

```html
        <style>
        aui-frame div{
            width: 100px;
        }

        </style>
```

### 组件生命周期

组件类的四个生命周期事件：

1. created（组件创建时触发）：比如：

```javascript
const $frame = $('<aui-frame></aui-frame>').appendTo($('body'));
```
    
   这时候aui-frame组件被创建并添加到body元素中，触发created事件


2. detached（组件移除文档时触发）：比如：
```javascript
const fragment = document.createDocumentFragment(); fragment.append($frame[0]); 
```
   这时候刚才的frame组件被从body中抽出，并添加到fragment，从body抽出时即移除文档（document），会触发detached事件

3. adopted（组件从旧文档移到新文档时触发）：比如：
```javascript
const $div = $('div').appendTo($('body')); $div.append($frame); 
```
   这时候将一个div添加到body中，则div处于文档中，然后将frame添加到div中相当于从body中移动到div中，所以会触发adopted事件

4. attributeChanged（组件属性改变时触发）：属性改变需要组件类定义静态属性observedAttributes = [需要监控的属性名]
   比如：假设设置了
   ```javascript
    static get observedAttributes(){
        return ['init'];
    }
   ```

   当设置$frame.attr('init', 'true');则会触发attributeChanged事件，该事件接收三个参数（attrName, oldVal, newVal）

   当设置多个属性监听的时候都会进到此函数，可以根据attrName进行区分


### 组件类实例化对象关键属性

1. 类的实例化对象中this.$el代表的就是当前组件对应的标准dom对象（不是一个jquery的$对象），注意this本身不是一个dom对象

2. 而this.$el又具有component属性，其值即为this，也就是组件实例化对象本身。即：
```javascript
this.$el.component===this //true
```
    

## 路由使用

### 路由特性

1. 路由可以有多级，每一级都对应一个aui-page组件，即每一级路由对应的组件会在aui-page中显示。

2. 路由生命周期：两个组件切换时，显示的组件会触发enter事件（可监听该事件做逻辑），同时赋予active样式，隐藏的组件会触发leave事件（可监听该事件做逻辑），同时移除active样式。

3. 当路由没有设置cache: true缓存时，组件被切换隐藏时会被remove出aui-page，即销毁（进入组件的detached事件）；反之会移除掉active样式，但不会被remove掉，在aui-page中仍然存在。

4. 每一级aui-page下有且仅有一个路由组件显示，当组件显示时将会被赋予active样式，其他组件被移除active样式。


### 路由获取

```javascript

import { router } from '@auicomp/page/Page.aui';

```

### 路由添加

```javascript

import MainPage from '../pages/MainPage.aui';

router.add([
    {
        path: '/',
        redirect: '/main'
    },
    {
        path: '/main', // 路由路径，比如/main?username=nandy007可以匹配此路由，但是/main1就匹配不上，也就是说?之后的可以不用匹配到，如果需要精确匹配可以使用正则
        component: MainPage, // 路由加载的组件
        // cache: true // 设置缓存，当设置为true，从当前路由页面跳转到其他路由，当前的路由页面不销毁，下次切换到当前路由的时候created事件不会触发
        // children: [] // 设置子路由，子路由也是形如{path, component, cache?, children?, redirect?:string|function(query)}
    }
]);

```

### 路由跳转

路由跳转包括有状态（有历史纪录）和无状态（无历史纪录）两种。

#### 使用hash跳转（有状态）

```javascript

location.href = '#/yourhash'; // 有#

```

#### router.go跳转

router.go(options, nostate);

当nostate为true时为无状态，其他值为有状态，默认不填为有状态

options可以是一个字符串，值为路由可匹配的路径（不包含#）

比如：
```javascript

router.go('/main', true); // 无状态跳转到/main路由

```


options可以是一个形如{path: '', isForce: boolean}的对象

其中path跟上面的字符串用法含义一样，isForce为路由对应的组件是否强制重新加载，如果跳转的路由设置了cache: true即缓存路由，或者要跳转的路由就是当前正在显示的路由，设置isForce为true会重新加载组件，否则不会重新加载仅仅切换显示

```javascript

router.go({path: '/main', isForce: true}); // 有状态跳转到/main路由，并强制刷新组件

```

### 路由传参

路由传参是通过?key=value方式传参，?及之后的部分不需要在路由配置中匹配（比如正则匹配，虽然使用正则匹配到也可以跳转到对应路由）

获取参数方式为：

```javascript

router.getQueryObj(url?);

```

因为路由跳转实际是页面hash值的变化，所以此方法默认不穿url的情况下实际是获取当前页面的hash值中?之后的参数，如果传参则为url格式，则解析url?之后的参数

比如：

```javascript

location.href = '#/main?username=nandy007'; // 跳转路由并传参

```

在main组件的created函数里可以获取参数：


```javascript

var hashParams = router.getQueryObj(); // 获取当前hash值中键值对参数
var username = hashParams.username; // 获取路由跳转的参数

var searchParams = router.getQueryObj(location.search); // 获取url地址中的键值对参数，假设url为 http://domain.com/index.html?employeeId=8888#/main
var employeeId = searchParams.employeeId; // 获取到url search部分的参数

```

需要特别说明的是，getQueryObj方法默认会对参数进行解码，但是解码方式不一定适合所有情况，当发现获取参数乱码时，可以通过重写router内部编解码函数进行处理。比如：

```javascript
// 编码方式重写
router._escape = function(v){
    v = v||'';
    try{
        return encodeURIComponent(v);
    }catch(e){
        return v;
    }
}
// 解码方式重写
router._unescape = function(v){
    v = v||'';
    try{
        return decodeURIComponent(v);
    }catch(e){
        return v;
    }
}

```

## 组件互调

aui组件之间可能需要互相调用内部方法进行处理，比如A组件刷新B组件数据等。

假设有一组件定义Main.aui：

```javascript

export default class Main{
    
    static get tag(){
        return 'main';
    }

    created(){
        
    }

    refresh(){
        // do sth.
    }
}


```

在某个时机该组件添加到了页面：

```javascript

$('#app').html('<aui-main id="main"></aui-main');

```

下面介绍两种方式调用Main组件的refresh函数

### 通过原生dom对象component属性调用

组件对应的JS原生dom对象具有component属性，该属性即为类Main的实例化对象（与该dom相对应）。

所以可以通过此属性直接调用对象的方法；

```javascript

var mainDom = document.querySelector('#main'); // 精准获取到main组件的js dom对象

mainDom.component.refresh();

```


### 通过事件机制调用

即Main组件内部监听某个事件，该事件内部执行refresh函数，其他组件或者函数需要调用Main组件的refresh函数只要触发此事件即可。

改造Main.aui：

```javascript

export default class Main{
    
    static get tag(){
        return 'main';
    }

    created(){
        var $el = $(this.$el);// this即Main类的实例化对象，该对象的$el属性即为对应组件的原生js dom对象
        var self = this;
        // 监听一个自定义事件供其他组件按需触发
        $el.on('doRefresh', function(){
            self.refresh(); // 监听doRefresh事件调用refresh函数
        });
    }

    refresh(){
        // do sth.
    }
}


```

其他组件只需要触发doRefresh事件即可

```javascript

$('#main').trigger('doRefresh');

```


## mvvm相关

### 手动销毁mvvm

mvvm通过*$(selector).render(obj);*创建，它返回一个mvvm对象，如果不需要使用的时候请调用该对象的destroy方法手动进行销毁。

比如：

```javascript

var vm = $(selector).render(obj); // 返回一个mvvm对象

vm.destroy();

```

结合aui组件使用，一般在aui组件被移除（detached）的时候调用此方法，但是detached不代表组件已经销毁，可能会重新添加到文档dom中，所以应该根据需要未必是在detached中销毁mvvm。

### v-model指令

v-model指令是表单元素双向数据绑定指令，由于html的表单元素的value都是string类型，而我们从后台返回的数据可能是数字型（number）

这时候就可能导致模型匹配的时候会出错，所以当双向绑定的数据类型是number类型时需要给对应的表单元素添加number属性，比如

```html

<select id="day_interval" v-model="formData.day_interval" number>
    <option v-for="item in day_interval_list" v-bind:value="item" v-text="item"></option>
</select>

```

### v-filter指令

v-filter指令必须跟v-for指令一起使用，用于为循环体做数据预处理的指令，其值必须是一个函数，该函数默认接收两个参数：index（当前循环的索引值）， item（当前循环的数组元素对象），比如：

```html

<ul>
    <li v-for="item in list" v-filter="func.doFilter" v-text="item.title"></li>
</ul>

```

```javascript

var obj = {
    list: [
        {
            title: 'agile ce框架发布'
        }
    ],
    func: {
        doFilter: function(index, item){
            item.title = '第'+index+'条数据'; // 最终注入的文本被替换，而不再是'agile ce框架发布'
        }
    }
}

```

### vmignore属性

当dom元素具有vmignore属性，则该元素及其内部元素不会被mvvm处理（mvvm指明遍历到vmignore就不会继续往下遍历）。所以，一般该属性设置在较外层元素上，这样包含的元素范围更广。

主要用处有：

1. 当对一个内部有众多dom元素，但是仅有几个元素使用mvvm注入时，其他不需要mvvm注入的元素可以设置此属性，可以提高指令遍历的速度，提高运行效率。

2. 当某个aui组件任意父元素和内部各自有mvvm注入时，或者有嵌套元素各自有mvvm注入时，为了避免mvvm指令被父节点读取，可以在子元素中设置该属性。


### v-template指令（等价于useTemplate属性）

v-template指令，用于对子元素使用$.template进行模板预处理，预处理的结果再使用mvvm注入（如果内部含有mvvm指令的话）。

$.template模板注入是不可逆数据注入，不支持数据绑定，仅做注入，所以性能和效率比mvvm高，如果v-for内部数据不需要动态改变，或者仅有少量数据需要动态改变，则可以使用此方法以提高性能。

v-template属性可以不设置值，此时模板内容即为节点内部的innerHTML内容；当设置值的时候，其值为$.template的模板id值，模板id值设置方式如下：

```javascript

$.template.setter(id, templateStr); // id值必须全局唯一

```

完整示例如下：

```html

<ul class="org-user" v-on:click="func.popupCard()">
    <li v-for="user in formData.users" v-template="contact_orguser">

    </li>
</ul>

```


```javascript

$.template.setter('contact_orguser', `
        <div class="headIcon">
            <%if(user.photourl){%>
                <img src="<%=#user.photourl||''%>" alt="" class="head">
            <%}else{%>
                <div style="background: <%=#user.avatar_color||''%>" class="avatar_user"><%=user.avatar_text%></div>
            <%}%>
        </div>
        <span><%=#user.name||''%></span>
    `);  

```

其中template模板注入的数据跟mvvm注入的数据一致。


### 已赋值但ui不变

如果使用不当，会发生已经赋值但是ui显示没有变化的情况，这种情况通常是由于mvvm对象绑定混乱造成。

由于mvvm绑定是严格的对象监测，如果对象性质已经改变则绑定失效。

常见的原因有：

1. 对象（我们一般称为变量）未定义

即：ui中使用mvvm绑定的变量必须事先在注入的对象中定义。

比如：

```html

<span v-text="a.b"></span>

```

那么，在注入的对象中至少要包含{a:{b:...}}

```javascript

var obj = {
    a: {
        b: 'test'
    }
};

// var obj = {a:{}}; // 此为错误写法，因为ui中用到b，但是为定义b

$('span').render(obj);

```

同样的，如果是数组，且初始化没有值，也应该定义为一个空数组 [] 或 new Array()，而不是null或者undefined，比如：

```html

<span v-for="item in list" v-text="item.title"></span>

```

```javascript

var obj = {
    list: []
};

// var obj = {a:{}}; // 此为错误写法，因为ui中用到b，但是未定义b

$('span').render(obj);

obj.list.push({
    title: '1'
});

```

2. 嵌套注入

嵌套注入是指具有父子层级结构的dom都需要进行注入，这时候可以使用vmignore来避免，而不是让绑定交叉混用。

具体用法请看 vmignore属性 用法


3. 重复注入

一个dom对象被多次注入是不允许的。


4. 对象改变

对象一旦定义则不可改变。

比如：

```javascript

var obj = {
    a: {
        b: 1
    },
    list: []
};

// 对象a被重新赋值，性质已改变
obj.a = {
    b: 2
};

// 对象list被重新赋值，性质已改变
obj.list = [{
    title: 1
}];


```

上面的例子中对象a的存储地址实际已经改变，重新被赋值，会导致mvvm失效。同理数组的重新赋值也是不行的。

但是，在最新版agile-ce@0.4.23之后这种行为已经可以支持，源于ace框架内部做了处理，赋值采用深拷贝处理，而不是真实的赋值

5. mvvm已经被销毁

可以调用mvvm对象的destroy()方法销毁，这时候再进行数据改变不会在ui生效。