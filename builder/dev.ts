import webpack from 'webpack'
import express from 'express'
import { createProxyMiddleware as proxy } from 'http-proxy-middleware'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

import devConfig from './webpack.dev'

const compiler = webpack(devConfig)
const app = express()

const devMiddleware = webpackDevMiddleware(compiler, {
    publicPath: devConfig?.output?.publicPath,
})

app.use(webpackHotMiddleware(compiler))
app.use(devMiddleware)

app.use('/api', proxy({
    target: 'https://api.cloudflare.com',
    changeOrigin: true,
    pathRewrite: {
        '^/api': '/client/v4',
    },
}))

app.get('*', (req, res) => {
    let fileBuffer: Buffer | null = null
    // console.log(devMiddleware)
    const fs = devMiddleware.context.outputFileSystem

    try {
        // Try read file from filesystem
        fileBuffer = fs.readFileSync(`${devConfig?.output?.path}/..${req.path}`)

        if (req.path.endsWith('.js')) {
            res.type('application/javascript')
        }
    } catch (err) {
        // if not exsit
        fileBuffer = fs.readFileSync(`${devConfig?.output?.path}/../index.html`)
    }

    res.send(fileBuffer!!.toString())
})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`App started at 127.0.0.1:${PORT}`)
})
