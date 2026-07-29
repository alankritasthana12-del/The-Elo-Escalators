export default function StatCard({ label, value, icon: Icon, accent = false }) {
  return (
    <div className={`rounded-2xl border p-4 sm:p-5 ${accent ? 'bg-primary text-white border-primary' : 'bg-surface border-border'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-medium uppercase tracking-wider ${accent ? 'text-blue-200' : 'text-text-secondary'}`}>
          {label}
        </span>
        {Icon && <Icon className={`w-4 h-4 ${accent ? 'text-blue-200' : 'text-text-tertiary'}`} />}
      </div>
      <p className={`text-2xl sm:text-3xl font-bold ${accent ? 'text-white' : 'text-text'}`}>
        {value}
      </p>
    </div>
  );
}
