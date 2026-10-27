export function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getStatusColor(status) {
  switch (status) {
    case 'UP':
      return 'bg-emerald-950 text-emerald-400 border-emerald-800';
    case 'DEGRADED':
      return 'bg-amber-950 text-amber-300 border-amber-800';
    case 'DOWN':
      return 'bg-rose-950 text-rose-400 border-rose-800';
    default:
      return 'bg-slate-800 text-slate-400 border-slate-700';
  }
}

export function getSeverityColor(sev) {
  switch (sev) {
    case 'P0':
      return 'bg-rose-950 text-rose-300 border-rose-800 animate-pulse';
    case 'P1':
      return 'bg-amber-950 text-amber-300 border-amber-800';
    case 'P2':
      return 'bg-blue-950 text-blue-300 border-blue-800';
    default:
      return 'bg-slate-800 text-slate-400 border-slate-700';
  }
}
