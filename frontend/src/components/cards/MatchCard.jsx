import { Link } from 'react-router-dom';
import { MapPin, Clock, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import ConfidenceScore from './ConfidenceScore';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function MatchCard({ match, index = 0 }) {
  const { lostItem, foundItem, confidence, reasons, status } = match;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className="bg-surface border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Header with confidence */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-border-light bg-border-light/30">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-text">AI Match</span>
          <Badge variant={status === 'claimed' ? 'success' : 'primary'}>
            {status === 'claimed' ? 'Claimed' : 'Pending'}
          </Badge>
        </div>
        <ConfidenceScore score={confidence} size={56} />
      </div>

      {/* Items comparison */}
      <div className="p-4 sm:p-5 space-y-4">
        {/* Lost item */}
        {/* Lost item */}
        <div className="flex gap-4 items-center">
          {lostItem.image ? (
            <img src={lostItem.image} alt={lostItem.title} className="w-16 h-16 object-cover rounded-xl shrink-0 border border-border" />
          ) : (
            <div className="w-16 h-16 bg-border-light rounded-xl flex items-center justify-center shrink-0 border border-border">
               <span className="text-text-tertiary text-[10px] uppercase font-bold">No Img</span>
            </div>
          )}
          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Badge variant="lost">Lost</Badge>
            </div>
            <h3 className="font-semibold text-text text-sm sm:text-base mb-1 truncate">{lostItem.title}</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {lostItem.location}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {lostItem.date}</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-grow h-px bg-border" />
          <svg className="w-4 h-4 text-text-tertiary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
          <div className="flex-grow h-px bg-border" />
        </div>

        {/* Found item */}
        {/* Found item */}
        <div className="flex gap-4 items-center">
          {foundItem.image ? (
            <img src={foundItem.image} alt={foundItem.title} className="w-16 h-16 object-cover rounded-xl shrink-0 border border-border" />
          ) : (
            <div className="w-16 h-16 bg-border-light rounded-xl flex items-center justify-center shrink-0 border border-border">
               <span className="text-text-tertiary text-[10px] uppercase font-bold">No Img</span>
            </div>
          )}
          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Badge variant="found">Found</Badge>
            </div>
            <h3 className="font-semibold text-text text-sm sm:text-base mb-1 truncate">{foundItem.title}</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {foundItem.location}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {foundItem.date}</span>
            </div>
          </div>
        </div>

        {/* Match reasons */}
        {reasons && reasons.length > 0 && (
          <div className="bg-primary-light/50 rounded-xl p-3 sm:p-4">
            <p className="text-xs font-semibold text-primary mb-2">Why this matched</p>
            <ul className="space-y-1">
              {reasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                  <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="px-4 sm:px-5 py-3 border-t border-border-light flex flex-col sm:flex-row gap-2">
        <Link to={`/item/${foundItem.id}`} className="flex-1">
          <Button variant="secondary" size="sm" className="w-full">View Details</Button>
        </Link>
        {status !== 'claimed' && (
          <Link to={`/claim/${match.id}`} className="flex-1">
            <Button size="sm" className="w-full">Claim This Item</Button>
          </Link>
        )}
      </div>
    </motion.article>
  );
}
