export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return '0%'
  return `${Math.round(value)}%`
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function daysAgo(date: string | null | undefined): number {
  if (!date) return 0
  const now = new Date()
  const past = new Date(date)
  const diff = now.getTime() - past.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export function getStatusColor(status: string): string {
  const colors: { [key: string]: string } = {
    prospect: 'bg-gray-500',
    contacted: 'bg-blue-500',
    interested: 'bg-amber-500',
    call_scheduled: 'bg-purple-500',
    demo_booked: 'bg-purple-500',
    onboarded: 'bg-green-500',
    active: 'bg-green-500',
    first_booking: 'bg-green-500',
  }
  return colors[status] || 'bg-gray-500'
}
