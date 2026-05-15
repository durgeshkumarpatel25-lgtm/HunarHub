'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Calendar, Settings, LogOut, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      router.push('/login');
    } else {
      const parsedUser = JSON.parse(userInfo);
      setUser(parsedUser);
      fetchDashboardData(parsedUser);
    }
  }, []);

  const fetchDashboardData = async (userInfo) => {
    try {
      setLoading(true);
      const isEntrepreneur = userInfo.role === 'entrepreneur';

      const ordersRes = await fetch(
        `http://localhost:5000/api/orders/${isEntrepreneur ? 'entrepreneur' : 'myorders'}`,
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      if (ordersRes.ok) setOrders(await ordersRes.json());

      const reqRes = await fetch(
        `http://localhost:5000/api/services/${isEntrepreneur ? 'entrepreneur' : 'myrequests'}`,
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      if (reqRes.ok) setRequests(await reqRes.json());

    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    router.push('/login');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
      case 'Delivered':
      case 'Accepted':
        return <CheckCircle size={18} className="text-green-500" />;
      case 'Rejected':
      case 'Cancelled':
        return <XCircle size={18} className="text-red-500" />;
      default:
        return <Clock size={18} className="text-yellow-500" />;
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white border-r border-gray-200 md:min-h-screen">
        <div className="p-6 border-b border-gray-100">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-xl font-bold mb-3">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-sm text-gray-500 capitalize">{user.role} Account</p>
        </div>

        <nav className="p-4 space-y-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Package size={18} /> Orders
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'requests' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Calendar size={18} /> Service Requests
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Settings size={18} /> Settings
          </button>

          <div className="pt-4 mt-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 capitalize">{activeTab.replace('-', ' ')}</h1>

        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {orders.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No orders found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="p-4 text-sm font-semibold text-gray-600">Order ID</th>
                      <th className="p-4 text-sm font-semibold text-gray-600">Amount</th>
                      <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                      <th className="p-4 text-sm font-semibold text-gray-600">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="p-4 text-sm text-gray-900 font-medium">#{order._id.substring(0, 8)}</td>
                        <td className="p-4 text-sm text-gray-600 font-medium text-primary-600">₹{order.totalAmount}</td>
                        <td className="p-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1.5">
                            {getStatusIcon(order.status)} {order.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {requests.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No service requests found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="p-4 text-sm font-semibold text-gray-600">Details</th>
                      <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                      <th className="p-4 text-sm font-semibold text-gray-600">Est. Price</th>
                      <th className="p-4 text-sm font-semibold text-gray-600">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr key={req._id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="p-4 text-sm text-gray-900 max-w-xs truncate" title={req.serviceDetails}>
                          {req.serviceDetails}
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1.5">
                            {getStatusIcon(req.status)} {req.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-600 font-medium text-primary-600">
                          {req.priceEstimate ? `₹${req.priceEstimate}` : 'Pending'}
                        </td>
                        <td className="p-4 text-sm text-gray-500">
                          {new Date(req.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Account Settings</h3>
            <p className="text-gray-500 mb-6">Update your account information and preferences.</p>
            <form className="max-w-md space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" defaultValue={user.name} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" defaultValue={user.email} disabled className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500 cursor-not-allowed outline-none" />
              </div>
              <button type="button" className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                Save Changes
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
