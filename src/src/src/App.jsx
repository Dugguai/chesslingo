import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Lessons from './pages/Lessons';
import Puzzle from './pages/Puzzle';
import Play from './pages/Play';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import Achievements from './pages/Achievements';
import './App.css';

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/lessons/:sectionId/:lessonId" element={<Puzzle />} />
          <Route path="/play" element={<Play />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/achievements" element={<Achievements />} />
        </Routes>
      </main>
    </div>
  );
}
