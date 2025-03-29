import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './components/Login/Login';
import UserList from './components/UserList/UserList';
import EditUser from './components/EditUser/EditUser';
import ProtectedRoute from '../src/components/ProtectedRoute/ProtectedRoute';
import './App.css';

function App() {
  return (
    <div className="app">
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/users" element={
          <ProtectedRoute>
            <UserList />
          </ProtectedRoute>
        } />
        <Route path="/users/:id/edit" element={
          <ProtectedRoute>
            <EditUser />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
