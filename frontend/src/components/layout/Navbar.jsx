import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { NAV_LINKS } from '../../constants';
import ThemeToggle from './ThemeToggle';
import MobileSidebar from './MobileSidebar';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <span className="font-bold text-text text-base sm:text-lg tracking-tight">
              Lost<span className="text-primary">&</span>Found
            </span>
          </Link>

          {/* Center: Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary bg-primary-light/50'
                      : 'text-text-secondary hover:text-text hover:bg-border-light'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right: Desktop Actions & Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:flex items-center pr-4">
              <ThemeToggle />
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 -mr-2 rounded-lg text-text-secondary hover:text-text hover:bg-border-light transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar (Rendered via AnimatePresence internally) */}
      <MobileSidebar isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
