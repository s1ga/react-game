import React, { useState, useEffect, useContext, EffectCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { Loader } from '../../components/UI/Loader/Loader'
import { AuthContext } from '../../context/AuthContext'
import { useFetch } from '../../hooks/fetch.hook'
import { IStatistics } from '../../interfaces/pages.interface'
import './StatisticsPage.css'

export const StatisticsPage: React.FC = () => {
    const [statistics, setStatistics] = useState<Array<IStatistics>>([])
    const { userId, token, username, logout } = useContext(AuthContext)
    const history = useHistory()
    const { fetchData, loading } = useFetch()

    useEffect(() => {
        (async function fetching() {
            try {
                const data = await fetchData(`/api/statistics/${userId}`, { 'Authorization': token }) 
                setStatistics(data.statistics)
            } catch (e) {
                logout()
                history.push('/')
            }
        }) ()
    }, [])

    return (
        <div className="Statistics">
            <h2>{ username } statistics</h2>
            <div>
                {
                    loading 
                        ? <Loader />
                        : <ul>
                            { statistics.length
                                ? statistics.map((item: IStatistics) => {
                                        const date = new Date(item.date)
                                        return <li key={item._id}>
                                                { date.toLocaleDateString() } { date.toLocaleTimeString() } - { item.points } очков
                                                - { item.winner ? 'победа' : 'выигрыш' }
                                            </li> 
                                    }) 
                                : <p>Информации пока нет</p>
                            }
                          </ul>
                
                }
            </div>
        </div>
    )
}
