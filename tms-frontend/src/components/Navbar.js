import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { FiMenu, FiX } from "react-icons/fi"
import { useAuth } from "../context/AuthContext"
import toast from 'react-hot-toast'
// import { BuildingOffice2Icon } from "@heroicons/react/24/outline"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuth()
  const publicRoutes = ['/login', '/signup', '/']
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ]

  const NavLink = ({ to, children, className }) => {
    const isActive = location.pathname === to
    return (
      <Link
        to={to}
        className={`${className} ${
          isActive ? "text-indigo-600 font-semibold" : "text-gray-700 hover:text-indigo-600"
        } transition-colors duration-200`}
      >
        {children}
      </Link>
    )
  }

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 mb-16 ${
        scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/favicon.png" alt="FDA logo" className="h-8 w-8 text-indigo-600" />
            <span className="ml-3 text-xl font-semibold text-gray-800">
              FDA Procurement System
            </span>

          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {publicRoutes.includes(location.pathname) ? (
              <>
                <NavLink to="/login" className="px-4 py-2 text-sm font-medium">
                  Sign In
                </NavLink>
                <NavLink
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
                >
                  Get Started
                </NavLink>
              </>
            ) : (
              <>
                {isAuthenticated && (
                  <>
                    <NavLink to="/dashboard" className="text-sm font-medium">
                      Dashboard
                    </NavLink>
                    <NavLink to="/tenders" className="text-sm font-medium">
                      Tenders
                    </NavLink>
                    <NavLink to="/profile" className="text-sm font-medium hover:text-blue-600">
                      Profile
                    </NavLink>
                    <NavLink to="/tools" className="hover:text-blue-600">
                      Tools
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-sm"
                    >
                      Logout
                    </button>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0 p-4 space-y-4 z-50">
          {navItems.map(({ to, label }) => (
            <NavLink key={to} to={to} className="block text-sm font-medium" onClick={() => setIsOpen(false)}>
              {label}
            </NavLink>
          ))}
          <hr className="border-gray-200" />
          {publicRoutes.includes(location.pathname) ? (
            <>
              <NavLink
                to="/login"
                className="block px-4 py-2 text-sm font-medium rounded-lg hover:bg-indigo-50"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </NavLink>
              <NavLink
                to="/signup"
                className="block px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm text-center"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/dashboard"
                className="block px-4 py-2 text-sm font-medium rounded-lg hover:bg-indigo-50"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/tenders"
                className="block px-4 py-2 text-sm font-medium rounded-lg hover:bg-indigo-50"
                onClick={() => setIsOpen(false)}
              >
                Tenders
              </NavLink>
              <NavLink
                to="/profile"
                className="block px-4 py-2 text-sm font-medium rounded-lg hover:bg-indigo-50"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </NavLink>
            </>
          )}
          {user && (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="block px-4 py-2 text-sm font-medium rounded-lg hover:bg-indigo-50"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
