'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Briefcase, ShoppingBag, ShieldCheck, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userInfo);
    if (parsedUser.role !== 'admin') {
      router.push('/'); // Redirect non-admins
      return;
    }

    fetchAdminData(parsedUser.token);
  }, []);

  const fetchAdminData = async (token) => {
    try {
      setLoading(true);
      const statsRes = await fetch('http://localhost:5000/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (statsRes.ok) setStats(await statsRes.json());

      const entRes = await fetch('http://localhost:5000/api/admin/entrepreneurs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (entRes.ok) setEntrepreneurs(await entRes.json());

    } catch (error) {
      console.error('Failed to fetch admin data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const res = await fetch(`http://localhost:5000/api/admin/entrepreneurs/${id}/verify`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });

      if (res.ok) {
        // Update local state to reflect verification
        setEntrepreneurs(entrepreneurs.map(ent =>
          ent._id === id ? { ...ent, isVerified: true } : ent
        ));
      }
    } catch (error) {
      console.error('Failed to verify entrepreneur', error);
    }
  };

  if (loading || !stats) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-blue-50 p-4 rounded-xl text-blue-600">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-green-50 p-4 rounded-xl text-green-600">
              <Briefcase size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Entrepreneurs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEntrepreneurs}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-purple-50 p-4 rounded-xl text-purple-600">
              <ShoppingBag size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-yellow-50 p-4 rounded-xl text-yellow-600">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue}</p>
            </div>
          </div>
        </div>

        {/* Entrepreneurs Verification Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Platform Entrepreneurs</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 text-sm font-semibold text-gray-600">Name</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Category</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Location</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {entrepreneurs.map((ent) => (
                  <tr key={ent._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="p-4 text-sm text-gray-900 font-medium">{ent.user?.name || 'N/A'}</td>
                    <td className="p-4 text-sm text-gray-600">{ent.category}</td>
                    <td className="p-4 text-sm text-gray-600">{ent.location}</td>
                    <td className="p-4 text-sm">
                      {ent.isVerified ? (
                        <span className="flex items-center gap-1 text-green-600 font-medium">
                          <ShieldCheck size={16} /> Verified
                        </span>
                      ) : (
                        <span className="text-yellow-600 font-medium">Pending</span>
                      )}
                    </td>
                    <td className="p-4 text-sm">
                      {!ent.isVerified && (
                        <button
                          onClick={() => handleVerify(ent._id)}
                          className="bg-primary-50 text-primary-600 px-3 py-1.5 rounded text-xs font-semibold hover:bg-primary-100 transition-colors"
                        >
                          Verify Now
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
