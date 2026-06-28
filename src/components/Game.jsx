import { useState } from 'react'

function Game({score, setScore}) {

  //get a random customer order for each new customer
  function getOrder(){
    const order = []

    //get random cone
    const cone = cones[Math.floor(Math.random() * cones.length)]
    order.push(cone)

    //get random scoops
    const totalFlavours = flavours.length  //get the total number of ice creams available to choose from
    const numScoops = Math.floor(Math.random() * totalFlavours) + 1  //get random number of scoops, minimum 1 scoop
    
    for(let i=0; i<numScoops; i++){
      const randomFlavour = flavours[Math.floor(Math.random() * totalFlavours)]  //get random ice cream flavours
      order.push(randomFlavour)  //add flavour to customer order
    }

    //50% chance to get random syrups
    if(Math.random() > 0.5){
      const numSyrups = Math.floor(Math.random() * 2) + 1  //at most 2 syrups, minimum 1
      for(let i=0; i<numSyrups; i++){
        const randomSyrup = syrups[Math.floor(Math.random() * syrups.length)]
        order.push(randomSyrup)
      }
    }

    //50% chance to get random toppings
    if(Math.random() > 0.5){
      const numToppings = Math.floor(Math.random() * 2) + 1  //at most 2 syrups, minimum 1
      for(let i=0; i<numToppings; i++){
        const randomTopping = toppings[Math.floor(Math.random() * toppings.length)]
        order.push(randomTopping)
      }
    }
    
    return order
  }

  function addItem(item){
    setPlayerOrder([...playerOrder, item])
  }

  //check if created ice cream matches customer order
  function checkOrder(){
    //filter out toppings
    const customerBase = order.filter(i => !toppings.includes(i))
    const playerBase = playerOrder.filter(i => !toppings.includes(i))

    //extract the toppings -> sort so toppings dont have to be in exact order since the pictures I drew are hard to tell which one is first
    const customerToppings = order.filter(i => toppings.includes(i)).sort()
    const playerToppings = playerOrder.filter(i => toppings.includes(i)).sort()

    //compare orders
    const correctBase = JSON.stringify(customerBase) === JSON.stringify(playerBase)
    const correctToppings = JSON.stringify(customerToppings) === JSON.stringify(playerToppings)
    if(correctBase && correctToppings){
      setScore(score + 25*(order.length-1))  //25 points for each item excluding the cone
      setPlayerOrder([])  //reset created order
      setOrder(getOrder())  //get new customer order
    } else{
      score -= 100  //minus points for each wrong order
    }
  }

  const flavours = ["Vanilla", "Strawberry", "Chocolate", "Mint", "Ube", "Orange", "Bubble Gum", "Tomato", "Lemon"]  //all ice cream flavours
  const cones = ["Cup", "Waffle"]
  const syrups = ["Chocolate Syrup", "Strawberry Syrup", "Caramel Syrup"]
  const toppings = ["Cherries", "Sprinkles", "Marshmallows"]
  const [order, setOrder] = useState(getOrder())
  const [playerOrder, setPlayerOrder] = useState([])

  return(
    /*display current score*/
    <div className="game">
      <h2>Score: {score}</h2>

      {/*customer order*/}
      <div className="order-box">
        <h3>Order:</h3>

      {/*display order from the array*/}
        <ul>
          {order.slice().reverse().map((item, index) => (  //reverse order so that cones are that the bottom, toppings at the top
            <p key={index}>{item}</p>
          ))}
        </ul>
      </div>

      {/*display all items as buttons*/}
      <div className="buttons">

        {toppings.map((topping) => (
          <button
            key={topping}
            onClick={() => addItem(topping)}  /*add topping*/
            disabled={playerOrder.filter(i => toppings.includes(i)).length >= 2  /*max toppings = 2*/
                      || !playerOrder.some(i => cones.includes(i))}  /*cone has to be chosen before adding anything else*/
          >
            {topping}
          </button>
        ))}

        {syrups.map((syrup) => (
          <button
            key={syrup}
            onClick={() => addItem(syrup)}  /*add syrup*/
            disabled={playerOrder.filter(i => syrups.includes(i)).length >= 2  /*max syrups = 2*/
                      || !playerOrder.some(i => cones.includes(i))}  /*cone has to be chosen before adding anything else*/
          >
            {syrup}
          </button>
        ))}

        {flavours.map((flavour) => (
          <button
            key={flavour}
            onClick={() => addItem(flavour)}  /*add scoop*/
            disabled={playerOrder.filter(i => flavours.includes(i)).length >= flavours.length  /*max scoops = total num of flavours*/
                      || !playerOrder.some(i => cones.includes(i))}  /*cone has to be chosen before adding anything else*/
          >
            {flavour}
          </button>
        ))}

        {cones.map((cone) => (
          <button
            key={cone}
            onClick={() => addItem(cone)}  /*add cone*/
            disabled={playerOrder.some(i => cones.includes(i))}  /*disable cone buttons when a cone is already chosen*/
          >
            {cone}
          </button>
        ))}

      </div>

      <div className="player-order">
        <h3>Your Order:</h3>

        <ul>
          {playerOrder.filter(Boolean).slice().reverse().map((item, index) => (
            <p key={index}>{item}</p>
          ))}
        </ul>
      </div>

      {/*check order and serve to customer*/}
      <button onClick={checkOrder}>
        Serve
      </button>

      {/*reset ice cream*/}
      <button onClick={() => setPlayerOrder([])}>
        Garbage
      </button>
    </div>
  )
}

export default Game;