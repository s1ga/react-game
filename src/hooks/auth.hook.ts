import React, { useState, useCallback, useEffect } from 'react'

// example of code is taken from Vladilen Minin

const localStorageName = 'react-game'

export const useAuth = () => {
    const [token, setToken] = useState<string | null>(null)
    const [userId, setUserId] = useState<string | null>(null)
    const [ready, setReady] = useState<boolean>(false)

    const login = useCallback((userToken: string, id: string) => {
        setToken(userToken)
        setUserId(id)

        localStorage.setItem(localStorageName, JSON.stringify({
            token: userToken,
            userId: id
        }))
    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setUserId(null)

        localStorage.removeItem(localStorageName)
    }, [])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(localStorageName) || '[]')

        if (data && data.token) {
            login(data.token, data.userId)
        }

        setReady(true)
    }, [login])

    return { token, userId, ready, login, logout }
}
