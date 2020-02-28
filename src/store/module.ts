import { getModule } from 'vuex-module-decorators'
import { namespace } from 'vuex-class'
import store from '@/store'
import User from '@/store/modules/user'

export const UserModule = getModule(User, store)

export const UserNamespace = namespace('user')

export default {
    UserModule,
    UserNamespace,
}
