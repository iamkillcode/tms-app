import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from '../components/Navbar';

const AuthLayout = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AuthLayout;
