import { useUser } from '../context/UserContext';
import { getLeagueForElo, fakeLeaderboard, leagueTiers } from '../data/achievements';
import './Leaderboard.css';

export default function Leaderboard() {
  const { user } = useUser();
  const league = getLeagueForElo(user.elo);

  const board = fakeLeaderboard
    .map((row) => (row.isYou ? { ...row, xp: user.xp, avatar: user.avatar } : row))
    .sort((a, b) => b.xp - a.xp)
    .map((row, i) => ({ ...row, rank: i + 1 }));

  return (
    <div className="leaderboard-page">
      <div className="league-hero card" style={{ background: league.color + '15', borderColor: league.color }}>
        <div className="league-icon" style={{ background: league.color }}>{league.icon}</div>
        <div>
          <h1>{league.label} League</h1>
          <p>आपकी current league • {user.elo} Elo</p>
        </div>
      </div>

      <h2 className="section-title">🏆 Weekly Leaderboard</h2>

      <div className="leaderboard-list card">
        {board.map((row) => (
          <div key={row.rank} className={`lb-row ${row.isYou ? 'you' : ''}`}>
            <div className="lb-rank">#{row.rank}</div>
            <div className="lb-avatar">{row.avatar}</div>
            <div className="lb-name">{row.name}</div>
            <div className="lb-xp">{row.xp} XP</div>
          </div>
        ))}
      </div>

      <h2 className="section-title">🎖️ League Tiers</h2>
      <div className="tiers-grid">
        {leagueTiers.map((t) => (
          <div key={t.id} className={`tier-card card ${t.id === league.id ? 'current' : ''}`}>
            <div className="tier-icon" style={{ background: t.color + '22', color: t.color }}>{t.icon}</div>
            <div className="tier-label">{t.label}</div>
            {t.id === league.id && <div className="tier-current">Current</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
