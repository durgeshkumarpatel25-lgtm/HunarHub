'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Star, MapPin, Briefcase, Calendar, ShieldCheck } from 'lucide-react';

export default function EntrepreneurProfile() {
  const params = useParams();
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchProfile();
      fetchProducts();
    }
  }, [params.id]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/entrepreneurs/${params.id}`);
      const data = await res.json();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/products?entrepreneurId=${params.id}`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!profile || profile.message) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Profile not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="h-48 bg-primary-600 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
          <div className="px-6 sm:px-10 pb-10 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end -mt-16 sm:-mt-20 mb-6">
              <div className="flex items-end">
                <div className="w-32 h-32 rounded-2xl bg-white p-2 shadow-lg z-10 border border-gray-100">
                  <div className="w-full h-full bg-primary-100 rounded-xl flex items-center justify-center text-5xl">
                    🧑‍🔧
                  </div>
                </div>
                <div className="ml-6 mb-2 z-10">
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-md flex items-center gap-3">
                    {profile.user?.name}
                    {profile.isVerified && <ShieldCheck size={28} className="text-blue-400" />}
                  </h1>
                  <p className="text-primary-100 font-medium text-lg mt-1">{profile.category}</p>
                </div>
              </div>
              
              <div className="mt-6 sm:mt-0 w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-full font-semibold shadow-md transition-all hover:shadow-lg">
                  Request Service
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="bg-gray-100 p-3 rounded-full shrink-0">
                  <MapPin size={20} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase">Location</p>
                  <p className="font-medium text-gray-900">{profile.location}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-gray-600">
                <div className="bg-gray-100 p-3 rounded-full shrink-0">
                  <Briefcase size={20} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase">Experience</p>
                  <p className="font-medium text-gray-900">{profile.experienceYears || 0} Years</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <div className="bg-yellow-50 p-3 rounded-full shrink-0">
                  <Star size={20} className="text-yellow-500 fill-current" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase">Rating</p>
                  <p className="font-medium text-gray-900 flex items-baseline gap-1">
                    <span className="text-lg">{profile.ratings?.average || 0}</span> 
                    <span className="text-sm text-gray-500">({profile.ratings?.count || 0} reviews)</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details & Skills */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills?.map((skill, idx) => (
                  <span key={idx} className="bg-primary-50 text-primary-700 font-medium px-3 py-1.5 rounded-lg text-sm border border-primary-100">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Products & Services */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Products & Offerings</h2>
            
            {products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 border-dashed p-12 text-center">
                <p className="text-gray-500 mb-2">No products listed yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {products.map((product) => (
                  <div key={product._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                    <div className="h-48 bg-gray-100 relative">
                      <div className="absolute inset-0 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300">
                        📦
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg text-gray-900 line-clamp-1">{product.name}</h4>
                        <span className="font-extrabold text-primary-600 bg-primary-50 px-2 py-1 rounded-lg">₹{product.price}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                      <button className="w-full bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-semibold py-2 rounded-xl transition-colors">
                        Buy Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
