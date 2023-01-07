export async function onRequest(context) {
    const { request } = context
    const url = new URL(request.url)

    if (!url.pathname.startsWith('/api/')) {
        return context.next()
    }

    url.hostname = 'api.cloudflare.com'
    url.pathname = `/client/v4${url.pathname.replace(/^\/api/, '')}`
    url.port = 443
    url.protocol = 'https'

    const modifiedRequest = new Request(url, request)
    const response = await fetch(modifiedRequest)

    return response
}
