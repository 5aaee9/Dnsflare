import files from '../files'
import mime from 'mime-types'

export async function handleAssertEvent(request) {
    const url = new URL(request.url)
    let fileName = url.pathname

    if (!files[fileName]) {
        fileName = '/index.html'
    }

    return new Response(Buffer.from(files[fileName], 'base64').toString(), {
        status: 200,
        headers: {
            'Content-Type': mime.lookup(fileName),
        },
    })
}
