import { useUser } from '../context/UserContext';
import { getLeagueForElo, allAchievements } from '../data/achievements';
import './Profile.css';

export default function Profile() {
  const { user } = useUser();
  const league = getLeagueForElo(user.elo);
  const winRate = user.gamesPlayed ? Math.round((user.gamesWon / user.gamesPlayed) * 100) : 0;

  return (
    <div className="profile-page">
      <div className="profile-header card">
        <div className="profile-avatar">{user.avatar}</div>
        <div className="profile-info">
          <h1>{user.name}</h1>
          <div className="profile-badges">
            <span className="badge" style={{ background: league.color + '22', color: league.color }}>
              {league.icon} {league.label}
            </span>
            <span className="badge" style={{ background: '#fff7d9', color: '#b48500' }}>
              🔥 {user.streak} day streak
            </span>
          </div>
        </div>
        <div className="profile-xp">
          <div className="profile-xp-value">⭐ {user.xp}</div>
          <div className="profile-xp-label">Total XP</div>
        </div>
      </div>

      <h2 className="section-title">📊 आपके आंकड़े</h2>
      <div className="stats-grid">
        <div className="stat-card card">
          <div className="stat-card-value">{user.gamesPlayed}</div>
          <div className="stat-card-label">Games Played</div>
        </div>
        <div className="stat-card card">
          <div className="stat-card-value" style={{ color: 'var(--green)' }}>{user.gamesWon}</div>
          <div className="stat-card-label">Wins</div>
        </div>
        <div className="stat-card card">
          <div className="stat-card-value" style={{ color: 'var(--red)' }}>{user.gamesLost}</div>
          <div className="stat-card-label">Losses</div>
        </div>
        <div className="stat-card card">
          <div className="stat-card-value">{winRate}%</div>
          <div className="stat-card-label">Win Rate</div>
        </div>
        <div className="stat-card card">
          <div className="stat-card-value">{user.elo}</div>
          <div className="stat-card-label">Current Elo</div>
        </div>
        <div className="stat-card card">
          <div className="stat-card-value">{user.highestElo}</div>
          <div className="stat-card-label">Highest Elo</div>
        </div>
        <div className="stat-card card">
          <div className="stat-card-value">{user.puzzlesSolved}</div>
          <div className="stat-card-label">Puzzles Solved</div>
        </div>
        <div className="stat-card card">
          <div className="stat-card-value">{user.checkmates}</div>
          <div className="stat-card-label">Checkmates</div>
        </div>
      </div>

      <h2 className="section-title">🏅 Achievements</h2>
      <div className="achievements-grid">
        {allAchievements.map((a) => {
          const unlocked = user.achievements.includes(a.id);
          return (
            <div key={a.id} className={`ach-card card ${unlocked ? 'unlocked' : 'locked'}`}>
              <div className="ach-icon" style={{ background: unlocked ? a.color + '22' : '#f0f0f0' }}>
                {unlocked ? a.icon : '🔒'}
              </div>
              <div className="ach-info">
                <div className="ach-title">{a.title}</div>
                <div className="ach-desc">{a.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
