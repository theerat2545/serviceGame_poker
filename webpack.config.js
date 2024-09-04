const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        app: './src/index.js',
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|jpeg|gif|svg|json)$/,
                exclude: /node_modules/,
                type: 'asset/resource', // ใช้ asset/resource สำหรับรูปภาพ
            },
            {
                test: /\.json$/,
                type: 'json', // ใช้ type: 'json' สำหรับไฟล์ JSON
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
    devServer: {
        static: path.join(__dirname, 'dist'),
        compress: true,
        port: 8081,
        hot: true,
        open: true, 
    }    
};
