"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HomeIcon, ArrowLeftIcon, SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [countdown, setCountdown] = useState(10);

  // Countdown timer effect
  useEffect(() => {
    if (countdown <= 0) {
      router.push('/');
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, router]);

  // Handle search function
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl text-center">
        {/* Animated 404 */}
        <div className="mb-8 relative">
          <h1 className="text-[150px] md:text-[200px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600 leading-none animate-pulse">
            404
          </h1>
          <div className="absolute -top-6 right-1/4 w-16 h-16 md:w-24 md:h-24 bg-yellow-300 rounded-full opacity-70 animate-bounce" style={{ animationDuration: '2s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-10 h-10 md:w-16 md:h-16 bg-purple-300 rounded-full opacity-70 animate-bounce" style={{ animationDuration: '2.5s' }}></div>
        </div>

        {/* Text content */}
        <div className="mx-auto max-w-lg px-6 py-8 bg-white rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-6">
            Oops! The page you&apos;re looking for seems to have wandered off.
            We&apos;ve dispatched a search party, but in the meantime...
          </p>

          {/* Search box */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <input
                type="text"
                className="w-full h-12 px-4 pl-10 pr-16 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search for something else..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon size={18} className="text-gray-400" />
              </div>
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Navigation options */}
          <div className="flex flex-col md:flex-row gap-4 justify-center mt-2">
            <Button 
              onClick={() => router.back()}
              variant="outline"
              className="flex items-center justify-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeftIcon size={16} />
              <span>Go Back</span>
            </Button>
            
            <Link href="/" passHref>
              <Button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                <HomeIcon size={16} />
                <span>Return Home</span>
              </Button>
            </Link>
          </div>

          {/* Countdown timer */}
          <div className="mt-8 text-sm text-gray-500">
            Redirecting to homepage in <span className="font-semibold text-indigo-600">{countdown}</span> seconds
          </div>
        </div>

        {/* Additional help links */}
        <div className="mt-8 text-gray-500 text-sm flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link href="/sitemap" className="hover:text-indigo-600 hover:underline">Sitemap</Link>
          <Link href="/contact" className="hover:text-indigo-600 hover:underline">Contact Support</Link>
          <Link href="/faq" className="hover:text-indigo-600 hover:underline">FAQ</Link>
          <Link href="/help" className="hover:text-indigo-600 hover:underline">Help Center</Link>
        </div>
      </div>
    </div>
  );
}
