import React, { useState } from 'react';
import { PlayCircle, Clock, Calendar, CheckCircle2, Video, List, Play, X } from 'lucide-react';
import VimeoPlayer from '../components/VimeoPlayer';
import { WORKSHOPS } from '../constants/catalog';
import './Workshops.css';

const Workshops = () => {
  const [activeWorkshop, setActiveWorkshop] = useState(WORKSHOPS[0]);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [seekTo, setSeekTo] = useState(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimeJump = (seconds, videoId) => {
    if (playingVideoId !== videoId) {
      setPlayingVideoId(videoId);
    }
    setSeekTo(seconds);
    setTimeout(() => setSeekTo(null), 1000);
  };

  const handleSelectWorkshop = (ws) => {
    setActiveWorkshop(ws);
    setPlayingVideoId(ws.vimeoId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClosePlayer = () => {
    setPlayingVideoId(null);
  };

  if (!activeWorkshop) {
    return (
      <div className="dash-loading">
        <Video size={40} className="text-primary animate-pulse" />
        <p>Carregando biblioteca...</p>
      </div>
    );
  }

  return (
    <div className="page-container workshops-page">
      <header className="page-header custom-header">
        <h1>Gravações e Workshops</h1>
      </header>

      <div className="workshops-content">
        
        {/* SPOTLIGHT SECTION */}
        <section className="hero-workshop">
          <div className="hero-cover-wrapper">
             {playingVideoId === activeWorkshop.vimeoId ? (
                <>
                  <VimeoPlayer 
                    videoId={activeWorkshop.vimeoId} 
                    title={activeWorkshop.title} 
                    seekTo={seekTo}
                  />
                  <button className="btn-close-player" onClick={handleClosePlayer} title="Fechar Player">
                    <X size={20} />
                  </button>
                </>
             ) : (
                <div className="hero-poster">
                  <img src={activeWorkshop.cover} alt={activeWorkshop.title} className="hero-cover" />
                  <div className="hero-overlay"></div>
                  {activeWorkshop.isNew && (
                    <div className="badge-new">
                      <Video size={14} /> <span>NOVO ENCONTRO</span>
                    </div>
                  )}
                  <button className="btn-hero-play" onClick={() => setPlayingVideoId(activeWorkshop.vimeoId)}>
                      <PlayCircle size={64} strokeWidth={1.5} />
                  </button>
                </div>
             )}
          </div>
          
          <div className="hero-details">
            <div className="meta-info">
              <span className="info-pill"><Clock size={14} /> {activeWorkshop.duration}</span>
              <span className="info-pill highlight"><Calendar size={14} /> {activeWorkshop.date}</span>
            </div>
            
            <div className="title-area">
                <h2>{activeWorkshop.title}</h2>
                <span className="subtitle">{activeWorkshop.subtitle}</span>
            </div>
            
            <p className="description">{activeWorkshop.description}</p>
            
            <div className="timestamps-box glass-card">
              <div className="ts-header">
                  <List size={18} className="text-primary" />
                  <h4>Momentos Chave:</h4>
              </div>
              <div className="time-list">
                {activeWorkshop.timestamps.map((ts, idx) => (
                  <button 
                    key={idx} 
                    className="time-row" 
                    onClick={() => handleTimeJump(ts.seconds, activeWorkshop.vimeoId)}
                  >
                    <span className="ts-time">{formatTime(ts.seconds)}</span>
                    <span className="ts-divider">—</span>
                    <span className="ts-title">{ts.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* BIBLIOTECA DE MASTERCLASSES */}
        <div className="section-divider">
          <h3>Biblioteca de Masterclasses</h3>
        </div>

        <section className="workshops-grid">
          {WORKSHOPS.map(ws => (
            <div 
              key={ws.id} 
              className={`ws-mini-card glass-card ${activeWorkshop.id === ws.id ? 'active-ws' : ''}`}
              onClick={() => handleSelectWorkshop(ws)}
            >
              <div className="ws-mini-thumb">
                <img src={ws.cover} alt={ws.title} />
                <div className="mini-play-overlay">
                  <Play size={20} fill="currentColor" />
                </div>
              </div>
              <div className="ws-mini-info">
                <span className="ws-cat">{ws.category}</span>
                <h4>{ws.title}</h4>
                <p>{ws.duration}</p>
              </div>
            </div>
          ))}
        </section>

      </div>
    </div>
  );
}

export default Workshops;
