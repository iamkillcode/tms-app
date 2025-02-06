import { Link } from "react-router-dom";
import { DocumentChartBarIcon, ShieldCheckIcon, ClockIcon } from "@heroicons/react/24/outline";
import Footer from "../components/Footer";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <div className="bg-indigo-50 py-20 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Streamlined Procurement Management for FDA Ghana
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Manage tenders, track activities, and generate official documents with Ghana FDA compliance
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/signup"
              className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Generate a New Tender Number
            </Link>
            <button className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50">
              Watch Demo
            </button>
          </div>
        </div>
      </div>

      {/* Key Features Grid */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <DocumentChartBarIcon className="h-12 w-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Tender Management</h3>
            <p className="text-gray-600">
              Generate and track tender numbers with automatic number generations
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <ShieldCheckIcon className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">ISO Certification</h3>
            <p className="text-gray-600">
              Create ISO numbers with automatic number generations
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-sm">
            <ClockIcon className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Activity Tracking</h3>
            <p className="text-gray-600">
              Monitor procurement timelines and deadlines with real-time updates
            </p>
          </div>
        </div>
      </div>

      {/* Compliance Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Fully Compliant with Ghana FDA Regulations
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Built-in validation for Public Procurement Act (Act 663) and FDA specific requirements
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
              <img src="./coatofarms.png" alt="Coat of Arms" className="h-20 w-auto mx-auto" />
              <img src="/ppalogo.png" alt="PPA Logo" className="h-20 w-auto mx-auto" />
              <img src="/favicon.png" alt="ISO Certified" className="h-20 w-auto mx-auto" />
              <img src="/moh.jpg" alt="GDPR Compliant" className="h-20 w-auto mx-auto" />
            </div>
          </div>
        </div>


      </div>

      <Footer />
    </div>
  );
};

export default Landing; 