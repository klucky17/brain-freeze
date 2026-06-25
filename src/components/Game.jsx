import { useState } from 'react'

function Game({score, setScore}) {

  // //get a randomized order
  // function shuffleOrder(IceCreamOrder){
  //   let currentIndex = IceCreamOrder.length
  //   while(currentIndex != 0){
  //     let randomIndex = Math.floor(Math.random() * currentIndex)
  //     currentIndex--
      
  //     [IceCreamOrder[currentIndex], IceCreamOrder[randomIndex]] = [IceCreamOrder[randomIndex], IceCreamOrder[currentIndex]]
  //   }
  // }

  //get a random customer order for each new customer
  function getOrder(){
    const totalFlavours = flavours.length  //get the total number of ice creams available to choose from
    const orderLength = Math.floor(Math.random() * totalFlavours) + 1  //get random order length, minimum 1 scoop

    const order = []
    for(let i=0; i<orderLength; i++){
      const randomFlavour = flavours[Math.floor(Math.random() * totalFlavours)]  //get random ice cream flavours
      order.push(randomFlavour)  //add flavour to customer order
    }
    
    return order
  }

  function addFlavour(item){
    setIceCream([...playerIceCream, item])
  }

  //check if created ice cream matches customer order
  function checkOrder(){
    const correct = JSON.stringify(order) === JSON.stringify(playerIceCream) //compare orders
    if (correct){
      setScore(score + 100)
      setIceCream([])  //reset ice cream creation
      setOrder(getOrder())  //get new customer order
    }
  }

  const flavours = ["Vanilla", "Strawberry", "Chocolate", "Mint", "Ube", "Orange", "Cotton Candy", "Cherry", "Lemon"]  //all ice cream flavours
  const [order, setOrder] = useState(getOrder(flavours))
  const [playerIceCream, setIceCream] = useState([])

  return(
    /*display current score*/
    <div className="game">
      <h2>Score: {score}</h2>

      {/*customer order*/}
      <div className="order-box">
        <h3>Order:</h3>

      {/*display order from the array*/}
        <ul>
          {order.map((item, index) => (
            <p key={index}>{item}</p>
          ))}
        </ul>
      </div>

      {/*display all flavours as buttons*/}
      <div className="buttons">
        {flavours.map((flavour) => (
          <button
            key={flavour}
            onClick={() => addFlavour(flavour)}  /*add scoop*/
          >
            {flavour}
          </button>
        ))}
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

      <button onClick={() => setIceCream([])}>
        Garbage
      </button>
    </div>
  )
}

export default Game;