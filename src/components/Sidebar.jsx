import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Award, User, Settings, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="profile-section">
          <div className="profile-card">
            <img src="https://ui-avatars.com/api/?name=Alex+Rivers&background=353534&color=A3E635&size=128" alt="Alex Rivers" className="avatar" />
            <div className="profile-info">
              <span className="profile-name">Alex Rivers</span>
              <span className="profile-status">Deep Work Mode</span>
            </div>
          </div>
        </div>

        <nav className="nav-menu">
          <NavLink to="/" className={({ isActive }) => 'nav-link ' + (isActive ? 'active' : '')}>
            <Home size={18} />
            <span>Início</span>
          </NavLink>
          <NavLink to="/courses" className={({ isActive }) => 'nav-link ' + (isActive ? 'active' : '')}>
            <BookOpen size={18} />
            <span>Meus Cursos</span>
          </NavLink>
          <NavLink to="/certificates" className={({ isActive }) => 'nav-link ' + (isActive ? 'active' : '')}>
            <Award size={18} />
            <span>Certificados</span>
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => 'nav-link ' + (isActive ? 'active' : '')}>
            <User size={18} />
            <span>Perfil</span>
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-bottom">
        <NavLink to="/settings" className={({ isActive }) => 'nav-action ' + (isActive ? 'active' : '')}>
          <Settings size={18} />
          <span>Configurações</span>
        </NavLink>
        <button className="nav-action">
          <LogOut size={18} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
