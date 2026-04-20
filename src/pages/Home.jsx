import React from 'react';
import { PlayCircle, Lock, Play } from 'lucide-react';
import { useAppContext } from '../components/AppContext';
import './Home.css';

const Home = () => {
  const { user } = useAppContext();
  const firstName = user.name ? user.name.split(' ')[0] : 'Estudante';
  
  return (
    <div className="page-container home-page">
      <header className="page-header">
        <h1>Continue assistindo, {firstName}</h1>
      </header>

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
                Ver Gravações
              </button>
           </div>
        </div>

        <div className="modules-section">
          <h2>Seus Módulos</h2>
          <div className="modules-list">
            <div className="module-item locked empty-module">
              <div className="module-item-left">
                <div className="module-icon locked">
                  <Lock size={18} />
                </div>
                <div className="module-info">
                  <h4>Desbloqueie o acesso</h4>
                  <span>Faça o upgrade ou matricule-se iniciar.</span>
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
