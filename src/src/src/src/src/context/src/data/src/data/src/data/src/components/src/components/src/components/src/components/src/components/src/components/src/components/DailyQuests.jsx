import { dailyQuests, monthlyChallenge } from '../data/quests';
import { useUser } from '../context/UserContext';
import './DailyQuests.css';

export default function DailyQuests() {
  const { user } = useUser();

  return (
    <div className="daily-quests card">
      <div className="quests-header">
        <h3>🎯 Daily Quests</h3>
        <span className="quests-reset">Reset in 8h</span>
      </div>

      {dailyQuests.map((q) => {
        const progress = user.questsToday[q.id]?.progress ?? 0;
        const pct = Math.min(100, (progress / q.target) * 100);
        const done = progress >= q.target;

        return (
          <div className={`quest-item ${done ? 'done' : ''}`} key={q.id}>
            <div className="quest-icon" style={{ background: q.color + '22', color: q.color }}>
              {q.icon}
            </div>
            <div className="quest-info">
              <div className="quest-label">{q.label}</div>
              <div className="quest-progress-bar">
                <div className="quest-progress-fill" style={{ width: `${pct}%`, background: q.color }} />
              </div>
            </div>
            <div className="quest-reward">
              {done ? '✅' : `+${q.reward}💎`}
            </div>
          </div>
        );
      })}

      <div className="monthly-challenge">
        <div className="monthly-header">
          <span className="monthly-badge">🏅</span>
          <span className="monthly-title">{monthlyChallenge.title}</span>
        </div>
        <p className="monthly-desc">{monthlyChallenge.description}</p>
        <div className="quest-progress-bar">
          <div
            className="quest-progress-fill"
            style={{ width: `${Math.min(100, (user.solvedPuzzles / monthlyChallenge.target) * 100)}%`, background: monthlyChallenge.color }}
          />
        </div>
        <div className="monthly-foot">
          {user.solvedPuzzles} / {monthlyChallenge.target} • 🎁 {monthlyChallenge.reward}
        </div>
      </div>
    </div>
  );
}
