import { Link } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';
import Badge from '../common/Badge';

export default function ItemCard({ item }) {
  const { id, title, category, location, date, type, status } = item;

  return (
    <Link
      to={`/item/${id}`}
      className="block bg-surface border border-border rounded-2xl p-4 sm:p-5 hover:shadow-sm transition-shadow"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-text text-sm sm:text-base leading-snug">{title}</h3>
        <Badge variant={type === 'lost' ? 'lost' : 'found'}>
          {type === 'lost' ? 'Lost' : 'Found'}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-text-secondary mb-3">
        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {location}</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {date}</span>
      </div>

      {status && (
        <Badge variant={
          status === 'recovered' ? 'success' :
          status === 'matched' ? 'primary' :
          'default'
        }>
          {status}
        </Badge>
      )}
    </Link>
  );
}
