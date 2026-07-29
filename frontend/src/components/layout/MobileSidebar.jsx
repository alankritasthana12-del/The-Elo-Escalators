import { useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { X, Home, MapPin, Search, Cpu, Activity, LogIn, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import { NAV_LINKS } from '../../constants';

export default function MobileSidebar({ isOpen, onClose }) {
  // Prevent scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Map icons for visual sidebar
  const getIcon = (path) => {
    switch (path) {
      case '/': return <Home className="w-5 h-5" />;
      case '/report-lost':
      case '/report-found': return <MapPin className="w-5 h-5" />;
      case '/search': return <Search className="w-5 h-5" />;
      case '/matches': return <Cpu className="w-5 h-5" />;
      case '/dashboard': return <Activity className="w-5 h-5" />;
      default: return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-text/30 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-surface shadow-2xl border-r border-border flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
          >
            {/* Header */}
            <div className="flex items-center justify-between h-14 px-4 border-b border-border shrink-0">
              <Link to="/" className="flex items-center gap-2" onClick={onClose}>
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <span className="font-bold text-text text-base tracking-tight">
                  Lost<span className="text-primary">&</span>Found
                </span>
              </Link>
              <button
                onClick={onClose}
                className="p-2 -mr-2 rounded-lg text-text-secondary hover:text-text hover:bg-border-light transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-grow overflow-y-auto py-4 px-3 space-y-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-primary bg-primary-light/50'
                        : 'text-text hover:text-text hover:bg-border-light'
                    }`
                  }
                >
                  <div className="text-text-secondary">
                    {getIcon(link.path)}
                  </div>
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Footer / Controls */}
            <div className="p-4 border-t border-border shrink-0 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text">Theme</span>
                <ThemeToggle />
              </div>
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-text bg-border-light hover:bg-border rounded-xl transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
