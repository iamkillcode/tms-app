import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TenderManagement from './components/TenderManagement';
import AdminPanel from './components/AdminPanel';
import TenderForm from './components/TenderForm';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tenders" element={<TenderManagement />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/tender-form" element={<TenderForm />} />
        {/* Add more routes here */}
      </Routes>
    </Router>
  );
}

export default App;
