import { createContext } from 'react'

interface IAuthContext {
    token: string | null
    userId: string,
    username: string
    isAuth: boolean,
    login(userToken: string, userId: string, username: string): void,
    logout(): void   
}

const noop = (): void => {}

export const AuthContext = createContext({
        token: null,
        userId: '',
        username: '',
        isAuth: false,
        login: noop,
        logout: noop
} as IAuthContext)