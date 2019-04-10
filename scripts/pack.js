const path = require('path'), 
    fs = require('fs');

const { spawn } = require('child_process');

let project = '', type = 'app';

try{
    const original = JSON.parse(process.env.npm_config_argv).original;
    const cmd = original.shift();
    type = original.shift().split(':').pop();
    project = original.shift();
}catch(e){
    console.log(e);
}

process.env.project = project;
process.env.NODE_ENV = 'production';

function run(){
    spawn('node', ['--max_old_space_size=4096', 'node_modules/webpack/bin/webpack.js', '--progress', '--colors', '--config', 'build/webpack.config.'+type+'.js'], {
        cwd: path.join(__dirname, '../'),
        // env: {
        //     project: project,
        //     NODE_ENV: 'production'
        // },
        stdio: 'inherit'
    });  
}

run();


