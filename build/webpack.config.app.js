const webpack = require('webpack'),
	path = require('path'),
	glob = require('glob'),
	fs = require('fs-extra');
	

const ExtractTextPlugin = require('extract-text-webpack-plugin');


// 国际化语言序列
const languages = ['cn'];
// 皮肤序列
const themes = ['default'];

const configs = [];

// 入口根目录
const entryRoot = path.join(__dirname, '../app');

let project = process.env.project;

// if( !project || !fs.existsSync(path.join(entryRoot, project))){
// 	project = '';
// }

console.log('\n\n\n\n','当前应用：'+(project||'全部')+'\n\n\n\n');

// 将app目录下的文件夹分开编译，除了common目录
const apps =  project?project.split(' '):glob.sync('*', {cwd: entryRoot, ignore: 'common'});

// 定义输出目录
let outputRoot = path.join(__dirname, '../public');

let buildPath = 'build';

// 生产环境下输出目录改为dist文件夹，并通过版本进行区分
if (process.env.NODE_ENV === 'production') {
	const versionPath = path.join(__dirname, '../dist');
	const publicSrcPath = path.join(__dirname, '../public');
	
	glob.sync('*', {cwd: publicSrcPath}).forEach((folder)=>{
		if(apps.indexOf(folder)>-1) fs.copySync(path.join(publicSrcPath, folder), path.join(versionPath, folder+'/static'));
	});
	
	outputRoot = versionPath;

	buildPath = 'static/'+buildPath;
}

// 为每个app生成独立的配置文件
apps.forEach(function(appName){
	// 定义app独立的入口配置
	const entry = {}, appEntryRoot = path.join(entryRoot, appName);

	// 将每个app下的js文件作为入口文件
	glob.sync('*.js', { cwd: appEntryRoot }).forEach(function (name) {
		entry[name.replace('.js', '')] = [path.join(appEntryRoot, name)];
	});

	let publicPath = process.env.NODE_ENV === 'production'?'../../':'/'+appName+'/'+buildPath+'/'; // 资源相对路径

	// 重要！！！以下配置中，每一个入口文件将生成languages.length*themes.length个文件，实际引入js文件的时候要注意区分语言和皮肤目录
	// 可参考public/demo下的html文件中js和css的引入

	// 生成不同语言包的配置
	languages.forEach(function (language) {
		// 生成不同皮肤的配置
		themes.forEach(function (theme) {
			const plugins = [
				new ExtractTextPlugin('css/' + theme + '/[name].css'), // 重要！！！定义输出的css规则，css只与皮肤有关，与语言无关
				new webpack.DefinePlugin({
					'process.env': {
						NODE_ENV: 'production'
					}
				})
			];

			if (process.env.NODE_ENV === 'production') {
				// 生产环境对代码进行混淆和压缩
				plugins.push(
					new webpack.optimize.UglifyJsPlugin({
						compress: {
							warnings: false
						}
					}),
					new webpack.LoaderOptionsPlugin({
						minimize: true
					})
				);

			} else {
				// 开发环境使用热加载和源映像工具（代码分块）
				plugins.push(new webpack.HotModuleReplacementPlugin());
				plugins.push(new webpack.SourceMapDevToolPlugin());

			}

			configs.push({
				name: language, // 名称
				entry: Object.assign({}, entry), // 入口
				output: { // 输出
					path: path.join(outputRoot, appName, buildPath),
					filename: 'js/' + language + '/' + theme + '/[name].js', // 重要！！！以语言和皮肤为目录生成文件，根据需要引入对应的js文件
					publicPath: publicPath,
				},
				devServer: { // 开发环境web服务配置
					host: '0.0.0.0',
					contentBase: './public', //本地服务器所加载的页面所在的目录
					historyApiFallback: true, //不跳转
					inline: true,
					hot: true,
					port: 3100 // 启动端口
				},
				module: {
					rules: [
						{
							test: /\.aui$/,
							use: [
								{
									loader: 'babel-loader',
									options: {
										"presets": ["es2015", "react", "stage-3"],
										"plugins": [["transform-es2015-arrow-functions"], "transform-object-assign", "transform-async-to-generator"]
									}
								},
								{
									loader: 'aui-loader',
									options: {
										// cssloader: 'style-loader!css-loader!postcss-loader'
										cssloader: ExtractTextPlugin.extract({use: [ 'css-loader', 'postcss-loader'], fallback: 'style-loader'})
									}

								}
							]
						},
						{
							test: /\.js$/,
							use: {
								loader: 'babel-loader',
								options: {
									"presets": ["es2015", "react", "stage-3"],
									"plugins": [["transform-es2015-arrow-functions"], "transform-object-assign", "transform-async-to-generator"]
								}
							}
						},
						{
							test: /\.less$/,
							//loader: 'style-loader!css-loader!less-loader'
							use: ExtractTextPlugin.extract({ use: ['css-loader', 'postcss-loader', 'less-loader'], fallback: 'style-loader' }),
						},
						{
							test: /\.css$/,
							//loader: 'style-loader!css-loader!postcss-loader'
							use: ExtractTextPlugin.extract({ use: ['css-loader', 'postcss-loader'], fallback: 'style-loader' })
						},
						{
							test: /\.(png|jpg|gif)$/,
							use: [{
								loader: 'url-loader',
								options: {
									limit: 8192,
									name: 'images/[name].[ext]' // 图片资源另存为目录，不区分语言和皮肤
								}
							}]
						},
						{
							// 专供iconfont方案使用的，后面会带一串时间戳，需要特别匹配到
							test: /\.(woff|woff2|svg|eot|ttf)\??.*$/,
							use: [{
								loader: 'url-loader',
								options: {
									limit: 8192,
									name: 'fonts/[name].[ext]' // 字体资源另存为目录，不区分语言和皮肤
								}
							}]
						}
					]
				},
				plugins: plugins,
				resolve: {
					alias: {
						'@lang': path.join(entryRoot, appName, 'resources/' + language), // 语言配置文件目录，指向每个应用的resources下的语言目录，比如demo/resources/cn
						'@theme': path.join(entryRoot, appName, 'assets/less/theme/' + theme), // 皮肤配置文件目录，指向每个应用自己的皮肤目录，比如demo/assets/less/theme/default
						'@less': path.join(entryRoot, appName, 'assets/less'), // 每个应用自己的less文件目录
						'@comp': path.join(entryRoot, appName, 'components'), // 每个应用自己的组件目录
						'@libs': path.join(entryRoot, appName, 'assets/libs'), // 每个应用自己的工具类目录
						'@comm': path.join(entryRoot, 'common'), // 所有app公共资源，只有共性的才能放在这里面
						'@auicomp': 'aui-h5/src/components', // aui-h5的组件目录，用法请看demo
						'@auifont': 'aui-h5/src/assets/auicon', // aui-h5的字体目录，建议拷贝出来使用，或使用自己的字体
            			'@auiutil': 'aui-h5/src/utils' // aui-h5的工具类目录
					}
				}
			});
		});

	});

});


module.exports = configs;