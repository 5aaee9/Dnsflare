import { defineStore } from 'pinia'


type LoginType = 'token' | 'email'
type UserStoreState = {
    token: string
    saveToken: boolean

    email: string
    globalToken: string

    type: LoginType
}

export const useUserStore = defineStore('user', {
    state: (): UserStoreState => {
        return {
            token: '',
            saveToken: false,
            email: '',
            globalToken: '',
            type: 'token'
        }
    },

    persist: true,

    actions: {
        setToken(token: string) {
            this.token = token
        },

        setSaveState(save: boolean) {
            this.saveToken = save
        },

        setEmail(email: string) {
            this.email = email
        },

        setGlobalToken(global: string) {
            this.globalToken = global
        },

        setLoginType(type: LoginType) {
            this.type = type
        },

        logout() {
            this.token = ''
            this.email = ''
            this.globalToken = ''
            this.saveToken = false
        },

        loginByToken(document: { save: boolean, token: string }) {
            this.setToken(document.token)
            this.setSaveState(document.save)
            this.setEmail('')
            this.setGlobalToken('')
            this.setLoginType('token')
        },

        loginByEmail(document: { save: boolean, email: string, globalToken: string }) {
            this.setEmail(document.email)
            this.setToken('')
            this.setSaveState(document.save)
            this.setGlobalToken(document.globalToken)
            this.setLoginType('email')
        }
    }
})
