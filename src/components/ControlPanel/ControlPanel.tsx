import React, { useState, useContext, useRef, useEffect } from 'react'
import { MenuToggle } from '../UI/MenuToggle/MenuToggle'
import { Menu } from '../Menu/Menu'
import { AuthContext } from '../../context/AuthContext'
import audioSrc from './icons/audio.svg'
import audioMutedSrc from './icons/audio_muted.svg'
import musicSrc from './icons/music.svg'
import music from '../../pages/StartPage/audio/start-music.mp3'
import musicMutedSrc from './icons/music_muted.svg'
import { ControlPanelProps } from '../../interfaces/components.interface'
import './ControlPanel.css'

export const ControlPanel: React.FC<ControlPanelProps> = ({ clickHandler, isAudioMuted, isMusicMuted }) => {
    const [isMenu, setIsMenu] = useState<boolean>(false)
    const { isAuth, userId, logout } = useContext(AuthContext)
    const musicRef = useRef<HTMLAudioElement>(null)

    useEffect(() => {
        const music = musicRef.current!
        music.volume = 0.2
        isMusicMuted ? music.pause() : music.play()
    }, [isMusicMuted])

    const audioClickHandler = (): void => {
        clickHandler('audio')
    }
    
    const musicClickHandler = (): void => {
        clickHandler('music')
    }

    const toggleMenuHandler = (): void => {
        setIsMenu(prevState => !prevState)
    }
    
    const menuCloseHandler = (): void => {
        setIsMenu(false)
    }

    return (
        <header className="header">
            <audio ref={musicRef} src={music} loop />
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
