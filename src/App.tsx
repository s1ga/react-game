import { useState, useEffect } from 'react'
import { Switch, BrowserRouter, Route, Redirect } from 'react-router-dom'
import { AuthContext } from './context/AuthContext'
import { useAuth } from './hooks/auth.hook'
import { ControlPanel } from './components/ControlPanel/ControlPanel'
import { Footer } from './components/Footer/Footer'
import { StartPage } from './pages/StartPage/StartPage'
import { StatisticsPage } from './pages/StatisticsPage/StatisticsPage'
import { GamePage } from './pages/GamePage/GamePage'
import { AuthPage } from './pages/AuthPage/AuthPage' 
import './App.css'

function App() {
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false)
  const [option, setOption] = useState<string>('easy')
  const { token, userId, username, login, logout, ready } = useAuth()
  const isAuth: boolean = !!token

  const clickHandler = (stateCase: string): void => {
    if (stateCase === 'audio') {
      setIsAudioMuted(!isAudioMuted)
    }
  }

  const modeHandler = (mode: string): void => {
    setOption(mode)
  }

  return (
    <AuthContext.Provider value={{
      token, userId, username, isAuth, login, logout
    }}>
      <div className="App">
        <BrowserRouter>
          <ControlPanel 
            clickHandler={clickHandler}
            isAudioMuted={isAudioMuted}
          />
        
          {
            isAuth
              ? <Switch>
                  <Route path="/home">
                    <StartPage
                      setMode={modeHandler} 
                      isAudioMuted={isAudioMuted} 
                    />
                  </Route>

                  <Route path="/statistics/:id">
                    <StatisticsPage />
                  </Route>

                  <Route path="/game">
                    <GamePage 
                      option={option}
                      isAudioMuted={isAudioMuted} 
                    />
                  </Route>
                  <Redirect to="/home" />
                </Switch>
              : <Switch>
                  <Route path="/">
                    <AuthPage />
                  </Route>
                  <Redirect to="/" />
                </Switch>
          }

          <Footer />
        </BrowserRouter>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
