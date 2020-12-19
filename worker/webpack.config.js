module.exports = {
    target: 'webworker',
    entry: './src/index.js',
    output: {
        path: __dirname,
        filename: 'index.js',
    },
    resolve: {
        extensions: ['.js', '.json'],
        fallback: {
            path: false,
        },
    },
}
