import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import './Header.css';

export default function Header() {
  const { user } = useUser();
  const { pathname } = useLocation();

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          <span className="logo-icon">♟️</span>
          <span className="logo-text">ChessQuest</span>
        </Link>

        <nav className="nav">
          <Link className={pathname === '/' ? 'active' : ''} to="/">🏠 Learn</Link>
          <Link className={pathname.startsWith('/lessons') ? 'active' : ''} to="/lessons">📚 Lessons</Link>
          <Link className={pathname === '/play' ? 'active' : ''} to="/play">⚔️ Play</Link>
          <Link className={pathname === '/leaderboard' ? 'active' : ''} to="/leaderboard">🏆 League</Link>
        </nav>

        <div className="header-stats">
          <div className="stat">
            <span className="stat-icon">🔥</span>
            <span className="stat-value">{user.streak}</span>
          </div>
          <div className="stat">
            <span className="stat-icon">⭐</span>
            <span className="stat-value">{user.xp}</span>
          </div>
          <div className="stat">
            <span className="stat-icon">💎</span>
            <span className="stat-value">{user.gems}</span>
          </div>
          <div className="stat hearts">
            <span className="stat-icon">❤️</span>
            <span className="stat-value">{user.hearts}</span>
          </div>
          <Link to="/profile" className="profile-btn">
            {user.avatar}
          </Link>
        </div>
      </div>
    </header>
  );
}
