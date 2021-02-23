import React, { useState, useEffect, useContext } from 'react'
import Modal from 'react-modal'
import { Link, useHistory } from 'react-router-dom'
import BelarusMap from '../../components/Belarus_Map/Belarus_Map'
import { AuthContext } from '../../context/AuthContext'
import './GamePage.css'

interface GamePageProps {
    option: string
    
}

Modal.setAppElement('#root')

export const GamePage: React.FC<GamePageProps> = ({ option }) => {


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
