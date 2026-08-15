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

  return (
    <div className="home">

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
  );
}

export default Home;