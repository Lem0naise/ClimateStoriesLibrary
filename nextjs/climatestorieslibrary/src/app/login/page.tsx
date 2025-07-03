"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmail, getCurrentUser, isUserAdmin } from '@/utils/useSupabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { user } = await getCurrentUser();
      if (user && await isUserAdmin(user)) {
        router.push('/admin');
      }
      setCheckingAuth(false);
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { user, session, error } = await signInWithEmail(email, password);
      
      if (error) {
        setError(error);
        setLoading(false);
        return;
      }

      if (user && session) {
        // Check if user is admin
        const adminStatus = await isUserAdmin(user);
        if (adminStatus) {
          router.push('/admin');
        } else {
          setError('Access denied. Admin privileges required.');
          setLoading(false);
        }
      } else {
        setError('Authentication failed. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[color:var(--background)] flex items-center justify-center py-4 md:py-10">
        <div className="max-w-md mx-auto px-3 md:px-6 w-full">
          <div className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] p-4 md:p-8 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-[rgba(140,198,63,0.3)] rounded mb-4"></div>
              <div className="h-4 bg-[rgba(140,198,63,0.2)] rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--background)] py-4 md:py-10">
      <div className="max-w-md mx-auto px-3 md:px-6">
        <div className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] p-4 md:p-8">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-[color:var(--lightgreen)] text-[clamp(24px,6vw,32px)] mb-2 md:mb-4 font-bold">
              Admin Login
            </h1>
            <p className="text-[color:var(--lightgreen)] text-[clamp(12px,3vw,16px)] opacity-90">
              Access the Climate Stories Library admin panel
            </p>
          </div>

          {error && (
            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-red-700 text-sm md:text-base">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div>
              <label 
                htmlFor="email" 
                className="block text-[color:var(--lightgreen)] text-sm md:text-base font-semibold mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 md:p-4 bg-[rgba(255,255,255,0.1)] border-2 border-[rgba(140,198,63,0.3)] rounded-lg text-[color:var(--lightgreen)] placeholder-gray-400 focus:border-[color:var(--lightgreen)] focus:outline-none transition-colors duration-300 text-sm md:text-base"
                placeholder="Enter your admin email"
                disabled={loading}
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-[color:var(--lightgreen)] text-sm md:text-base font-semibold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 md:p-4 bg-[rgba(255,255,255,0.1)] border-2 border-[rgba(140,198,63,0.3)] rounded-lg text-[color:var(--lightgreen)] placeholder-gray-400 focus:border-[color:var(--lightgreen)] focus:outline-none transition-colors duration-300 text-sm md:text-base"
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[color:var(--lightgreen)] text-[color:var(--darkgreen)] py-3 md:py-4 px-6 md:px-8 rounded-lg font-semibold text-sm md:text-base transition-all duration-300 hover:bg-[color:var(--darkgreen)] hover:text-[color:var(--lightgreen)] hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(140,198,63,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 md:mt-8 text-center">
            <Link 
              href="/" 
              className="text-[color:var(--lightgreen)] text-sm md:text-base opacity-70 hover:opacity-100 underline transition-opacity duration-300"
            >
              ← Back to Stories
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
