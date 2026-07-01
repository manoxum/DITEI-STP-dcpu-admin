export function getStatusColor(status?: "critical" | "warning" | "stable" | "high" | "medium" | "low" | string): string {
  switch (status) {
    case 'critical':
    case 'high':
      return '#ef4444'; // red-500
    case 'warning':
    case 'medium':
      return '#f59e0b'; // amber-500
    case 'stable':
    case 'low':
      return '#10b981'; // emerald-500
    default:
      return '#3b82f6'; // blue-500 default
  }
}
