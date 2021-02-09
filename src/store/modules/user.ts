import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'

type LoginType = 'token' | 'email'

@Module({
    namespaced: true,
    name: 'user',
})
export default class UserModule extends VuexModule {
    token = ''
    saveToken = false

    email = ''
    globalToken = ''

    type: LoginType = 'token'

    @Mutation
    setToken(token: string) {
        this.token = token
    }

    @Mutation
    setSaveState(saveToken: boolean) {
        this.saveToken = saveToken
    }

    @Mutation
    setEmail(email: string) {
        this.email = email
    }

    @Mutation
    setGlobalToken(globalToken: string) {
        this.globalToken = globalToken
    }

    @Mutation
    setLoginType(type: LoginType) {
        this.type = type
    }

    @Action({ rawError: true })
    logout() {
        this.setToken('')
        this.setEmail('')
        this.setGlobalToken('')
    }

    @Action({ rawError: true })
    loginByToken(document: { save: boolean, token: string }) {
        this.setToken(document.token)
        this.setSaveState(document.save)
        this.setEmail('')
        this.setGlobalToken('')
        this.setLoginType('token')
    }

    @Action({ rawError: true })
    loginByEmail(document: { save: boolean, email: string, globalToken: string }) {
        this.setEmail(document.email)
        this.setToken('')
        this.setSaveState(document.save)
        this.setGlobalToken(document.globalToken)
        this.setLoginType('email')
    }
}
