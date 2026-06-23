import { useState } from 'react'
import './App.css'
import Home from "./components/Home"
import Game from "./components/Game"

function App(){
  const[gameStarted, setGameStarted] = useState(false)
  const[score, setScore] = useState(0)

  return (
    <>
    {!gameStarted ? (
      <Home
        score = {score}
        startGame = {() => setGameStarted(true)}
      />
    ):(
      <Game
        score = {score}
        setScore = {setScore}
      />
    )}
    </>
  )
}

export default App