import React from 'react';
import { Download, Share2 } from 'lucide-react';
import './Certificates.css';

const Certificates = () => {
  return (
    <div className="page-container certificates-page">
      <div className="ambient-glow"></div>
      
      <div className="cert-content-wrapper">
        <div className="cert-header">
          <h1>Achievement Unlocked</h1>
          <p>You have successfully mastered the curriculum.</p>
        </div>

        <div className="action-area">
          <button className="btn-action primary">
            <Download size={18} />
            <span>Download Certificate (PDF)</span>
          </button>
          <button className="btn-action secondary">
            <Share2 size={18} />
            <span>Share on LinkedIn</span>
          </button>
        </div>

        <div className="certificate-card">
          <div className="ghost-border"></div>
          <div className="inner-content">
            <div className="cert-header-sec">
              <div className="badge-glow"></div>
              <h2>CERTIFICATE OF COMPLETION</h2>
            </div>
            
            <div className="cert-body">
              <span className="cert-label">This is to certify that</span>
              <h3 className="cert-name font-serif">Alex Rivers</h3>
              <div className="divider"></div>
              <span className="cert-label">has successfully completed the comprehensive</span>
              <h4 className="cert-course">UI/UX Masterclass</h4>
            </div>

            <div className="cert-footer">
              <div className="cert-meta">
                <span className="meta-label">DATE ISSUED</span>
                <span className="meta-value">October 24, 2023</span>
              </div>
              
              <div className="cert-logo">
                <span className="logo-text">Lumen</span>
                <span className="logo-sub">ACADEMY</span>
              </div>

              <div className="cert-meta right">
                <span className="meta-label">CREDENTIAL ID</span>
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
             <h5>Course Complete</h5>
             <p>You completed 100% of the course materials, including all quizzes and projects.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Certificates;
