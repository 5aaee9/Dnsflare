const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

export function handleOptionRequest(request) {
    if (
        request.headers.get('Origin') !== null &&
        request.headers.get('Access-Control-Request-Method') !== null &&
        request.headers.get('Access-Control-Request-Headers') !== null
    ) {
        return new Response(null, {
            headers: corsHeaders,
        })
    } else {
        // Handle standard OPTIONS request.
        // If you want to allow other HTTP Methods, you can do that here.
        return new Response(null, {
            headers: {
                Allow: 'GET, HEAD, POST, PATCH, DELETE, OPTIONS',
            },
        })
    }
}

export async function handleProxyRequest(request) {
    const url = new URL(request.url)

    url.hostname = 'api.cloudflare.com'
    url.pathname = `/client/v4${url.pathname.substr(4)}`

    const text = await request.text()

    const fetchParams = {
        method: request.method,
        headers: request.headers,
    }

    if (text) {
        fetchParams.body = text
    }


    const response = await fetch(url, fetchParams)

    return new Response(await response.text(), {
        status: response.status,
        headers: response.headers,
    })
}
