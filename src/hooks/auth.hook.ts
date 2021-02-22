import { useState, useCallback, useEffect } from 'react'

// example of code is taken from Vladilen Minin

const localStorageName = 'react-game'

export const useAuth = () => {
    const [token, setToken] = useState<string | null>(null)
    const [userId, setUserId] = useState<string>('')
    const [username, setUsername] = useState<string>('')
    const [ready, setReady] = useState<boolean>(false)

    const login = useCallback((userToken: string, idUser: string, username: string) => {
        setToken(userToken)
        setUserId(idUser)
        setUsername(username)

        localStorage.setItem(localStorageName, JSON.stringify({
            token: userToken,
            userId: idUser,
            name: username
        }))
    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setUserId('')
        setUsername('')

        localStorage.removeItem(localStorageName)
    }, [])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(localStorageName) || '[]')

        if (data && data.token) {
            login(data.token, data.userId, data.username)
        }

        setReady(true)
    }, [login])

    return { token, userId, ready, login, logout }
}
