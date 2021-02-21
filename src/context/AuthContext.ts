import React, { createContext } from 'react'

interface IAuthContext {
    token: string | null
    userId: string,
    isAuth: boolean,
    login(): void,
    logout(): void   
}


const noop = (): void => {}

export const AuthContext = createContext({
        token: null,
        userId: '',
        isAuth: false,
        login: noop,
        logout: noop
} as IAuthContext)