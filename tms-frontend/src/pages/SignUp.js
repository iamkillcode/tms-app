import { useState } from "react"
import { Link } from "react-router-dom"
import AuthLayout from "../layouts/AuthLayout"
import { GoogleIcon, GitHubIcon, EyeIcon, EyeSlashIcon } from "../components/Icons"
import toast from 'react-hot-toast';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Frontend validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          fullName: formData.fullName,
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      toast.success('Registration successful! Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Create Account
        </h2>
        <p className="text-gray-500 text-sm">
          Join our tender management platform
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-4">
          {[
            { id: 'fullName', label: 'Full Name', type: 'text' },
            { id: 'username', label: 'Username', type: 'text' },
            { id: 'email', label: 'Email Address', type: 'email' },
            { id: 'password', label: 'Password', type: 'password' },
            { id: 'confirmPassword', label: 'Confirm Password', type: 'password' }
          ].map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <div className="relative">
                <input
                  {...field}
                  name={field.id}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                  placeholder={`Enter your ${field.label.toLowerCase()}`}
                  value={formData[field.id]}
                  onChange={handleChange}
                />
                {field.id === 'password' && (
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
                )}
                {field.id === 'confirmPassword' && (
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
        >
          Create Account
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

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export default SignUp

