import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, Tag, Cpu } from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import ErrorState from '../../components/common/ErrorState';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

export default function ItemDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchItem = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await api.getItem(id);
      setItem(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-4">
        <LoadingSkeleton className="h-56 sm:h-72" />
        <LoadingSkeleton className="h-6 w-48" />
        <LoadingSkeleton className="h-4 w-full" />
        <LoadingSkeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-8">
        <ErrorState
          title="Item not found"
          description="We couldn't load the details for this item."
          onRetry={fetchItem}
        />
      </div>
    );
  }

  const statusBadgeVariant =
    item.status === 'recovered' ? 'success' :
    item.status === 'matched' ? 'primary' :
    item.status === 'claimed' ? 'warning' :
    'default';

  return (
    <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
      <Link
        to={-1}
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Image */}
        {item.image && (
          <div className="rounded-2xl overflow-hidden border border-border mb-6 bg-border-light">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-48 sm:h-72 object-cover"
            />
          </div>
        )}

        {/* Header */}
        <div className="flex flex-wrap items-start gap-2 mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-text flex-grow">{item.title}</h1>
          <div className="flex gap-1.5 shrink-0">
            <Badge variant={item.type === 'lost' ? 'lost' : 'found'}>
              {item.type === 'lost' ? 'Lost' : 'Found'}
            </Badge>
            {item.status && <Badge variant={statusBadgeVariant}>{item.status}</Badge>}
          </div>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-text-secondary mb-6">
          <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-text-tertiary" /> {item.location}</span>
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-text-tertiary" /> {item.date}</span>
          {item.category && (
            <span className="flex items-center gap-1.5"><Tag className="w-4 h-4 text-text-tertiary" /> {item.category}</span>
          )}
        </div>

        {/* Description */}
        {item.description && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-text mb-2">Description</h2>
            <p className="text-sm text-text-secondary leading-relaxed">{item.description}</p>
          </div>
        )}

        {/* AI Analysis */}
        {item.aiAnalysis && (
          <div className="border border-primary-light bg-primary-light/30 rounded-2xl p-4 sm:p-5 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-primary">AI Analysis</h2>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              {item.aiAnalysis.detectedType && (
                <div>
                  <dt className="text-xs text-text-tertiary">Detected Type</dt>
                  <dd className="text-sm font-medium text-text">{item.aiAnalysis.detectedType}</dd>
                </div>
              )}
              {item.aiAnalysis.detectedBrand && (
                <div>
                  <dt className="text-xs text-text-tertiary">Brand</dt>
                  <dd className="text-sm font-medium text-text">{item.aiAnalysis.detectedBrand}</dd>
                </div>
              )}
              {item.aiAnalysis.detectedColour && (
                <div>
                  <dt className="text-xs text-text-tertiary">Colour</dt>
                  <dd className="text-sm font-medium text-text">{item.aiAnalysis.detectedColour}</dd>
                </div>
              )}
              {item.aiAnalysis.visibleText && (
                <div className="sm:col-span-2">
                  <dt className="text-xs text-text-tertiary mb-1">Visible Text (OCR)</dt>
                  <dd className="text-xs font-mono text-text-secondary bg-surface border border-border rounded-lg p-3 max-h-32 overflow-y-auto whitespace-pre-wrap">{item.aiAnalysis.visibleText}</dd>
                </div>
              )}
              {item.aiAnalysis.additionalNotes && (
                <div className="sm:col-span-2">
                  <dt className="text-xs text-text-tertiary">Notes</dt>
                  <dd className="text-sm text-text-secondary">{item.aiAnalysis.additionalNotes}</dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {/* Claim action */}
        {item.type === 'found' && item.status !== 'recovered' && item.status !== 'claimed' && (
          <Link to={`/claim/${item.id}`}>
            <Button size="lg" className="w-full sm:w-auto">
              This is mine — Verify & Claim
            </Button>
          </Link>
        )}
        
        {item.type === 'lost' && item.status !== 'recovered' && item.status !== 'claimed' && (
          <Link to={`/claim/${item.id}`}>
            <Button size="lg" className="w-full sm:w-auto">
              I found this — Verify & Connect
            </Button>
          </Link>
        )}
      </motion.div>
    </div>
  );
}
