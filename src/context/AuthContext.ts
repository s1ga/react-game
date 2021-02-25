import { createContext } from 'react'
import { IAuthContext } from '../interfaces/context.interface'

const noop = (): void => {}

export const AuthContext = createContext({
        token: null,
        userId: '',
        username: '',
        isAuth: false,
        login: noop,
        logout: noop
} as IAuthContext)