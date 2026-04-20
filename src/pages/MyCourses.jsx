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


  return (
    <div className="page-container course-page">
      <header className="page-header text-glow">
        <h1>Meus Cursos</h1>
        <p className="page-subtitle">Gerencie seu progresso e acesso aos materiais exclusivos.</p>
      </header>

      <div className="content-grid-empty-aligned">
        <div className="empty-state-card glass">
           <div className="empty-icon-box">
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
