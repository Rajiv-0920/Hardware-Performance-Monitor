import si from 'systeminformation'

export const getSystemMetrics = async () => {
  try {
    // We can fetch static and dynamic data in parallel for better performance
    const [
      cpu,
      load,
      temp,
      speed,
      time,
      mem,
      diskLayout,
      blockDevices,
      fsSize,
      fsStats,
      netStats,
      diskIO,
    ] = await Promise.all([
      si.cpu(),
      si.currentLoad(),
      si.cpuTemperature(),
      si.cpuCurrentSpeed(),
      si.time(),
      si.mem(),
      si.diskLayout(),
      si.blockDevices(),
      si.fsSize(),
      si.fsStats(),
      si.networkStats(),
      si.disksIO(),
    ])

    return {
      cpu: {
        ...cpu,
        load: load.currentLoad,
        temperature: temp.main,
        currentSpeed: speed.avg,
        uptime: time.uptime,
      },
      memory: mem,
      diskLayout,
      blockDevices,
      fsSize,
      fsStats,
      network: {
        down: netStats[0]?.rx_sec || 0,
        up: netStats[0]?.tx_sec || 0,
        totalDown: netStats[0]?.rx_bytes || 0,
        totalUp: netStats[0]?.tx_bytes || 0,
      },
      diskIO, // systeminformation calculates _sec rates automatically if called periodically
    }
  } catch (error) {
    console.error('Metrics collection error:', error)
    return null
  }
}
