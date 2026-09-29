export const allAchievements = [
  { id: 'first_checkmate', icon: '🏆', title: 'First Checkmate', desc: 'पहली बार चेकमेट करें', color: '#ffc800' },
  { id: 'puzzle_10', icon: '♟️', title: 'Puzzle Starter', desc: '10 पहेलियाँ हल करें', color: '#58cc02' },
  { id: 'puzzle_50', icon: '🧩', title: 'Puzzle Master', desc: '50 पहेलियाँ हल करें', color: '#1cb0f6' },
  { id: 'streak_7', icon: '🔥', title: '7 Day Warrior', desc: '7 दिन लगातार प्रैक्टिस', color: '#ff9600' },
  { id: 'streak_30', icon: '🌟', title: 'Monthly Master', desc: '30 दिन लगातार प्रैक्टिस', color: '#ce82ff' },
  { id: 'xp_1000', icon: '⭐', title: 'XP Collector', desc: '1000 XP कमाएं', color: '#ffc800' },
  { id: 'beat_oscar', icon: '👑', title: 'Beat Oscar', desc: 'Oscar को हराएं', color: '#ff4b4b' },
  { id: 'perfect_lesson', icon: '🎯', title: 'Perfect Lesson', desc: 'बिना गलती lesson पूरा करें', color: '#58cc02' },
];

export const leagueTiers = [
  { id: 'bronze', label: 'Bronze', color: '#a97142', icon: '🥉' },
  { id: 'silver', label: 'Silver', color: '#999', icon: '🥈' },
  { id: 'gold', label: 'Gold', color: '#ffc800', icon: '🥇' },
  { id: 'platinum', label: 'Platinum', color: '#1cb0f6', icon: '💎' },
  { id: 'diamond', label: 'Diamond', color: '#58cc02', icon: '💠' },
  { id: 'master', label: 'Master', color: '#ce82ff', icon: '👑' },
];

export function getLeagueForElo(elo) {
  if (elo < 500) return leagueTiers[0];
  if (elo < 700) return leagueTiers[1];
  if (elo < 900) return leagueTiers[2];
  if (elo < 1100) return leagueTiers[3];
  if (elo < 1400) return leagueTiers[4];
  return leagueTiers[5];
}

export const fakeLeaderboard = [
  { rank: 1, name: 'MagnusJr', avatar: '👑', xp: 2450 },
  { rank: 2, name: 'Aditya', avatar: '👨‍🎓', xp: 1450 },
  { rank: 3, name: 'Priya', avatar: '👩‍🎤', xp: 1390 },
  { rank: 4, name: 'Rahul', avatar: '🧑‍💻', xp: 1100 },
  { rank: 5, name: 'You', avatar: '🧑', xp: 0, isYou: true },
  { rank: 6, name: 'Kiran', avatar: '👨‍🚀', xp: 980 },
  { rank: 7, name: 'Sneha', avatar: '👩‍🔬', xp: 850 },
];
