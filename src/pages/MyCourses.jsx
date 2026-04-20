import React, { useState, useRef, useEffect } from 'react';
import { Play, Lock } from 'lucide-react';
import './MyCourses.css';

const MyCourses = () => {
  const [activeLesson, setActiveLesson] = useState(0);

  const playlist = [
    { title: 'Intro to Design Systems', duration: '12:45', completed: true },
    { title: 'Foundations of Color', duration: '18:20', completed: true },
    { title: 'Advanced Pattern Library', duration: '24:15', playing: true },
    { title: 'Responsive Grids', duration: '15:10', locked: true },
  ];

  return (
    <div className="course-page">
      <section className="video-hero">
        <div className="video-container">
          <div className="video-placeholder">
             {/* Simulação de Player de Vídeo */}
             <Play size={64} className="text-primary" fill="currentColor" />
          </div>
        </div>
      </section>

      <div className="course-layout">
        <div className="course-main">
          <header className="lesson-info">
            <span className="module-tag">FOUNDATIONS MODULE</span>
            <h1>Principles of Design Systems</h1>
            <p className="lesson-meta">Lesson 4 of 12 • 45 minutes</p>
          </header>

          <div className="lesson-card glass-card">
            <div className="card-header">
              <h3>In Progress</h3>
              <span className="text-primary">65% Completed</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: '65%' }} />
            </div>
            <p className="card-desc">
              In this session, we dive deep into the atomic principles that govern professional design systems.
            </p>
            <div className="card-actions">
              <button className="btn-secondary">Previous Lesson</button>
              <button className="btn-primary">Next Lesson</button>
            </div>
          </div>
        </div>

        <aside className="course-sidebar">
          <h3>Module Playlist</h3>
          <div className="playlist-list">
            {playlist.map((item, i) => (
              <div key={i} className={`playlist-item glass-card ${item.playing ? 'playing' : ''} ${item.locked ? 'locked' : ''}`}>
                <div className="item-status">
                  {item.locked ? <Lock size={16} /> : (item.completed ? <div className="dot-done" /> : <div className="dot-progress" />)}
                </div>
                <div className="item-info">
                  <h4>{item.title}</h4>
                  <span>{item.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default MyCourses;
