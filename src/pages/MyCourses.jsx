import React, { useState, useRef, useEffect } from 'react';
import { Play, Lock, BookOpen } from 'lucide-react';
import './MyCourses.css';

const MyCourses = () => {
  const [activeLesson, setActiveLesson] = useState(0);

  const playlist = [];

  return (
    <div className="course-page">
      <section className="video-hero">
        <div className="video-container">
          <div className="video-placeholder">
             {/* Simulação de Player de Vídeo Vazio */}
             <Play size={64} className="text-secondary" opacity={0.3} />
             <p className="text-secondary" style={{ marginTop: '16px' }}>Selecione uma aula para começar</p>
          </div>
        </div>
      </section>

      <div className="course-layout">
        <div className="course-main">
          {playlist.length > 0 ? (
            <>
              <header className="lesson-info">
                <span className="module-tag">MÓDULO ATUAL</span>
                <h1>Título da Aula</h1>
                <p className="lesson-meta">Aula 0 de 0 • 0 minutos</p>
              </header>

              <div className="lesson-card glass-card">
                <div className="card-header">
                  <h3>Em Progresso</h3>
                  <span className="text-primary">0% concluído</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: '0%' }} />
                </div>
                <p className="card-desc">
                  Selecione um curso no catálogo para ver o conteúdo detalhado aqui.
                </p>
                <div className="card-actions">
                  <button className="btn-secondary">Aula Anterior</button>
                  <button className="btn-primary">Próxima Aula</button>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state-clean" style={{ textAlign: 'center' }}>
              <div className="empty-icon-clean">
                <BookOpen size={32} strokeWidth={1.5} />
              </div>
              <h4>Nenhuma aula ativa</h4>
              <p>O conteúdo das aulas aparecerá aqui assim que você iniciar um curso em sua trilha.</p>
            </div>
          )}
        </div>

        <aside className="course-sidebar">
          <h3>Playlist do Módulo</h3>
          <div className="playlist-list">
            {playlist.length > 0 ? (
              playlist.map((item, i) => (
                <div key={i} className={`playlist-item glass-card ${item.playing ? 'playing' : ''} ${item.locked ? 'locked' : ''}`}>
                  <div className="item-status">
                    {item.locked ? <Lock size={16} /> : (item.completed ? <div className="dot-done" /> : <div className="dot-progress" />)}
                  </div>
                  <div className="item-info">
                    <h4>{item.title}</h4>
                    <span>{item.duration}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-secondary" style={{ fontSize: '14px', marginTop: '12px' }}>Lista vazia.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default MyCourses;
