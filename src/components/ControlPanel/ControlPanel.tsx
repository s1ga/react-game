import React, { useState, useContext, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { MenuToggle } from '../UI/MenuToggle/MenuToggle'
import { Menu } from '../Menu/Menu'
import { AuthContext } from '../../context/AuthContext'
import audioSrc from './icons/audio.svg'
import audioMutedSrc from './icons/audio_muted.svg'
import musicSrc from './icons/music.svg'
import gameSrc from './audio/game_music.mp3'
import startSrc from './audio/start_music.mp3'
import musicMutedSrc from './icons/music_muted.svg'
import { ControlPanelProps } from '../../interfaces/components.interface'
import './ControlPanel.css'

export const ControlPanel: React.FC<ControlPanelProps> = ({ clickHandler, isAudioMuted }) => {
    const [isMenu, setIsMenu] = useState<boolean>(false)
    const [isMusicMuted, setIsMusicState] = useState<boolean>(true)
    const [path, setPath] = useState<string>('/home')
    const location = useLocation()
    const { isAuth, userId, logout } = useContext(AuthContext)
    const musicRef = useRef<HTMLAudioElement>(null)

    useEffect(() => {
        const path = location.pathname.split('/')[1]
        setPath(prev => {
            if (location.pathname === '/') {
                return '/'
            } else if (path === 'game') {
                return 'game'
            } else if (prev !== 'home') {
                return 'home'
            }
            return prev
        })
    }, [location.pathname])

    useEffect(() => {
        switch (path) {
            case '/':
                musicRef.current!.src = ''
                break
            case 'home':
                musicRef.current!.src = startSrc
                isMusicMuted ? musicRef.current!.pause() : musicRef.current!.play()
                break
            case 'game':
                musicRef.current!.src = gameSrc
                isMusicMuted ? musicRef.current!.pause() : musicRef.current!.play()
                break
            default:
                musicRef.current!.src = ''
                break
        }
    }, [path])

    useEffect(() => {
        const music = musicRef.current!
        music.volume = 0.5
        isMusicMuted ? music.pause() : music.play()
    }, [isMusicMuted])

    const musicClickHandler = (): void => {
        setIsMusicState(prevState => !prevState)
    }
    
    const audioClickHandler = (): void => {
        clickHandler('audio')
    }

    const toggleMenuHandler = (): void => {
        setIsMenu(prevState => !prevState)
    }
    
    const menuCloseHandler = (): void => {
        setIsMenu(false)
    }

    return (
        <header className="header">
            <audio ref={musicRef} src={startSrc} loop />
            <ul className="header__list">
                {
                    isAuth 
                        ? <li className="header__list__item">
                            <Menu 
                                isOpen={isMenu} 
                                onClose={menuCloseHandler} 
                                user={userId} 
                                logout={logout} 
                            />
                            <MenuToggle onToggle={toggleMenuHandler} isOpen={isMenu} />
                          </li>
                        : <li></li>
                }

                <li className="header__list__item">
                    <img onClick={musicClickHandler} src={isMusicMuted ? musicMutedSrc : musicSrc} />
                </li>

                <li className="header__list__item">
                    <img onClick={audioClickHandler} src={isAudioMuted ? audioMutedSrc : audioSrc} />
                </li>
            </ul>
        </header>
    )
}
