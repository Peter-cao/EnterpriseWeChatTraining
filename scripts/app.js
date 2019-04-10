const path = require('path'), 
    fs = require('fs');

const { spawn } = require('child_process');

let project = '';

try{
    project = JSON.parse(process.env.npm_config_argv).original.slice(2).join(' ');
}catch(e){
    console.log(e);
}

process.env.project = project;

function run(){
    spawn('node', ['--max_old_space_size=4096', 'node_modules/webpack-dev-server/bin/webpack-dev-server.js', '--progress', '--colors', '--config', 'build/webpack.config.app.js'], {
        cwd: path.join(__dirname, '../'),
        // env: {
        //     project: project
        // },
        stdio: 'inherit'
    });  
}

run();


