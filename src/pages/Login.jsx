import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { Card, TextField, Button, IconButton, InputAdornment, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';

const Login = () => {
  const [loginValue, setLoginValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = btoa(`${loginValue}:${passwordValue}`);
      
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth`, {
        headers: {
          'Authorization': `Basic ${token}`
        }
      });

      if (response.status === 200) {
        localStorage.setItem('authToken', token);
        navigate('/teachers');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Неверный логин или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login__wrapper">
      <Card sx={{ width: 500, height: 400, p: 5, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <TextField
            label="Логин"
            value={loginValue}
            onChange={(e) => setLoginValue(e.target.value)}
            required
            fullWidth
            margin="normal"
            disabled={loading}
          />
          
          <TextField
            label="Пароль"
            type={showPassword ? 'text' : 'password'}
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
            required
            fullWidth
            margin="normal"
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    onClick={() => setShowPassword(!showPassword)} 
                    edge="end"
                    disabled={loading}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? 'Вход...' : 'Войти'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;