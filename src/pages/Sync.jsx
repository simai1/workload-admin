import React, { useState, useEffect } from 'react';
import { Button, CircularProgress, Typography, Box, Card, Alert, Collapse, IconButton } from '@mui/material';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import CloseIcon from '@mui/icons-material/Close';

const SyncPage = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [syncStatus, setSyncStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
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
    fetchSyncStatus();
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
            fetchSyncStatus(); // Обновляем статус после завершения синхронизации
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSyncing, timeLeft]);

  const fetchSyncStatus = async () => {
    try {
      setLoadingStatus(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/status`);
      setSyncStatus(response.data);
    } catch (error) {
      console.error('Error fetching sync status:', error);
      setSyncStatus({
        status: 'error',
        message: 'Не удалось получить статус синхронизации',
        error: error.message
      });
    } finally {
      setLoadingStatus(false);
    }
  };

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
        // Обновляем статус после небольшой задержки
        setTimeout(fetchSyncStatus, 2000);
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
      fetchSyncStatus(); // Обновляем статус при ошибке
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

        {/* Блок статуса синхронизации */}
        <Box sx={{ width: '100%', mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Статус последней синхронизации
          </Typography>
          
          {loadingStatus ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress size={24} />
            </Box>
          ) : syncStatus ? (
            <Collapse in={!!syncStatus}>
              <Alert
                severity={syncStatus.status === 'success' ? 'success' : 'error'}
                sx={{ mb: 2 }}
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => setSyncStatus(null)}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {syncStatus.status === 'success' ? 'Успешно' : 'Ошибка'}
                </Typography>
                <Typography variant="body2">
                  {syncStatus.message}
                </Typography>
                {syncStatus.lastSync && (
                  <Typography variant="caption" display="block">
                    Время: {syncStatus.lastSync}
                  </Typography>
                )}
                {syncStatus.error && (
                  <Typography variant="body2" sx={{ mt: 1, fontFamily: 'monospace' }}>
                    {syncStatus.error}
                  </Typography>
                )}
              </Alert>
            </Collapse>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Информация о статусе отсутствует
            </Typography>
          )}
        </Box>
      </Box>
    </Card>
  );
};

export default SyncPage;