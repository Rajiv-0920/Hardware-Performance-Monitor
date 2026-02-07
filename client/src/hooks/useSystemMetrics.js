// hooks/useSystemMetrics.js
import { useState, useEffect } from 'react'
import { socket } from '../socket'

export const useSystemMetrics = () => {
  const [metrics, setMetrics] = useState({
    cpu: {},
    memory: {},
    blockDevices: [],
    diskLayout: [],
    fsSize: [],
    fsStats: {},
    diskIO: {},
    network: { down: 0, up: 0 },
  })

  const [history, setHistory] = useState({
    cpu: Array(30).fill(0),
    mem: Array(30).fill(0),
    disk: Array(30).fill(0),
  })

  useEffect(() => {
    socket.on('cpu_update', (data) => {
      setMetrics((prev) => ({ ...prev, cpu: data }))
      setHistory((prev) => ({
        ...prev,
        cpu: [...prev.cpu.slice(1), data.load || 0],
      }))
    })

    socket.on('memory_update', (data) => {
      setMetrics((prev) => ({ ...prev, memory: data }))
      setHistory((prev) => ({
        ...prev,
        mem: [...prev.mem.slice(1), (data.used / data.total) * 100],
      }))
    })

    socket.on('disk_io_update', (data) => {
      setMetrics((prev) => ({ ...prev, diskIO: data }))
      setHistory((prev) => ({
        ...prev,
        disk: [
          ...prev.disk.slice(1),
          (data.rIO_sec || 0) + (data.wIO_sec || 0),
        ],
      }))
    })

    socket.on('network_update', (data) =>
      setMetrics((prev) => ({ ...prev, network: data })),
    )
    socket.on('block_devices_update', (data) =>
      setMetrics((prev) => ({ ...prev, blockDevices: data })),
    )
    socket.on('fs_size_update', (data) =>
      setMetrics((prev) => ({ ...prev, fsSize: data })),
    )
    socket.on('fs_state_update', (data) =>
      setMetrics((prev) => ({ ...prev, fsStats: data })),
    )

    return () => socket.off()
  }, [])

  return { metrics, history }
}
