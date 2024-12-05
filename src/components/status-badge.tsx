import { Badge } from '@/components/ui/badge';
import { ServiceStatus } from '@/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: ServiceStatus | 'investigating' | 'identified' | 'monitoring' | 'resolved';
}

const statusConfig = {
  // Service statuses
  Operational: {
    label: 'Operational',
    className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  },
  "Partial Outage": {
    label: 'Partial Outage',
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  },
  "Degraded Performance": {
    label: 'Degraded Performance',
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  },
  "Major Outage": {
    label: 'Major Outage',
    className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  },
  maintenance: {
    label: 'Maintenance',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  },
  // Incident statuses
  investigating: {
    label: 'Investigating',
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  },
  identified: {
    label: 'Identified',
    className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
  },
  monitoring: {
    label: 'Monitoring',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  },
  resolved: {
    label: 'Resolved',
    className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  },
} as const;

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge variant="secondary" className={cn('font-medium', config.className)}>
      {config.label}
    </Badge>
  );
}