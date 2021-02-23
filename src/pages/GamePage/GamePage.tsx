import { maxHeaderSize } from 'node:http'
import React, { useState, useEffect, useContext } from 'react'
import Modal from 'react-modal'
import { Link, useHistory } from 'react-router-dom'
import BelarusMap from '../../components/Belarus_Map/Belarus_Map'
import { AuthContext } from '../../context/AuthContext'
import { useFetch } from '../../hooks/fetch.hook'
import './GamePage.css'

interface GamePageProps {
    option: string
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
                        setModalText('Выберите область')
                        modalOpen()
                    }, 100)
                    close = window.setTimeout(() => {
                        closeModal()
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

    return (
        <div id="game">
            <BelarusMap click={mapClickHandler} />
            <Modal
                className="Modal"
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Start Modal"
            >
            <h2>{modalText}</h2>    
            </Modal>
            <Modal
                className="Modal"
                isOpen={questionIsOpen}
                // onRequestClose={closeModal}
                contentLabel="Question Modal"
            >
                <h2>{question}</h2>
                <input onChange={changeHandler} value={answer} />
                <button onClick={questionClickhandler}>Ответить</button>
            </Modal>
            <Modal
                className="Modal"
                isOpen={answerIsOpen}
                // onRequestClose={closeModal}
                contentLabel="Answer Modal"
            >
                <h2>{question}</h2>
                <div>
                    <p>Ваш ответ: {answer}</p>
                    {/* <p>{time}</p> */}
                </div>
                <div>
                    <p>Ответ противника: {opponentAnswer}</p>
                    {/* <p>{opponentTime}</p> */}
                </div>
                <div>
                    Правильный ответ: {correctAnswer}
                </div>
            </Modal>
            <Modal
                className="Modal"
                isOpen={finalIsOpen}
            >
                <p>{ regionCount > 3 || isFinalRound ? 'Поздравлем, вы выиграли!' : 'К сожалению, вы проиграли' }</p>
                <Link to="/">Вернуться на главную</Link>
            </Modal>
        </div>
    )
}
