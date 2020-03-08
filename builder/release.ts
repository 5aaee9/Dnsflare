import webpack from 'webpack'
import path from 'path'
import fse from 'fs-extra'
import config from './webpack.prod'

async function build() {
    await fse.emptyDir(path.resolve(__dirname, '../build'))
    webpack(config, (err, status) => {
        if (err) throw err

        process.stdout.write(`${status.toString({
            colors: true,
            modules: false,
            children: true,
            chunks: false,
            chunkModules: false,
        })}\n\n`)

        if (status.hasErrors()) {
            // eslint-disable-next-line no-console
            console.error('Build failed with errors.\n')
            process.exit(1)
        }
    })
}

build()
