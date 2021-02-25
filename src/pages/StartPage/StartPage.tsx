import React, { useState, useEffect, useRef, useContext } from 'react'
import Switch  from 'react-switch'
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { useFetch } from '../../hooks/fetch.hook'
import clickSrc from './audio/click.mp3'
import buttonSrc from './audio/button_click.mp3'
import { StartPageProps } from '../../interfaces/pages.interface'
import './StartPage.css'

export const StartPage: React.FC<StartPageProps> = ({ isAudioMuted, setMode }) => {
    const [isChecked, setIsChecked] = useState<boolean>(false)
    const clickRef = useRef<HTMLAudioElement>(null)
    const buttonRef = useRef<HTMLAudioElement>(null)
    const history = useHistory()
    const { fetchData } = useFetch()
    const { token, logout } = useContext(AuthContext)
    let click: number

    useEffect(() => {
        (async function fetching() {
            try {
                await fetchData(`/api/home`, { 'Authorization': token }) 
            } catch (e) {
                logout()
                history.push('/')
            }
        }) ()

        return () => {
            window.clearTimeout(click)
        }
    }, [])

    // useEffect(() => {
    //     const music = musicRef.current!
    //     music.volume = 0.2
    //     isMusicMuted ? music.pause() : music.play()
    // }, [isMusicMuted])

    useEffect(() => {
        if (isAudioMuted) {
            clickRef.current!.muted = true
            buttonRef.current!.muted = true
        } else {
            clickRef.current!.muted = false
            buttonRef.current!.muted = false
        }
    }, [isAudioMuted])

    const clickHandler = (): void => {
        buttonRef.current!.play()
        const optionMode = isChecked ? 'hard' : 'easy'
        setMode(optionMode)
        click = window.setTimeout(() => {
            history.push('/game')
        }, 500)
    }

    const handleChange = (flag: boolean): void => {
        clickRef.current!.play()
        setIsChecked(flag)
    }

    return (
        <div className="start__page">
            <audio ref={clickRef} src={clickSrc} />
            <audio ref={buttonRef} src={buttonSrc} />
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
            <a className="start__page__btn" onClick={clickHandler}>Начать игру</a>
        </div>
    )
}
