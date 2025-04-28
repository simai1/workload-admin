import React, { useState, useEffect } from 'react';
import { Button, CircularProgress, Typography, Box, Card } from '@mui/material';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const SyncPage = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const savedState = localStorage.getItem('syncState');
    if (savedState) {
      const { isSyncing: savedIsSyncing, syncStartTime } = JSON.parse(savedState);
      if (savedIsSyncing && syncStartTime) {
        const now = new Date().getTime();
        const elapsed = Math.floor((now - syncStartTime) / 1000);
        const remaining = Math.max(60 - elapsed, 0);

        if (remaining > 0) {
          setIsSyncing(true);
          setTimeLeft(remaining);
        } else {
          localStorage.removeItem('syncState');
        }
      }
    }
  }, []);

  useEffect(() => {
    let timer;
    if (isSyncing && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsSyncing(false);
            localStorage.removeItem('syncState');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSyncing, timeLeft]);

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      setTimeLeft(60);
      const startTime = new Date().getTime();
      
      localStorage.setItem('syncState', JSON.stringify({
        isSyncing: true,
        syncStartTime: startTime
      }));

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/sync`);
      
      if (response.status === 200) {
        enqueueSnackbar('Синхронизация успешно запущена', { variant: 'success' });
      }
    } catch (error) {
      setIsSyncing(false);
      setTimeLeft(0);
      localStorage.removeItem('syncState');
      
      let errorMessage = 'Ошибка при запуске синхронизации';
      if (error.response) {
        errorMessage += `: ${error.response.data.message || error.response.statusText}`;
      } else if (error.request) {
        errorMessage += ': Сервер не отвечает';
      }
      
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  return (
    <Card sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Синхронизация данных
        </Typography>
        
        {isSyncing ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={24} />
            <Typography variant="body1">
              Синхронизация в процессе...
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Доступно через: {timeLeft} сек
            </Typography>
          </Box>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSync}
            disabled={isSyncing}
            sx={{ minWidth: 200 }}
          >
            Начать синхронизацию
          </Button>
        )}
        
        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
          Синхронизация может занять несколько минут
        </Typography>
      </Box>
    </Card>
  );
};

export default SyncPage;