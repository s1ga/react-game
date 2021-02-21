import React from 'react'
import './MenuToggle.css'

interface MenuToggleProps {
    onToggle(): void
    isOpen: boolean
}

export const MenuToggle: React.FC<MenuToggleProps> = ({ onToggle, isOpen }) => {
    const classes: String[] = ['MenuToggle', 'fa']

    isOpen ? classes.push('fa-times', 'open') : classes.push('fa-bars')

    return <i className={classes.join(' ')} onClick={onToggle} />
}
