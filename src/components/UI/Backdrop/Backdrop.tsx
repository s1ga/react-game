import React from 'react'
import './Backdrop.css'

interface BackdropProps {
    onClick(): void
}

export const Backdrop: React.FC<BackdropProps> = ({ onClick }) => <div className="Backdrop" onClick={onClick} />
