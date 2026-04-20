import React, { useState, useEffect } from 'react';
import { PlayCircle, Lock, Play, Video } from 'lucide-react';
import { useAppContext } from '../components/AppContext';
import './Home.css';

const Home = () => {
  const { user } = useAppContext();
  const firstName = user?.name ? user.name.split(' ')[0] : 'Estudante';
  
  // Lógica de Cursos: Inicialmente vazio para respeitar o desejo do usuário.
  // Pode ser expandido para buscar do banco de dados futuramente.
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  return (
    <div className="page-container home-page">
      <header className="page-header text-glow">
        <h1>Continue assistindo, {firstName}</h1>
      </header>

      {enrolledCourses.length > 0 ? (
        <div className="content-grid">
          <div className="continue-watching-section">
            {enrolledCourses.map((course, idx) => (
              <div className="course-card glass" key={idx}>
                <div className="course-card-top">
                  <div className={`course-thumb ${course.thumbClass}`}></div>
                  <div className="course-info">
                    <h3>{course.title}</h3>
                    <span className="course-module">{course.module}</span>
                    <span className="course-progress">{course.progress}% Complete</span>
                  </div>
                </div>
                <div className="course-card-bottom">
                  <button className="btn-watch">
                    <PlayCircle size={18} />
                    <span>Watch</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Estado Vazio - Quando não há cursos */
        <div className="content-grid-empty">
          <div className="empty-state-card glass">
             <div className="empty-icon-box">
               <PlayCircle size={32} strokeWidth={1.5} />
             </div>
             <h2>Seu aprendizado começa aqui</h2>
             <p>Você ainda não iniciou nenhuma jornada. Explore a biblioteca de aulas ao vivo e módulos fundamentais para dar o primeiro passo.</p>
             <div className="empty-actions">
                <button className="btn-empty-primary" onClick={() => window.location.href='/courses'}>
                  Explorar Módulos
                </button>
                <button className="btn-empty-secondary" onClick={() => window.location.href='/workshops'}>
                  Ver Encontros Gravados
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Módulos Gerais - Sempre visíveis como referência */}
      <div className="modules-section">
        <h2>Explore os Módulos</h2>
        <div className="modules-list">
          <div className="module-item unlocked glass">
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

          <div className="module-item locked glass">
            <div className="module-item-left">
              <div className="module-icon locked">
                <Lock size={18} />
              </div>
              <div className="module-info">
                <h4>Advanced Design Patterns</h4>
                <span>8 lessons</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
