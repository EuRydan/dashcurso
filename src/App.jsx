// Build trigger: 2026-04-20T20:04
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useAppContext } from './components/AppContext';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import MyCourses from './pages/MyCourses';
import Certificates from './pages/Certificates';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Premium from './pages/Premium';
import Workshops from './pages/Workshops';
import { AppProvider } from './components/AppContext';
import './index.css';

// Banner de Verificação de E-mail
const EmailVerificationBanner = () => {
  const { user } = useAppContext();
  
  if (!user || user.email_confirmed_at) return null;

  return (
    <div className="verification-banner">
      <div className="banner-content">
        <AlertCircle size={16} />
        <span>Confirme seu e-mail para garantir a segurança da sua conta. Verifique sua caixa de entrada.</span>
      </div>
    </div>
  );
};

// Layout wrapper for authenticated pages
const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <EmailVerificationBanner />
      {/* Mobile Header */}
      <header className="mobile-header">
        <div className="mobile-logo">
          <span className="text-primary" style={{ fontWeight: 800 }}>LUMEN</span>
        </div>
        <button className="hamburger" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <div className={`bar ${isSidebarOpen ? 'active' : ''}`}></div>
        </button>
      </header>

      {/* Overlay to close sidebar on mobile */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

      <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
      
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

const AuthGuard = ({ children }) => {
  const { user, loading } = useAppContext();
  
  if (loading) return (
    <div className="loading-screen">
       <Loader2 className="spin" size={40} color="var(--color-primary)" />
    </div>
  );

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
        
        {/* Protected Routes Wrapper */}
        <Route element={<AuthGuard><DashboardLayout /></AuthGuard>}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<MyCourses />} />
          <Route path="/workshops" element={<Workshops />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/premium" element={<Premium />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
    </AppProvider>
  );
}

export default App;
