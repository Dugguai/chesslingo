import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import Oscar from '../components/Oscar';
import { useUser } from '../context/UserContext';
import { sections, getAllLessons } from '../data/lessons';
import './Puzzle.css';

export default function Puzzle() {
  const { sectionId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user, addXP, addGems, loseHeart, completeLesson, solvePuzzle } = useUser();

  const section = sections.find((s) => s.id === Number(sectionId));
  const lesson = useMemo(() => {
    if (!section) return null;
    return getAllLessons(section).find((l) => l.id === Number(lessonId));
  }, [section, lessonId]);

  const [game, setGame] = useState(() => new Chess(lesson?.fen || '8/8/8/8/8/8/8/8 w - - 0 1'));
  const [status, setStatus] = useState('intro'); // intro | correct | wrong | complete
  const [oscarState, setOscarState] = useState('idle');
  const [oscarMsg, setOscarMsg] = useState('');
  const [hintLevel, setHintLevel] = useState(0);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [history, setHistory] = useState([]);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!lesson) return;
    setGame(new Chess(lesson.fen));
    setStatus('intro');
    setOscarState('talking');
    setOscarMsg(lesson.oscarIntro || 'आइए इस पोज़ीशन को solve करें!');
    setHintLevel(0);
    setAttempts(0);
    setHistory([]);
  }, [lesson]);

  if (!section || !lesson) {
    return <p>Lesson नहीं मिला। <Link to="/lessons">वापस जाएं</Link></p>;
  }

  const uci = (from, to) => `${from}${to}`;
  const solution = lesson.solution || [];

  function onDrop(source, target) {
    if (status === 'complete') return false;

    const gameCopy = new Chess(game.fen());
    let move;
    try {
      move = gameCopy.move({ from: source, to: target, promotion: 'q' });
    } catch {
      return false;
    }
    if (!move) return false;

    setGame(gameCopy);
    setHistory((h) => [...h, `${move.from}${move.to}`]);
    setSelectedSquare(null);

    // Check against solution
    const isCorrect = solution.some((s) => s === uci(source, target)) || solution.length === 0;

    if (isCorrect) {
      const gainXP = 20;
      const gainGems = 5;
      addXP(gainXP);
      addGems(gainGems);
      completeLesson(section.id, lesson.id);
      solvePuzzle(`${section.id}-${lesson.id}`);
      setStatus('correct');
      setOscarState('celebrating');
      setOscarMsg('Excellent move! 🎉 +20 XP और +5 💎 मिले!');
      setTimeout(() => setStatus('complete'), 1000);
    } else {
      setAttempts((a) => a + 1);
      loseHeart();
      setStatus('wrong');
      setOscarState('sad');
      setOscarMsg("Not quite. Let's try that again. देखें कि कौन सा piece सबसे अच्छा move दे सकता है।");
      setTimeout(() => {
        setGame(new Chess(lesson.fen));
        setStatus('intro');
      }, 1200);
    }
    return true;
  }

  function onSquareClick(square) {
    if (selectedSquare) {
      onDrop(selectedSquare, square);
      setSelectedSquare(null);
    } else {
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) setSelectedSquare(square);
    }
  }

  function showHint() {
    const next = Math.min(3, hintLevel + 1);
    setHintLevel(next);
    setOscarState('hint');
    const hintText =
      next === 1 ? lesson.hint1 :
      next === 2 ? lesson.hint2 :
      lesson.hint3;
    setOscarMsg(hintText || 'Hint not available');
  }

  function undoMove() {
    const g = new Chess(game.fen());
    g.undo();
    setGame(g);
    setHistory((h) => h.slice(0, -1));
    setStatus('intro');
  }

  function nextLesson() {
    const all = getAllLessons(section);
    const idx = all.findIndex((l) => l.id === lesson.id);
    if (idx < all.length - 1) {
      navigate(`/lessons/${section.id}/${all[idx + 1].id}`);
    } else {
      navigate('/lessons');
    }
  }

  // Legal move highlight
  const customSquareStyles = {};
  if (selectedSquare) {
    customSquareStyles[selectedSquare] = { background: 'rgba(88, 204, 2, 0.35)' };
    const moves = game.moves({ square: selectedSquare, verbose: true });
    moves.forEach((m) => {
      customSquareStyles[m.to] = {
        background: m.captured
          ? 'radial-gradient(circle, rgba(255,75,75,0.5) 40%, transparent 45%)'
          : 'radial-gradient(circle, rgba(88,204,2,0.5) 25%, transparent 30%)',
      };
    });
  }

  // Hint highlight
  if (hintLevel >= 1 && solution[0]) {
    const from = solution[0].slice(0, 2);
    customSquareStyles[from] = { ...(customSquareStyles[from] || {}), boxShadow: 'inset 0 0 0 4px #ffc800' };
  }
  if (hintLevel >= 2 && solution[0]) {
    const to = solution[0].slice(2, 4);
    customSquareStyles[to] = { ...(customSquareStyles[to] || {}), boxShadow: 'inset 0 0 0 4px #1cb0f6' };
  }

  return (
    <div className="puzzle-page">
      <div className="puzzle-topbar">
        <Link to="/lessons" className="back-link">← Lessons</Link>
        <span className="puzzle-section-name" style={{ color: section.color }}>
          {section.icon} {section.title}
        </span>
        <span className="puzzle-lesson-num">Lesson {lesson.id}</span>
      </div>

      <div className="puzzle-layout">
        <div className="puzzle-left">
          <Oscar
            state={oscarState}
            message={oscarMsg}
            autoSpeak={true}
          />

          <div className="puzzle-task card">
            <h3>🎯 कार्य</h3>
            <p>{lesson.task || 'सही चाल खोजें'}</p>
          </div>
        </div>

        <div className="puzzle-center">
          <div className="board-container">
            <Chessboard
              position={game.fen()}
              onPieceDrop={onDrop}
              onSquareClick={onSquareClick}
              boardWidth={460}
              customSquareStyles={customSquareStyles}
              customBoardStyle={{
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
              }}
              customDarkSquareStyle={{ backgroundColor: '#769656' }}
              customLightSquareStyle={{ backgroundColor: '#eeeed2' }}
              animationDuration={220}
            />
          </div>

          <div className="puzzle-controls">
            <button className="ctrl-btn" onClick={undoMove} disabled={status === 'complete'}>
              ↩️ Undo
            </button>
            <button className="ctrl-btn hint" onClick={showHint}>
              💡 Hint {hintLevel > 0 && `(${hintLevel}/3)`}
            </button>
            <button className="ctrl-btn" onClick={() => { setGame(new Chess(lesson.fen)); setStatus('intro'); setHintLevel(0); }}>
              🔄 Reset
            </button>
          </div>

          {status === 'correct' && (
            <div className="feedback-panel correct">
              <div className="feedback-icon">✅</div>
              <div>
                <div className="feedback-title">Correct!</div>
                <div className="feedback-sub">+20 XP • +5 💎</div>
              </div>
            </div>
          )}

          {status === 'wrong' && (
            <div className="feedback-panel wrong">
              <div className="feedback-icon">❌</div>
              <div>
                <div className="feedback-title">Oops, that's not correct</div>
                <div className="feedback-sub">फिर से कोशिश करें</div>
              </div>
            </div>
          )}

          {status === 'complete' && (
            <div className="complete-panel card">
              <div className="complete-emoji">🎉</div>
              <h3>Lesson Complete!</h3>
              <p>आपने puzzle सफलतापूर्वक solve किया।</p>
              <div className="complete-rewards">
                <div className="reward-chip">⭐ +20 XP</div>
                <div className="reward-chip">💎 +5</div>
                <div className="reward-chip">🔥 Streak +1</div>
              </div>
              <div className="complete-actions">
                <button className="btn-3d btn-gray" onClick={() => navigate('/lessons')}>
                  Lessons
                </button>
                <button className="btn-3d btn-green" onClick={nextLesson}>
                  Next Lesson →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
