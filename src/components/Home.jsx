function Home({ score, startGame }) {
  return (
    <div className="home">
      <h1>Brain Freeze</h1>

      <h2>High Score: {score}</h2>

      <button
        className="start-button"
        onClick={startGame}
      >
        Play
      </button>
    </div>
  );
}

export default Home;