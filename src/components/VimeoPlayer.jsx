import React, { useEffect, useRef, useState } from 'react';
import Player from '@vimeo/player';
import { supabase } from '../lib/supabase';
import { useAppContext } from './AppContext';
import { Loader2 } from 'lucide-react';

const VimeoPlayer = ({ videoId, title, seekTo }) => {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const { user } = useAppContext();
  const [loading, setLoading] = useState(true);
  const saveInterval = useRef(null);

  // Handle external seek requests
  useEffect(() => {
    if (playerRef.current && seekTo) {
      const seconds = parseTimeToSeconds(seekTo);
      playerRef.current.setCurrentTime(seconds);
      playerRef.current.play();
    }
  }, [seekTo]);

  const parseTimeToSeconds = (timeStr) => {
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return parts[0];
  };

  useEffect(() => {
    if (!containerRef.current || !user) return;

    const initPlayer = async () => {
      // 1. Iniciar o Player do Vimeo
      const player = new Player(containerRef.current, {
        id: videoId,
        responsive: true,
        autoplay: false,
      });
      playerRef.current = player;

      try {
        // 2. Buscar progresso anterior no Supabase
        const { data, error } = await supabase
          .from('video_progress')
          .select('last_position_seconds')
          .eq('user_id', user.id)
          .eq('video_id', videoId)
          .single();

        if (!error && data) {
          // 3. Se houver progresso, pular para o tempo salvo
          player.setCurrentTime(data.last_position_seconds);
        }
      } catch (err) {
        console.warn('Erro ao buscar progresso:', err);
      }

      setLoading(false);

      // 4. Configurar eventos de salvamento
      player.on('play', () => {
        startProgressSync();
      });

      player.on('pause', () => {
        stopProgressSync();
        saveProgress(); // Salva imediatamente ao pausar
      });

      player.on('ended', () => {
        stopProgressSync();
        markAsCompleted();
      });
    };

    initPlayer();

    return () => {
      stopProgressSync();
      if (playerRef.current) playerRef.current.destroy();
    };
  }, [videoId, user]);

  const startProgressSync = () => {
    if (saveInterval.current) return;
    saveInterval.current = setInterval(() => {
      saveProgress();
    }, 10000); // Sincroniza a cada 10 segundos
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
      
      // Upsert: Insere ou atualiza o progresso
      const { error } = await supabase
        .from('video_progress')
        .upsert({
          user_id: user.id,
          video_id: videoId,
          last_position_seconds: currentTime,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id, video_id' });

      if (error) console.error('Erro ao salvar progresso:', error);
    } catch (err) {
      console.error('Falha ao obter tempo do player:', err);
    }
  };

  const markAsCompleted = async () => {
    if (!user) return;
    await supabase
      .from('video_progress')
      .update({ completed: true })
      .eq('user_id', user.id)
      .eq('video_id', videoId);
  };

  return (
    <div className="vimeo-player-wrapper" style={{ position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#000' }}>
      {loading && (
        <div className="player-loader" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <Loader2 className="spin" color="var(--color-primary)" />
        </div>
      )}
      <div ref={containerRef} className="vimeo-container"></div>
    </div>
  );
};

export default VimeoPlayer;
