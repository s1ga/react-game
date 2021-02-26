import React, { useState, useEffect, useContext, useRef, ObjectHTMLAttributes } from 'react'
import Modal from 'react-modal'
import { Link, useHistory } from 'react-router-dom'
import { BelarusMap } from '../../components/BelarusMap/BelarusMap'
import { AuthContext } from '../../context/AuthContext'
import { useFetch } from '../../hooks/fetch.hook'
import clickSrc from './audio/map_click.mp3'
import questionSrc from './audio/question_click.mp3'
import { 
    randomNumFromRange, getOpponentAnswer, 
    isRightAnswer, handler 
} from '../../utils'
import { 
    GamePageProps, IModalState, IGameQuestion, 
    ICounter, IGameState, IRegions
} from '../../interfaces/pages.interface'
import './GamePage.css'

Modal.setAppElement('#root')

export const GamePage: React.FC<GamePageProps> = ({ option, isAudioMuted }) => {
    const [gameState, setGameState] = useState<IGameState>({
        isStart: true, isFinal: false, isFinalRound: false, isWinner: false
    })
    const [modal, setModal] = useState<IModalState>({ 
        modalIsOpen: false, questionIsOpen: false, answerIsOpen: false,
        finalIsOpen: false, modalText: ''
    })
    const [gameQuestion, setGameQuestion] = useState<IGameQuestion>({
        question: '', correctAnswer: 0, opponentAnswer: 0,
        answer: '', regionQuestions: [], isLoaded: false
    })
    const [counter, setCounter] = useState<ICounter>({
        question: 0, rightAnswers: 0, 
        region: 0, round: 0
    })
    const [regions, setRegions] = useState<IRegions>({
        current: null, playing: [1, 2, 3, 4, 5, 6]
    })
    const clickRef = useRef<HTMLAudioElement>(null)
    const questionRef = useRef<HTMLAudioElement>(null)
    const gameRef = useRef<HTMLDivElement | null>(null)
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
                    }, 100)
                    close = window.setTimeout(() => {
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
        if (isAudioMuted) {
            clickRef.current!.muted = true
            questionRef.current!.muted = true
        } else {
            clickRef.current!.muted = false
            questionRef.current!.muted = false
        }
    }, [isAudioMuted])

    useEffect(() => {
        if (gameState.isFinalRound) {
            open = window.setTimeout(() => {
                setModal({ ...modal, modalIsOpen: true, modalText: 'Финальный раунд' })
            }, 1500)

            close = window.setTimeout(() => {
                setModal({ ...modal, modalIsOpen: false })
                setRegions({ ...regions, current: 0 })
            }, 3000)
        }
    }, [gameState.isFinalRound])

    useEffect(() => {
        if (gameState.isFinal) {
            fetchData(`/api/statistics/${userId}`, { 'Authorization': token }, 'POST', {
                points: points * counter.region,
                winner: gameState.isWinner
            })
            open = window.setTimeout(() => {
                setModal({ ...modal, finalIsOpen: true })
            }, 1500)
        }
    }, [gameState.isFinal])

    useEffect(() => {
        setGameState({ ...gameState, isStart: false })
        if (regions.current !== null) {
            (async function fetching() {
                try {
                    setGameQuestion({ ...gameQuestion, isLoaded: false })
                    const data = await fetchData(`/api/game/questions?option=${option}&region=${regions.current}`, { 'Authorization': token })
                    setCounter({ ...counter, rightAnswers: 0 })
                    setGameQuestion({ ...gameQuestion, regionQuestions: data, isLoaded: true })
                } catch (e) {
                    logout()
                    history.push('/')
                }
            }) ()
        }
    }, [regions.current])

    useEffect(() => {
        if (gameQuestion.isLoaded) {
            openQuestionModal()
        }
    }, [gameQuestion.isLoaded])

    useEffect(() => {
        if (!gameState.isStart) {
            const { answer, opponentAnswer, correctAnswer } = gameQuestion
            if (isRightAnswer(+answer, opponentAnswer, correctAnswer)) {
                setCounter(prev => ({ ...prev, rightAnswers: prev.rightAnswers + 1 }))
            } else {
                openAnswerModal()
            }
        }
    }, [gameQuestion.opponentAnswer])

    useEffect(() => {
        if (!gameState.isStart && counter.question) {
            openAnswerModal()
        }
    }, [counter.rightAnswers])

    useEffect(() => {
        if (counter.round === 6) {
            if (counter.region === 3) {
                setGameState({ ...gameState, isFinalRound: true }) 
            } else {
                counter.region > 3 
                    ? setGameState({ ...gameState, isWinner: true, isFinal: true }) 
                    : setGameState({ ...gameState, isWinner: false, isFinal: true })
            }
        } else if (counter.round === 7) {
            counter.rightAnswers >= 2 
                ? setGameState({ ...gameState, isWinner: true, isFinal: true })
                : setGameState({ ...gameState, isWinner: false, isFinal: true })
        } else {
            gameRef.current!.addEventListener('click', handler, true)
            open = window.setTimeout(() => {
                setModal({ ...modal, modalText: 'Выберите область', modalIsOpen: true })
                gameRef.current!.removeEventListener('click', handler, true)
            }, 2500)
            close = window.setTimeout(() => {
                setModal({ ...modal, modalIsOpen: false })
            }, 5000)
        }
    }, [counter.round])

    const openQuestionModal = (): void => {
        const i: number = randomNumFromRange(gameQuestion.regionQuestions.length)
        const { question, answer } = gameQuestion.regionQuestions[i]
    
        gameQuestion.regionQuestions.splice(i, 1)
        setGameQuestion({ 
            ...gameQuestion, 
            question, 
            correctAnswer: +answer,
            regionQuestions: gameQuestion.regionQuestions
        })
        setCounter(prev => ({ ...prev, question: prev.question + 1 }))
        setModal({ ...modal, questionIsOpen: true })
    }

    const openAnswerModal = (): void => {
        setGameQuestion({ ...gameQuestion, answer: '' })
        setModal({ ...modal, answerIsOpen: true })
        close = window.setTimeout(() => {
            closeAnswerModal()
        }, 4000)
    }

    const closeAnswerModal = (): void => {
        if (counter.question === 3) {
            if (!gameState.isFinalRound) {
                const region = document.querySelector(`[data-id="${regions.current}"]`) as HTMLElement
                if (counter.rightAnswers >= 2) {
                    setCounter(prev => ({ ...prev, region: prev.region + 1 }))
                    region.classList.add('red')
                    open = window.setTimeout(() => {region.style.fill = 'red'}, 2000)
                } else {
                    region.classList.add('green')
                    open = window.setTimeout(() => {region.style.fill = 'green'}, 2000)
                    
                } 
            } else {
                counter.rightAnswers >= 2 
                    ? setGameState({ ...gameState, isFinalRound: false })
                    : setGameState({ ...gameState, isFinalRound: true })
            }

            setModal({ ...modal, answerIsOpen: false })
            setCounter(prev => ({ ...prev, question: 0, round: prev.round + 1 }))
        } else {
            setModal({ ...modal, answerIsOpen: false })
            openQuestionModal()
        }
    }

    const questionClickHandler = (): void => {
        questionRef.current!.play()
        const opponentAnswer = getOpponentAnswer(gameQuestion.correctAnswer)
        setModal({ ...modal, questionIsOpen: false })
        setGameQuestion({ ...gameQuestion, opponentAnswer })
    }

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setGameQuestion({ ...gameQuestion, answer: e.target.value })
    }

    const mapClickHandler = (e: React.MouseEvent<SVGPolygonElement>) => {
        clickRef.current!.play()
        const region: number = +(e.currentTarget.dataset.id ?? 0)
        if (regions.playing.includes(region)) {
            const index = regions.playing.indexOf(region)
            regions.playing.splice(index, 1)
            setRegions({ playing: regions.playing, current: region })
        }
    }

    return (
        <div ref={gameRef} id="game">
            <audio ref={clickRef} src={clickSrc} />
            <audio ref={questionRef} src={questionSrc} />
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
            >
                <h2>{ gameQuestion.question }</h2>
                <input type="text" value={gameQuestion.answer} onChange={changeHandler} placeholder="Ваш ответ" />
                <button onClick={questionClickHandler}>Ответить</button>
            </Modal>

            <Modal 
                className="Modal"
                isOpen={modal.answerIsOpen}
                contentLabel="Answer Modal"
            >
                <h2>{ gameQuestion.question }</h2>
                <p>
                    <span>Ваш ответ: { gameQuestion.answer }</span>
                </p>
                <p>
                    <span>Ответ противника: { gameQuestion.opponentAnswer }</span>
                </p>
                <p>
                    <span>Правильный ответ: { gameQuestion.correctAnswer }</span>
                </p>
            </Modal>
            
            <Modal 
                className="Modal"
                isOpen={modal.finalIsOpen}
                contentLabel="Final Modal"
            >
                <h2>{ gameState.isWinner ? 'Поздравлем, вы выиграли!' : 'К сожалению, вы проиграли' }</h2>
                <Link to="/home">Вернуться на главную</Link>
            </Modal>
        </div>
    )
}
