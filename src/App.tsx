import { useState, useEffect } from 'react'
import { Switch, BrowserRouter, Route, Redirect } from 'react-router-dom'
import { AuthContext } from './context/AuthContext'
import { useAuth } from './hooks/auth.hook'
import { ControlPanel } from './components/ControlPanel/ControlPanel'
import './App.css'

function App() {
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false)
  const [isMusicMuted, setIsMusicMuted] = useState<boolean>(true)
  const { token, userId, login, logout, ready } = useAuth()
  const isAuth: boolean = !!token

  const clickHandler = (stateCase: string): void => {
    stateCase === 'audio' ?  setIsAudioMuted(!isAudioMuted) : setIsMusicMuted(!isMusicMuted) 
  }

  return (
    <AuthContext.Provider value={{
      token, userId, isAuth, login, logout
    }}>
      <div className="App">
        <BrowserRouter>
          <ControlPanel 
            clickHandler={clickHandler}
            isAudioMuted={isAudioMuted}
            isMusicMuted={isMusicMuted}
          />
        
          {
            isAuth
              ? <Switch>
                  <Route path="/home">
                    <StartPage
                      mode={modeHandler} 
                      isAudioMuted={isAudioMuted} 
                      isMusicMuted={isMusicMuted}
                    />
                  </Route>

                  <Route path="/statistics/:id">
                    <StatisticsPage />
                  </Route>

                  <Route path="/game">
                    <GamePage 
                      option={option}
                      
                    />
                  </Route>
                  <Redirect to="/home" />
                </Switch>
              : <Switch>
                  <Route path="/" component={AuthPage} />
                  <Redirect to="/" />
                </Switch>
          }

          {/* <Footer /> */}
        </BrowserRouter>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
