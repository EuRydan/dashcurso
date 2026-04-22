import React from 'react';
import { Play, Clock } from 'lucide-react';
import './ContinueWatching.css';

const ContinueWatching = ({ lesson, progressPercent, onContinue }) => {
  if (!lesson) return null;

  return (
    <div className="continue-card glass-card">
      <div className="continue-content">
        <div className="continue-thumb">
          <img src={lesson.courseThumb} alt={lesson.title} />
          <div className="thumb-overlay">
            <button className="play-button-small" onClick={onContinue}>
              <Play size={20} fill="currentColor" />
            </button>
          </div>
        </div>
        
        <div className="continue-info">
          <div className="info-header">
            <span className="course-tag">{lesson.courseTitle}</span>
            <span className="module-info">{lesson.module}</span>
          </div>
          <h3>{lesson.title}</h3>
          
          <div className="progress-footer">
            <div className="progress-stats">
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-active" 
                  style={{ width: `${progressPercent}%` }} 
                />
              </div>
              <span className="percent-text">{Math.round(progressPercent)}% assistido</span>
            </div>
            <button className="btn-continue-now" onClick={onContinue}>
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContinueWatching;
