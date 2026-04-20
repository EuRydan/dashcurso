import React from 'react';
import { PlayCircle, Lock, Play } from 'lucide-react';
import { useAppContext } from '../components/AppContext';
import './Home.css';

const Home = () => {
  const { user } = useAppContext();
  const firstName = user?.name ? user.name.split(' ')[0] : 'Alex';
  
  // Mock data para fidelidade ao Figma (Sistema cru mas funcional)
  const continueWatching = [
    {
      id: 1,
      title: 'UI/UX Advanced',
      module: 'Module 4: Component Architecture',
      progress: 65,
      image: 'uiux-thumb'
    },
    {
      id: 2,
      title: 'Motion Design',
      module: 'Module 1: Easing Basics',
      progress: 20,
      image: 'motion-thumb'
    }
  ];

  const modules = [
    { title: 'Foundations', lessons: 5, locked: false },
    { title: 'Advanced Patterns', lessons: 8, locked: true },
    { title: 'Design Systems', lessons: 12, locked: true },
  ];

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Continue watching, {firstName}</h1>
      </header>

      <section className="bento-grid">
        {continueWatching.map(course => (
          <div key={course.id} className="bento-card glass-card">
            <div className="bento-card-header">
              <div className={`thumb-placeholder ${course.image}`} />
              <div className="bento-text">
                <h3>{course.title}</h3>
                <p>{course.module}</p>
                <span className="progress-tag">{course.progress}% Complete</span>
              </div>
            </div>
            <div className="bento-card-footer">
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${course.progress}%` }} />
              </div>
              <button className="btn-watch-bento">
                <Play size={14} fill="currentColor" />
                <span>Watch</span>
              </button>
            </div>
          </div>
        ))}
      </section>

      <section className="modules-section">
        <h2>All Modules</h2>
        <div className="modules-list">
          {modules.map((m, i) => (
            <div key={i} className={`module-item glass-card ${m.locked ? 'locked' : ''}`}>
              <div className="module-left">
                <div className="module-icon">
                   {m.locked ? <Lock size={20} /> : <PlayCircle size={20} className="text-primary" />}
                </div>
                <div className="module-info">
                  <h4>{m.title}</h4>
                  <p>{m.lessons} lessons</p>
                </div>
              </div>
              {!m.locked && <button className="btn-module-action">Play</button>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
