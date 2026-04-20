import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, PlayCircle, CheckCircle } from 'lucide-react';
import './MyCourses.css';

const MyCourses = () => {
  const [progress, setProgress] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const videoRef = useRef(null);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      if (total > 0) {
        const percent = (current / total) * 100;
        setProgress(Math.floor(percent));
        
        if (percent >= 70 && !unlocked) {
          setUnlocked(true);
          // Here we would typically update global state / API to unlock the certificate
        }
      }
    }
  };

  // Mock playlist data
  const playlist = [
    { title: '1. Introduction to Tokens', time: '8:45', status: 'Completed' },
    { title: '2. Color Psychology', time: '15:20', status: 'Completed' },
    { title: '3. Typography Hierarchy', time: '11:10', status: 'Completed' },
    { title: '4. Design Systems', time: '14:10', status: 'Playing' },
    { title: '5. Advanced Components', time: '22:00', status: 'Locked' },
  ];

  return (
    <div className="page-container course-page">
      <div className="video-section">
        <div className="video-player-wrapper">
          <video 
            ref={videoRef}
            src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" 
            controls 
            className="video-player"
            onTimeUpdate={handleTimeUpdate}
            poster="https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=1280&h=720"
          ></video>
        </div>
      </div>

      <div className="course-content-container">
        <div className="lesson-details">
          <div className="lesson-header">
            <span className="module-name">FOUNDATIONS MODULE</span>
            <h1>Lesson 4: Design Systems</h1>
            <p className="lesson-desc">
              Learn how to build scalable components, establish token hierarchies, and create a unified language bridging design and engineering in a dark-mode environment.
            </p>
          </div>

          <div className="progress-section">
            <div className="progress-text">
              <span>You've watched {progress}% of this lesson</span>
              <span className="status-badge">{progress >= 70 ? 'COMPLETED' : 'IN PROGRESS'}</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: progress + '%' }}></div>
            </div>
            {unlocked && (
              <div className="unlock-alert">
                 <CheckCircle size={16} />
                 <span>Certificate Unlocked! You can view it in the Certificates tab.</span>
              </div>
            )}
          </div>

          <div className="navigation-actions">
            <button className="btn-nav prev">
              <ArrowLeft size={16} />
              <span>Previous Lesson</span>
            </button>
            <button className="btn-nav next">
              <span>Next Lesson</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="module-sidebar">
          <h3>Foundations Playlist</h3>
          <div className="playlist">
            {playlist.map((item, idx) => (
              <div key={idx} className={'playlist-item ' + item.status.toLowerCase()}>
                <div className="playlist-info">
                  <span className="playlist-title">{item.title}</span>
                  <span className="playlist-meta">{item.time} • {item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
