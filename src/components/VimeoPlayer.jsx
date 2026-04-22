import React, { useEffect, useRef, useState } from 'react';
import Player from '@vimeo/player';
import { supabase } from '../lib/supabase';
import { useAppContext } from './AppContext';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import './VimeoPlayer.css';

const VimeoPlayer = ({ videoId, title, seekTo, onCompletion }) => {
  const iframeRef = useRef(null);
  const playerRef = useRef(null);
  const { user } = useAppContext();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const saveInterval = useRef(null);
  const hasTriggeredCompletion = useRef(false);

  // Parâmetros do player recomendados (Vimeo Oficial)
  const videoUrl = `https://player.vimeo.com/video/${videoId}?autoplay=0&byline=0&portrait=0&title=0&badge=0&autopause=0&player_id=0&app_id=58479`;

  // Reset completion trigger when videoId changes
  useEffect(() => {
    hasTriggeredCompletion.current = false;
  }, [videoId]);

  // Handle external seek requests (timestamps)
  useEffect(() => {
    if (playerRef.current && seekTo) {
      const seconds = parseTimeToSeconds(seekTo);
      playerRef.current.setCurrentTime(seconds).then(() => {
        playerRef.current.play();
      }).catch(err => console.error('Erro ao buscar tempo:', err));
    }
  }, [seekTo]);

  const parseTimeToSeconds = (timeStr) => {
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return parts[0];
  };

  useEffect(() => {
    if (!iframeRef.current || !user) return;

    // Inicializa o SDK do Vimeo apontando para o iframe existente
    const player = new Player(iframeRef.current);
    playerRef.current = player;

    const initProgress = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('video_progress')
          .select('last_position_seconds')
          .eq('user_id', user.id)
          .eq('video_id', videoId)
          .single();

        if (!fetchError && data) {
          player.setCurrentTime(data.last_position_seconds);
        }
      } catch (err) {
        console.warn('Progresso não encontrado para este vídeo.');
      }
    };

    player.on('loaded', () => {
      setLoading(false);
      setError(false);
      initProgress();
    });

    player.on('error', (data) => {
      console.error('Erro no Player do Vimeo:', data);
      setError(true);
      setLoading(false);
    });

    player.on('timeupdate', (data) => {
      // Marcar como concluída ao atingir 90%
      if (data.percent >= 0.9 && !hasTriggeredCompletion.current) {
        hasTriggeredCompletion.current = true;
        markAsCompleted();
        if (onCompletion) onCompletion(videoId);
      }
    });

    player.on('play', () => startProgressSync());
    player.on('pause', () => {
      stopProgressSync();
      saveProgress();
    });
    player.on('ended', () => {
      stopProgressSync();
      markAsCompleted();
    });

    return () => {
      stopProgressSync();
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId, user]);

  const startProgressSync = () => {
    if (saveInterval.current) return;
    saveInterval.current = setInterval(() => {
      saveProgress();
    }, 10000);
  };

  const stopProgressSync = () => {
    if (saveInterval.current) {
      clearInterval(saveInterval.current);
      saveInterval.current = null;
    }
  };

  const saveProgress = async () => {
    if (!playerRef.current || !user) return;
    try {
      const currentTime = await playerRef.current.getCurrentTime();
      
      const { data: existing } = await supabase
        .from('video_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('video_id', videoId)
        .single();

      if (existing) {
        await supabase
          .from('video_progress')
          .update({
            last_position_seconds: currentTime,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id)
          .eq('video_id', videoId);
      } else {
        await supabase
          .from('video_progress')
          .insert({
            user_id: user.id,
            video_id: videoId,
            last_position_seconds: currentTime,
            updated_at: new Date().toISOString(),
          });
      }
    } catch (err) {
      console.error('Background Sync Error:', err);
    }
  };

  const markAsCompleted = async () => {
    if (!user) return;
    try {
      await supabase
        .from('video_progress')
        .update({ completed: true })
        .eq('user_id', user.id)
        .eq('video_id', videoId);
      
      console.log(`[VimeoPlayer] Aula ${videoId} marcada como concluída (90%+)`);
    } catch (err) {
      console.error('Erro ao marcar como concluído:', err);
    }
  };

  return (
    <div className="vimeo-player-outer-wrapper">
      <div className="vimeo-aspect-ratio-container">
        {loading && (
          <div className="vimeo-overlay-state">
            <Loader2 className="vimeo-spin" size={32} color="var(--color-primary)" />
            <span>Preparando vídeo...</span>
          </div>
        )}

        {error && (
          <div className="vimeo-overlay-state error">
            <AlertTriangle size={48} color="#f87171" />
            <h3>Ocorreu um erro no Player</h3>
            <p>Certifique-se que o domínio do projeto está autorizado nas configurações de privacidade do Vimeo.</p>
            <button className="btn-retry" onClick={() => window.location.reload()}>
              <RefreshCw size={16} /> Atualizar Página
            </button>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={videoUrl}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: loading || error ? 0 : 1,
            transition: 'opacity 0.3s ease'
          }}
        />
      </div>
    </div>
  );
};

export default VimeoPlayer;
