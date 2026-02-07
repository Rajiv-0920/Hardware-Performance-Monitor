import React, { useEffect, useRef } from 'react'

const Sparkline = ({ data, color, height = 150 }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const { width, height } = canvas

    ctx.clearRect(0, 0, width, height)
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, color.replace('1)', '0.4)'))
    gradient.addColorStop(1, color.replace('1)', '0.0)'))

    const maxValue = Math.max(...data, 1)
    const points = data.map((val, i) => ({
      x: (width / (data.length - 1)) * i,
      y: height - (val / maxValue) * height,
    }))

    // Area
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.moveTo(0, height)
    points.forEach((p) => ctx.lineTo(p.x, p.y))
    ctx.lineTo(width, height)
    ctx.fill()

    // Line
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()
    points.forEach((p, i) =>
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y),
    )
    ctx.stroke()
  }, [data, color])

  return (
    <canvas ref={canvasRef} width='400' height={height} className='w-full' />
  )
}

export default Sparkline
