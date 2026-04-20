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
const Certificates = () => {
  const { user } = useAppContext();
  const userName = user?.name || 'Alex Rivers';

  return (
    <div className="certificates-page">
      <div className="ambient-blurs">
        <div className="blur-one" />
        <div className="blur-two" />
      </div>

      <header className="achievement-section glass-card">
        <div className="achievement-content">
          <div className="achievement-text">
            <span>SPECIAL ACHIEVEMENT</span>
            <h2>Foundations Mastery</h2>
            <p>You have successfully completed the foundational track with a perfect score.</p>
          </div>
          <div className="achievement-badge">
            <Award size={48} className="text-primary neon-glow" />
          </div>
        </div>
      </header>

      <section className="certificates-list">
        <h2>Your Certificates</h2>
        <div className="certificate-item glass-card">
          <div className="cert-preview">
            <div className="cert-mock-content">
              <span className="cert-title">CERTIFICATE OF COMPLETION</span>
              <h3>{userName}</h3>
              <p>UI/UX Design Patterns</p>
            </div>
          </div>
          <div className="cert-actions-sidebar">
            <div className="cert-info-main">
              <h4>UI Design Foundations</h4>
              <p>Issued on April 20, 2026</p>
            </div>
            <div className="cert-btn-group">
              <button className="btn-secondary">
                <Share2 size={16} />
                <span>Share</span>
              </button>
              <button className="btn-primary">
                <Download size={16} />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Certificates;
