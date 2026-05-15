'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Star, Filter } from 'lucide-react';

export default function EntrepreneursList() {
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const categories = ['All', 'Cobbler', 'Potter', 'Tailor', 'Artisan', 'Vendor'];

  useEffect(() => {
    fetchEntrepreneurs();
  }, [category]);

  const fetchEntrepreneurs = async () => {
    try {
      setLoading(true);
      let url = 'http://localhost:5000/api/entrepreneurs';
      const params = new URLSearchParams();
      
      if (category && category !== 'All') {
        params.append('category', category);
      }
      if (search) {
        params.append('search', search);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setEntrepreneurs(data);
    } catch (error) {
      console.error('Error fetching entrepreneurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEntrepreneurs();
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Discover Local Talent</h1>
            <p className="text-gray-600 mt-2">Find skilled professionals near you</p>
          </div>
          
          <form onSubmit={handleSearchSubmit} className="w-full md:w-auto flex-1 max-w-md">
            <div className="relative flex items-center w-full h-12 rounded-lg bg-white overflow-hidden shadow-sm border border-gray-200">
              <div className="grid place-items-center h-full w-12 text-gray-400">
                <Search size={18} />
              </div>
              <input
                className="peer h-full w-full outline-none text-sm text-gray-700 pr-2 bg-transparent"
                type="text"
                placeholder="Search skills or names..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" className="bg-primary-600 text-white px-4 h-full font-medium hover:bg-primary-700 transition-colors">
                Search
              </button>
            </div>
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center gap-2 mb-6 text-gray-900 font-bold text-lg">
                <Filter size={20} className="text-primary-600" />
                Filters
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wider">Categories</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="category" 
                        value={cat}
                        checked={category === cat || (cat === 'All' && category === '')}
                        onChange={() => setCategory(cat === 'All' ? '' : cat)}
                        className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <span className={`text-sm ${category === cat || (cat === 'All' && category === '') ? 'text-primary-700 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : entrepreneurs.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
                <h3 className="text-xl font-medium text-gray-900 mb-2">No professionals found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {entrepreneurs.map((ent) => (
                  <div key={ent._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full group">
                    <div className="h-48 bg-primary-100 relative overflow-hidden flex items-center justify-center">
                      {/* Image placeholder */}
                      <span className="text-4xl">🧑‍🔧</span>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                      <div className="absolute bottom-4 left-4 z-20 flex space-x-2">
                        <span className="bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded-md text-primary-800 uppercase tracking-wider">
                          {ent.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{ent.user?.name || 'User'}</h3>
                        </div>
                        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg shrink-0">
                          <Star size={14} className="text-yellow-500 fill-current" />
                          <span className="ml-1 text-sm font-bold text-yellow-700">
                            {ent.ratings?.average || 'New'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <MapPin size={16} className="mr-1 shrink-0" />
                        <span className="line-clamp-1">{ent.location}</span>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {ent.skills && ent.skills.slice(0, 3).map((skill, idx) => (
                            <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                              {skill}
                            </span>
                          ))}
                          {ent.skills && ent.skills.length > 3 && (
                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                              +{ent.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-auto pt-4 border-t border-gray-100">
                        <Link href={`/entrepreneurs/${ent._id}`} className="block w-full text-center bg-primary-50 text-primary-700 hover:bg-primary-100 font-medium py-2 rounded-lg transition-colors">
                          View Profile
                        </Link>
                      </div>
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
