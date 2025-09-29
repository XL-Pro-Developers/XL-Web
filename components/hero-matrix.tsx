"use client"

import { useEffect, useRef } from "react"

export function HeroMatrix({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // Resize handling
    let width = (canvas.width = canvas.offsetWidth || window.innerWidth)
    let height = (canvas.height = canvas.offsetHeight || 500)

    const onResize = () => {
      width = canvas.width = canvas.offsetWidth || window.innerWidth
      height = canvas.height = canvas.offsetHeight || 500
      // Recompute columns
      columns = Math.floor(width / fontSize)
      drops = Array(columns).fill(1)
    }
    const ro = new ResizeObserver(onResize)
    ro.observe(canvas)

    // Matrix rain setup
    const characters =
      "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロゴゾドボポ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const chars = characters.split("")
    const fontSize = 14
    let columns = Math.floor(width / fontSize)
    let drops = Array(columns).fill(1)

    // Colors via design tokens: primary neon for glyphs, subtle dark backdrop
    const glyphColor = getComputedStyle(document.documentElement).getPropertyValue("--c-accent") || "#00FFC2"
    const fadeBg = "rgba(0,0,0,0.12)" // subtler trail and lower visibility

    let raf = 0
    const draw = () => {
      if (!ctx) return
      // fade effect
      ctx.fillStyle = fadeBg
      ctx.fillRect(0, 0, width, height)

      ctx.fillStyle = glyphColor.trim() || "#00FFC2"
      ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize
        ctx.fillText(text, x, y)

        if (y > height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      }
      raf = requestAnimationFrame(draw)
    }

    if (!prefersReduced) {
      // Prime a darker base so trails look nice
      ctx.fillStyle = "rgba(0,0,0,0.25)"
      ctx.fillRect(0, 0, width, height)
      raf = requestAnimationFrame(draw)
    } else {
      // Static subtle background for reduced motion
      ctx.fillStyle = "rgba(0,0,0,0.12)"
      ctx.fillRect(0, 0, width, height)
      ctx.fillStyle = glyphColor.trim() || "#00FFC2"
      ctx.font = `${fontSize}px ui-monospace, monospace`
      for (let i = 0; i < columns; i++) {
        const x = i * fontSize
        const y = (i % 3) * fontSize * 3 + 80
        ctx.fillText(chars[(i * 7) % chars.length], x, y)
      }
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  return <canvas ref={ref} className={className} aria-hidden />
}
