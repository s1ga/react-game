import React, { useState, useEffect, useContext, ChangeEvent } from 'react'
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

interface IRegionQuestions {
    __id: string
    question: string
    answer: string
}

interface IGameQuestion {
    question: string
    correctAnswer: number
    opponentAnswer: number
    answer: number
    regionQuestions: Array<IRegionQuestions>
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
    const [gameQuestion, setGameQuestion] = useState<IGameQuestion>({
        question: '', correctAnswer: 0, opponentAnswer: 0,
        answer: 0, regionQuestions: []
    })
    const history = useHistory()
    const { token, logout, userId } = useContext(AuthContext)
    const { fetchData, loading } = useFetch()
    let open: number
    let close: number

    useEffect(() => {
        (async function fetching() {
            try {
                await fetchData(`/api/game`, { 'Authorization': token })
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
            setModal({ ...modal, finalIsOpen: false })
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
        if (isFinal) {
            fetchData(`/api/statistics/${userId}`, { 'Authorization': token }, 'POST', { points: points * regionCount })
            open = window.setTimeout(() => {
                setModal({ ...modal, finalIsOpen: true })
            }, 1500)
        }
    }, [isFinal])

    useEffect(() => {
        setIsStart(false)
        if (currentRegion !== null) {
            (async function fetching() {
                try {
                    const data = await fetchData(`/api/questions?option=${option}&region=${currentRegion}`, { 'Authorization': token })
                    setGameQuestion({ ...gameQuestion, regionQuestions: data })
                    openQuestionModal()
                } catch (e) {
                    logout()
                    history.push('/')
                }
            }) ()
        }
    }, [currentRegion])

    useEffect(() => {

    }, [opponentAnswer])

    useEffect(() => {

    }, [rightAnswersCounter])

    useEffect(() => {

    }, [roundCounter])

    const openQuestionModal = (): void => {
        const i: number = randomNumFromRange(gameQuestion.regionQuestions.length)
        setGameQuestion({ 
            ...gameQuestion, 
            question: gameQuestion.regionQuestions[i].question, 
            correctAnswer: +gameQuestion.regionQuestions[i].answer 
        })
        setQuestionCounter(prev => prev + 1)
        gameQuestion.regionQuestions.splice(i, 1)
        setGameQuestion({ ...gameQuestion, regionQuestions: gameQuestion.regionQuestions })

        setModal({ ...modal, questionIsOpen: true })
    }

    const openAnswerModal = (): void => {
    }

    const closeAnswerModal = (): void => {

    }

    const questionClickhandler = (): void => {

    }

    const changeHandler = (e: ChangeEvent<HTMLInputElement>): void => {
        setGameQuestion({ ...gameQuestion, answer: +e.target.value })
    }

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
