
const path = require('path');
const glob = require('glob');
const fs = require('fs');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const CopyWebpackPlugin = require('copy-webpack-plugin');

let externals = _externals();

const entryRoot = path.join(__dirname, '../server');

let project = process.env.project;

if( !project || !fs.existsSync(path.join(entryRoot, project))){
	project = '';
}

console.log('\n\n\n\n','当前应用：'+(project||'全部')+'\n\n\n\n');

let servers = project ? [project]:glob.sync('*', {cwd: entryRoot, ignore: 'common'});


const configs = [];

servers.forEach((server)=>{

    const curFolder = path.join(__dirname, '../server/', server);
    const targetFolder = path.join(__dirname, '../dist/', server)

    configs.push({
        entry: {
            app: path.join(curFolder, 'app.js')
        },
        target: 'node',
        output: {
            path: targetFolder,
            filename: 'app.js'
        },
        resolve: {
            extensions: ['.js']
        },
        externals: externals,
        node: {
            console: true,
            global: true,
            process: true,
            Buffer: true,
            __filename: false,
            __dirname: false,
            setImmediate: true
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    // loader: 'babel-loader',
                    // query: {
                    //     presets: ['es2015', 'react', 'stage-3']
                    // },
                    exclude: /node_modules/
                },
                // {
                //     test: /\.json$/,
                //     loader: 'json-loader'
                // },
                {
                    test: /\.router$/,
                    loader: path.join(__dirname, '../environment/loader/router-loader.js')
                }
            ]
        },
        plugins: [
    
            new UglifyJsPlugin({
                uglifyOptions: {
                  ecma: 8
                }
            }),
    
            new CopyWebpackPlugin((function(){
                const folders = ['configs', 'views'], arr = [];
                folders.forEach((folder)=>{
                    const from = path.join(curFolder, folder),
                        to = path.join(targetFolder, folder);
                    if(fs.existsSync(from)){
                        arr.push({
                            from: from,
                            to: to,
                            toType: 'dir',
                            force: true
                        });
                    }
                });
                return arr;
            })())
        ]
    });
});



function _externals() {
    let manifest = require('../package.json');
    let dependencies = Object.assign({}, manifest.dependencies||{}, manifest.devDependencies||{});
    let externals = {};
    for (let p in dependencies) {
        externals[p] = 'commonjs ' + p;
    }
    externals['./config.prod'] = 'commonjs2 ./configs/config.prod'; // config.prod文件不打包，所以需要在打包的时候拷贝到编译目录
    return externals;
}

module.exports = configs;