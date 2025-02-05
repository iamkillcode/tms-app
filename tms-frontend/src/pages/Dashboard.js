import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Footer from "../components/Footer";
import { CurrencyDollarIcon, DocumentTextIcon, UserGroupIcon, ClockIcon } from "@heroicons/react/24/outline";

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);

  // Sample data - replace with real data from your API
  const procurementData = [
    { month: 'Jan', value: 65 },
    { month: 'Feb', value: 85 },
    { month: 'Mar', value: 45 },
    { month: 'Apr', value: 95 },
  ];

  const stats = [
    { title: 'Total Spend', value: '₵2.4M', icon: CurrencyDollarIcon, change: '+2.4%' },
    { title: 'Active RFPs', value: '12', icon: DocumentTextIcon, change: '-1.2%' },
    { title: 'Vendors', value: '45', icon: UserGroupIcon, change: '+5.6%' },
    { title: 'Avg. Process Time', value: '14d', icon: ClockIcon, change: '-0.8%' },
  ];

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Check if we have a valid token in localStorage
        const token = localStorage.getItem('authToken');
        if (!token) {
          window.location.href = "/login";
          return;
        }
        
        // If you have API endpoint to verify token, add check here
        // await verifyToken(token); 

        document.title = "TMS - Procurement Dashboard";
      } catch (error) {
        console.error('Auth verification failed:', error);
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 mt-8">
            Procurement Dashboard
          </h1>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-semibold mt-2">{stat.value}</p>
                    <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change} from last month
                    </span>
                  </div>
                  <stat.icon className="h-12 w-12 text-blue-600" aria-hidden="true" />
                </div>
              </div>
            ))}
          </div>

          {/* Chart Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-lg font-semibold mb-4">Procurement Trends</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={procurementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Recent RFPs</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 border-b">
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Description</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3].map((i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="py-3">2023-09-{i.toString().padStart(2, '0')}</td>
                        <td className="py-3">Office Supplies Purchase</td>
                        <td className="py-3">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            Completed
                          </span>
                        </td>
                        <td className="py-3">₵{((i * 4500).toLocaleString())}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Pending Tasks</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium">Vendor Onboarding</p>
                    <p className="text-sm text-gray-500">3 pending approvals</p>
                  </div>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600" style={{ width: '45%' }} />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium">Contract Renewals</p>
                    <p className="text-sm text-gray-500">5 expiring soon</p>
                  </div>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-600" style={{ width: '75%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard; 