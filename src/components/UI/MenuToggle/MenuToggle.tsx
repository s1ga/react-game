import React from 'react'
import { MenuToggleProps } from '../../../interfaces/components.interface'
import './MenuToggle.css'

export const MenuToggle: React.FC<MenuToggleProps> = ({ onToggle, isOpen }) => {
    const classes: String[] = ['MenuToggle', 'fa']

    isOpen ? classes.push('fa-times', 'open') : classes.push('fa-bars')

    return <i className={classes.join(' ')} onClick={onToggle} />
}
