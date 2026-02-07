export const formatUptime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

// Format helper functions
export const formatBytes = (bytes, decimals = 2) => {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

export const formatBytesPerSec = (bytes) => {
  return `${formatBytes(bytes)}/s`
}

export const formatCacheSize = (bytes) => {
  if (!bytes) return 'N/A'
  return formatBytes(bytes, 0)
}

export const getStatusColor = (value, thresholds = [50, 80]) => {
  if (value < thresholds[0]) return 'text-green-400'
  if (value < thresholds[1]) return 'text-yellow-400'
  return 'text-red-400'
}

export const getStatusBg = (value, thresholds = [50, 80]) => {
  if (value < thresholds[0]) return 'bg-green-500'
  if (value < thresholds[1]) return 'bg-yellow-500'
  return 'bg-red-500'
}
