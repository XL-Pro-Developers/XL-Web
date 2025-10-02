"use client"

import { useEffect, useRef } from "react"

export function HeroMatrix({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Resize handling
    let width = (canvas.width = canvas.offsetWidth || window.innerWidth)
    let height = (canvas.height = canvas.offsetHeight || 500)

    const onResize = () => {
      width = canvas.width = canvas.offsetWidth || window.innerWidth
      height = canvas.height = canvas.offsetHeight || 500
      drawBackground()
    }
    const ro = new ResizeObserver(onResize)
    ro.observe(canvas)

    const drawBackground = () => {
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Create subtle gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.02)')
      gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.01)')
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.02)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Add subtle grid pattern
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.03)'
      ctx.lineWidth = 1

      const gridSize = 60
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // Add subtle accent circles
      const accentColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--color-primary") || "rgba(0, 100, 255, 0.05)"
      
      ctx.fillStyle = accentColor
      ctx.globalAlpha = 0.05
      
      // Top right circle
      ctx.beginPath()
      ctx.arc(width * 0.8, height * 0.2, 150, 0, Math.PI * 2)
      ctx.fill()
      
      // Bottom left circle
      ctx.beginPath()
      ctx.arc(width * 0.2, height * 0.8, 180, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.globalAlpha = 1
    }

    drawBackground()

    return () => {
      ro.disconnect()
    }
  }, [])

  return <canvas ref={ref} className={className} aria-hidden />
}