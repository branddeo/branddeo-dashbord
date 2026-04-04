import { useState } from 'react'
import heroImg from './assets/hero.png'

function App() {
  const [score, setScore] = useState(0)

  // Fonction pour le jeu simple
  const playGame = () => {
    const randomPoints = Math.floor(Math.random() * 10) + 1
    setScore(score + randomPoints)
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', padding: '50px', backgroundColor: '#f5f5f5' }}>
      
      {/* Hero section */}
      <div style={{ marginBottom: '40px' }}>
        <img src={heroImg} alt="Branddeo Hero" width="200" style={{ borderRadius: '20px' }} />
        <h1 style={{ color: '#333' }}>Branddeo Agency</h1>
        <p style={{ color: '#666', fontSize: '18px' }}>Notre site est en cours de conception. Découvrez notre mini-jeu ci-dessous !</p>
      </div>

      {/* Jeu simple */}
      <div style={{ margin: '20px 0' }}>
        <button
          onClick={playGame}
          style={{
            padding: '15px 30px',
            fontSize: '18px',
            backgroundColor: '#ff4d4f',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
          }}
        >
          Gagner des points !
        </button>
        <p style={{ marginTop: '20px', fontSize: '20px', color: '#333' }}>Score : {score}</p>
      </div>

      {/* Footer */}
      <footer style={{ marginTop: '60px', color: '#999', fontSize: '14px' }}>
        © 2026 Branddeo. Tous droits réservés.
      </footer>
    </div>
  )
}

export default App