"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { GlowButton } from "./glow-button"
import { HeroMatrix } from "./hero-matrix"
import { RegisterModal } from "./register-modal"


const Prism = dynamic(() => import("./Prism"), { ssr: false })
const Hero3D = dynamic(() => import("./hero-3d"), { ssr: false })
const SplashCursor = dynamic(() => import("./SplashCursor"), { ssr: false })

const eventData = {
  title: "Codeathon 2.0",
  slug: "codeathon-2-0",
  qrCodeUrl: "",
}

export function Hero() {
  const [modalOpen, setModalOpen] = useState(false)
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
    <section className="hero-bg relative w-full min-h-screen overflow-hidden">
      {/* Background */}
      <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none w-full h-full">
        <HeroMatrix className="h-full w-full opacity-80" />
        {/* {isDesktop && <Prism />} */}
      </div>

      {/* 3D Effects & Cursor */}
      {isDesktop && <Hero3D />}
      {/* {isDesktop && <SplashCursor />} */}
      
      {/* Hero Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 sm:py-24 md:py-32 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Text */}
        <div className="flex flex-col justify-center gap-6">
          <h1 className="font-display text-pretty text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Build. Learn. Ship.
            <br />
            Join the XL Pro Developer Community
          </h1>
          <p className="text-pretty text-base md:text-lg text-muted-foreground">
            A futuristic, minimal community for developers. Events, projects, chat, and more—designed for speed and clarity.
          </p>
        </div>

        {/* Codeathon Box */}
        <div className="relative min-h-[350px] md:min-h-[450px] flex items-center justify-center">
          <div className="glass rounded-2xl p-6 border-gradient w-full">
            <div className="space-y-2">
              <video
                src="https://uomobeznhbvlzengqqxl.supabase.co/storage/v1/object/public/website%20stuff/WhatsApp%20Video%202025-09-30%20at%2019.14.20_3485c314.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full rounded-lg mb-2 object-cover aspect-video"
                poster="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80"
              />
              <h3 className="font-display text-lg">Codeathon 2.0</h3>
              <p className="text-sm text-muted-foreground">
                Join us for a weekend of coding, collaboration, and fun! Open to all skill levels.
              </p>
              <GlowButton className="mt-2 w-full" onClick={() => setModalOpen(true)}>
                Register Now
              </GlowButton>
            </div>
          </div>
        </div>
      </div>

      {/* Register Modal */}
      <RegisterModal open={modalOpen} onClose={() => setModalOpen(false)} event={eventData} />
    </section>
  )
}
