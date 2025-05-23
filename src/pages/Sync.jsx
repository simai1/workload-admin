import React, { useState, useEffect } from 'react';
import { Button, CircularProgress, Typography, Box, Card, Alert, Collapse, IconButton } from '@mui/material';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import CloseIcon from '@mui/icons-material/Close';

const SYNC_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  IN_PROGRESS: 'in_progress',
  UNKNOWN: 'unknown'
};

const SyncPage = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [syncStatus, setSyncStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [serverReady, setServerReady] = useState(false);
  const [loadingReady, setLoadingReady] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  const getAlertSeverity = (status) => {
    switch (status) {
      case SYNC_STATUS.SUCCESS: return 'success';
      case SYNC_STATUS.ERROR: return 'error';
      case SYNC_STATUS.IN_PROGRESS:
      case SYNC_STATUS.UNKNOWN: 
      default: return 'info';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case SYNC_STATUS.SUCCESS: return 'Успешно';
      case SYNC_STATUS.ERROR: return 'Ошибка';
      case SYNC_STATUS.IN_PROGRESS: return 'В процессе';
      case SYNC_STATUS.UNKNOWN: return 'Статус неизвестен';
      default: return 'Статус';
    }
  };

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
    checkServerReady();
    
    const statusInterval = setInterval(fetchSyncStatus, 15000);
    const readyInterval = setInterval(checkServerReady, 10000);
    
    return () => {
      clearInterval(statusInterval);
      clearInterval(readyInterval);
    };
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
            fetchSyncStatus();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSyncing, timeLeft]);

  const checkServerReady = async () => {
    try {
      setLoadingReady(true);
      await axios.get(`${import.meta.env.VITE_API_URL}/ready`);
      setServerReady(true);
    } catch (error) {
      console.error('Error checking server readiness:', error);
      setServerReady(false);
    } finally {
      setLoadingReady(false);
    }
  };

  const fetchSyncStatus = async () => {
    try {
      setLoadingStatus(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/status`);
      
      const statusData = response.data;
      let normalizedStatus = statusData.status || SYNC_STATUS.UNKNOWN;
      
      if (statusData.message?.includes('Synchronization in progress')) {
        normalizedStatus = SYNC_STATUS.IN_PROGRESS;
      } else if (statusData.message?.includes('status unknown')) {
        normalizedStatus = SYNC_STATUS.UNKNOWN;
      }
      
      setSyncStatus({
        ...statusData,
        normalizedStatus
      });
    } catch (error) {
      console.error('Error fetching sync status:', error);
      setSyncStatus({
        status: SYNC_STATUS.ERROR,
        normalizedStatus: SYNC_STATUS.ERROR,
        message: 'Не удалось получить статус синхронизации',
        error: error.message
      });
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleSync = async () => {
    await checkServerReady();
    if (!serverReady) {
      enqueueSnackbar('Сервер не готов к синхронизации', { variant: 'error' });
      return;
    }

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
      fetchSyncStatus();
    }
  };

  return (
    <Card sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Синхронизация данных
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: loadingReady 
                ? 'grey' 
                : serverReady 
                  ? 'success.main' 
                  : 'error.main',
              boxShadow: `0 0 8px ${loadingReady 
                ? 'grey' 
                : serverReady 
                  ? 'success.main' 
                  : 'error.main'}`
            }}
          />
          <Typography variant="body2">
            {loadingReady 
              ? 'Проверка состояния сервера...' 
              : serverReady 
                ? 'Сервер готов' 
                : 'Сервер не готов'}
          </Typography>
        </Box>
        
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
            disabled={isSyncing || !serverReady}
            sx={{ minWidth: 200 }}
          >
            Начать синхронизацию
          </Button>
        )}
        
        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
          Синхронизация может занять несколько минут
        </Typography>

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
                severity={getAlertSeverity(syncStatus.normalizedStatus)}
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
                  {getStatusText(syncStatus.normalizedStatus)}
                </Typography>
                <Typography variant="body2">
                  {syncStatus.message}
                </Typography>
                {syncStatus.lastSync && (
                  <Typography variant="caption" display="block">
                    Время: {new Date(syncStatus.lastSync).toLocaleString()}
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