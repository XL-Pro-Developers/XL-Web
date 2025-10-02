"use client"

import Link from "next/link"
import Image from "next/image"
import { GlowButton } from "./glow-button"
import { useState } from "react"
import { RegisterModal } from "./register-modal"

export function Hero() {
  const [open, setOpen] = useState(false)
  
  // Event data for Codeathon 2.0
  const codeathonEvent = {
    slug: "codeathon-2",
    title: "Codeathon 2.0",
    date: "TBA",
    blurb: "Join us for a weekend of coding, collaboration, and fun! Open to all skill levels.",
    qrCodeUrl: "/qr-code.png" // Update with your actual QR code path
  }
  
  return (
    <section className="hero-bg relative z-10">
      {/* remove local matrix; now provided globally from layout */}
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        {/* Styled Logo Section */}
        <div className="mb-12 md:mb-16 flex justify-center">
          <div className="relative group">
            {/* Glow effect behind logo */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Logo container with glass effect */}
            <div className="relative glass rounded-2xl p-3 md:p-4 border-gradient">
              <Image
                src="/xl-pro-logo.png"
                alt="XL Pro Developers - Srinivas Institute of Technology"
                width={200}
                height={100}
                className="w-full h-auto max-w-[200px]"
                priority
              />
            </div>
          </div>
        </div>

        {/* Original grid layout */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col justify-center gap-6">
            <h1 className="font-display text-pretty text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Build. Learn. Ship.
              <br />
              Join the XL Pro Developer Community
            </h1>
            <p className="text-pretty text-base text-muted-foreground md:text-lg">
              A futuristic, minimal community for developers. Events, projects, chat, and more—designed for speed and
              clarity.
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 -z-10 blur-3xl" aria-hidden>
              <div
                className="h-full w-full rounded-full"
                style={{ background: "radial-gradient(closest-side, rgba(0,209,255,0.15), transparent 60%)" }}
              />
            </div>
            <div className="glass rounded-2xl overflow-hidden border-gradient">
              {/* Video container */}
              <div className="relative aspect-video w-full bg-black">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src="/Codeathon.mp4" type="video/mp4" />
                </video>
              </div>
              {/* Content */}
              <div className="p-6 space-y-3">
                <h3 className="font-display text-2xl font-bold">Codeathon 2.0</h3>
                <p className="text-sm text-muted-foreground">
                  Join us for a weekend of coding, collaboration, and fun! Open to all skill levels.
                </p>
                <GlowButton className="w-full" onClick={() => setOpen(true)}>Register Now</GlowButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Register Modal */}
      <RegisterModal open={open} onClose={() => setOpen(false)} event={codeathonEvent} />
    </section>
  )
}