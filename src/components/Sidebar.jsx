import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Award, User, Settings, LogOut, Star, Radio, Sun, Moon } from 'lucide-react';
import { useAppContext } from './AppContext';
import { supabase } from '../lib/supabase';
import './Sidebar.css';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const navigate = useNavigate();
  const { user, theme, toggleTheme } = useAppContext();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const displayName = user?.name || user?.email?.split('@')[0] || 'Alex Rivers';
  const avatarUrl = user?.avatarBase64 || `https://ui-avatars.com/api/?name=${displayName.replace(' ', '+')}&background=353534&color=A3E635&size=128`;

  return (
    <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-top">
        <div className="profile-section">
          <NavLink to="/profile" className="profile-card" onClick={closeSidebar}>
            <img src={avatarUrl} alt="Avatar" className="avatar" />
            <div className="profile-info">
              <span className="profile-name">{displayName}</span>
              <span className="profile-status">Deep Work Mode</span>
            </div>
          </NavLink>
        </div>

        <nav className="nav-menu">
          <NavLink to="/" className={({ isActive }) => 'nav-link ' + (isActive ? 'active' : '')} onClick={closeSidebar}>
            <Home size={18} />
            <span>Início</span>
          </NavLink>
          <NavLink to="/courses" className={({ isActive }) => 'nav-link ' + (isActive ? 'active' : '')} onClick={closeSidebar}>
            <BookOpen size={18} />
            <span>Meus Cursos</span>
          </NavLink>
          <NavLink to="/workshops" className={({ isActive }) => 'nav-link ' + (isActive ? 'active' : '')} onClick={closeSidebar}>
            <Radio size={18} />
            <span>Encontros ao Vivo</span>
          </NavLink>
          <NavLink to="/certificates" className={({ isActive }) => 'nav-link ' + (isActive ? 'active' : '')} onClick={closeSidebar}>
            <Award size={18} />
            <span>Certificados</span>
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => 'nav-link ' + (isActive ? 'active' : '')} onClick={closeSidebar}>
            <User size={18} />
            <span>Perfil</span>
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-bottom">
        <NavLink to="/premium" className={({ isActive }) => 'nav-action premium-btn ' + (isActive ? 'active' : '')} onClick={closeSidebar}>
          <Star size={18} fill="currentColor" />
          <span>Fazer upgrade</span>
        </NavLink>
        
        <NavLink to="/settings" className={({ isActive }) => 'nav-action ' + (isActive ? 'active' : '')} onClick={closeSidebar}>
          <Settings size={18} />
          <span>Configurações</span>
        </NavLink>
        
        <button className="nav-action" onClick={handleLogout} type="button">
          <LogOut size={18} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
