import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <span className="font-semibold text-sm text-text">Lost&Found</span>
            </Link>
            <p className="text-xs text-text-tertiary max-w-xs">
              An AI-powered campus lost and found system. Helping students recover their belongings.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-text-secondary" aria-label="Footer navigation">
            <Link to="/report-lost" className="hover:text-text transition-colors">Report Lost</Link>
            <Link to="/report-found" className="hover:text-text transition-colors">Report Found</Link>
            <Link to="/search" className="hover:text-text transition-colors">Search</Link>
            <Link to="/dashboard" className="hover:text-text transition-colors">Dashboard</Link>
          </nav>
        </div>
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-text-tertiary text-center sm:text-left">
            &copy; {new Date().getFullYear()} AI Lost & Found Assistant — Hackathon Project by The Elo Escalators
          </p>
        </div>
      </div>
    </footer>
  );
}
