import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { TextField, Button, Paper, Typography, Box, CircularProgress } from '@mui/material';
import { FiLogIn } from 'react-icons/fi';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

    if (localStorage.getItem('token')) {
      navigate('/users');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post('https://reqres.in/api/login', {
        email,
        password
      });
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        toast.success('Login successful!');
        navigate('/users');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Paper elevation={3} className="login-paper">
        <Typography variant="h4" component="h1" className="login-title">
          Sign in to EmployWise
        </Typography>
        {/* <Typography variant="body2" color="textSecondary" className="login-subtitle">
          Use email: eve.holt@reqres.in and password: cityslicka
        </Typography> */}
        
        <form className="login-form" onSubmit={handleSubmit}>
          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            margin="normal"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Box mt={3}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <FiLogIn />}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </Box>
        </form>
      </Paper>
    </div>
  );
};

export default Login;
