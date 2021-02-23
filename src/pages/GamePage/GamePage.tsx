import React, { useState, useEffect, useContext } from 'react'
import Modal from 'react-modal'
import { Link, useHistory } from 'react-router-dom'
import { BelarusMap } from '../../components/BelarusMap/BelarusMap'
import { AuthContext } from '../../context/AuthContext'
import { useFetch } from '../../hooks/fetch.hook'
import './GamePage.css'

interface GamePageProps {
    option: string
}

interface IModalState {
    modalIsOpen: boolean
    questionIsOpen: boolean
    answerIsOpen: boolean
    finalIsOpen: boolean
    modalText: string
}

Modal.setAppElement('#root')

const randomNumFromRange = (length: number): number => Math.floor(Math.random() * length)

const getOpponentAnswer = (correctAnswer: number): number => {
    let shift: number = 10
    if (correctAnswer > 10000) {
        shift = 1000
    } else if (correctAnswer > 100000) {
        shift = 5000
    }

    const max = Math.ceil(correctAnswer + shift)
    const min = Math.floor(correctAnswer - shift)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const isRightAnswer = (answer: number, opponentAnswer: number, correctAnswer: number): boolean => {
    const answerVariation = Math.abs(correctAnswer - answer)
    const opponentAnswerVariation = Math.abs(correctAnswer - opponentAnswer)

    return answerVariation < opponentAnswerVariation ? true : false
}

const handler = (e: React.MouseEvent): void => {
    e.preventDefault()
    e.stopPropagation()
}   

export const GamePage: React.FC<GamePageProps> = ({ option }) => {
    const [isStart, setIsStart] = useState<boolean>(true)
    const [modal, setModal] = useState<IModalState>({ 
        modalIsOpen: false, questionIsOpen: false, answerIsOpen: false,
        finalIsOpen: false, modalText: ''
    })
    const history = useHistory()
    const { token, logout, userId } = useContext(AuthContext)
    const { fetchData, loading } = useFetch()
    let open: number
    let close: number

    useEffect(() => {
        (async function fetching() {
            try {
                const data = await fetchData(`/api/game`, { 'Authorization': token })
                if (isStart) {
                    open = window.setTimeout(() => {
                        setModal({ ...modal, modalText: 'Выберите область', modalIsOpen: true })
                        // modalOpen()
                    }, 100)
                    close = window.setTimeout(() => {
                        // closeModal()
                        setModal({ ...modal, modalIsOpen: false })
                    }, 3000)
                }
            } catch (e) {
                logout()
                history.push('/')
            }
        }) ()
        return () => {
            window.clearTimeout(open)
            window.clearTimeout(close)
        }
    }, [])

    useEffect(() => {
        if (isFinalRound) {
            open = window.setTimeout(() => {
                setModal({ ...modal, modalIsOpen: true, modalText: 'Финальный раунд' })
            }, 1500)

            close = window.setTimeout(() => {
                setModal({ ...modal, modalIsOpen: false })
                // setCurrentRegion(0)
            }, 3000)
        }
    }, [isFinalRound])

    useEffect(() => {

    }, [isFinal])

    const mapClickHandler = (e: React.MouseEvent<SVGPolygonElement>) => {
        // if ()
    }

    return (
        <div id="game">
            <BelarusMap click={mapClickHandler} />
            
            <Modal 
                className="Modal"
                isOpen={modal.modalIsOpen}
                contentLabel="Start Modal"
            > 
                <h2>{ modal.modalText }</h2>
            </Modal>

            <Modal 
                className="Modal"
                isOpen={modal.questionIsOpen}
                contentLabel="Question Modal"
            />

            <Modal 
                className="Modal"
                isOpen={modal.answerIsOpen}
                contentLabel="Answer Modal"
            />
            <Modal 
                className="Modal"
                isOpen={modal.answerIsOpen}
                contentLabel="Final Modal"
            />
        </div>
    )
}
