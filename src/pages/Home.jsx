import React from 'react';
import { PlayCircle, Lock, Play } from 'lucide-react';
import { useAppContext } from '../components/AppContext';
import './Home.css';

const Home = () => {
  const { user } = useAppContext();
  const firstName = user?.name ? user.name.split(' ')[0] : 'Estudante';
  
  // Lista de cursos vazia por padrão - não deve aparecer NADA se o usuário não tem cursos
  const enrolledCourses = [];

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
        <div className="content-grid-empty-aligned">
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
    </div>
  );
};

export default Home;
