import React, { useState, useEffect, useContext, EffectCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { useFetch } from '../../hooks/fetch.hook'
import './StatisticsPage.css'

interface Statistics {
    _id: string
    points: number
    date: Date
    user: string
}

export const StatisticsPage: React.FC = () => {
    const [statistics, setStatistics] = useState<Array<Statistics>>([])
    const { userId, token, username, logout } = useContext(AuthContext)
    const history = useHistory()
    const { fetchData, loading } = useFetch()

    useEffect(() => {
        (async function fetching() {
            const data = await fetchData(`/api/statistics/${userId}`, { 'Authorization': token }) 
            console.log(data)
            // setStatistics(data)
        }) ()
    }, [])

    return (
        <div className="Statistics">
            <h2>Statistics</h2>
            <div>
                <ul>
                    { statistics.length
                      ? statistics.map((item: Statistics) => {
                            const date = new Date(item.date)
                            return <li key={item._id}>{ date.toLocaleDateString() } { date.toLocaleTimeString() } - { item.points } очков</li> 
                        }) 
                      : <p>Информации пока нет</p>
                    }
                </ul>
            </div>
        </div>
    )
}
