import React from 'react'
import { BackdropProps } from '../../../interfaces/components.interface'
import './Backdrop.css'

export const Backdrop: React.FC<BackdropProps> = ({ onClick }) => <div className="Backdrop" onClick={onClick} />
