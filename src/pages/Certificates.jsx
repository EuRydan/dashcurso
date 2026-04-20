import React, { useState } from 'react';
import { Download, Share2, Award } from 'lucide-react';
import { useAppContext } from '../components/AppContext';
import './Certificates.css';

const Certificates = () => {
  const { user } = useAppContext();
  const userName = user?.name || 'Alex Rivers';

  const certificates = []; // Sistema cru

  return (
    <div className="certificates-page">
      <div className="ambient-blurs">
        <div className="blur-one" />
        <div className="blur-two" />
      </div>

      <header className="achievement-section glass-card">
        <div className="achievement-content">
          <div className="achievement-text">
            <span>CONQUISTA DESBLOQUEADA</span>
            <h2>Domínio das Fundações</h2>
            <p>Você completou com sucesso a trilha fundamental com aproveitamento máximo.</p>
          </div>
          <div className="achievement-badge">
            <Award size={48} className="text-primary neon-glow" />
          </div>
        </div>
      </header>

      <section className="certificates-list">
        <h2>Seus Certificados</h2>
        
        {certificates.length > 0 ? (
          certificates.map((cert, i) => (
            <div key={i} className="certificate-item glass-card">
              <div className="cert-preview">
                <div className="cert-mock-content">
                  <span className="cert-title">CERTIFICADO DE CONCLUSÃO</span>
                  <h3>{userName}</h3>
                  <p>{cert.title}</p>
                </div>
              </div>
              <div className="cert-actions-sidebar">
                <div className="cert-info-main">
                  <h4>{cert.title}</h4>
                  <p>Emitido em {cert.date}</p>
                </div>
                <div className="cert-btn-group">
                  <button className="btn-secondary">
                    <Share2 size={16} />
                    <span>Compartilhar</span>
                  </button>
                  <button className="btn-primary">
                    <Download size={16} />
                    <span>Baixar PDF</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state-minimal">
            <p className="text-secondary">Você ainda não possui certificados disponíveis.</p>
            <p className="text-secondary" style={{ fontSize: '14px' }}>Complete os módulos para conquistar sua certificação.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Certificates;
