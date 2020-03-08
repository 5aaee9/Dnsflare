import baseConfig from './webpack.base'
import merge from 'webpack-merge'
import webpack from 'webpack'


export default merge(baseConfig, {
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
        hot: true,
    },
})
