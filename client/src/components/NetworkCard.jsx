import React from 'react'
import { Wifi, Gauge, TrendingDown, TrendingUp } from 'lucide-react'
import { formatBytesPerSec } from '../utils/utils'

const NetworkCard = ({ networkData }) => (
  <div className='bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-green-500/50 transition-all'>
    <div className='flex items-center justify-between mb-4'>
      <div className='flex items-center gap-3'>
        <div className='bg-green-500/20 p-2 rounded-lg'>
          <Wifi className='w-5 h-5 text-green-400' />
        </div>
        <span className='text-gray-300 font-medium'>Network Traffic</span>
      </div>
      <Gauge className='w-5 h-5 text-green-400' />
    </div>
    <div className='space-y-4'>
      <div className='flex justify-between items-end'>
        <div className='flex items-center gap-2'>
          <TrendingDown className='w-4 h-4 text-green-400' />
          <span className='text-xs text-gray-400'>Download</span>
        </div>
        <span className='text-lg font-bold'>
          {formatBytesPerSec(networkData?.down || 0)}
        </span>
      </div>
      <div className='flex justify-between items-end'>
        <div className='flex items-center gap-2'>
          <TrendingUp className='w-4 h-4 text-blue-400' />
          <span className='text-xs text-gray-400'>Upload</span>
        </div>
        <span className='text-lg font-bold'>
          {formatBytesPerSec(networkData?.up || 0)}
        </span>
      </div>
    </div>
  </div>
)

export default NetworkCard
