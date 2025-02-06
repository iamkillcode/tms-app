import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Toast from './components/Toast';
import Profile from './pages/Profile';
import TenderNumberGenerator from './pages/TenderNumberGenerator';
import ToolsDashboard from './pages/ToolsDashboard';
import TenderList from './pages/TenderList';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Toast />
      <Navbar />
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/generate-tender" element={<TenderNumberGenerator />} />
          <Route path="/tools" element={<ToolsDashboard />} />
          <Route path="/tenders" element={<TenderList />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;