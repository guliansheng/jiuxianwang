let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
let lessExtract = new ExtractTextWebpackPlugin({filename:'./css/[name].css'});
let cssExtract = new ExtractTextWebpackPlugin({filename:'./css/[name].css'});
let webpack = require('webpack');//启用服务器时的实时更新
module.exports = {
    entry:{
        main:'./src/js/main.js',
        page:'./src/js/page.js'
    },
    output:{
        filename:'./js/[name].[hash:8].js', //设置hash值,清除缓存,可以设置hash位数
        path:path.resolve("./dist")//这个路径必须是绝对路径,打包到dist文件夹下
    },//出口
    devServer:{ //开发服务器
        contentBase:'./dist', //本地服务地址
        open:true, //启动后自动打开浏览器
        inline:true
    },
    mode:'development',
    plugins:[
        new HtmlWebpackPlugin({//打包html文件
            template:'./src/index.html',//打包的html文件路径
            title:'zhufeng',//可使用的title属性
            filename:'index.html',
            chunks:['main'],
            minify:{
                removeAttributeQuotes:true, //删除属性中的双引号
                collapseWhitespace:true //变成一行
            },
            hash:true //在html中的js文件名称后面加一串hash值,清除缓存
        }),
        new HtmlWebpackPlugin({//打包html文件
            template:'./src/page.html',//打包的html文件路径
            title:'zhufeng',//可使用的title属性
            filename:'page.html',
            chunks:['page'],
            minify:{
                removeAttributeQuotes:true, //删除属性中的双引号
                collapseWhitespace:true //变成一行
            },
            hash:true //在html中的js文件名称后面加一串hash值,清除缓存
        }),
        new CleanWebpackPlugin(['./dist']),//先将dist文件夹删掉,再创建一个新的,清除缓存
        new webpack.HotModuleReplacementPlugin(),
        cssExtract,
        lessExtract,
    ],
    module:{
        rules:[
            {test:/\.css$/,use:cssExtract.extract({
                    use:[//这种写法可以方便传入参数
                        {loader:'css-loader'},
                    ]
                })
            },
            {test:/\.less$/,use:lessExtract.extract({
                    use:[
                        {loader:'css-loader'},
                        {loader:'less-loader'}
                    ]
                })
            },
            {test:/\.(jpg|png|jpeg|gif)$/,use: [//图片格式
                {loader: 'url-loader',
                    options: {
                        limit: '4096',  //限制图片文件的大小,1024是1Kb
                        name:'[name].[ext]',
                        outputPath:'img/',
                        publicPath:'../img/'
                    }
                }
            ]},
            {test:/\.html$/,use:'html-withimg-loader'}
        ]
    }

}