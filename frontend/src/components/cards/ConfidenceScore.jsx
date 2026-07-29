import { CheckCircle2 } from 'lucide-react';

/**
 * Visual confidence score indicator.
 * Renders a circular progress ring with percentage.
 */
export default function ConfidenceScore({ score, size = 64 }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let colorClass, bgClass, label;
  if (score >= 85) {
    colorClass = 'text-success stroke-success';
    bgClass = 'stroke-success/15';
    label = 'High';
  } else if (score >= 60) {
    colorClass = 'text-warning stroke-warning';
    bgClass = 'stroke-warning/15';
    label = 'Medium';
  } else {
    colorClass = 'text-orange-500 stroke-orange-500';
    bgClass = 'stroke-orange-500/15';
    label = 'Low';
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth="5"
            className={bgClass}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={colorClass}
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-base font-bold ${colorClass.split(' ')[0]}`}>{score}%</span>
        </div>
      </div>
      <span className={`text-xs font-medium ${colorClass.split(' ')[0]}`}>{label} match</span>
    </div>
  );
}
