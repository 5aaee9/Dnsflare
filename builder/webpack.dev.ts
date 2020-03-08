import baseConfig from './webpack.base'
import merge from 'webpack-merge'
import webpack from 'webpack'
import TerserPlugin from 'terser-webpack-plugin'

export default merge(baseConfig, {
    mode: 'production',
    devtool: false,
    optimization: {
        minimizer:[
            new TerserPlugin({
                sourceMap: false,
            }),
        ],
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: true,
        }),
    ],
})

