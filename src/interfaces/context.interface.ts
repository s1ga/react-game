interface IAuthContext {
    token: string | null
    userId: string,
    username: string
    isAuth: boolean,
    login: (userToken: string, userId: string, username: string) => void,
    logout: () => void   
}

export type { IAuthContext }