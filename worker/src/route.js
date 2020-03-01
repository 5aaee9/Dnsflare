import { handleOptionRequest, handleProxyRequest } from './routes/api'
import { handleAssertEvent } from './routes/assert'
import config from './config'

export function handleRequest(event) {
    const {request} = event

    const url = new URL(request.url)

    // If cloudflare api proxy
    if (url.pathname.startsWith(config.PROXY_ENDPOINT)) {
        if (request.method === 'OPTIONS') {
            event.respondWith(handleOptionRequest(event.request))
        } else {
            event.respondWith(handleProxyRequest(event.request))
        }
    } else {
        event.respondWith(handleAssertEvent(event.request))
    }
}
