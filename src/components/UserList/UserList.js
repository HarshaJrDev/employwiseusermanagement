import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  Typography, Button, Card, CardContent, CardActions, Grid, 
  Avatar, TextField, Pagination, Box, CircularProgress 
} from '@mui/material';
import { FiLogOut, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi';
import './UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchUsers = async (page) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`https://reqres.in/api/users?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      let fetchedUsers = response.data.data;

      fetchedUsers = fetchedUsers.map(user => {
        const storedUser = localStorage.getItem(`user_${user.id}`);
        return storedUser ? JSON.parse(storedUser) : user;
      });

      setUsers(fetchedUsers);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users. Please try again.');

      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    toast.info('Logged out successfully');
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleEdit = (id) => {
    navigate(`/users/${id}/edit`);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://reqres.in/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsers(users.filter(user => user.id !== id));
      localStorage.removeItem(`user_${id}`);
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user. Please try again.');
    }
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || 
           user.email?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="container">
      <div className="page-header">
        <Typography variant="h5">User Management</Typography>
        <Button variant="contained" color="secondary" startIcon={<FiLogOut />} onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <Box className="search-container">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{ startAdornment: <FiSearch className="search-icon" /> }}
        />
      </Box>

      {loading ? (
        <Box className="loading-container"><CircularProgress /></Box>
      ) : (
        <>
          <Grid container spacing={3} className="user-grid">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <Grid item xs={12} sm={6} md={4} key={user.id}>
                  <Card className="user-card">
                    <CardContent className="user-card-content">
                      <Avatar src={user.avatar} alt={user.first_name} className="user-avatar" />
                      <div className="user-info">
                        <Typography variant="h6">{user.first_name} {user.last_name}</Typography>
                        <Typography variant="body2" color="textSecondary">{user.email}</Typography>
                      </div>
                    </CardContent>
                    <CardActions className="user-card-actions">
                      <Button size="small" color="primary" startIcon={<FiEdit />} onClick={() => handleEdit(user.id)}>Edit</Button>
                      <Button size="small" color="secondary" startIcon={<FiTrash2 />} onClick={() => handleDelete(user.id)}>Delete</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}><Typography variant="body1" align="center">No users found.</Typography></Grid>
            )}
          </Grid>

          {!searchTerm && totalPages > 0 && (
            <Box className="pagination-container">
              <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" />
            </Box>
          )}
        </>
      )}
    </div>
  );
};

export default UserList;
