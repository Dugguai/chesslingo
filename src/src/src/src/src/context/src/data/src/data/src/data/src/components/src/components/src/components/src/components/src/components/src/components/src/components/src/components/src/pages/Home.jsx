import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useSpeech } from '../hooks/useSpeech';
import { useEffect, useState } from 'react';
import Oscar from '../components/Oscar';
import DailyQuests from '../components/DailyQuests';
import Hearts from '../components/Hearts';
import { sections, getAllLessons } from '../data/lessons';
import { getLeagueForElo } from '../data/achievements';
import './Home.css';

export default function Home() {
  const { user, refillHearts } = useUser();
  const league = getLeagueForElo(user.elo);
  const [oscarMsg, setOscarMsg] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    const greeting =
      hour < 12 ? 'Good morning' :
      hour < 17 ? 'Good afternoon' :
      'Good evening';
    setOscarMsg(`${greeting}! Ready to train your chess mind today?`);
  }, []);

  // पहला अधूरा lesson ढूंढें
  const continueTarget = (() => {
    for (const section of sections) {
      const lessons = getAllLessons(section);
      for (const lesson of lessons) {
        const key = `${section.id}-${lesson.id}`;
        if (!user.completedLessons.includes(key)) {
          return { section, lesson };
        }
      }
    }
    return null;
  })();

  return (
    <div className="home">
      <div className="home-grid">
        <div className="home-left">
          <div className="welcome-card card">
            <Oscar state="idle" message={oscarMsg} />
            <div className="welcome-text">
              <h2>नमस्ते, {user.name}! 👋</h2>
              <p>आज एक और दिन है chess में महारत हासिल करने का।</p>
            </div>
          </div>

          <div className="continue-card card">
            <div className="continue-left">
              <div className="continue-label">आगे बढ़ें</div>
              <h3>{continueTarget ? continueTarget.lesson.title : 'सभी lessons पूरे!'}</h3>
              <p className="continue-sub">
                {continueTarget
                  ? `${continueTarget.section.title} • Lesson ${continueTarget.lesson.id}`
                  : 'बहुत बढ़िया! अब आप play करें।'}
              </p>
            </div>
            <Link
              to={continueTarget ? `/lessons/${continueTarget.section.id}/${continueTarget.lesson.id}` : '/play'}
              className="btn-3d btn-green continue-btn"
            >
              {continueTarget ? '▶ START' : '⚔️ PLAY'}
            </Link>
          </div>

          <div className="stats-row">
            <div className="mini-card card">
              <div className="mini-icon" style={{ background: '#fff7d9' }}>🔥</div>
              <div className="mini-value">{user.streak}</div>
              <div className="mini-label">Day Streak</div>
            </div>
            <div className="mini-card card">
              <div className="mini-icon" style={{ background: '#fff0d9' }}>⭐</div>
              <div className="mini-value">{user.xp}</div>
              <div className="mini-label">Total XP</div>
            </div>
            <div className="mini-card card">
              <div className="mini-icon" style={{ background: league.color + '22' }}>
                {league.icon}
              </div>
              <div className="mini-value">{user.elo}</div>
              <div className="mini-label">{league.label}</div>
            </div>
            <div className="mini-card card">
              <div className="mini-icon" style={{ background: '#e0f5ff' }}>🧩</div>
              <div className="mini-value">{user.puzzlesSolved}</div>
              <div className="mini-label">Puzzles</div>
            </div>
          </div>

          <Hearts onRefill={refillHearts} />
        </div>

        <div className="home-right">
          <DailyQuests />
        </div>
      </div>
    </div>
  );
}
