import { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();

const DEFAULT = {
  name: 'Player',
  avatar: '🧑',
  xp: 0,
  gems: 120,
  hearts: 5,
  maxHearts: 5,
  streak: 12,
  lastPractice: null,
  elo: 548,
  highestElo: 548,
  completedLessons: [],
  solvedPuzzles: [],
  achievements: ['first_checkmate'],
  questsToday: {
    earnXP: { target: 50, progress: 0 },
    solvePuzzles: { target: 5, progress: 0 },
    playMatch: { target: 1, progress: 0 },
  },
  gamesPlayed: 142,
  gamesWon: 86,
  gamesLost: 56,
  puzzlesSolved: 387,
  accuracy: 84,
  checkmates: 74,
  boardTheme: 'classic',
  pieceTheme: '3d-classic',
  oscarOutfit: 'default',
  friends: [
    { id: 1, name: 'Aditya', avatar: '👨‍🎓', xp: 1450, streak: 22 },
    { id: 2, name: 'Priya', avatar: '👩‍🎤', xp: 1390, streak: 15 },
    { id: 3, name: 'Rahul', avatar: '🧑‍💻', xp: 1100, streak: 8 },
  ],
};

function loadState() {
  try {
    const saved = localStorage.getItem('chessquest-user');
    if (saved) return { ...DEFAULT, ...JSON.parse(saved) };
  } catch {}
  return DEFAULT;
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(loadState);

  useEffect(() => {
    localStorage.setItem('chessquest-user', JSON.stringify(user));
  }, [user]);

  const addXP = (amount) =>
    setUser((u) => ({
      ...u,
      xp: u.xp + amount,
      questsToday: {
        ...u.questsToday,
        earnXP: {
          ...u.questsToday.earnXP,
          progress: Math.min(u.questsToday.earnXP.target, u.questsToday.earnXP.progress + amount),
        },
      },
    }));

  const addGems = (n) => setUser((u) => ({ ...u, gems: u.gems + n }));

  const loseHeart = () =>
    setUser((u) => ({ ...u, hearts: Math.max(0, u.hearts - 1) }));

  const refillHearts = () =>
    setUser((u) => ({ ...u, hearts: u.maxHearts, gems: Math.max(0, u.gems - 50) }));

  const completeLesson = (sectionId, lessonId) =>
    setUser((u) => {
      const key = `${sectionId}-${lessonId}`;
      if (u.completedLessons.includes(key)) return u;
      return { ...u, completedLessons: [...u.completedLessons, key] };
    });

  const solvePuzzle = (puzzleId) =>
    setUser((u) => {
      const already = u.solvedPuzzles.includes(puzzleId);
      return {
        ...u,
        solvedPuzzles: already ? u.solvedPuzzles : [...u.solvedPuzzles, puzzleId],
        puzzlesSolved: already ? u.puzzlesSolved : u.puzzlesSolved + 1,
        questsToday: {
          ...u.questsToday,
          solvePuzzles: {
            ...u.questsToday.solvePuzzles,
            progress: Math.min(u.questsToday.solvePuzzles.target, u.questsToday.solvePuzzles.progress + 1),
          },
        },
      };
    });

  const recordMatch = (won, eloDelta) =>
    setUser((u) => ({
      ...u,
      gamesPlayed: u.gamesPlayed + 1,
      gamesWon: won ? u.gamesWon + 1 : u.gamesWon,
      gamesLost: won ? u.gamesLost : u.gamesLost + 1,
      elo: Math.max(100, u.elo + eloDelta),
      highestElo: Math.max(u.highestElo, u.elo + eloDelta),
      questsToday: {
        ...u.questsToday,
        playMatch: {
          ...u.questsToday.playMatch,
          progress: Math.min(u.questsToday.playMatch.target, u.questsToday.playMatch.progress + 1),
        },
      },
    }));

  const unlockAchievement = (id) =>
    setUser((u) => ({
      ...u,
      achievements: u.achievements.includes(id) ? u.achievements : [...u.achievements, id],
    }));

  const resetProgress = () => setUser({ ...DEFAULT, xp: 0, completedLessons: [], solvedPuzzles: [] });

  return (
    <UserContext.Provider
      value={{
        user,
        addXP,
        addGems,
        loseHeart,
        refillHearts,
        completeLesson,
        solvePuzzle,
        recordMatch,
        unlockAchievement,
        resetProgress,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
