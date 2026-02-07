import React from 'react'
import { FolderOpen } from 'lucide-react'
import { formatBytes, getStatusBg, getStatusColor } from '../utils/utils'

const StorageTable = ({ data, title, icon: Icon }) => (
  <div className='bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6'>
    <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
      <Icon className='w-5 h-5 text-blue-400' /> {title}
    </h3>
    <div className='overflow-x-auto'>
      <table className='w-full text-left text-sm'>
        <thead>
          <tr className='text-gray-400 border-b border-gray-700'>
            <th className='pb-3'>Mount/Device</th>
            <th className='pb-3'>Size</th>
            <th className='pb-3'>Usage</th>
            <th className='pb-3 text-right'>Type</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-700/50'>
          {data?.map((item, idx) => (
            <tr key={idx} className='hover:bg-gray-700/20'>
              <td className='py-3 flex items-center gap-2'>
                <FolderOpen className='w-4 h-4 text-blue-400' />
                <span className='font-mono'>{item.mount || item.name}</span>
              </td>
              <td className='py-3'>{formatBytes(item.size)}</td>
              <td className='py-3'>
                {item.use !== undefined && (
                  <div className='flex items-center gap-2 w-24'>
                    <div className='flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden'>
                      <div
                        className={`h-full ${getStatusBg(item.use)}`}
                        style={{ width: `${item.use}%` }}
                      />
                    </div>
                    <span className={`text-[10px] ${getStatusColor(item.use)}`}>
                      {item.use.toFixed(0)}%
                    </span>
                  </div>
                )}
              </td>
              <td className='py-3 text-right text-gray-500'>
                {item.type || item.fsType}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

export default StorageTable
