import React from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { Backdrop } from '../UI/Backdrop/Backdrop'
import { MenuProps } from '../../interfaces/components.interface'
import './Menu.css'

export const Menu: React.FC<MenuProps> = ({ isOpen, user, onClose, logout }) => {
    const history = useHistory()
    const classes: String[] = ['Menu']

    const logoutHanlder = (e: React.MouseEvent) => {
        e.preventDefault()
        logout()
        history.push('/')
    }
    
    const clickHandler = (): void => {
        onClose()
    }   
    
    if (!isOpen) {
        classes.push('close')
    }

    return (
        <>
            <nav className={classes.join(' ')}>
                <ul>
                    <li>
                        <NavLink activeClassName="active" onClick={clickHandler} to="/home">На главную</NavLink>
                    </li>

                    <li>
                        <NavLink activeClassName="active" onClick={clickHandler} to={`/statistics/${user}`}>Статистика</NavLink>
                    </li>

                    <li>
                        <a onClick={logoutHanlder} href="/">Выйти</a>
                    </li>
                </ul>
            </nav>
            
            { isOpen ? <Backdrop onClick={onClose} /> : null }
        </>
    )
}
