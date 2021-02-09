import webpack from 'webpack'
import prodConfig from './webpack.prod'

async function pack(config: webpack.Configuration) {
    return new Promise((res, rej) => {
        webpack(config, (err, status) => {
            if (err) {
                return rej(err.stack || err)
            }

            if (!status) {
                return
            }

            if (status.hasErrors()) {
                let errMsg = ''

                status.toString({
                    chunks: false,
                    colors: true,
                })
                    .split(/\r?\n/)
                    .forEach(line => {
                        errMsg += `    ${line}\n`
                    })
                rej(errMsg)
            } else {
                res(status.toString({
                    chunks: false,
                    colors: true,
                }))
            }
        })
    })
}

pack(prodConfig as any).then(result => {
    console.log(result)
})
