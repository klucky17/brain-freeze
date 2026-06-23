import { useState } from 'react'

function Game({score, setScore}) {
  const order = ["Vanilla", "Strawberry", "Chocolate"]
  const [playerIceCream, setIceCream] = useState([])

  function addIngredient(item){
    setIceCream([...playerIceCream, item])
  }

  function checkOrder(){
    const correct = JSON.stringify(order) === JSON.stringify(playerIceCream)
    if (correct){
      setScore(score + 100)
    }
    setIceCream([])
  }

  return(
<div className="game">
      <h2>Score: {score}</h2>

      <div className="order-box">
        <h3>Order:</h3>

        <ul>
          {order.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </ul>
      </div>

      <div className="buttons">
        <button onClick={() => addIngredient("Vanilla")}>
          Vanilla
        </button>

        <button onClick={() => addIngredient("Strawberry")}>
          Strawberry
        </button>

        <button onClick={() => addIngredient("Chocolate")}>
          Chocolate
        </button>
      </div>

      <div className="player-order">
        <h3>Your Ice Cream:</h3>

        <ul>
          {playerIceCream.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <button onClick={checkOrder}>
        Serve
      </button>
    </div>
  )
}

export default Game;