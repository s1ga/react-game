import React from 'react'
import schoolLogo from './img/rs_school_js.svg'
import './Footer.css'

export const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <ul className="footer__list">
                <li className="footer__list__item">
                    <a href="https://rs.school/js" target="_blank">
                        <img src={schoolLogo} alt="Rolling Scopes School"/>
                    </a>
                </li>

                <li className="footer__list__item">
                    <a href="https://github.com/s1ga" target="_blank">Sergey Harlanov</a> <span>&copy;2021</span>
                </li>
            </ul>
        </footer>
    )
}
