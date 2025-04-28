import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { Card, TextField, Button, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login = () => {
  const [loginValue, setLoginValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      console.log('Login:', loginValue);
      console.log('Password:', passwordValue);

      navigate('/teachers');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login__wrapper">
      <Card
        className="d-flex justify-center align-center overflow-hidden flex-column pa-10"
        sx={{ width: 500, height: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 5 }}
      >
        <form className="form__login" onSubmit={handleLogin} style={{ width: '100%' }}>
          <TextField
            label="Логин"
            value={loginValue}
            onChange={(e) => setLoginValue(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Пароль"
            type={showPassword ? 'text' : 'password'}
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
            required
            fullWidth
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Войти
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;
