import baseConfig from './webpack.base'
import merge from 'webpack-merge'
import webpack, { Configuration } from 'webpack'
import TerserPlugin from 'terser-webpack-plugin'

export default merge(baseConfig as Configuration, {
    mode: 'production',
    devtool: false,
    optimization: {
        minimize: true,
        minimizer:[
            new TerserPlugin(),
        ],
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: true,
        }),
    ],
})

