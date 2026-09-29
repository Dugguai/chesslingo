import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { sections, getAllLessons } from '../data/lessons';
import './Lessons.css';

export default function Lessons() {
  const { user } = useUser();

  return (
    <div className="lessons-page">
      <div className="lessons-header">
        <h1>📚 लेसन पाथ</h1>
        <p className="subtitle">एक-एक पहेली हल करें और आगे बढ़ें</p>
      </div>

      {sections.map((section) => {
        const lessons = getAllLessons(section);
        const completedInSection = lessons.filter((l) =>
          user.completedLessons.includes(`${section.id}-${l.id}`)
        ).length;

        return (
          <div key={section.id} className="section-block">
            <div className="section-header" style={{ background: section.color }}>
              <div className="section-icon-wrap">{section.icon}</div>
              <div className="section-info">
                <h2>{section.title}</h2>
                <p>{section.subtitle} • {completedInSection}/{lessons.length} पूर्ण</p>
              </div>
              <div className="section-progress">
                <div className="section-progress-fill" style={{ width: `${(completedInSection / lessons.length) * 100}%` }} />
              </div>
            </div>

            <div className="lessons-grid">
              {lessons.slice(0, 30).map((lesson, idx) => {
                const key = `${section.id}-${lesson.id}`;
                const done = user.completedLessons.includes(key);
                const prevKey = idx > 0 ? `${section.id}-${lessons[idx - 1].id}` : null;
                const locked = idx > 0 && !user.completedLessons.includes(prevKey);

                if (locked) {
                  return (
                    <div key={lesson.id} className="lesson-node locked">
                      <div className="lesson-number">🔒</div>
                      <div className="lesson-title">{lesson.title}</div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={lesson.id}
                    to={`/lessons/${section.id}/${lesson.id}`}
                    className={`lesson-node ${done ? 'done' : ''}`}
                    style={{ borderColor: section.color }}
                  >
                    <div className="lesson-number" style={{ background: done ? section.color : section.color + '33', color: done ? 'white' : section.color }}>
                      {done ? '✓' : lesson.id}
                    </div>
                    <div className="lesson-title">{lesson.title}</div>
                  </Link>
                );
              })}
            </div>
            {lessons.length > 30 && (
              <p className="more-note">...और {lessons.length - 30} lessons unlock होने वाले हैं</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
