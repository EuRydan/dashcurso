import React, { useEffect, useState } from 'react';
import { PlayCircle, Lock, Play, Star, Calendar, Loader2 } from 'lucide-react';
import { useAppContext } from '../components/AppContext';
import { supabase } from '../lib/supabase';
import { COURSES, WORKSHOPS } from '../constants/catalog';
import ContinueWatching from '../components/ContinueWatching';
import './Home.css';

const Home = () => {
  const { user } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [lastLesson, setLastLesson] = useState(null);
  const [courseProgress, setCourseProgress] = useState([]);
  const [nextMeeting, setNextMeeting] = useState(null);

  const firstName = user?.nickname || 'Usuário';

  useEffect(() => {
    if (!user) return;

    const fetchDashData = async () => {
      setLoading(true);
      try {
        // 1. Buscar todo o progresso do usuário
        const { data: progressData } = await supabase
          .from('video_progress')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        if (progressData && progressData.length > 0) {
          // Achar a última aula (Continue Watching)
          const last = progressData[0];
          // Procurar no catálogo qual aula é essa
          let foundLesson = null;
          COURSES.forEach(c => {
            const lesson = c.lessons.find(l => l.vimeo_id === last.video_id);
            if (lesson) {
              foundLesson = { 
                ...lesson, 
                courseTitle: c.title, 
                courseThumb: c.thumbnail,
                rawProgress: last 
              };
            }
          });
          setLastLesson(foundLesson);

          // Calcular progresso de cada curso
          const calculatedProgress = COURSES.map(course => {
            const totalLessons = course.lessons.length;
            const completedCount = course.lessons.filter(lesson => 
              progressData.find(p => p.video_id === lesson.vimeo_id && p.completed)
            ).length;
            
            return {
              ...course,
              percent: Math.round((completedCount / totalLessons) * 100)
            };
          });
          setCourseProgress(calculatedProgress);
        } else {
          // Se não houver progresso, o progresso de todos os cursos é 0%
          setCourseProgress(COURSES.map(c => ({ ...c, percent: 0 })));
        }

        // 2. Buscar próximo encontro (Simplificado: pega o mais recente da tabela)
        const { data: meetingData } = await supabase
          .from('encontros')
          .select('*')
          .order('date', { ascending: true })
          .limit(1)
          .single();
        
        if (meetingData) setNextMeeting(meetingData);

      } catch (err) {
        console.warn('Erro ao carregar dados do dashboard:', err);
        // Fallback para cursos mesmo com erro no banco
        setCourseProgress(COURSES.map(c => ({ ...c, percent: 0 })));
      } finally {
        setLoading(false);
      }
    };

    fetchDashData();
  }, [user]);

  if (loading) {
    return (
      <div className="dash-loading">
        <Loader2 className="vimeo-spin" size={40} color="var(--color-primary)" />
        <p>Sincronizando seu progresso...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="header-text">
          <h1>Bem-vindo, {firstName}</h1>
          <p>Pronto para continuar sua jornada de evolução?</p>
        </div>

        <div className="premium-upsell glass-card">
          <div className="upsell-content">
            <div className="upsell-icon"><Star size={24} fill="currentColor" /></div>
            <div className="upsell-text">
              <h3>Eleve o seu nível</h3>
              <p>Desbloqueie mentorias exclusivas e conteúdos avançados.</p>
            </div>
          </div>
          <button className="btn-upsell" onClick={() => window.location.href = '/premium'}>Ver Planos</button>
        </div>
      </header>

      {/* SEÇÃO CONTINUE ASSISTINDO */}
      {lastLesson && (
        <section className="dash-section">
          <h2>Continue de onde parou</h2>
          <ContinueWatching 
            lesson={lastLesson} 
            progressPercent={75} // Simplificado por enquanto, ou calculado via tempo assistido
            onContinue={() => window.location.href = '/courses'} 
          />
        </section>
      )}

      <div className="dash-grid-main">
        {/* COLUNA ESQUERDA: CURSOS */}
        <div className="dash-col-left">
          <section className="dash-section">
            <h2>Seus Cursos</h2>
            <div className="courses-progress-list">
              {courseProgress.map(course => (
                <div key={course.id} className="course-progress-card glass-card">
                  <div className="course-card-top">
                    <img src={course.thumbnail} alt={course.title} />
                    <div className="course-card-info">
                      <h4>{course.title}</h4>
                      <span className="course-stat">{course.lessons.length} aulas</span>
                    </div>
                    <div className="course-percent-badge">{course.percent}%</div>
                  </div>
                  <div className="course-card-bottom">
                    <div className="progress-bar-container">
                      <div className="progress-bar-active" style={{ width: `${course.percent}%` }} />
                    </div>
                    <button className="btn-go-course" onClick={() => window.location.href = '/courses'}>
                      Acessar <Play size={12} fill="currentColor" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* COLUNA DIREITA: EVENTOS E NOTAS */}
        <div className="dash-col-right">
          <section className="dash-section">
            <h2>Próximo Encontro</h2>
            <div className="meeting-card glass-card">
              <div className="meeting-date-box">
                <span className="month">ABR</span>
                <span className="day">28</span>
              </div>
              <div className="meeting-info">
                <h4>{nextMeeting?.title || 'Workshop de Carreira'}</h4>
                <p><Calendar size={14} /> Terça-feira, às 20h</p>
                <button className="btn-meeting">Adicionar à agenda</button>
              </div>
            </div>
          </section>

          <div className="notice-banner glass-card mt-6">
            <div className="notice-content">
              <div className="notice-badge">GRAVAÇÃO</div>
              <p>Real Talk #1 com Filipe Canto já disponível!</p>
              <button className="btn-notice-sm" onClick={() => window.location.href = '/workshops'}>Assistir</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
