import baseConfig from './webpack.base'
import merge from 'webpack-merge'
import webpack, { Configuration } from 'webpack'


export default merge(baseConfig as Configuration, {
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
        hot: true,
    },
} as Configuration)
