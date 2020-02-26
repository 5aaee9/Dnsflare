type ErrorEntity = {
    code: number
    message: string
    errorChain?: ErrorEntity[]
}

type Message = {
    code: number
    message: string
    type: any
}

type APIResponse<T> = {
    result: T | null
    success: boolean
    errors: ErrorEntity[]
    messages: Message[]
}
