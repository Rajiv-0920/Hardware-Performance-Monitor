import React, { useState, useEffect, useRef } from 'react'

import { socket } from '../socket'

import {
  Activity,
  Cpu,
  HardDrive,
  Wifi,
  WifiOff,
  Zap,
  TrendingUp,
  TrendingDown,
  Server,
  Database,
  Thermometer,
  Clock,
  Info,
  Microchip as Chip,
  Layers,
  Gauge,
  HardDriveDownload,
  HardDriveUpload,
  FileText,
  FolderOpen,
  MonitorCheck,
} from 'lucide-react'

import {
  formatBytes,
  formatBytesPerSec,
  formatCacheSize,
  formatUptime,
  getStatusBg,
  getStatusColor,
} from '../utils/utils'

const SystemPerformanceMonitor = () => {
  // File System Size (from systeminformation fsSize())

  const [fsSize, setFsSize] = useState()

  // State for dynamic metrics

  const [uptime, setUptime] = useState(0)

  const [cpuUsage, setCpuUsage] = useState(0)

  const [cpuTemp, setCpuTemp] = useState(0)

  const [cpuInfo, setCpuInfo] = useState({})

  const [memoryInfo, setMemoryInfo] = useState({})

  const [diskLayout, setDiskLayout] = useState([])

  const [blockDevices, setBlockDevices] = useState([])

  // File System Stats (from systeminformation fsStats())

  const [fsStats, setFsStats] = useState({})

  const [networkDown, setNetworkDown] = useState(0)

  const [networkUp, setNetworkUp] = useState(0)

  const [isOnline, setIsOnline] = useState(navigator.onLine)

  const [cpuHistory, setCpuHistory] = useState(Array(30).fill(0))

  const [memHistory, setMemHistory] = useState(Array(30).fill(0))

  const [diskIO, setDiskIO] = useState({
    rIO: 0,

    wIO: 0,

    tIO: 0,

    rIO_sec: 0,

    wIO_sec: 0,

    tIO_sec: 0,
  })

  // History arrays - store the per-second values

  const [diskIOHistory, setDiskIOHistory] = useState(Array(30).fill(0))

  const cpuCanvasRef = useRef(null)

  const memCanvasRef = useRef(null)

  const diskCanvasRef = useRef(null)

  useEffect(() => {
    socket.on('cpu_update', (cpuData) => {
      setCpuInfo(cpuData)

      const newCpu = Math.max(10, Math.min(95, cpuData.load || 0))

      setCpuUsage(newCpu)

      setCpuHistory((prev) => [...prev.slice(1), newCpu])

      setCpuTemp(cpuData.temperature || 0)

      setUptime(cpuData.uptime || 0)
    })

    socket.on('memory_update', (memData) => {
      setMemoryInfo(memData)

      const memUsedPercent = (memData.used / memData.total) * 100

      setMemHistory((prev) => [...prev.slice(1), memUsedPercent])
    })

    socket.on('block_devices_update', (blockDevicesData) => {
      setBlockDevices(blockDevicesData)
    })

    socket.on('disk_layout_update', (diskData) => {
      setDiskLayout(diskData)
    })

    socket.on('fs_size_update', (fsSizeData) => {
      setFsSize(fsSizeData)
    })

    socket.on('fs_state_update', (fsStateData) => {
      setFsStats(fsStateData)
    })

    socket.on('disk_io_update', (diskIOData) => {
      setDiskIO(diskIOData)

      setDiskIOHistory((prev) => [
        ...prev.slice(1),

        (diskIOData.rIO_sec || 0) + (diskIOData.wIO_sec || 0),
      ])
    })

    socket.on('network_update', (networkData) => {
      setNetworkDown(networkData.down || 0)

      setNetworkUp(networkData.up || 0)
    })
  }, [])

  // Simulate system metrics

  useEffect(() => {
    const interval = setInterval(() => {
      setIsOnline(navigator.onLine)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Draw charts

  const drawChart = (canvas, data, color) => {
    if (!canvas) return

    const ctx = canvas.getContext('2d')

    const width = canvas.width

    const height = canvas.height

    ctx.clearRect(0, 0, width, height)

    // Gradient

    const gradient = ctx.createLinearGradient(0, 0, 0, height)

    gradient.addColorStop(0, color.replace('1)', '0.5)'))

    gradient.addColorStop(1, color.replace('1)', '0.0)'))

    ctx.fillStyle = gradient

    ctx.beginPath()

    ctx.moveTo(0, height)

    const maxValue = Math.max(...data, 1)

    data.forEach((value, index) => {
      const x = (width / (data.length - 1)) * index

      const y = height - (value / maxValue) * height

      if (index === 0) ctx.lineTo(x, y)
      else ctx.lineTo(x, y)
    })

    ctx.lineTo(width, height)

    ctx.closePath()

    ctx.fill()

    // Line

    ctx.strokeStyle = color

    ctx.lineWidth = 2

    ctx.beginPath()

    data.forEach((value, index) => {
      const x = (width / (data.length - 1)) * index

      const y = height - (value / maxValue) * height

      if (index === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })

    ctx.stroke()
  }

  useEffect(() => {
    drawChart(cpuCanvasRef.current, cpuHistory, 'rgba(59, 130, 246, 1)')
  }, [cpuHistory])

  useEffect(() => {
    drawChart(memCanvasRef.current, memHistory, 'rgba(168, 85, 247, 1)')
  }, [memHistory])

  useEffect(() => {
    drawChart(diskCanvasRef.current, diskIOHistory, 'rgba(34, 197, 94, 1)')
  }, [diskIOHistory])

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}

        <div className='mb-8 flex items-center justify-between flex-wrap gap-4'>
          <div className='flex items-center gap-4'>
            <div className='bg-blue-500 p-3 rounded-xl'>
              <Activity className='w-8 h-8' />
            </div>

            <div>
              <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
                System Performance Monitor
              </h1>

              <p className='text-gray-400 text-sm mt-1'>
                Real-time system metrics and monitoring
              </p>
            </div>
          </div>

          <div className='flex items-center gap-6'>
            <div className='flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700'>
              <Clock className='w-4 h-4 text-blue-400' />

              <span className='text-sm font-mono'>
                Up time: {formatUptime(uptime)}
              </span>
            </div>

            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isOnline ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'}`}
            >
              {isOnline ? (
                <Wifi className='w-4 h-4 text-green-400' />
              ) : (
                <WifiOff className='w-4 h-4 text-red-400' />
              )}

              <span className='text-sm font-semibold'>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
          {/* CPU Card */}

          <div className='bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-3'>
                <div className='bg-blue-500/20 p-2 rounded-lg'>
                  <Cpu className='w-5 h-5 text-blue-400' />
                </div>

                <span className='text-gray-300 font-medium'>CPU Usage</span>
              </div>

              <Zap className={`w-5 h-5 ${getStatusColor(cpuUsage)}`} />
            </div>

            <div className='mb-2'>
              <div className={`text-4xl font-bold ${getStatusColor(cpuUsage)}`}>
                {cpuUsage.toFixed(1)}%
              </div>

              <div className='text-sm text-gray-400 mt-1'>
                {cpuUsage > 50 ? 'High Load' : 'Normal'}
              </div>
            </div>

            <div className='h-2 bg-gray-700 rounded-full overflow-hidden mt-4'>
              <div
                className={`h-full ${getStatusBg(cpuUsage)} transition-all duration-300`}
                style={{ width: `${cpuUsage}%` }}
              />
            </div>
          </div>

          {/* Memory Card */}

          <div className='bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-purple-500/50 transition-all'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-3'>
                <div className='bg-purple-500/20 p-2 rounded-lg'>
                  <Database className='w-5 h-5 text-purple-400' />
                </div>

                <span className='text-gray-300 font-medium'>Memory</span>
              </div>

              <Activity
                className={`w-5 h-5 ${getStatusColor((memoryInfo.used / memoryInfo.total) * 100)}`}
              />
            </div>

            <div className='mb-2'>
              <div className='text-4xl font-bold text-purple-400'>
                {formatBytes(memoryInfo.used)}
              </div>

              <div className='text-sm text-gray-400 mt-1'>
                of {formatBytes(memoryInfo.total)} (
                {((memoryInfo.used / memoryInfo.total) * 100).toFixed(1)}%)
              </div>
            </div>

            <div className='h-2 bg-gray-700 rounded-full overflow-hidden mt-4'>
              <div
                className='h-full bg-purple-500 transition-all duration-300'
                style={{
                  width: `${(memoryInfo.used / memoryInfo.total) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Disk Space Card */}

          <div className='bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-orange-500/50 transition-all'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-3'>
                <div className='bg-orange-500/20 p-2 rounded-lg'>
                  <HardDrive className='w-5 h-5 text-orange-400' />
                </div>

                <span className='text-gray-300 font-medium'>Disk Space</span>
              </div>

              <Server className='w-5 h-5 text-orange-400' />
            </div>

            <div className='mb-2'>
              <div className='text-4xl font-bold text-orange-400'>
                {fsSize?.length > 0 ? formatBytes(fsSize[0].used) : '0 B'}
              </div>

              <div className='text-sm text-gray-400 mt-1'>
                of {fsSize?.length > 0 ? formatBytes(fsSize[0].size) : '0 B'} (
                {fsSize?.length > 0 ? fsSize[0].use.toFixed(1) : 0}%)
              </div>
            </div>

            <div className='h-2 bg-gray-700 rounded-full overflow-hidden mt-4'>
              <div
                className='h-full bg-orange-500 transition-all duration-300'
                style={{ width: `${fsSize?.length > 0 ? fsSize[0].use : 0}%` }}
              />
            </div>
          </div>

          {/* Temperature Card */}

          <div className='bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-red-500/50 transition-all'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-3'>
                <div className='bg-red-500/20 p-2 rounded-lg'>
                  <Thermometer className='w-5 h-5 text-red-400' />
                </div>

                <span className='text-gray-300 font-medium'>CPU Temp</span>
              </div>

              <TrendingUp
                className={`w-5 h-5 ${getStatusColor(cpuTemp, [60, 75])}`}
              />
            </div>

            <div className='mb-2'>
              <div
                className={`text-4xl font-bold ${getStatusColor(cpuTemp, [60, 75])}`}
              >
                {cpuTemp.toFixed(1)}°C
              </div>

              <div className='text-sm text-gray-400 mt-1'>
                {cpuTemp < 60 ? 'Cool' : cpuTemp < 75 ? 'Warm' : 'Hot'}
              </div>
            </div>

            <div className='h-2 bg-gray-700 rounded-full overflow-hidden mt-4'>
              <div
                className={`h-full ${getStatusBg(cpuTemp, [60, 75])} transition-all duration-300`}
                style={{ width: `${cpuTemp > 100 ? 100 : cpuTemp}%` }}
              />
            </div>
          </div>

          {/* Network Traffic Card */}

          <div className='bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-green-500/50 transition-all'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-3'>
                <div className='bg-green-500/20 p-2 rounded-lg'>
                  <Wifi className='w-5 h-5 text-green-400' />
                </div>

                <span className='text-gray-300 font-medium'>Network</span>
              </div>

              <Gauge className='w-5 h-5 text-green-400' />
            </div>

            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <TrendingDown className='w-4 h-4 text-green-400' />

                  <span className='text-xs text-gray-400'>Down</span>
                </div>

                <span className='text-sm font-bold text-white'>
                  {formatBytesPerSec(networkDown)}
                </span>
              </div>

              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <TrendingUp className='w-4 h-4 text-blue-400' />

                  <span className='text-xs text-gray-400'>Up</span>
                </div>

                <span className='text-sm font-bold text-white'>
                  {formatBytesPerSec(networkUp)}
                </span>
              </div>
            </div>

            <div className='h-1.5 bg-gray-700 rounded-full overflow-hidden mt-4'>
              <div
                className='h-full bg-green-500 transition-all duration-300'
                style={{
                  width: networkDown > 0 || networkUp > 0 ? '100%' : '0%',
                }}
              />
            </div>
          </div>
        </div>

        {/* CPU Details Section */}

        <div className='mb-6'>
          <div className='bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6'>
            <h3 className='text-xl font-semibold mb-6 flex items-center gap-2'>
              <Chip className='w-6 h-6 text-blue-400' />
              Processor Information
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
              {/* Main CPU Info */}

              <div className='col-span-1 md:col-span-2 lg:col-span-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-5'>
                <div className='flex items-center gap-4 mb-3'>
                  <div className='bg-blue-500/20 p-3 rounded-lg'>
                    <Cpu className='w-8 h-8 text-blue-400' />
                  </div>

                  <div>
                    <h4 className='text-2xl font-bold text-blue-400'>
                      {cpuInfo?.manufacturer} {cpuInfo?.brand}
                    </h4>

                    <p className='text-gray-400 text-sm'>
                      {cpuInfo?.cores}-Core Processor • {cpuInfo?.socket}
                    </p>
                  </div>
                </div>

                <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mt-4'>
                  <div className='bg-gray-800/50 rounded-lg p-3'>
                    <div className='text-xs text-gray-400 mb-1'>Base Clock</div>

                    <div className='text-lg font-bold text-white'>
                      {cpuInfo?.speed} GHz
                    </div>
                  </div>

                  <div className='bg-gray-800/50 rounded-lg p-3'>
                    <div className='text-xs text-gray-400 mb-1'>
                      Total Cores
                    </div>

                    <div className='text-lg font-bold text-white'>
                      {cpuInfo?.cores}
                    </div>
                  </div>

                  <div className='bg-gray-800/50 rounded-lg p-3'>
                    <div className='text-xs text-gray-400 mb-1'>P-Cores</div>

                    <div className='text-lg font-bold text-green-400'>
                      {cpuInfo?.performanceCores}
                    </div>
                  </div>

                  <div className='bg-gray-800/50 rounded-lg p-3'>
                    <div className='text-xs text-gray-400 mb-1'>E-Cores</div>

                    <div className='text-lg font-bold text-blue-400'>
                      {cpuInfo?.efficiencyCores}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cache */}

              <div className='bg-gray-700/30 rounded-xl p-4 border border-gray-600/50'>
                <div className='flex items-center gap-2 mb-3'>
                  <Database className='w-4 h-4 text-orange-400' />

                  <span className='text-sm font-semibold text-gray-300'>
                    Cache
                  </span>
                </div>

                <div className='space-y-2'>
                  <div className='flex justify-between items-center'>
                    <span className='text-xs text-gray-400'>L1 Data</span>

                    <span className='text-sm font-bold text-white'>
                      {formatCacheSize(cpuInfo?.cache?.l1d)}
                    </span>
                  </div>

                  <div className='flex justify-between items-center'>
                    <span className='text-xs text-gray-400'>
                      L1 Instruction
                    </span>

                    <span className='text-sm font-bold text-white'>
                      {formatCacheSize(cpuInfo?.cache?.l1i)}
                    </span>
                  </div>

                  <div className='flex justify-between items-center'>
                    <span className='text-xs text-gray-400'>L2</span>

                    <span className='text-sm font-bold text-orange-400'>
                      {formatCacheSize(cpuInfo?.cache?.l2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Features */}

              <div className='bg-gray-700/30 rounded-xl p-4 border border-gray-600/50 col-span-3'>
                <div className='flex items-center gap-2 mb-3'>
                  <Info className='w-4 h-4 text-blue-400' />

                  <span className='text-sm font-semibold text-gray-300'>
                    Features & Status
                  </span>
                </div>

                <div className='grid grid-cols-3 gap-3'>
                  <div className='flex justify-between items-center'>
                    <span className='text-xs text-gray-400'>
                      Virtualization
                    </span>

                    <span
                      className={`text-sm font-bold ${cpuInfo?.virtualization ? 'text-green-400' : 'text-red-400'}`}
                    >
                      {cpuInfo?.virtualization ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>

                  <div className='flex justify-between items-center'>
                    <span className='text-xs text-gray-400'>
                      Physical Cores
                    </span>

                    <span className='text-sm font-bold text-white'>
                      {cpuInfo?.physicalCores}
                    </span>
                  </div>

                  <div className='flex justify-between items-center'>
                    <span className='text-xs text-gray-400'>Processors</span>

                    <span className='text-sm font-bold text-white'>
                      {cpuInfo?.processors}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Distribution */}

            <div className='bg-gray-700/30 rounded-xl p-4 border border-gray-600/50'>
              <h4 className='text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2'>
                <Cpu className='w-4 h-4' />
                Core Distribution
              </h4>

              <div className='flex gap-2 mb-2'>
                {[...Array(cpuInfo?.performanceCores)].map((_, i) => (
                  <div
                    key={`p-${i}`}
                    className='flex-1 h-12 bg-gradient-to-t from-green-500 to-green-400 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-green-500/50'
                  >
                    P{i + 1}
                  </div>
                ))}

                {[...Array(cpuInfo?.efficiencyCores)].map((_, i) => (
                  <div
                    key={`e-${i}`}
                    className='flex-1 h-12 bg-gradient-to-t from-blue-500 to-blue-400 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-blue-500/50'
                  >
                    E{i + 1}
                  </div>
                ))}
              </div>

              <div className='flex gap-4 text-xs text-gray-400 mt-3'>
                <div className='flex items-center gap-2'>
                  <div className='w-3 h-3 rounded bg-green-500'></div>

                  <span>Performance Cores ({cpuInfo?.performanceCores})</span>
                </div>

                <div className='flex items-center gap-2'>
                  <div className='w-3 h-3 rounded bg-blue-500'></div>

                  <span>Efficiency Cores ({cpuInfo?.efficiencyCores})</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Memory Details */}

        <div className='mb-6'>
          <div className='bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6'>
            <h3 className='text-xl font-semibold mb-6 flex items-center gap-2'>
              <Database className='w-6 h-6 text-purple-400' />
              Memory Information
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              <div className='bg-gray-700/30 rounded-xl p-4 border border-gray-600/50'>
                <div className='text-xs text-gray-400 mb-2'>Total Memory</div>

                <div className='text-2xl font-bold text-purple-400'>
                  {formatBytes(memoryInfo.total)}
                </div>
              </div>

              <div className='bg-gray-700/30 rounded-xl p-4 border border-gray-600/50'>
                <div className='text-xs text-gray-400 mb-2'>Used Memory</div>

                <div className='text-2xl font-bold text-red-400'>
                  {formatBytes(memoryInfo.used)}
                </div>

                <div className='text-xs text-gray-400 mt-1'>
                  {((memoryInfo.used / memoryInfo.total) * 100).toFixed(1)}%
                </div>
              </div>

              <div className='bg-gray-700/30 rounded-xl p-4 border border-gray-600/50'>
                <div className='text-xs text-gray-400 mb-2'>
                  Available Memory
                </div>

                <div className='text-2xl font-bold text-green-400'>
                  {formatBytes(memoryInfo.available)}
                </div>

                <div className='text-xs text-gray-400 mt-1'>
                  {((memoryInfo.available / memoryInfo.total) * 100).toFixed(1)}
                  %
                </div>
              </div>

              <div className='bg-gray-700/30 rounded-xl p-4 border border-gray-600/50'>
                <div className='text-xs text-gray-400 mb-2'>Active Memory</div>

                <div className='text-2xl font-bold text-yellow-400'>
                  {formatBytes(memoryInfo.active)}
                </div>

                <div className='text-xs text-gray-400 mt-1'>
                  {((memoryInfo.active / memoryInfo.total) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disk Layout & Block Devices */}

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
          {/* Disk Layout */}

          <div className='bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6'>
            <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
              <HardDrive className='w-5 h-5 text-orange-400' />
              Physical Disk Layout
            </h3>

            {diskLayout.map((disk, idx) => (
              <div
                key={idx}
                className='bg-gray-700/30 rounded-xl p-4 border border-gray-600/50'
              >
                <div className='flex items-center justify-between mb-3'>
                  <div className='flex items-center gap-2'>
                    <MonitorCheck className='w-5 h-5 text-green-400' />

                    <span className='font-semibold text-white'>
                      {disk.name}
                    </span>
                  </div>

                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      disk.smartStatus === 'verified'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {disk.smartStatus.toUpperCase()}
                  </span>
                </div>

                <div className='grid grid-cols-2 gap-3 text-sm'>
                  <div>
                    <div className='text-gray-400 text-xs'>Type</div>

                    <div className='text-white font-semibold'>{disk.type}</div>
                  </div>

                  <div>
                    <div className='text-gray-400 text-xs'>Size</div>

                    <div className='text-white font-semibold'>
                      {formatBytes(disk.size)}
                    </div>
                  </div>

                  <div>
                    <div className='text-gray-400 text-xs'>Interface</div>

                    <div className='text-white font-semibold'>
                      {disk.interfaceType}
                    </div>
                  </div>

                  <div>
                    <div className='text-gray-400 text-xs'>Firmware</div>

                    <div className='text-white font-semibold'>
                      {disk.firmwareRevision}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Block Devices */}

          <div className='bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6'>
            <h3 className='text-lg font-semibold mb-4 flex items-center gap-2 text-white'>
              <Server className='w-5 h-5 text-blue-400' />
              Block Devices
            </h3>

            <div className='overflow-x-auto'>
              <table className='w-full text-left text-sm'>
                <thead>
                  <tr className='text-gray-400 border-b border-gray-700'>
                    <th className='pb-3 font-medium'>Device</th>

                    <th className='pb-3 font-medium'>Size</th>

                    <th className='pb-3 font-medium'>Mount Point</th>

                    <th className='pb-3 font-medium text-right'>FS Type</th>
                  </tr>
                </thead>

                <tbody className='divide-y divide-gray-700/50'>
                  {blockDevices.map((device, idx) => (
                    <tr
                      key={idx}
                      className='hover:bg-gray-700/20 transition-colors'
                    >
                      <td className='py-3 flex items-center gap-2'>
                        <FolderOpen className='w-4 h-4 text-blue-400' />

                        <span className='text-white font-medium'>
                          {device.label || device.name}
                        </span>
                      </td>

                      <td className='py-3 text-gray-300'>
                        {formatBytes(device.size)}
                      </td>

                      <td className='py-3 text-gray-400 font-mono text-xs'>
                        {device.mount || '—'}
                      </td>

                      <td className='py-3 text-right'>
                        <span className='px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20'>
                          {device.fsType}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Charts Grid */}

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6'>
          <div className='bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6'>
            <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
              <Cpu className='w-5 h-5 text-blue-400' />
              CPU History
            </h3>

            <canvas
              ref={cpuCanvasRef}
              width='400'
              height='150'
              className='w-full'
            />
          </div>

          <div className='bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6'>
            <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
              <Database className='w-5 h-5 text-purple-400' />
              Memory Usage
            </h3>

            <canvas
              ref={memCanvasRef}
              width='400'
              height='150'
              className='w-full'
            />
          </div>

          <div className='bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6'>
            <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
              <HardDrive className='w-5 h-5 text-green-400' />
              Disk I/O Activity
            </h3>

            <canvas
              ref={diskCanvasRef}
              width='400'
              height='150'
              className='w-full'
            />
          </div>
        </div>

        {/* Disk IO & File System Stats */}

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
          {/* Disk IO Stats */}

          <div className='bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6'>
            <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
              <HardDrive className='w-5 h-5 text-green-400' />
              Disk I/O Statistics
            </h3>

            <div className='space-y-3'>
              {/* Read Operations */}

              <div className='flex items-center justify-between p-4 bg-gray-700/50 rounded-lg'>
                <div className='flex items-center gap-3'>
                  <HardDriveDownload className='w-5 h-5 text-green-400' />

                  <div>
                    <div className='text-sm text-gray-400'>Read Operations</div>

                    <div className='text-xs text-gray-500'>
                      Total: {diskIO?.rIO?.toLocaleString() || 0} IO
                    </div>
                  </div>
                </div>

                <span className='text-xl font-bold text-green-400'>
                  {Math.round(diskIO?.rIO_sec || 0)} IO/s
                </span>
              </div>

              {/* Write Operations */}

              <div className='flex items-center justify-between p-4 bg-gray-700/50 rounded-lg'>
                <div className='flex items-center gap-3'>
                  <HardDriveUpload className='w-5 h-5 text-blue-400' />

                  <div>
                    <div className='text-sm text-gray-400'>
                      Write Operations
                    </div>

                    <div className='text-xs text-gray-500'>
                      Total: {diskIO?.wIO?.toLocaleString() || 0} IO
                    </div>
                  </div>
                </div>

                <span className='text-xl font-bold text-blue-400'>
                  {Math.round(diskIO?.wIO_sec || 0)} IO/s
                </span>
              </div>

              {/* Total Operations */}

              <div className='flex items-center justify-between p-4 bg-gray-700/50 rounded-lg'>
                <div className='flex items-center gap-3'>
                  <Activity className='w-5 h-5 text-purple-400' />

                  <div>
                    <div className='text-sm text-gray-400'>
                      Total Operations
                    </div>

                    <div className='text-xs text-gray-500'>
                      Total: {diskIO?.tIO?.toLocaleString() || 0} IO
                    </div>
                  </div>
                </div>

                <span className='text-xl font-bold text-purple-400'>
                  {Math.round(diskIO?.tIO_sec || 0)} IO/s
                </span>
              </div>
            </div>
          </div>

          {/* File System Stats */}

          <div className='bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6'>
            <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
              <FileText className='w-5 h-5 text-orange-400' />
              File System Transfer Stats
            </h3>

            <div className='space-y-3'>
              <div className='flex items-center justify-between p-4 bg-gray-700/50 rounded-lg'>
                <div className='flex items-center gap-3'>
                  <TrendingDown className='w-5 h-5 text-green-400' />

                  <div>
                    <div className='text-sm text-gray-400'>Bytes Read</div>

                    <div className='text-xs text-gray-500'>
                      Total: {formatBytes(fsStats.rx)}
                    </div>
                  </div>
                </div>

                <span className='text-xl font-bold text-green-400'>
                  {formatBytesPerSec(fsStats.rx_sec)}
                </span>
              </div>

              <div className='flex items-center justify-between p-4 bg-gray-700/50 rounded-lg'>
                <div className='flex items-center gap-3'>
                  <TrendingUp className='w-5 h-5 text-blue-400' />

                  <div>
                    <div className='text-sm text-gray-400'>Bytes Written</div>

                    <div className='text-xs text-gray-500'>
                      Total: {formatBytes(fsStats.wx)}
                    </div>
                  </div>
                </div>

                <span className='text-xl font-bold text-blue-400'>
                  {formatBytesPerSec(fsStats.wx_sec)}
                </span>
              </div>

              <div className='flex items-center justify-between p-4 bg-gray-700/50 rounded-lg'>
                <div className='flex items-center gap-3'>
                  <Activity className='w-5 h-5 text-purple-400' />

                  <div>
                    <div className='text-sm text-gray-400'>Total Transfer</div>

                    <div className='text-xs text-gray-500'>
                      Total: {formatBytes(fsStats.tx)}
                    </div>
                  </div>
                </div>

                <span className='text-xl font-bold text-purple-400'>
                  {formatBytesPerSec(fsStats.tx_sec)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* File System Details */}

        <div className='bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6'>
          <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
            <FolderOpen className='w-5 h-5 text-blue-400' />
            Mounted File Systems
          </h3>

          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='text-left border-b border-gray-700'>
                  <th className='pb-3 text-sm text-gray-400'>Mount Point</th>

                  <th className='pb-3 text-sm text-gray-400'>Type</th>

                  <th className='pb-3 text-sm text-gray-400'>Size</th>

                  <th className='pb-3 text-sm text-gray-400'>Used</th>

                  <th className='pb-3 text-sm text-gray-400'>Available</th>

                  <th className='pb-3 text-sm text-gray-400'>Usage</th>

                  <th className='pb-3 text-sm text-gray-400'>R/W</th>
                </tr>
              </thead>

              <tbody>
                {fsSize?.map((fs, idx) => (
                  <tr key={idx} className='border-b border-gray-700/50'>
                    <td className='py-3 font-mono text-sm text-white'>
                      {fs.mount}
                    </td>

                    <td className='py-3 text-sm text-gray-300'>{fs.type}</td>

                    <td className='py-3 text-sm text-gray-300'>
                      {formatBytes(fs.size)}
                    </td>

                    <td className='py-3 text-sm text-red-400'>
                      {formatBytes(fs.used)}
                    </td>

                    <td className='py-3 text-sm text-green-400'>
                      {formatBytes(fs.available)}
                    </td>

                    <td className='py-3'>
                      <div className='flex items-center gap-2'>
                        <div className='flex-1 h-2 bg-gray-700 rounded-full overflow-hidden'>
                          <div
                            className={`h-full ${getStatusBg(fs.use)}`}
                            style={{ width: `${fs.use}%` }}
                          />
                        </div>

                        <span
                          className={`text-sm font-bold ${getStatusColor(fs.use)}`}
                        >
                          {fs.use.toFixed(1)}%
                        </span>
                      </div>
                    </td>

                    <td className='py-3'>
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          fs.rw
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {fs.rw ? 'R/W' : 'RO'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemPerformanceMonitor
