import './Home.css'
import {supabase} from '../supabase'
import {useState, useEffect} from 'react';

function Home({ score, startGame }) {
  const[leaderboard, setLeaderboard] = useState([])

  useEffect(() => {

    async function getLeaderboard(){
      const {data} = await supabase
        .from('leaderboard')
        .select('name, score')
        .order('score', {ascending: false})  //descending
        .limit(10)  //only display top 10
      setLeaderboard(data || [])
    }
    getLeaderboard()

  }, [])
  
  const highscore = parseInt(localStorage.getItem('highscore')) || 0  //get highscore, if no highscore then highscore = 0

  useEffect(() => {
    function updateScale(){
      const scale = Math.max(  //max picks the bigger number -> height or width so that whole screen gets filled
        window.innerWidth / 1536,  //base laptop size being worked on -> dell xps 15 9520
        window.innerHeight / 827
      )
      document.documentElement.style.setProperty('--scale', scale)  //set css variable --scale to scale
    }
    updateScale()
    window.addEventListener('resize', updateScale)  //update scale everytime the window gets resized
    return () => window.removeEventListener('resize', updateScale)  //stop the resize listener from running -> so it doesnt run in the background
  }, [])  //[] means only run/setup once when game loads

  return (
    <div className="home">
      <div className="home-container">

        <div className="home-text">
          <h1>Brain Freeze</h1>

          <h2>High Score: {highscore}</h2>
        </div>

        <button className="start-button" onClick={startGame}>
          Play
        </button>

        <div className="leaderboard">
          <h2>Top 10 Leaderboard</h2>
          <ol>
            {leaderboard.map((entry, index) => (
              <li key={index}>
                <span>{index + 1}.</span>  {/*show ranking numbers*/}
                <span>{entry.name}</span>
                <span>{entry.score}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default Home;