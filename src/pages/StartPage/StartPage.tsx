import React, { useState, useEffect, useRef, useContext } from 'react'
import Switch  from 'react-switch'
import { Link, useHistory } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { useFetch } from '../../hooks/fetch.hook'
import musicSrc from './audio/start-music.mp3'
import audioSrc from './audio/click.mp3'
import { StartPageProps } from '../../interfaces/pages.interface'
import './StartPage.css'

export const StartPage: React.FC<StartPageProps> = ({ isAudioMuted, isMusicMuted, setMode }) => {
    const [isChecked, setIsChecked] = useState<boolean>(false)
    const musicRef = useRef<HTMLAudioElement>(null)
    const audioRef = useRef<HTMLAudioElement>(null)
    const history = useHistory()
    const { fetchData } = useFetch()
    const { token, logout } = useContext(AuthContext)

    useEffect(() => {
        (async function fetching() {
            try {
                await fetchData(`/api/home`, { 'Authorization': token }) 
            } catch (e) {
                logout()
                history.push('/')
            }
        }) ()
    }, [])

    useEffect(() => {
        const music = musicRef.current!
        music.volume = 0.2
        isMusicMuted ? music.pause() : music.play()
    }, [isMusicMuted])

    useEffect(() => {
        isAudioMuted ? audioRef.current!.muted = true : audioRef.current!.muted = false
    }, [isAudioMuted])

    const clickHandler = (): void => {
        const optionMode = isChecked ? 'hard' : 'easy'
        setMode(optionMode)
    }

    const handleChange = (flag: boolean): void => {
        audioRef.current!.play()
        setIsChecked(flag)
    }

    return (
        <div className="start__page">
            <audio ref={musicRef} src={musicSrc} loop />
            <audio ref={audioRef} src={audioSrc} />
            <div className="start__page__switch__wrapper">
                <span>Легкий</span>
                <Switch 
                    className="start__page__switch"
                    onChange={handleChange}
                    checked={isChecked} 
                    onColor="#ff0000"
                    offColor="#adff2f"
                    uncheckedIcon={false}
                    checkedIcon={false}
                />
                <span>Тяжелый</span>
            </div>
            <Link className="start__page__btn" to="/game" onClick={clickHandler}>Начать игру</Link>
        </div>
    )
}
