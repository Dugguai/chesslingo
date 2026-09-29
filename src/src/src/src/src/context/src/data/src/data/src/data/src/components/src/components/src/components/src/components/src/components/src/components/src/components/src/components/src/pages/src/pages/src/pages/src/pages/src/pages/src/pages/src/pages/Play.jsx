import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import Oscar from '../components/Oscar';
import { useUser } from '../context/UserContext';
import './Play.css';

export default function Play() {
  const { user, recordMatch, addXP, addGems } = useUser();
  const [mode, setMode] = useState(null); // null | 'oscar' | 'friend' | 'anyone'
  const [difficulty, setDifficulty] = useState('medium');
  const [game, setGame] = useState(null);
  const [oscarMsg, setOscarMsg] = useState('');
  const [oscarState, setOscarState] = useState('idle');
  const [gameOver, setGameOver] = useState(null);

  function startGame(diff) {
    setGame(new Chess());
    setGameOver(null);
    setOscarState('talking');
    setOscarMsg(`Let's play! I'm at ${diff} level. Good luck!`);
  }

  function resetToMenu() {
    setMode(null);
    setGame(null);
    setGameOver(null);
    setOscarMsg('');
  }

  function makeOscarMove(gameObj) {
    const moves = gameObj.moves({ verbose: true });
    if (!moves.length) return;

    let pool;
    if (difficulty === 'easy') {
      pool = moves;
    } else if (difficulty === 'medium') {
      const captures = moves.filter((m) => m.captured);
      pool = captures.length ? captures : moves;
    } else {
      // hard: prefer captures of high-value pieces
      const values = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 100 };
      pool = [...moves].sort((a, b) => (values[b.captured] || 0) - (values[a.captured] || 0));
    }
    const pick = pool[Math.floor(Math.random() * Math.min(pool.length, 4))];
    gameObj.move({ from: pick.from, to: pick.to, promotion: 'q' });
  }

  function onDrop(source, target) {
    if (!game || gameOver) return false;
    const gameCopy = new Chess(game.fen());
    let move;
    try {
      move = gameCopy.move({ from: source, to: target, promotion: 'q' });
    } catch {
      return false;
    }
    if (!move) return false;

    setGame(gameCopy);
    setOscarState('thinking');
    setOscarMsg('Hmm, let me think...');

    setTimeout(() => {
      const after = new Chess(gameCopy.fen());
      if (after.isGameOver()) {
        handleGameOver(after);
        return;
      }
      makeOscarMove(after);
      setGame(after);
      setOscarState('idle');

      if (after.isGameOver()) {
        handleGameOver(after);
      } else {
        setOscarMsg('Your turn!');
      }
    }, 500);

    return true;
  }

  function handleGameOver(g) {
    if (g.isCheckmate()) {
      const winner = g.turn() === 'w' ? 'black' : 'white';
      if (winner === 'white') {
        setGameOver('win');
        setOscarState('sad');
        setOscarMsg('Fantastic! You checkmated me. Well played!');
        recordMatch(true, 18);
        addXP(30);
        addGems(10);
      } else {
        setGameOver('loss');
        setOscarState('happy');
        setOscarMsg('Good game! Let\'s see where the position changed.');
        recordMatch(false, -12);
        addXP(10);
      }
    } else if (g.isDraw() || g.isStalemate()) {
      setGameOver('draw');
      setOscarState('idle');
      setOscarMsg('A draw! Solid play.');
      recordMatch(false, 0);
      addXP(15);
    }
  }

  // ---------- MENU ----------
  if (!mode) {
    return (
      <div className="play-page">
        <h1>⚔️ Chess Matches</h1>
        <p className="play-sub">अपने अगले match के लिए opponent चुनें</p>

        <div className="match-cards">
          <button className="match-card oscar" onClick={() => setMode('oscar')}>
            <div className="match-emoji">🎓</div>
            <h3>Oscar</h3>
            <p>AI Coach + Opponent</p>
            <span className="match-cta">Play →</span>
          </button>
          <button className="match-card friend" onClick={() => setMode('friend')}>
            <div className="match-emoji">👥</div>
            <h3>Friend</h3>
            <p>दोस्त को चैलेंज करें</p>
            <span className="match-cta">Challenge →</span>
          </button>
          <button className="match-card anyone" onClick={() => setMode('anyone')}>
            <div className="match-emoji">🌍</div>
            <h3>Anyone</h3>
            <p>Random opponent</p>
            <span className="match-cta">Find →</span>
          </button>
        </div>

        <div className="match-stats card">
          <div><strong>{user.gamesPlayed}</strong><span>Games</span></div>
          <div><strong>{user.gamesWon}</strong><span>Wins</span></div>
          <div><strong>{user.gamesLost}</strong><span>Losses</span></div>
          <div><strong>{user.elo}</strong><span>Elo</span></div>
        </div>
      </div>
    );
  }

  // ---------- FRIEND / ANYONE placeholder ----------
  if (mode === 'friend' || mode === 'anyone') {
    return (
      <div className="play-page">
        <button className="back-link" onClick={resetToMenu}>← Matches</button>
        <div className="placeholder-card card">
          <div className="ph-emoji">🚧</div>
          <h2>{mode === 'friend' ? 'Friend Match' : 'Online Match'}</h2>
          <p>यह feature जल्द आ रहा है! अभी के लिए Oscar के साथ खेलें।</p>
          <button className="btn-3d btn-green" onClick={resetToMenu}>वापस जाएं</button>
        </div>
      </div>
    );
  }

  // ---------- OSCAR GAME ----------
  if (mode === 'oscar' && !game) {
    return (
      <div className="play-page">
        <button className="back-link" onClick={resetToMenu}>← Matches</button>
        <div className="difficulty-pick card">
          <h2>🎓 Play against Oscar</h2>
          <p>अपनी difficulty चुनें</p>
          <div className="diff-grid">
            {[
              { id: 'easy', label: 'Easy', icon: '🟢', desc: 'Beginner' },
              { id: 'medium', label: 'Medium', icon: '🟡', desc: 'Balanced' },
              { id: 'hard', label: 'Hard', icon: '🔴', desc: 'Strong' },
            ].map((d) => (
              <button
                key={d.id}
                className={`diff-card ${difficulty === d.id ? 'active' : ''}`}
                onClick={() => setDifficulty(d.id)}
              >
                <div className="diff-icon">{d.icon}</div>
                <div className="diff-label">{d.label}</div>
                <div className="diff-desc">{d.desc}</div>
              </button>
            ))}
          </div>
          <button className="btn-3d btn-green start-btn" onClick={() => startGame(difficulty)}>
            ▶ Start Match
          </button>
        </div>
      </div>
    );
  }

  // ---------- GAME IN PROGRESS ----------
  return (
    <div className="play-page">
      <div className="game-topbar">
        <button className="back-link" onClick={resetToMenu}>← Matches</button>
        <span className="game-difficulty">🎓 Oscar • {difficulty}</span>
      </div>

      <div className="game-layout">
        <div className="game-board-wrap">
          <Chessboard
            position={game.fen()}
            onPieceDrop={onDrop}
            boardWidth={480}
            customBoardStyle={{ borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.18)' }}
            customDarkSquareStyle={{ backgroundColor: '#769656' }}
            customLightSquareStyle={{ backgroundColor: '#eeeed2' }}
            animationDuration={220}
          />

          <div className="game-status">
            {game.turn() === 'w' ? 'आपकी चाल (White)' : "Oscar की चाल..."}
          </div>

          <div className="game-actions">
            <button className="ctrl-btn" onClick={() => startGame(difficulty)}>🔄 Restart</button>
            <button className="ctrl-btn" onClick={resetToMenu}>🏠 Menu</button>
          </div>

          {gameOver && (
            <div className={`game-over-panel ${gameOver}`}>
              <div className="go-emoji">
                {gameOver === 'win' ? '🏆' : gameOver === 'loss' ? '😔' : '🤝'}
              </div>
              <h3>
                {gameOver === 'win' ? 'VICTORY!' :
                 gameOver === 'loss' ? 'DEFEAT' :
                 'DRAW'}
              </h3>
              <p>
                {gameOver === 'win' ? 'You defeated Oscar!' :
                 gameOver === 'loss' ? 'Oscar won this time.' :
                 'Well matched.'}
              </p>
              <div className="go-rewards">
                {gameOver === 'win' && <>
                  <span className="reward-chip">+18 Elo</span>
                  <span className="reward-chip">+30 XP</span>
                  <span className="reward-chip">+10 💎</span>
                </>}
                {gameOver === 'loss' && <>
                  <span className="reward-chip">-12 Elo</span>
                  <span className="reward-chip">+10 XP</span>
                </>}
                {gameOver === 'draw' && <span className="reward-chip">+15 XP</span>}
              </div>
              <div className="go-actions">
                <button className="btn-3d btn-gray" onClick={resetToMenu}>Menu</button>
                <button className="btn-3d btn-green" onClick={() => startGame(difficulty)}>Play Again</button>
              </div>
            </div>
          )}
        </div>

        <div className="game-side">
          <Oscar state={oscarState} message={oscarMsg} />
          <div className="game-history card">
            <h4>📜 Moves</h4>
            {game.history().length === 0 ? (
              <p className="empty-note">अभी कोई चाल नहीं</p>
            ) : (
              <ol className="moves-list">
                {game.history().slice(-10).map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
