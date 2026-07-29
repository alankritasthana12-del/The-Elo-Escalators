import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, Loader2, MapPin, Clock, ArrowRight, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(false);
    setResults(null);

    try {
      const response = await api.search(query);
      setResults(response.results || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-2xl mx-auto mb-10 sm:mb-14">
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2 text-center">Search Items</h1>
        <p className="text-sm text-text-secondary text-center mb-8 max-w-md mx-auto">
          Describe what you're looking for in everyday language. Our AI will find the closest matches.
        </p>

        <form onSubmit={handleSearch} className="relative">
          <label htmlFor="search-input" className="sr-only">Search lost and found items</label>
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary pointer-events-none" />
            <input
              id="search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try: I lost a black wallet near the library yesterday"
              className="w-full bg-surface border border-border rounded-2xl py-3.5 sm:py-4 pl-12 pr-24 sm:pr-28 text-sm text-text placeholder:text-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Button type="submit" size="sm" disabled={loading || !query.trim()}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
              </Button>
            </div>
          </div>
        </form>
      </div>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
            <p className="text-sm text-text-secondary">Searching with AI...</p>
          </motion.div>
        )}

        {error && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ErrorState
              title="Search failed"
              description="We couldn't complete your search. Please try again."
              onRetry={() => handleSearch({ preventDefault: () => {} })}
            />
          </motion.div>
        )}

        {results && results.length === 0 && (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <EmptyState
              icon={Inbox}
              title="No matches found"
              description="Try broadening your description or using different keywords."
            />
          </motion.div>
        )}

        {results && results.length > 0 && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm font-medium text-text-secondary mb-4">
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </p>
            <div className="space-y-3">
              {results.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                >
                  <Link
                    to={`/item/${item.id}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-surface border border-border rounded-2xl p-4 sm:p-5 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex gap-4 items-center flex-grow min-w-0">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl shrink-0 border border-border" />
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-border-light rounded-xl shrink-0 flex items-center justify-center border border-border">
                          <SearchIcon className="w-6 h-6 text-text-tertiary" />
                        </div>
                      )}
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <h3 className="font-semibold text-text text-sm">{item.title}</h3>
                          <Badge variant={item.type === 'lost' ? 'lost' : 'found'}>
                            {item.type === 'lost' ? 'Lost' : 'Found'}
                          </Badge>
                        </div>
                        {item.description && (
                          <p className="text-xs text-text-secondary mb-2 line-clamp-2">{item.description}</p>
                        )}
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-tertiary">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.location}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.date}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="shrink-0 flex items-center ml-2 hidden sm:flex">
                      <Button size="sm" variant="secondary" onClick={(e) => {
                        e.preventDefault();
                        window.location.href = `/claim/${item.id}`;
                      }}>
                        {item.type === 'lost' ? 'I found this' : 'Claim this'}
                      </Button>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
