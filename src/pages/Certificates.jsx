import React from 'react';
import { Download, Share2 } from 'lucide-react';
import { useAppContext } from '../components/AppContext';
import './Certificates.css';

const Certificates = () => {
  const { user } = useAppContext();
  
  const handleLinkedInShare = () => {
    const shareText = encodeURIComponent(`Muito feliz em compartilhar que acabei de concluir o curso na Lumen Academy! 🚀 #aprendizado #tecnologia`);
    window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${shareText}`, '_blank');
  };

  const handleDownloadDemo = () => {
    alert("Função pronta para emissão baseada em imagem. Envie o certificado base pelo chat para eu anexar a elevação de desenho (Canvas) por cima da imagem!");
  };

  return (
    <div className="page-container certificates-page">
      <div className="ambient-glow"></div>
      
      <div className="cert-content-wrapper">
        <div className="cert-header">
          <h1>Conquista Desbloqueada</h1>
          <p>Você dominou o currículo com sucesso.</p>
        </div>

        <div className="action-area">
          <button className="btn-action primary" onClick={handleDownloadDemo}>
            <Download size={18} />
            <span>Baixar Certificado (PDF)</span>
          </button>
          <button className="btn-action secondary" onClick={handleLinkedInShare}>
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
              <span className="cert-label">Certificamos com louvor que</span>
              <h3 className="cert-name font-serif">{user.name}</h3>
              <div className="divider"></div>
              <span className="cert-label">concluiu com êxito o programa completo de</span>
              <h4 className="cert-course">UI/UX Masterclass</h4>
            </div>

            <div className="cert-footer">
              <div className="cert-meta">
                <span className="meta-label">DATA DE EMISSÃO</span>
                <span className="meta-value">20 de Abril, 2026</span>
              </div>
              
              <div className="cert-logo">
                <span className="logo-text">Lumen</span>
                <span className="logo-sub">ACADEMY</span>
              </div>

              <div className="cert-meta right">
                <span className="meta-label">ID DA CREDENCIAL</span>
                <span className="meta-id">LMN-892-UX</span>
              </div>
            </div>
          </div>
        </div>

        <div className="progress-summary-bento">
           <div className="bento-icon">
              <span className="percent-text">100%</span>
           </div>
           <div className="bento-info">
             <h5>Curso Concluído</h5>
             <p>Você completou 100% dos materiais do curso, incluindo todos os questionários e projetos práticos.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Certificates;
