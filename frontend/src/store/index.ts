import { action, observable } from 'mobx';
import { User } from '../types/User'

export class Store {
    @observable user?: User = undefined

    @action setUser(user: any) {
        this.user = user
    }
}

export default new Store()