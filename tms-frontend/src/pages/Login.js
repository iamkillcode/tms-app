import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import { GoogleIcon, GitHubIcon, EyeIcon, EyeSlashIcon } from '../components/Icons';
import toast from 'react-hot-toast';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      toast.success('Login successful!');
      localStorage.setItem('authToken', data.token);
      window.location.href = '/dashboard';
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-500 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Create one here
          </Link>
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
        >
          Sign In
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 bg-white text-gray-500 text-sm">Or continue with</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <GoogleIcon className="w-4 h-4" />
            <span>Google</span>
          </button>
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <GitHubIcon className="w-4 h-4" />
            <span>GitHub</span>
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;