const path = require('path'), 
    fs = require('fs');
const nodemon = require('nodemon');


let project = 'demo', port = 5858;
try{
    const original = JSON.parse(process.env.npm_config_argv).original;
    project = original.pop();
    if(project!==undefined && typeof (new Function(`try{return ${project};}catch(e){return '';}`))()==='number'){
        port = project;
        project = original.pop();
    }
    if(!fs.existsSync(path.join(__dirname, '../server', project))){
        throw new Error('找不到项目：'+project);
    }
    run();
}catch(e){
    console.log(e);
}

function run(){
    console.log(`当前运行服务：${project} 调试端口：${port}`);
    nodemon({
        exec: `node --inspect=0.0.0.0:${port} ./server/${project}/app.js`,
        // script: './server/'+project+'/app.js',
        // args: ['--inspect=0.0.0.0:5858'],
        watch: './server/'+project,
        stdout: true
    });
}


