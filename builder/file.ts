const fs = require('fs')

const result = {}

function scan(dir: string, base: string) {
    const data = fs.readdirSync(dir)

    for (const file of data) {
        const stat = fs.statSync(`${dir}/${file}`)

        if (stat.isFile()) {
            result[`${base}/${file}`] = fs.readFileSync(`${dir}/${file}`).toString('base64')
        } else {
            scan(`${dir}/${file}`, `${base}/${file}`)
        }
    }
}

scan(`${__dirname}/build`, '')

fs.writeFileSync('worker/src/files.json', JSON.stringify(result, null, 4))
