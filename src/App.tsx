import React, { useState, useEffect } from 'react'
import { ControlPanel } from './components/ControlPanel/ControlPanel'
import './App.css'

function App() {
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false)
  const [isMusicMuted, setIsMusicMuted] = useState<boolean>(true)

  const clickHandler = (stateCase: string): void => {
    stateCase === 'audio' ?  setIsAudioMuted(!isAudioMuted) : setIsMusicMuted(!isMusicMuted) 
  }

  return (
    <div className="App">
      <ControlPanel 
        clickHandler={clickHandler}
        isAudioMuted={isAudioMuted}
        isMusicMuted={isMusicMuted}
      />
    </div>
  );
}

export default App;
