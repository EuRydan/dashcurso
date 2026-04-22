import React, { useState, useEffect } from 'react';
import { Play, Lock, BookOpen, CheckCircle } from 'lucide-react';
import VimeoPlayer from '../components/VimeoPlayer';
import { supabase } from '../lib/supabase';
import { useAppContext } from '../components/AppContext';
import './MyCourses.css';

const MyCourses = () => {
  const { user } = useAppContext();
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [lessons, setLessons] = useState([
    {
      id: 'lesson-1',
      vimeo_id: '76979871', // Vídeo teste clássico do Vimeo
      title: 'Apresentação do Projeto',
      duration: '10:45',
      locked: false,
      completed: false
    },
    {
      id: 'lesson-2',
      vimeo_id: '1025515286',
      title: 'Instalação das Ferramentas',
      duration: '15:20',
      locked: false,
      completed: false
    },
    {
      id: 'lesson-3',
      vimeo_id: '1025515286',
      title: 'Primeiros Passos no Dashboard',
      duration: '08:30',
      locked: true,
      completed: false
    }
  ]);

  const activeLesson = lessons[activeLessonIndex];

  // Busca progresso de conclusão para marcar as bolinhas na barra lateral
  useEffect(() => {
    if (!user) return;
    
    const fetchProgress = async () => {
      const { data, error } = await supabase
        .from('video_progress')
        .select('video_id, completed')
        .eq('user_id', user.id);

      if (!error && data) {
        setLessons(prev => prev.map(lesson => {
          const progress = data.find(p => p.video_id === lesson.vimeo_id);
          return {
            ...lesson,
            completed: progress ? progress.completed : false
          };
        }));
      }
    };

    fetchProgress();
  }, [user, activeLessonIndex]);

  return (
    <div className="course-page">
      <section className="video-hero">
        <div className="video-container">
          <VimeoPlayer 
            key={activeLesson.vimeo_id} 
            videoId={activeLesson.vimeo_id} 
            title={activeLesson.title} 
          />
        </div>
      </section>

      <div className="course-layout">
        <div className="course-main">
          <header className="lesson-info">
            <span className="module-tag">MÓDULO 01</span>
            <h1>{activeLesson.title}</h1>
            <p className="lesson-meta">Aula {activeLessonIndex + 1} de {lessons.length} • {activeLesson.duration}</p>
          </header>

          <div className="lesson-card glass-card">
            <div className="card-header">
              <h3>Progresso da Aula</h3>
              <span className={activeLesson.completed ? 'status-done' : 'status-pending'}>
                {activeLesson.completed ? 'Concluída' : 'Em progresso'}
              </span>
            </div>
            <p className="card-desc">
              Esta é uma aula de teste para validarmos o funcionamento do player do Vimeo e o sistema de salvamento de progresso no banco de dados.
            </p>
            <div className="card-actions">
              <button 
                className="btn-secondary" 
                disabled={activeLessonIndex === 0}
                onClick={() => setActiveLessonIndex(prev => prev - 1)}
              >
                Aula Anterior
              </button>
              <button 
                className="btn-primary"
                disabled={activeLessonIndex === lessons.length - 1}
                onClick={() => setActiveLessonIndex(prev => prev + 1)}
              >
                Próxima Aula
              </button>
            </div>
          </div>
        </div>

        <aside className="course-sidebar">
          <h3>Playlist do Módulo</h3>
          <div className="playlist-list">
            {lessons.map((item, i) => (
              <div 
                key={item.id} 
                className={`playlist-item glass-card ${activeLessonIndex === i ? 'playing' : ''} ${item.locked ? 'locked' : ''}`}
                onClick={() => !item.locked && setActiveLessonIndex(i)}
              >
                <div className="item-status">
                  {item.locked ? (
                    <Lock size={16} />
                  ) : (
                    item.completed ? <CheckCircle size={18} className="icon-done" /> : <div className="dot-progress" />
                  )}
                </div>
                <div className="item-info">
                  <h4>{item.title}</h4>
                  <span>{item.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default MyCourses;
