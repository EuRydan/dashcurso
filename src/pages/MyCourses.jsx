import React, { useState, useEffect } from 'react';
import { Play, Lock, BookOpen, CheckCircle } from 'lucide-react';
import VimeoPlayer from '../components/VimeoPlayer';
import { supabase } from '../lib/supabase';
import { useAppContext } from '../components/AppContext';
import { COURSES } from '../constants/catalog';
import './MyCourses.css';

const MyCourses = () => {
  const { user } = useAppContext();
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  
  // Pegamos o primeiro curso do catálogo como padrão (ajustável para múltiplos cursos)
  const [currentCourse] = useState(COURSES[0]);
  const [lessons, setLessons] = useState(currentCourse.lessons.map(l => ({ ...l, completed: false })));

  const activeLesson = lessons[activeLessonIndex];

  // Busca progresso de conclusão inicial
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
  }, [user]);

  const handleLessonCompletion = (vimeoId) => {
    setLessons(prev => prev.map(lesson => 
      lesson.vimeo_id === vimeoId ? { ...lesson, completed: true } : lesson
    ));
  };

  const handleNextLesson = () => {
    if (activeLessonIndex < lessons.length - 1) {
      setActiveLessonIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevLesson = () => {
    if (activeLessonIndex > 0) {
      setActiveLessonIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const completedCount = lessons.filter(l => l.completed).length;
  const coursePercent = Math.round((completedCount / lessons.length) * 100);
  const isModuleCompleted = lessons.length > 0 && lessons.every(l => l.completed);

  return (
    <div className="course-page">
      <section className="video-hero">
        <div className="video-container">
          <VimeoPlayer 
            key={activeLesson.vimeo_id} 
            videoId={activeLesson.vimeo_id} 
            title={activeLesson.title} 
            onCompletion={handleLessonCompletion}
          />
        </div>
      </section>

      <div className="course-layout">
        <div className="course-main">
          <header className="lesson-info">
            <span className="module-tag">{activeLesson.module || 'MÓDULO 01'}</span>
            <h1>{activeLesson.title}</h1>
            <div className="course-progress-header">
                <p className="lesson-meta">Aula {activeLessonIndex + 1} de {lessons.length} • {activeLesson.duration}</p>
                <div className="progress-badge-main">{coursePercent}% CONCLUÍDO</div>
            </div>
          </header>

          <div className="lesson-card glass-card">
            <div className="card-header">
              <h3>Status do Aprendizado</h3>
              <span className={activeLesson.completed ? 'status-done' : 'status-pending'}>
                {activeLesson.completed ? 'Concluída' : 'Em progresso'}
              </span>
            </div>
            
            <p className="card-desc">
              Você está assistindo ao curso <strong>{currentCourse.title}</strong>. Seu progresso é salvo automaticamente para que você possa continuar de onde parou em qualquer dispositivo.
            </p>

            {isModuleCompleted && (
              <div className="module-completion-banner">
                <CheckCircle size={20} />
                <span>Parabéns! Você completou este módulo. 🎉</span>
              </div>
            )}

            <div className="card-actions">
              <button 
                className="btn-secondary" 
                disabled={activeLessonIndex === 0}
                onClick={handlePrevLesson}
              >
                Aula Anterior
              </button>
              <button 
                className="btn-primary"
                disabled={activeLessonIndex === lessons.length - 1}
                onClick={handleNextLesson}
              >
                Próxima Aula
              </button>
            </div>
          </div>
        </div>

        <aside className="course-sidebar">
          <h3>Conteúdo do Curso</h3>
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
