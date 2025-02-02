import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthLayout from './layout/AuthLayout';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import TenderManagement from './components/TenderManagement';
import AdminPanel from './components/AdminPanel';
import TenderForm from './components/TenderForm';
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Protected Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tenders" element={<TenderManagement />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/tender-form" element={<TenderForm />} />
          {/* Add other protected routes here */}
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
