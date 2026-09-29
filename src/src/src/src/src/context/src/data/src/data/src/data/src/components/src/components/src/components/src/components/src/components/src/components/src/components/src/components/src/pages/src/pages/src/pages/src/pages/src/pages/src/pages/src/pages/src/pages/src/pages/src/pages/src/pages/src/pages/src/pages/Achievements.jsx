import { useUser } from '../context/UserContext';
import { allAchievements } from '../data/achievements';
import './Achievements.css';

export default function Achievements() {
  const { user } = useUser();
  const unlocked = allAchievements.filter((a) => user.achievements.includes(a.id));
  const locked = allAchievements.filter((a) => !user.achievements.includes(a.id));

  return (
    <div className="achievements-page">
      <h1>🏅 Achievements</h1>
      <p className="subtitle">आपने {unlocked.length}/{allAchievements.length} unlock किए हैं</p>

      <h2 className="section-title">✨ Unlocked ({unlocked.length})</h2>
      <div className="ach-grid">
        {unlocked.length === 0 && <p className="empty">अभी कोई achievement unlock नहीं हुई। खेलना शुरू करें!</p>}
        {unlocked.map((a) => (
          <div key={a.id} className="ach-item card unlocked">
            <div className="ach-item-icon" style={{ background: a.color + '22', color: a.color }}>{a.icon}</div>
            <div>
              <div className="ach-item-title">{a.title}</div>
              <div className="ach-item-desc">{a.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="section-title">🔒 Locked ({locked.length})</h2>
      <div className="ach-grid">
        {locked.map((a) => (
          <div key={a.id} className="ach-item card locked">
            <div className="ach-item-icon" style={{ background: '#f0f0f0', color: '#aaa' }}>🔒</div>
            <div>
              <div className="ach-item-title">{a.title}</div>
              <div className="ach-item-desc">{a.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
