interface GamePageProps {
    option: string,
    isAudioMuted: boolean 
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
    answer: string
    regionQuestions: Array<IRegionQuestions>
    isLoaded: boolean
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
    isWinner: boolean
}

interface IRegions {
    current: number | null
    playing: Number[]
}

interface IForm {
    email: string,
    name?: string,
    password: string
}

interface StartPageProps {
    isAudioMuted: boolean
    setMode: (option: string) => void 
}

interface IStatistics {
    _id: string
    points: number
    date: Date
    user: string
}

export type {
    GamePageProps, IModalState, IGameQuestion, ICounter, 
    IGameState, IRegions, IForm, StartPageProps, IStatistics 
}