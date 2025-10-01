"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { GlowButton } from "./glow-button"
import { HeroMatrix } from "./hero-matrix"

const Prism = dynamic(() => import("./Prism"), { ssr: false })
const Hero3D = dynamic(() => import("./hero-3d"), { ssr: false })
const SplashCursor = dynamic(() => import("./SplashCursor"), { ssr: false })

export function Hero({ onRegisterClick }: { onRegisterClick: () => void }) {
  const [isDesktop, setIsDesktop] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Desktop check
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  return (
    <section className="hero-bg relative w-full h-screen overflow-hidden">
      {/* Background Container */}
      <div
        ref={containerRef}
        className="absolute inset-0 z-0 pointer-events-none w-full h-full"
      >
        <HeroMatrix className="h-full w-full opacity-80" />
        {isDesktop && <Prism />}
      </div>

      {/* 3D Effects & Cursor */}
      {isDesktop && <Hero3D />}
      {isDesktop && <SplashCursor />}

      {/* Hero Content */}
      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 h-full items-center md:grid-cols-2">
        <div className="flex flex-col justify-center gap-6">
          <h1 className="font-display text-pretty text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Build. Learn. Ship.
            <br />
            Join the XL Pro Developer Community
          </h1>
          <p className="text-pretty text-base text-muted-foreground md:text-lg">
            A futuristic, minimal community for developers. Events, projects, chat, and more—designed for speed and clarity.
          </p>
        </div>

        <div className="relative min-h-[350px] md:min-h-[450px] h-[350px] md:h-[450px] flex items-center justify-center">
          <div className="glass rounded-2xl p-6 border-gradient w-full">
            <div className="mt-4 space-y-2">
              <video
                src="https://uomobeznhbvlzengqqxl.supabase.co/storage/v1/object/public/website%20stuff/WhatsApp%20Video%202025-09-30%20at%2019.14.20_3485c314.mp4"
                autoPlay
                muted
                playsInline
                className="w-full rounded-lg mb-2 object-cover aspect-video"
                poster="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80"
                onEnded={(e) => {
                  const video = e.currentTarget
                  video.pause()
                  video.currentTime = video.duration
                }}
              />
              <h3 className="font-display text-lg">Codeathon 2.0</h3>
              <p className="text-sm text-muted-foreground">
                Join us for a weekend of coding, collaboration, and fun! Open to all skill levels.
              </p>
              <GlowButton className="mt-2 w-full" onClick={onRegisterClick}>
                Register Now
              </GlowButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
