import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Zap, Shield, TrendingUp } from 'lucide-react';

function Layout({ children }) {
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Enhanced Background */}
      <div aria-hidden className="fixed inset-0 pointer-events-none">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-neutral-950 to-purple-950/20 animate-pulse"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-60" style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)`,
          backgroundSize: '18px 18px'
        }} />
        
        {/* Line pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px]" />
        
      </div>

      {/* Enhanced Navbar */}
      <nav className="sticky top-3 z-20 mb-6 px-4">
        <div className="max-w-7xl mx-auto backdrop-blur-xl supports-[backdrop-filter]:bg-neutral-900/80 bg-neutral-900/90 border border-neutral-800/50 rounded-2xl px-6 py-4 flex items-center justify-between shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white grid place-items-center shadow-lg">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div>
              <span className="font-bold tracking-tight font-brand text-xl bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
                CreditSea
              </span>
              <div className="text-xs text-neutral-500 font-medium">Credit Analytics Platform</div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2 text-sm">
            
            <Link 
              to="/" 
              className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                isActive('/') && !isActive('/reports')
                  ? 'text-white bg-indigo-600 shadow-lg' 
                  : 'text-neutral-200 hover:bg-neutral-800/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Upload
              </div>
            </Link>
            <Link 
              to="/reports" 
              className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                isActive('/reports') 
                  ? 'text-white bg-indigo-600 shadow-lg' 
                  : 'text-neutral-200 hover:bg-neutral-800/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Reports
              </div>
            </Link>
          </div>
          
          <div className="hidden lg:flex items-center gap-2 text-xs">
            <h4></h4>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 relative">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Urbanist:wght@700&family=Inter:wght@400;500;600;700&display=swap');
        
        .font-brand { 
          font-family: 'Urbanist', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'; 
          letter-spacing: -0.01em; 
        }
        .font-heading { 
          font-family: 'Poppins', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'; 
          letter-spacing: -0.01em; 
        }
        
        @keyframes fade-in {
          from { 
            opacity: 0; 
            transform: translateY(10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        /* Enhanced scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #6366f1, #8b5cf6);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #4f46e5, #7c3aed);
        }
      `}</style>
    </div>
  );
}

export default Layout;


