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
      <header className="page-header">
        <h1>Continue assistindo, {firstName}</h1>
      </header>

      {enrolledCourses.length > 0 ? (
        <div className="content-grid">
           {/* Renderizaria os cards aqui se houvesse cursos */}
        </div>
      ) : (
        /* Se o usuário não tem curso, não aparece nenhum card, apenas o estado inicial limpo */
        <div className="content-grid-empty">
          <div className="empty-state-card glass">
             <div className="empty-icon-box">
               <PlayCircle size={32} strokeWidth={1.5} />
             </div>
             <h2>Seu aprendizado começa aqui</h2>
             <p>Você ainda não iniciou nenhuma jornada. Explore a biblioteca para dar o primeiro passo.</p>
          </div>
        </div>
      )}

      <div className="modules-section">
        <h2>Módulos Disponíveis</h2>
        <div className="modules-list">
          <div className="module-item unlocked glass">
            <div className="module-item-left">
              <div className="module-icon unlocked">
                 <Play size={18} fill="currentColor" />
              </div>
              <div className="module-info">
                <h4>Foundations</h4>
                <span>5 aulas</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
