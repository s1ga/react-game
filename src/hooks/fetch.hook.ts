import { useState, useCallback } from 'react'

const BASE_URL = 'http://localhost:5000'

export const useFetch = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')

    const clearError = useCallback(() => setError(''), [])

    const fetchData = useCallback(async (url: string, method: string = 'GET', body: any = null, headers: any = {}): Promise<any> => {
        setLoading(true)    
        try {
            if (body) {
                body = JSON.stringify(body)
                headers['Content-Type'] = 'application/json'
            }

            const res = await fetch(BASE_URL + url, { method, body, headers })
            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || 'Что-то пошло не так')
            } else {
                setLoading(false)
            }

            return data
        } catch (e) {
            setLoading(false)
            setError(e.message)
            throw e.message
        }
    }, [])

    return { loading, error, fetchData, clearError }
}