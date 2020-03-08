import webpack from 'webpack'
const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

import config from './webpack.dev'

const compiler = webpack(config)
const app = express()

const devMiddleware = webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    quiet: true,
})

app.use(webpackHotMiddleware(compiler))
app.use(devMiddleware)

app.use('/api', createProxyMiddleware({
    target: 'https://api.cloudflare.com',
    changeOrigin: true,
    pathRewrite: {
        '^/api': '/client/v4',
    },
}))

app.get('*', (req, res) => {
    let fileBuffer: Buffer | null = null

    try {
        // Try read file from filesystem
        fileBuffer = devMiddleware.fileSystem.readFileSync(`${config.output.path}/..${req.path}`)

        if (req.path.endsWith('.js')) {
            res.type('application/javascript')
        }
    } catch (err) {
        // if not exsit
        fileBuffer = devMiddleware.fileSystem.readFileSync(`${config.output.path}/../index.html`)
    }

    res.send(fileBuffer!.toString())
})

const PORT = process.env.PORT || 8083

app.listen(PORT, 'localhost')
