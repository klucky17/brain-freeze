import {useState, useEffect} from 'react'
import './Game.css'
import {supabase} from '../supabase'

function Game({score, setScore, setGameStarted}) {

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
      setScore(score - 100)  //minus points for each wrong order
      setWrong(true)
      setTimeout(() => setWrong(false), 3000)  //reset after 3secs -> wrong text only shows for 3 secs
    }
  }

  function displayOrder(item){
    if(flavours.includes(item)) return `/scoops/${item} scoop.png`  //display scoop
    if(toppings.includes(item)) return `/toppings/${item}.png`  //display topping
    if(syrups.includes(item)) return `/toppings/${item}.png`  //display syrup
    if(cones.includes(item)) return `/toppings/${item}.png`  //display cone
  }

  const flavours = ["ube", "mint", "orange", "vanilla", "strawberry", "chocolate", "raspberry", "bubblegum", "lemon"]  //all ice cream flavours
  const cones = ["waffle", "cup"]
  const syrups = ["caramel syrup", "strawberry syrup", "chocolate syrup"]
  const toppings = ["sprinkles", "cherry", "cookie sticks"]
  const [order, setOrder] = useState(getOrder())
  const [playerOrder, setPlayerOrder] = useState([])

  //game timer
  const [time, setTime] = useState(45)  //45 seconds
  const [gameOver, setGameOver] = useState(false)  //start with gameOver = false

  const [wrong, setWrong] = useState(false)  //wrong order

  useEffect(() => {
    if(time === 0){  //timer done, times up
      setGameOver(true)
      return
    }
    const countdown = setTimeout(() => {
      setTime(time - 1)  //minus 1 in the countdown timer
    }, 1000)  //countdown every 1000 ms -> every 1 second
    
    return () => clearTimeout(countdown)  //cancel old timer before making a new one, useEffect runs again when time changes and creates a new setTimeOut
  }, [time])  //rerun useEffect everytime time changes


  //check compare with leaderboard
  const [playerName, setPlayerName] = useState('')
  const [isLeader, setIsLeader] = useState(false)

  async function checkLeaderboard(){
    const {data} = await supabase
      .from('leaderboard')
      .select('score')
      .order('score', {ascending: false})  //desending so highest score at the top
      .limit(10)  //only 10 ppl max on leaderboard

      let lowestLeaderScore = 0  //default 0 if less than 10 leaders
      if(data?.length >= 10){
        lowestLeaderScore = data[data.length-1].score  //last score in leaders (lowest)
      }
      
      if(score > lowestLeaderScore){
        setIsLeader(true)
      }
  }

  //so you can only submit to leaderboard one time
  const [submitted, setSubmitted] = useState(false)
  async function submitScore(){
    await supabase
      .from('leaderboard')
      .insert([{name: playerName, score: score}])

    const {count} = await supabase
      .from('leaderboard')
      .select('id', {count: 'exact', head: true})  //count how many are in the leaderboard out of 10, head true = only get the count not the data

    if(count > 10){
      const {data} = await supabase
        .from('leaderboard')
        .select('id, score')
        .order('score', {ascending: true})  //lowest score first
        .limit(1)  //select only one

      await supabase
        .from('leaderboard')
        .delete()
        .eq('id', data[0].id)  //delete where id = data[0].id
    }

    setSubmitted(true)  //score submitted
  }

  useEffect(() => {
    if(gameOver){
      const highscore = parseInt(localStorage.getItem('highscore')) || 0  //get local highscore, if not set then highscore = 0
      
      if(score > highscore){
        localStorage.setItem('highscore', score)  //set new highscore
      }
      
      checkLeaderboard()
    }
  }, [gameOver])

  let gameClass = "game"
  if(wrong){
    gameClass = "game wrong-order"
  }

  return(
    /*display current score*/
    <div className={gameClass}>

      {/*if the order is wrong, inform the player*/}
      {wrong && (
        <>
          <p className="wrong-text">Wrong Order! <br/> -100</p>
        </>
      )}
      
      <h2 className="timer">{time}s</h2>
      <h2>Score: {score}</h2>

      {/*game over pop up on top of the game*/}
      {gameOver && (
        <div className="popup-overlay">
          <div className="popup">
            <h1>Time's Up!</h1>
            <p>Score: {score}</p>

            {isLeader && !submitted && (
              <>
                <h3>Congratulations you made it into the top 10 leaderboard!</h3>
                <p>Add your name below and submit to be added to the leaderboard Ignore and click done to not be added to leaderboard</p>
                <input
                  className = "name-input"
                  type = "text"
                  placeholder = "Please enter your name"
                  value = {playerName}
                  onChange = {(e) => setPlayerName(e.target.value)}
                />
                <button className="submit-score" onClick={submitScore}>Submit Score</button>
              </>
            )}
            {submitted && <p>Score submitted to leaderboard!</p>}

            <button className="popup-done" onClick={() => {
              //reset everything
              setTime(45)  //set time back to 45 seconds
              setGameOver(false)
              setScore(0)
              setGameStarted(false)
            }}>
              Done
            </button>
          </div>
        </div>
      )}

      {/*customer order*/}
      <div className="order-box" key={order[0]+order.length}>  {/*key is for slide in animation*/}

        {/*display order from the array*/}
          {order.slice().map((item, index) => (
            <img key={index} src={displayOrder(item)} alt={item} width={43}
            height={syrups.includes(item) ? 25:
                    toppings.includes(item) ? 20:
                    40}  //scoops, cups -> default height

            />
          ))}
      </div>

      {/*dispay order in text version*/}
      <div className="order-text">
        <h3>Order:</h3>
        {order.slice().reverse().map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      </div>

      {/*display all items as buttons*/}
      <div className="buttons">

        <div className="flavour-buttons">
        {flavours.map((flavour) => (
          <button
            key={flavour}
            onClick={() => addItem(flavour)}  /*add scoop*/
            disabled={playerOrder.filter(i => flavours.includes(i)).length >= flavours.length  /*max scoops = total num of flavours*/
                      || !playerOrder.some(i => cones.includes(i))}  /*cone has to be chosen before adding anything else*/
          >
            <img src={`/buttons/${flavour}-tub.png`} alt={flavour} width={120} height={113} />
          </button>
        ))}
        </div>

        <div className="topping-buttons">
        {toppings.map((topping) => (
          <button
            key={topping}
            onClick={() => addItem(topping)}  /*add topping*/
            disabled={playerOrder.filter(i => toppings.includes(i)).length >= 2  /*max toppings = 2*/
                      || !playerOrder.some(i => cones.includes(i))}  /*cone has to be chosen before adding anything else*/
          >
            <img src={`/buttons/${topping}-jar.png`} alt={topping} width={75} height={90} />
          </button>
        ))}
        </div>

        <div className="syrup-buttons">
        {syrups.map((syrup) => (
          <button
            key={syrup}
            onClick={() => addItem(syrup)}  /*add syrup*/
            disabled={playerOrder.filter(i => syrups.includes(i)).length >= 2  /*max syrups = 2*/
                      || !playerOrder.some(i => cones.includes(i))}  /*cone has to be chosen before adding anything else*/
          >
            <img src={`/buttons/${syrup}-bottle.png`} alt={syrup} width={55} height={130} />
          </button>
        ))}
        </div>

        <div className="cone-buttons">
        {cones.map((cone) => (
          <button
            key={cone}
            onClick={() => addItem(cone)}  /*add cone*/
            disabled={playerOrder.some(i => cones.includes(i))}  /*disable cone buttons when a cone is already chosen*/
          >
            <img src={`/buttons/${cone}-button.png`} alt={cone} width={75} height={60} />
          </button>
        ))}
        </div>

      </div>

      <div className="player-order">
          {playerOrder.filter(Boolean).slice().map((item, index) => (
            <img key={index} src={displayOrder(item)} alt={item} width={63} 
            height={syrups.includes(item) ? 38:
                    item === 'cherry' ? 24:
                    toppings.includes(item) ? 30:
                    60}  //scoops, cups -> default
            style={{marginBottom:  //make the items layer ontop of each other nicley
              syrups.includes(item) ? '-32px':
              item === 'cherry' ? '-14px':
              item === 'cookie sticks' ? '-20px':
              item === 'sprinkles' ? '-32px':
              '-12px'  //scoops, cups -> default
            }}
            />
          ))}
      </div>

      {/*check order and serve to customer*/}
      <button className="serve-button" onClick={checkOrder}>
        Serve
      </button>

      {/*reset ice cream*/}
      <button className="garbage-button" onClick={() => setPlayerOrder([])}>
        Garbage
      </button>
    </div>
  )
}

export default Game;