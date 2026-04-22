import React, { useState } from 'react';
import { PlayCircle, Clock, Calendar, CheckCircle2, Video, List } from 'lucide-react';
import VimeoPlayer from '../components/VimeoPlayer';
import { WORKSHOPS } from '../constants/catalog';
import './Workshops.css';

const Workshops = () => {
  const [activeFilter, setActiveFilter] = useState('Todos');
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
    // Pequeno delay para garantir que o estado seja processado
    setTimeout(() => setSeekTo(null), 1000);
  };

  const heroWorkshop = WORKSHOPS && WORKSHOPS.length > 0 ? WORKSHOPS[0] : null;
  const gridWorkshops = WORKSHOPS && WORKSHOPS.length > 1 ? WORKSHOPS.slice(1) : [];

  if (!heroWorkshop) {
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
        
        {/* HERO WORKSHOP */}
        <section className="hero-workshop">
          <div className="hero-cover-wrapper">
             {playingVideoId === heroWorkshop.vimeoId ? (
                <VimeoPlayer 
                  videoId={heroWorkshop.vimeoId} 
                  title={heroWorkshop.title} 
                  seekTo={seekTo}
                />
             ) : (
                <div className="hero-poster">
                  <img src={heroWorkshop.cover} alt={heroWorkshop.title} className="hero-cover" />
                  <div className="hero-overlay"></div>
                  {heroWorkshop.isNew && (
                    <div className="badge-new">
                      <Video size={14} /> <span>NOVO ENCONTRO</span>
                    </div>
                  )}
                  <button className="btn-hero-play" onClick={() => setPlayingVideoId(heroWorkshop.vimeoId)}>
                      <PlayCircle size={64} strokeWidth={1.5} />
                  </button>
                </div>
             )}
          </div>
          
          <div className="hero-details">
            <div className="meta-info">
              <span className="info-pill"><Clock size={14} /> {heroWorkshop.duration}</span>
              <span className="info-pill highlight"><Calendar size={14} /> {heroWorkshop.date}</span>
            </div>
            
            <div className="title-area">
                <h2>{heroWorkshop.title}</h2>
                <span className="subtitle">{heroWorkshop.subtitle}</span>
            </div>
            
            <p className="description">{heroWorkshop.description}</p>
            
            <div className="timestamps-box glass-card">
              <div className="ts-header">
                  <List size={18} className="text-primary" />
                  <h4>Momentos Chave:</h4>
              </div>
              <div className="time-list">
                {heroWorkshop.timestamps.map((ts, idx) => (
                  <button 
                    key={idx} 
                    className="time-row" 
                    onClick={() => handleTimeJump(ts.seconds, heroWorkshop.vimeoId)}
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

        {/* LISTA SECUNDÁRIA */}
        <div className="section-divider">
          <h3>Biblioteca de Masterclasses</h3>
        </div>

        <section className="workshops-grid">
          {gridWorkshops.map(ws => (
            <div key={ws.id} className="ws-mini-card glass-card">
              <div className="ws-mini-thumb">
                <img src={ws.cover} alt={ws.title} />
                <button className="btn-mini-play" onClick={() => setPlayingVideoId(ws.vimeoId)}>
                  <Play size={16} fill="currentColor" />
                </button>
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
