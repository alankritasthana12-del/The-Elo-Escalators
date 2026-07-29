export default function LoadingSkeleton({ className = '', count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-border-light rounded-xl ${className}`}
          aria-hidden="true"
        />
      ))}
    </>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5 space-y-4 animate-pulse">
      <div className="h-40 bg-border-light rounded-xl" />
      <div className="h-5 bg-border-light rounded w-3/4" />
      <div className="h-4 bg-border-light rounded w-1/2" />
      <div className="flex gap-2">
        <div className="h-6 bg-border-light rounded-full w-20" />
        <div className="h-6 bg-border-light rounded-full w-16" />
      </div>
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5 animate-pulse">
      <div className="h-4 bg-border-light rounded w-24 mb-3" />
      <div className="h-8 bg-border-light rounded w-16" />
    </div>
  );
}
