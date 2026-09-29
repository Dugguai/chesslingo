import { useUser } from '../context/UserContext';
import './Hearts.css';

export default function Hearts({ onRefill }) {
  const { user } = useUser();

  return (
    <div className="hearts-widget card">
      <div className="hearts-header">
        <span className="hearts-title">❤️ Hearts</span>
        <span className="hearts-count">{user.hearts} / {user.maxHearts}</span>
      </div>
      <div className="hearts-row">
        {Array.from({ length: user.maxHearts }).map((_, i) => (
          <span key={i} className={`heart ${i < user.hearts ? 'full' : 'empty'}`}>
            {i < user.hearts ? '❤️' : '🤍'}
          </span>
        ))}
      </div>
      {user.hearts < user.maxHearts ? (
        <button className="btn-3d btn-orange refill-btn" onClick={onRefill}>
          💎 50 — Refill Hearts
        </button>
      ) : (
        <div className="hearts-note">सभी hearts full हैं ✨</div>
      )}
    </div>
  );
}
