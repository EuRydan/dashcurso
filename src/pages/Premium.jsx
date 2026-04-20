import React, { useState } from 'react';
import { Check, Star, Zap } from 'lucide-react';
import './Premium.css';

const Premium = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="page-container premium-page">
      <header className="premium-header">
        <h1>Desbloqueie o Próximo Nível</h1>
        <p>Acelere sua carreira com funcionalidades ilimitadas, mentorias e acesso vitalício a conteúdos avançados.</p>
        
        <div className="billing-toggle">
          <span className={!isAnnual ? 'active' : ''}>Mensal</span>
          <div className="toggle-switch" onClick={() => setIsAnnual(!isAnnual)}>
             <div className={`switch-knob ${isAnnual ? 'right' : 'left'}`}></div>
          </div>
          <span className={isAnnual ? 'active' : ''}>Anual <span className="discount-badge">Save 20%</span></span>
        </div>
      </header>

      <div className="pricing-grid">
        
        {/* Basic Plan */}
        <div className="pricing-card">
          <div className="plan-header">
            <h3>Starter</h3>
            <p>Perfeito para quem está começando agora e focado em fundamentos.</p>
          </div>
          <div className="plan-price">
            <span className="currency">R$</span>
            <span className="price">{isAnnual ? '49' : '59'}</span>
            <span className="period">/mês</span>
          </div>
          <div className="plan-features">
            <div className="feature"><Check size={18} /> Acesso a cursos base</div>
            <div className="feature"><Check size={18} /> Certificados digitais</div>
            <div className="feature inactive"><Check size={18} /> Mentorias ao vivo</div>
            <div className="feature inactive"><Check size={18} /> Plugins exclusivos</div>
          </div>
          <button className="btn-plan standard">Assinar Starter</button>
        </div>

        {/* Pro Plan */}
        <div className="pricing-card featured">
          <div className="popular-badge"><Star size={12} /> Mais Escolhido</div>
          <div className="plan-header">
            <h3>Profissional</h3>
            <p>O arsenal completo para decolar sua carreira no mercado tech.</p>
          </div>
          <div className="plan-price">
            <span className="currency">R$</span>
            <span className="price">{isAnnual ? '79' : '99'}</span>
            <span className="period">/mês</span>
          </div>
          <div className="plan-features">
            <div className="feature"><Check size={18} /> Acesso a cursos avançados</div>
            <div className="feature"><Check size={18} /> Certificados físicos</div>
            <div className="feature"><Check size={18} /> 2 Mentorias ao vivo/mês</div>
            <div className="feature"><Check size={18} /> Projetos práticos reais</div>
          </div>
          <button className="btn-plan accent">Quero ser Profissional</button>
        </div>

        {/* Enterprise Plan */}
        <div className="pricing-card">
           <div className="plan-header">
            <h3>Líder</h3>
            <p>Pensado exclusivel para CTOs e Líderes gerenciando tecnologia.</p>
          </div>
          <div className="plan-price">
            <span className="currency">R$</span>
            <span className="price">{isAnnual ? '159' : '199'}</span>
            <span className="period">/mês</span>
          </div>
          <div className="plan-features">
            <div className="feature"><Check size={18} /> Tudo do Profissional</div>
            <div className="feature"><Check size={18} /> Sessão 1on1 ilimitada</div>
            <div className="feature"><Check size={18} /> Code review nos projetos</div>
            <div className="feature"><Check size={18} /> Dashboard para times</div>
          </div>
          <button className="btn-plan standard">Assinar Líder</button>
        </div>

      </div>
    </div>
  );
}

export default Premium;
