import React from 'react';
import { PlayCircle, Lock, Play } from 'lucide-react';
import './Home.css';

const Home = () => {
  return (
    <div className="page-container home-page">
      <header className="page-header">
        <h1>Continue watching, Alex</h1>
      </header>

      <div className="content-grid">
        <div className="continue-watching-section">
          {/* Card 1 */}
          <div className="course-card">
            <div className="course-card-top">
              <div className="course-thumb mock-uiux"></div>
              <div className="course-info">
                <h3>UI/UX Advanced</h3>
                <span className="course-module">Module 4: Component Architecture</span>
                <span className="course-progress">65% Complete</span>
              </div>
            </div>
            <div className="course-card-bottom">
              <button className="btn-watch">
                <PlayCircle size={18} />
                <span>Watch</span>
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="course-card">
            <div className="course-card-top">
              <div className="course-thumb mock-motion"></div>
              <div className="course-info">
                <h3>Motion Design</h3>
                <span className="course-module">Module 1: Easing Basics</span>
                <span className="course-progress">20% Complete</span>
              </div>
            </div>
            <div className="course-card-bottom">
              <button className="btn-watch">
                <PlayCircle size={18} />
                <span>Watch</span>
              </button>
            </div>
          </div>
        </div>

        <div className="modules-section">
          <h2>All Modules</h2>
          <div className="modules-list">
            
            <div className="module-item unlocked">
              <div className="module-item-left">
                <div className="module-icon unlocked">
                   <Play size={18} fill="currentColor" />
                </div>
                <div className="module-info">
                  <h4>Foundations</h4>
                  <span>5 lessons</span>
                </div>
              </div>
              <button className="btn-icon">
                <PlayCircle size={24} />
              </button>
            </div>

            <div className="module-item locked">
              <div className="module-item-left">
                <div className="module-icon locked">
                  <Lock size={18} />
                </div>
                <div className="module-info">
                  <h4>Advanced Patterns</h4>
                  <span>8 lessons</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
