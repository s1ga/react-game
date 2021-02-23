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

interface ICounter {
    question: number
    rightAnswers: number
    region: number
    round: number
}

interface IGameState {
    isStart: boolean
    isFinal: boolean
    isFinalRound: boolean
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
    // const [isLoading, setIsLoading] = useState(true)
    const [gameState, setGameState] = useState<IGameState>({
        isStart: true, isFinal: false, isFinalRound: false
    })
    const [modal, setModal] = useState<IModalState>({ 
        modalIsOpen: false, questionIsOpen: false, answerIsOpen: false,
        finalIsOpen: false, modalText: ''
    })
    const [gameQuestion, setGameQuestion] = useState<IGameQuestion>({
        question: '', correctAnswer: 0, opponentAnswer: 0,
        answer: 0, regionQuestions: []
    })
    const [counter, setCounter] = useState<ICounter>({
        question: 0, rightAnswers: 0, 
        region: 0, round: 0
    })
    const history = useHistory()
    const { token, logout, userId } = useContext(AuthContext)
    const { fetchData, loading } = useFetch()
    const points: number = 500
    let open: number
    let close: number

    useEffect(() => {
        (async function fetching() {
            try {
                await fetchData(`/api/game`, { 'Authorization': token })
                if (gameState.isStart) {
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
        if (gameState.isFinalRound) {
            open = window.setTimeout(() => {
                setModal({ ...modal, modalIsOpen: true, modalText: 'Финальный раунд' })
            }, 1500)

            close = window.setTimeout(() => {
                setModal({ ...modal, modalIsOpen: false })
                // setCurrentRegion(0)
            }, 3000)
        }
    }, [gameState.isFinalRound])

    useEffect(() => {
        if (gameState.isFinal) {
            fetchData(`/api/statistics/${userId}`, { 'Authorization': token }, 'POST', { points: points * counter.region })
            open = window.setTimeout(() => {
                setModal({ ...modal, finalIsOpen: true })
            }, 1500)
        }
    }, [gameState.isFinal])

    useEffect(() => {
        setGameState({ ...gameState, isStart: false })
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
        if (!gameState.isStart) {
            setModal({ ...modal, questionIsOpen: false })
            const { answer, opponentAnswer, correctAnswer } = gameQuestion
            if (isRightAnswer(answer, opponentAnswer, correctAnswer)) {
                setCounter(prev => ({ ...prev, rightAnswers: prev.rightAnswers + 1 }))
            }
            openAnswerModal()
        }
    }, [gameQuestion.opponentAnswer])

    // useEffect(() => {

    // }, [rightAnswersCounter])

    useEffect(() => {
        if (counter.round === 6) {
            counter.region === 3 
                ? setGameState({ ...gameState, isFinalRound: true }) 
                : setGameState({ ...gameState, isFinal: true })
        } else if (counter.round === 7) {
            setGameState({ ...gameState, isFinal: true })
        } else {
            document.addEventListener('click', handler, true)
            open = window.setTimeout(() => {
                setModal({ ...modal, modalText: 'Выберите область', modalIsOpen: true })
            }, 1500)
            close = window.setTimeout(() => {
                document.removeEventListener('click', handler, true)
                setModal({ ...modal, modalIsOpen: false })
            }, 4000)
        }
    }, [counter.round])

    const openQuestionModal = (): void => {
        const i: number = randomNumFromRange(gameQuestion.regionQuestions.length)
        setGameQuestion({ 
            ...gameQuestion, 
            question: gameQuestion.regionQuestions[i].question, 
            correctAnswer: +gameQuestion.regionQuestions[i].answer 
        })
        setCounter(prev => ({ ...prev, question: prev.question + 1 }))
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
