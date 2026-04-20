import React, { useState } from 'react';
import { PlayCircle, Clock, Calendar, CheckCircle2, Video } from 'lucide-react';
import VimeoPlayer from '../components/VimeoPlayer';
import './Workshops.css';

const MOCK_WORKSHOPS = [
  {
    id: 1,
    title: "Estratégias de Growth em 2026",
    description: "Desvende como os algoritmos operam atualmente e aplique os funis validados para crescer 10x mais rápido neste trimestre.",
    duration: "1h 45min",
    date: "Aconteceu HOJE",
    category: "Liderança",
    isNew: true,
    vimeoId: "76979871",
    cover: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
    timestamps: [
      { time: "05:00", label: "Abertura do Evento" },
      { time: "22:15", label: "Desconstruindo Funis" },
      { time: "1:15:30", label: "Q&A com Participantes" }
    ]
  },
  {
    id: 2,
    title: "Masterclass de Prototipagem",
    description: "Dominando variáveis complexas e advanced components no Figma para entregar protótipos ultra-realistas.",
    duration: "2h 10min",
    date: "25 MAR",
    category: "UI/UX",
    isNew: false,
    vimeoId: "267475148",
    cover: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=800&auto=format&fit=crop",
    timestamps: [
      { time: "02:20", label: "Configuração do Documento" },
      { time: "15:45", label: "Trabalhando com Variáveis" },
      { time: "55:10", label: "Maturidade em Design System" }
    ]
  },
  {
    id: 3,
    title: "Entrando em Deep Work",
    description: "Como hackear seu fluxo de trabalho e atingir a concentração absoluta no home-office moderno.",
    duration: "1h 05min",
    date: "12 PEV",
    category: "Produtividade",
    isNew: false,
    vimeoId: "824804225",
    cover: "https://images.unsplash.com/photo-1593642532744-d377ab507dc8?q=80&w=800&auto=format&fit=crop",
    timestamps: [
      { time: "00:00", label: "O que é Deep Work" },
      { time: "30:00", label: "Regras do Bloqueio de Timpo" }
    ]
  }
];

  const [activeFilter, setActiveFilter] = useState('Todos');
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [seekTo, setSeekTo] = useState(null);

  const handleTimeJump = (time, videoId) => {
    if (playingVideoId !== videoId) {
      setPlayingVideoId(videoId);
    }
    setSeekTo(time);
    // Reset seekTo after a bit to allow re-clicking same timestamp
    setTimeout(() => setSeekTo(null), 500);
  };

  const heroWorkshop = MOCK_WORKSHOPS[0];
  const gridWorkshops = MOCK_WORKSHOPS.slice(1);

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
               <>
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
               </>
             )}
          </div>
          
          <div className="hero-details">
            <div className="meta-info">
              <span className="info-pill"><Clock size={14} /> {heroWorkshop.duration}</span>
              <span className="info-pill highlight"><Calendar size={14} /> {heroWorkshop.date}</span>
            </div>
            
            <h2>{heroWorkshop.title}</h2>
            <p className="description">{heroWorkshop.description}</p>
            
            <div className="timestamps-box">
              <h4>Momentos Chave:</h4>
              <div className="time-chips">
                {heroWorkshop.timestamps.map((ts, idx) => (
                  <button 
                    key={idx} 
                    className="time-jump" 
                    onClick={() => handleTimeJump(ts.time, heroWorkshop.vimeoId)}
                  >
                    <span className="time">{ts.time}</span> - {ts.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* WORKSHOTS GRID TÍTULO */}
        <div className="section-divider">
          <h3>Biblioteca Completa</h3>
        </div>

        {/* GRID SECUNDÁRIO STATUS CRÚ */}
        <section className="workshops-empty-grid">
           <div className="empty-state-card glass" style={{ minHeight: 'auto', padding: '48px 32px' }}>
              <div className="empty-icon-box" style={{ backgroundColor: 'transparent', border: '1px dashed var(--color-border)', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                 <Video size={24} />
              </div>
              <h4 style={{ fontSize: '18px', marginBottom: '8px' }}>Sua Biblioteca está em dia</h4>
              <p style={{ fontSize: '14px', maxWidth: '350px', margin: '0 auto', color: 'var(--color-text-secondary)' }}>
                Você não possui outras reuniões anteriores arquivadas em seu histórico atual. Fique ligado na agenda e assista acima à sua primeira aula masterclass ao vivo!
              </p>
           </div>
        </section>

      </div>
    </div>
  );
}

export default Workshops;
