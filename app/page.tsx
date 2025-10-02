"use client"

import { useState, useEffect, useRef } from "react"
import { SiteNav } from "@/components/site-nav"
import { Hero } from "@/components/hero"
import { SiteFooter } from "@/components/footer"
import { RegisterModal } from "@/components/register-modal"
import { HeroMatrix } from "@/components/hero-matrix"

const eventData = {
  title: "Codeathon 2.0",
  slug: "codeathon-2-0",
  qrCodeUrl: "",
}

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [navbarHeight, setNavbarHeight] = useState(0)
  const navRef = useRef<HTMLElement>(null)

  // Measure navbar height after page load
  useEffect(() => {
    const updateHeight = () => {
      if (navRef.current) setNavbarHeight(navRef.current.offsetHeight)
    }

    window.addEventListener("load", updateHeight)
    window.addEventListener("resize", updateHeight)
    updateHeight()

    return () => {
      window.removeEventListener("load", updateHeight)
      window.removeEventListener("resize", updateHeight)
    }
  }, [])

  // Scroll to top after layout is ready
  useEffect(() => {
    const timeout = setTimeout(() => window.scrollTo({ top: 0, left: 0 }), 50)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="relative min-h-screen">
      {/* Full-page Matrix background */}
      <HeroMatrix className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none opacity-80" />

      {/* All content above the Matrix */}
      <div className="relative z-10">
        <SiteNav ref={navRef} />

        {/* Hero section with padding to avoid negative margin */}
        <div style={{ paddingTop: navbarHeight }}>
          <Hero onRegisterClick={() => setModalOpen(true)} />
        </div>

        {/* Content Section */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-lg">Events</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Talks, workshops, and hack sessions with a futuristic twist.
              </p>
            </div>
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-lg">Members</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Meet builders across batches, roles, and stacks.
              </p>
            </div>
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-lg">Projects</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Showcase, collaborate, and publish your best work.
              </p>
            </div>
          </div>
        </section>

        <SiteFooter />

        {/* Register Modal */}
        {modalOpen && (
          <RegisterModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            event={eventData}
          />
        )}
      </div>
    </div>
  )
}
