import React, { createContext } from 'react'

interface IAuthContext {
    token: string | null
    userId: string | null,
    isAuth: boolean,
    login(): void,
    logout(): void   
}


const noop = (): void => {}

export const AuthContext = createContext({
        token: null,
        userId: null,
        isAuth: false,
        login: noop,
        logout: noop
} as IAuthContext)