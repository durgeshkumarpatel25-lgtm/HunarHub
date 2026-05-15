'use client';
import { useState, useEffect } from 'react';
import { Search, MapPin, Star } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredEntrepreneurs, setFeaturedEntrepreneurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check auth state
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    }

    const fetchFeatured = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/entrepreneurs?limit=3`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setFeaturedEntrepreneurs(data.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to fetch entrepreneurs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/entrepreneurs?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCategoryClick = (category) => {
    router.push(`/entrepreneurs?category=${encodeURIComponent(category)}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    router.push('/login');
  };

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-primary-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary-600 tracking-tight">HunarHub</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className="border-primary-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Home
              </Link>
              <Link href="/entrepreneurs" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Categories
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {userInfo ? (
                <>
                  <span className="text-gray-700 text-sm font-medium mr-2">Hi, {userInfo.name.split(' ')[0]}</span>
                  <Link href={userInfo.role === 'entrepreneur' ? '/dashboard/entrepreneur' : userInfo.role === 'admin' ? '/dashboard/admin' : '/dashboard'} className="text-gray-500 hover:text-gray-700 text-sm font-medium">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-red-100 transition-colors shadow-sm">
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-500 hover:text-gray-700 text-sm font-medium">Log in</Link>
                  <Link href="/register" className="bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-primary-50 pb-16 pt-20 lg:pb-24 lg:pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Empowering <span className="text-primary-600">Local Talent</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Discover and support skilled micro-entrepreneurs in your community. From custom tailoring to handmade pottery, find authentic services and products.
          </p>
          
          <div className="mt-10 max-w-xl mx-auto">
            <form onSubmit={handleSearch} className="relative flex items-center w-full h-14 rounded-full focus-within:shadow-lg bg-white overflow-hidden shadow-md border border-gray-100">
              <div className="grid place-items-center h-full w-12 text-gray-400">
                <Search size={20} />
              </div>
              <input
                className="peer h-full w-full outline-none text-sm text-gray-700 pr-2 bg-transparent"
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for cobblers, tailors, potters..." 
              />
              <button type="submit" className="bg-primary-600 text-white px-6 h-full font-medium hover:bg-primary-700 transition-colors">
                Search
              </button>
            </form>
          </div>
        </div>
        
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-primary-200 opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-secondary opacity-20 blur-3xl"></div>
      </div>

      {/* Categories */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {['Cobbler', 'Potter', 'Tailor', 'Artisan', 'Vendor'].map((category) => (
              <div 
                key={category} 
                onClick={() => handleCategoryClick(category)}
                className="group cursor-pointer flex flex-col items-center justify-center p-6 bg-primary-50 rounded-2xl hover:bg-primary-100 transition-all border border-transparent hover:border-primary-200 hover:shadow-md"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="font-medium text-gray-900">{category}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Entrepreneurs */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Entrepreneurs</h2>
              <p className="text-gray-500 mt-2">Highly rated professionals in your area</p>
            </div>
            <Link href="/entrepreneurs" className="text-primary-600 font-medium hover:text-primary-700">View all &rarr;</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <p className="text-gray-500">Loading featured entrepreneurs...</p>
            ) : featuredEntrepreneurs.length === 0 ? (
              <p className="text-gray-500">No entrepreneurs found. Be the first to register!</p>
            ) : (
              featuredEntrepreneurs.map((entrepreneur) => (
                <div key={entrepreneur._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                    <div className="absolute inset-0 bg-primary-200 group-hover:scale-105 transition-transform duration-500"></div>
                    <div className="absolute bottom-4 left-4 z-20 flex space-x-2">
                      <span className="bg-white/90 backdrop-blur text-xs font-medium px-2 py-1 rounded-md text-gray-800">
                        {entrepreneur.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{entrepreneur.user?.name || 'Unknown'}</h3>
                        <p className="text-sm text-primary-600 font-medium">{entrepreneur.skills}</p>
                      </div>
                      <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                        <Star size={14} className="text-yellow-500 fill-current" />
                        <span className="ml-1 text-sm font-bold text-yellow-700">New</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <MapPin size={16} className="mr-1" />
                      <span>{entrepreneur.location || 'Local Area'}</span>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Exp: <span className="font-bold text-gray-900">{entrepreneur.experienceYears} yrs</span>
                      </div>
                      <Link href={`/entrepreneurs/${entrepreneur._id}`} className="text-primary-600 font-medium hover:text-primary-700 transition-colors">
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
