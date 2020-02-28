import Vue from 'vue'

type MessageType = 'info' | 'success' | 'warn' | 'error'

type MessagePayload = {
    type: MessageType
    text: string
    // Message timeout, 0 if not close automatically
    timeout?: number
}

type MessageFunction = (value: string | MessagePayload, timeout?: number) => {
    close: () => void
}

declare module 'vue/types/vue' {
    interface Vue {
        $Message: MessageFunction & {
            config: (value: MessagePayload) => void
            loading: MessageFunction
        }
    }
}
