import React, { useState } from 'react';
import { Download, Share2, Award } from 'lucide-react';
import { useAppContext } from '../components/AppContext';
import './Certificates.css';

const Certificates = () => {
  const { user } = useAppContext();
  
  // Lista de certificados vazia por padrão
  const [certificates, setCertificates] = useState([]);

  const handleLinkedInShare = (certName) => {
    const text = encodeURIComponent(`Acabei de conquistar meu certificado em ${certName} na Lumen Academy! 🚀 Muito feliz com essa nova etapa na minha jornada de aprendizado.`);
    const url = `https://www.linkedin.com/feed/?shareActive=true&text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <div className="page-container certificates-page">
      <div className="ambient-glow"></div>
      
      {certificates.length > 0 ? (
        <div className="cert-content-wrapper">
          <div className="cert-header">
            <h1>Conquista Desbloqueada</h1>
            <p>Você dominou o currículo com sucesso.</p>
          </div>

          <div className="action-area">
            <button className="btn-action primary">
              <Download size={18} />
              <span>Download Certificado (PDF)</span>
            </button>
            <button className="btn-action secondary" onClick={() => handleLinkedInShare('UI/UX Masterclass')}>
              <Share2 size={18} />
              <span>Compartilhar no LinkedIn</span>
            </button>
          </div>

          <div className="certificate-card">
            <div className="ghost-border"></div>
            <div className="inner-content">
              <div className="cert-header-sec">
                <div className="badge-glow"></div>
                <h2>CERTIFICADO DE CONCLUSÃO</h2>
              </div>
              
              <div className="cert-body">
                <span className="cert-label">Certificamos que</span>
                <h3 className="cert-name font-serif">{user?.name || 'Estudante'}</h3>
                <div className="divider"></div>
                <span className="cert-label">concluiu com êxito o treinamento</span>
                <h4 className="cert-course">UI/UX Masterclass</h4>
              </div>

              <div className="cert-footer">
                <div className="cert-meta">
                  <span className="meta-label">DATA DE EMISSÃO</span>
                  <span className="meta-value">{new Date().toLocaleDateString('pt-BR')}</span>
                </div>
                
                <div className="cert-logo">
                  <span className="logo-text">Lumen</span>
                  <span className="logo-sub">ACADEMY</span>
                </div>

                <div className="cert-meta right">
                  <span className="meta-label">ID DA CREDENCIAL</span>
                  <span className="meta-id">LMN-{Math.floor(Math.random() * 1000)}-UX</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Estado Vazio - Quando não há certificados */
        <div className="cert-empty-state">
           <header className="page-header text-glow">
            <h1>Certificados</h1>
            <p className="page-subtitle">Seus marcos de aprendizado aparecerão aqui.</p>
          </header>

          <div className="content-grid-empty-aligned">
            <div className="empty-state-card glass">
               <div className="empty-icon-box">
                 <Award size={32} strokeWidth={1.5} color="var(--color-text-secondary)" />
               </div>
               <h2>Nenhum certificado emitido</h2>
               <p>Ao concluir 70% ou mais de um curso, seu certificado oficial de conclusão será gerado automaticamente nesta área.</p>
               <div className="empty-actions">
                  <button className="btn-empty-primary" onClick={() => window.location.href='/courses'}>
                    Ver Meus Cursos
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificates;
