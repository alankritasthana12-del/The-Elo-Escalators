import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/common/Button';

export default function NotFound() {
  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 flex flex-col items-center justify-center text-center py-20 sm:py-32">
      <p className="text-6xl sm:text-8xl font-extrabold text-border mb-4">404</p>
      <h1 className="text-xl sm:text-2xl font-bold text-text mb-2">Page not found</h1>
      <p className="text-sm text-text-secondary mb-8 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button variant="secondary">
          <Home className="w-4 h-4" />
          Back to Home
        </Button>
      </Link>
    </div>
  );
}
