import React from 'react'
import { Cpu, Database, Info } from 'lucide-react'
import { formatCacheSize } from '../utils/utils'

const ProcessorSection = ({ cpuInfo }) => {
  return (
    <div className='bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6'>
      <h3 className='text-xl font-semibold mb-6 flex items-center gap-2'>
        <Cpu className='w-6 h-6 text-blue-400' /> Processor Information
      </h3>

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6'>
        <div className='lg:col-span-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-5'>
          <div className='flex items-center gap-4'>
            <Cpu className='w-8 h-8 text-blue-400' />
            <div>
              <h4 className='text-2xl font-bold text-blue-400'>
                {cpuInfo?.manufacturer} {cpuInfo?.brand}
              </h4>
              <p className='text-gray-400 text-sm'>
                {cpuInfo?.cores} Cores • {cpuInfo?.speed} GHz
              </p>
            </div>
          </div>
        </div>

        {/* Cache Info */}
        <div className='bg-gray-700/30 rounded-xl p-4 border border-gray-600/50'>
          <span className='text-xs text-gray-400 flex items-center gap-2 mb-2'>
            <Database className='w-3 h-3' /> Cache
          </span>
          <div className='space-y-1 text-sm'>
            <div className='flex justify-between'>
              <span>L1d</span>
              <span>{formatCacheSize(cpuInfo?.cache?.l1d)}</span>
            </div>
            <div className='flex justify-between'>
              <span>L2</span>
              <span>{formatCacheSize(cpuInfo?.cache?.l2)}</span>
            </div>
          </div>
        </div>

        {/* Features Info */}
        <div className='lg:col-span-3 bg-gray-700/30 rounded-xl p-4 border border-gray-600/50'>
          <span className='text-xs text-gray-400 flex items-center gap-2 mb-2'>
            <Info className='w-3 h-3' /> Features
          </span>
          <div className='grid grid-cols-3 gap-4 text-sm'>
            <div>
              Virt:{' '}
              <span
                className={
                  cpuInfo?.virtualization ? 'text-green-400' : 'text-red-400'
                }
              >
                {cpuInfo?.virtualization ? 'ON' : 'OFF'}
              </span>
            </div>
            <div>Physical Cores: {cpuInfo?.physicalCores}</div>
            <div>Processors: {cpuInfo?.processors}</div>
          </div>
        </div>
      </div>

      {/* Core Distribution */}
      <div className='bg-gray-700/30 rounded-xl p-4 border border-gray-600/50'>
        <div className='flex gap-1'>
          {[...Array(cpuInfo?.performanceCores || 0)].map((_, i) => (
            <div
              key={i}
              className='flex-1 h-8 bg-green-500/50 rounded flex items-center justify-center text-[10px]'
            >
              P{i + 1}
            </div>
          ))}
          {[...Array(cpuInfo?.efficiencyCores || 0)].map((_, i) => (
            <div
              key={i}
              className='flex-1 h-8 bg-blue-500/50 rounded flex items-center justify-center text-[10px]'
            >
              E{i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProcessorSection
