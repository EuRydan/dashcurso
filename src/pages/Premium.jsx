import React, { useState } from 'react';
import { Check, Star, Zap, X } from 'lucide-react';
import './Premium.css';

const Premium = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="premium-page">
      <header className="premium-header">
        <span className="text-primary font-bold tracking-widest text-xs">ACESSO TOTAL</span>
        <h1>Desbloqueie seu Potencial</h1>
        <p className="text-secondary text-lg max-w-2xl mx-auto">
          Acelere sua carreira com recursos de elite, mentorias e acesso vitalício a estratégias avançadas de design e código.
        </p>
        
        <div className="billing-toggle glass-card">
          <span className={!isAnnual ? 'active' : ''}>Mensal</span>
          <div className="toggle-switch-billing" onClick={() => setIsAnnual(!isAnnual)}>
             <div className={`switch-thumb ${isAnnual ? 'right' : 'left'}`}></div>
          </div>
          <span className={isAnnual ? 'active' : ''}>Anual <span className="discount-badge">Eco. 20%</span></span>
        </div>
      </header>

      <div className="pricing-layout">
        <div className="pricing-card glass-card">
          <div className="plan-id">
            <h3>Starter</h3>
            <p className="text-secondary">Fundamentos básicos para iniciantes.</p>
          </div>
          <div className="plan-price">
            <span className="price-val">R${isAnnual ? '49' : '59'}</span>
            <span className="text-secondary">/mês</span>
          </div>
          <ul className="feature-list">
            <li><Check size={16} className="text-primary" /> Acesso ao Curso Básico</li>
            <li><Check size={16} className="text-primary" /> Certificados Digitais</li>
            <li className="locked"><X size={16} /> Mentorias ao Vivo</li>
          </ul>
          <button className="btn-secondary w-full">Assinar Starter</button>
        </div>

        <div className="pricing-card glass-card featured shadow-neon">
          <div className="featured-tag">MAIS POPULAR</div>
          <div className="plan-id">
            <h3>Profissional</h3>
            <p className="text-secondary">Arsenal completo para carreiras de alto nível.</p>
          </div>
          <div className="plan-price">
            <span className="price-val">R${isAnnual ? '79' : '99'}</span>
            <span className="text-secondary">/mês</span>
          </div>
          <ul className="feature-list">
            <li><Check size={16} className="text-primary" /> Trilha Masters Avançada</li>
            <li><Check size={16} className="text-primary" /> Certificados Físicos</li>
            <li><Check size={16} className="text-primary" /> Sessões Semanais ao Vivo</li>
            <li><Check size={16} className="text-primary" /> Plugins Exclusivos</li>
          </ul>
          <button className="btn-primary w-full">Assinar Profissional</button>
        </div>

        <div className="pricing-card glass-card">
          <div className="plan-id">
            <h3>Elite</h3>
            <p className="text-secondary">Acesso dedicado para líderes de equipe.</p>
          </div>
          <div className="plan-price">
            <span className="price-val">R${isAnnual ? '159' : '199'}</span>
            <span className="text-secondary">/mês</span>
          </div>
          <ul className="feature-list">
            <li><Check size={16} className="text-primary" /> Todos os recursos Pro</li>
            <li><Check size={16} className="text-primary" /> Calls Estratégicas 1-em-1</li>
            <li><Check size={16} className="text-primary" /> Acesso a Review de Código</li>
          </ul>
          <button className="btn-secondary w-full">Assinar Elite</button>
        </div>
      </div>
    </div>
  );
};

export default Premium;
