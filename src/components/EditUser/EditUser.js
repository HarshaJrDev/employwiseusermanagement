import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  Typography, Button, TextField, Paper, Avatar, Box, 
  CircularProgress, Grid, Divider 
} from '@mui/material';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import './EditUser.css';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }


        const savedUser = localStorage.getItem(`user_${id}`);
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setFormData({
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email || ''
          });
          setLoading(false);
          return;
        }


        const response = await axios.get(`https://reqres.in/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const userData = response.data.data;
        setUser(userData);
        setFormData({
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email || ''
        });


        localStorage.setItem(`user_${id}`, JSON.stringify(userData));
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error('Failed to fetch user details');

        if (error.response?.status === 404) {
          toast.error('User not found');
          navigate('/users');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.first_name || !formData.last_name || !formData.email) {
      toast.error('All fields are required');
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      

      const response = await axios.put(`https://reqres.in/api/users/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('API Response:', response.data);


      const updatedUser = {
        ...user,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email
      };

      setUser(updatedUser);
      localStorage.setItem(`user_${id}`, JSON.stringify(updatedUser));

      toast.success('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <Typography variant="h5" component="h1" className="page-title">
          Edit User
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<FiArrowLeft />}
          onClick={() => navigate('/users')}
        >
          Back to Users
        </Button>
      </div>

      {user && (
        <Paper elevation={3} className="edit-paper">
          <Box className="user-header">
            <Avatar src={user.avatar} alt={user.first_name} className="edit-avatar" />
            <Typography variant="h6" component="h2">
              {user.first_name} {user.last_name}
            </Typography>
          </Box>

          <Divider className="edit-divider" />

          <form onSubmit={handleSubmit} className="edit-form">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  name="first_name"
                  fullWidth
                  variant="outlined"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  name="last_name"
                  fullWidth
                  variant="outlined"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  fullWidth
                  variant="outlined"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>

            <Box className="form-actions">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={saving}
                startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <FiSave />}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </form>
        </Paper>
      )}
    </div>
  );
};

export default EditUser;