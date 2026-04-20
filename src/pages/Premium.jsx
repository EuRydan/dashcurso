import React, { useState } from 'react';
import { Check, Star, Zap, X } from 'lucide-react';
import './Premium.css';

const Premium = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="premium-page">
      <header className="premium-header">
        <span className="text-primary font-bold tracking-widest text-xs">GO UNLIMITED</span>
        <h1>Unlock Your Full Potential</h1>
        <p className="text-secondary text-lg max-w-2xl mx-auto">
          Accelerate your career with elite resources, mentorship, and lifetime access to advanced design and code strategies.
        </p>
        
        <div className="billing-toggle glass-card">
          <span className={!isAnnual ? 'active' : ''}>Monthly</span>
          <div className="toggle-switch-billing" onClick={() => setIsAnnual(!isAnnual)}>
             <div className={`switch-thumb ${isAnnual ? 'right' : 'left'}`}></div>
          </div>
          <span className={isAnnual ? 'active' : ''}>Annual <span className="discount-badge">Save 20%</span></span>
        </div>
      </header>

      <div className="pricing-layout">
        <div className="pricing-card glass-card">
          <div className="plan-id">
            <h3>Starter</h3>
            <p className="text-secondary">Basic foundations for early learners.</p>
          </div>
          <div className="plan-price">
            <span className="price-val">R${isAnnual ? '49' : '59'}</span>
            <span className="text-secondary">/mo</span>
          </div>
          <ul className="feature-list">
            <li><Check size={16} className="text-primary" /> Basic Course Access</li>
            <li><Check size={16} className="text-primary" /> Digital Certificates</li>
            <li className="locked"><X size={16} /> Live Mentorship</li>
          </ul>
          <button className="btn-secondary w-full">Join Starter</button>
        </div>

        <div className="pricing-card glass-card featured shadow-neon">
          <div className="featured-tag">MOST POPULAR</div>
          <div className="plan-id">
            <h3>Professional</h3>
            <p className="text-secondary">Full arsenal for high-level careers.</p>
          </div>
          <div className="plan-price">
            <span className="price-val">R${isAnnual ? '79' : '99'}</span>
            <span className="text-secondary">/mo</span>
          </div>
          <ul className="feature-list">
            <li><Check size={16} className="text-primary" /> Advanced Masters Track</li>
            <li><Check size={16} className="text-primary" /> Physical Certificates</li>
            <li><Check size={16} className="text-primary" /> Weekly Live Sessions</li>
            <li><Check size={16} className="text-primary" /> Exclusive Plugins</li>
          </ul>
          <button className="btn-primary w-full">Go Professional</button>
        </div>

        <div className="pricing-card glass-card">
          <div className="plan-id">
            <h3>Elite</h3>
            <p className="text-secondary">Dedicated access for team leaders.</p>
          </div>
          <div className="plan-price">
            <span className="price-val">R${isAnnual ? '159' : '199'}</span>
            <span className="text-secondary">/mo</span>
          </div>
          <ul className="feature-list">
            <li><Check size={16} className="text-primary" /> All Pro Features</li>
            <li><Check size={16} className="text-primary" /> 1-on-1 Strategy Calls</li>
            <li><Check size={16} className="text-primary" /> Code Review Access</li>
          </ul>
          <button className="btn-secondary w-full">Join Elite</button>
        </div>
      </div>
    </div>
  );
};

export default Premium;
