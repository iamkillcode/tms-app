import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

const Dashboard = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/login";
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Procurement Dashboard
          </h1>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-gray-600">
              Dashboard content will be implemented here
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard; 