import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'

@Module({
    namespaced: true,
    name: 'user',
})
export default class UserModule extends VuexModule {
    token: string = ''
    saveToken: boolean = false

    @Mutation
    setToken(token: string) {
        this.token = token
    }

    @Mutation
    setSaveToken(saveToken: boolean) {
        this.saveToken = saveToken
    }

    @Action({ rawError: true })
    logout() {
        this.setToken('')
    }

    @Action({ rawError: true })
    login(document: { save: boolean, token: string }) {
        this.setToken(document.token)
        this.setSaveToken(document.save)
    }
}
