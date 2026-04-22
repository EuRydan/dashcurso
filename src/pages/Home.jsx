import React from 'react';
import { PlayCircle, Lock, Play } from 'lucide-react';
import { useAppContext } from '../components/AppContext';
import './Home.css';

const Home = () => {
  const { user } = useAppContext();
  const firstName = user?.nickname || 'Usuário';
  
  // Sistema cru: sem dados iniciais
  const continueWatching = [];
  const modules = [];

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Bem-vindo, {firstName}</h1>

        <div className="notice-banner glass-card">
          <div className="notice-left">
            <div className="notice-icon">🎬</div>
            <div className="notice-text">
              <span className="notice-badge">NOVO</span>
              <p>Gravação disponível: <strong>Real Talk #1 com Filipe Canto</strong> sobre mercado e carreira.</p>
            </div>
          </div>
          <button className="btn-notice" onClick={() => window.location.href = '/courses'}>
            Assistir agora
          </button>
        </div>
      </header>

      {continueWatching.length > 0 ? (
        <section className="bento-grid">
          {continueWatching.map(course => (
            <div key={course.id} className="bento-card glass-card">
              <div className="bento-card-header">
                <div className={`thumb-placeholder ${course.image}`} />
                <div className="bento-text">
                  <h3>{course.title}</h3>
                  <p>{course.module}</p>
                  <span className="progress-tag">{course.progress}% concluído</span>
                </div>
              </div>
              <div className="bento-card-footer">
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${course.progress}%` }} />
                </div>
                <button className="btn-watch-bento">
                  <Play size={14} fill="currentColor" />
                  <span>Assistir</span>
                </button>
              </div>
            </div>
          ))}
        </section>
      ) : (
        <div className="empty-state-clean">
          <div className="empty-icon-clean">
            <Play size={32} strokeWidth={1.5} />
          </div>
          <h4>Nenhuma atividade recente</h4>
          <p>Você ainda não iniciou nenhum curso. Explore o catálogo e comece sua jornada hoje mesmo!</p>
        </div>
      )}

      <section className="modules-section">
        <h2>Todos os Módulos</h2>
        <div className="modules-list">
          {modules.length > 0 ? (
            modules.map((m, i) => (
              <div key={i} className={`module-item glass-card ${m.locked ? 'locked' : ''}`}>
                <div className="module-left">
                  <div className="module-icon">
                    {m.locked ? <Lock size={20} /> : <PlayCircle size={20} className="text-primary" />}
                  </div>
                  <div className="module-info">
                    <h4>{m.title}</h4>
                    <p>{m.lessons} aulas</p>
                  </div>
                </div>
                {!m.locked && <button className="btn-module-action">Play</button>}
              </div>
            ))
          ) : (
            <p className="text-secondary" style={{ fontSize: '14px' }}>Nenhum módulo disponível.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
