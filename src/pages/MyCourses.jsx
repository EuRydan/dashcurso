import React, { useState, useRef, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import './MyCourses.css';

const MyCourses = () => {
  const [progress, setProgress] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const videoRef = useRef(null);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      if (total > 0) {
        const percent = (current / total) * 100;
        setProgress(Math.floor(percent));
        
        if (percent >= 70 && !unlocked) {
          setUnlocked(true);
          // Here we would typically update global state / API to unlock the certificate
        }
      }
    }
  };

  // Mock playlist data
  const playlist = [
    { title: '1. Introduction to Tokens', time: '8:45', status: 'Completed' },
    { title: '2. Color Psychology', time: '15:20', status: 'Completed' },
    { title: '3. Typography Hierarchy', time: '11:10', status: 'Completed' },
    { title: '4. Design Systems', time: '14:10', status: 'Playing' },
    { title: '5. Advanced Components', time: '22:00', status: 'Locked' },
  ];

  return (
    <div className="page-container course-page">
      <div className="page-header" style={{ marginBottom: '32px' }}>
        <h1 style={{ color: 'var(--color-text-main)', fontSize: '32px', marginBottom: '8px' }}>Meus Cursos</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>Gerencie seu progresso e acesso aos materiais.</p>
      </div>

      <div className="content-grid-empty" style={{ gridTemplateColumns: '1fr' }}>
        <div className="empty-state-card glass">
           <div className="empty-icon-box" style={{ backgroundColor: 'transparent', border: '1px dashed var(--color-border)' }}>
             <BookOpen size={32} strokeWidth={1.5} color="var(--color-text-secondary)" />
           </div>
           <h2>Nenhuma matrícula ativa</h2>
           <p>Você não possui acesso a nenhum curso no momento. Quando você adquirir ou iniciar um módulo, ele aparecerá aqui com seu respectivo progresso.</p>
           <div className="empty-actions">
              <button className="btn-empty-primary" onClick={() => window.location.href='/workshops'}>
                Assistir Workshops
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
