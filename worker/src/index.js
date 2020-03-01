import { handleRequest } from './route'

addEventListener('fetch', event => {
    handleRequest(event)
})
