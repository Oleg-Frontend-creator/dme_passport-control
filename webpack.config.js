const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');

const isProd = true;

function jsFilename(chunkName) {
    const [page, mode] = chunkName.split('.');
    const folder = page === 'index' ? 'index-page' : 'advantages-page';
    return `js/${folder}/${page}.${mode}${isProd ? '.min' : ''}.js`;
}

function cssFilename(chunkName) {
    const parts = chunkName.split('.');
    const page = parts[1];
    const mode = parts[2];
    const folder = page === 'index' ? 'index-page' : 'advantages-page';
    return `css/${folder}/${page}.${mode}${isProd ? '.min' : ''}.css`;
}

module.exports = {
    mode: isProd ? 'production' : 'development',

    entry: {
        'index.critical': path.resolve(__dirname, 'src/scripts/entries/index/index.critical.js'),
        'index.async': path.resolve(__dirname, 'src/scripts/entries/index/index.async.js'),
        'advantages.critical': path.resolve(__dirname, 'src/scripts/entries/advantages/advantages.critical.js'),
        'advantages.async': path.resolve(__dirname, 'src/scripts/entries/advantages/advantages.async.js'),

        'css.index.critical': path.resolve(__dirname, 'src/css/entries/index/index.critical.css'),
        'css.index.async': path.resolve(__dirname, 'src/css/entries/index/index.async.css'),
        'css.advantages.critical': path.resolve(__dirname, 'src/css/entries/advantages/advantages.critical.css'),
        'css.advantages.async': path.resolve(__dirname, 'src/css/entries/advantages/advantages.async.css'),
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        filename: (pathData) => {
            const name = pathData.chunk.name;

            if (name.startsWith('css.')) return `js/_css/${name}.js`;

            return jsFilename(name);
        },
        assetModuleFilename: 'assets/[name][ext]',
    },

    devtool: isProd ? false : 'source-map',

    devServer: {
        static: {directory: path.resolve(__dirname, 'dist')},
        port: 5173,
        open: true,
        hot: true,
    },

    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    {loader: 'css-loader', options: {sourceMap: !isProd}},
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: !isProd,
                            postcssOptions: {plugins: [['autoprefixer']]},
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|webp|gif|svg|woff2?|ttf|eot)$/i,
                type: 'asset/resource',
                generator: {filename: 'assets/fonts/[name][ext]'},
            }
        ],
    },

    plugins: [
        new RemoveEmptyScriptsPlugin(),

        new MiniCssExtractPlugin({
            filename: (pathData) => cssFilename(pathData.chunk.name),
        }),

        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/pages/index.html'),
            filename: 'index.html',
            inject: false,
            chunks: ['css.index.critical', 'css.index.async', 'index.critical', 'index.async'],
            scriptLoading: 'defer',
            minify: isProd
                ? {collapseWhitespace: true, removeComments: true, minifyCSS: false, minifyJS: false}
                : false,
        }),

        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/pages/advantages.html'),
            filename: 'advantages.html',
            inject: false,
            chunks: ['css.advantages.critical', 'css.advantages.async', 'advantages.critical', 'advantages.async'],
            scriptLoading: 'defer',
            minify: isProd
                ? {collapseWhitespace: true, removeComments: true, minifyCSS: false, minifyJS: false}
                : false,
        }),

        new CopyWebpackPlugin({
            patterns: [
                {from: path.resolve(__dirname, 'src/assets'), to: 'assets'},
                {from: path.resolve(__dirname, 'src/php'), to: 'php'},
            ],
        }),
    ],

    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                extractComments: false,
                terserOptions: {format: {comments: false}},
            }),
            new CssMinimizerPlugin(),
        ],

        splitChunks: false,
        runtimeChunk: false,
    },
};