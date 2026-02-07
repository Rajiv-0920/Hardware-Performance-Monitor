import React from 'react'
import { getStatusBg, getStatusColor } from '../utils/utils'

const StatCard = ({
  title,
  value,
  subValue,
  icon: Icon,
  progress,
  colorClass,
  statusValue,
  thresholds,
}) => (
  <div
    className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-${colorClass}/50 transition-all`}
  >
    <div className='flex items-center justify-between mb-4'>
      <div className='flex items-center gap-3'>
        <div className={`bg-${colorClass}/20 p-2 rounded-lg`}>
          <Icon className={`w-5 h-5 text-${colorClass}`} />
        </div>
        <span className='text-gray-300 font-medium'>{title}</span>
      </div>
    </div>
    <div className='mb-2'>
      <div
        className={`text-4xl font-bold ${getStatusColor(statusValue, thresholds)}`}
      >
        {value}
      </div>
      <div className='text-sm text-gray-400 mt-1'>{subValue}</div>
    </div>
    {progress !== undefined && (
      <div className='h-2 bg-gray-700 rounded-full overflow-hidden mt-4'>
        <div
          className={`h-full ${getStatusBg(statusValue, thresholds)} transition-all duration-300`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    )}
  </div>
)

export default StatCard
