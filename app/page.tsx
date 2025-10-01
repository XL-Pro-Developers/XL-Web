// app/page.tsx
"use client"

import { useState } from "react"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/footer"
import { Hero } from "@/components/hero"
import { RegisterModal } from "@/components/register-modal"

const eventData = {
  title: "Codeathon 2.0",
  slug: "codeathon-2-0",
  qrCodeUrl: "",
}

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      {/* Fixed Navbar with semi-transparent background */}
      <SiteNav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-background/50 to-transparent backdrop-blur-md" />



      {/* Hero Section */}
      <Hero onRegisterClick={() => setModalOpen(true)} />

      {/* Content Section */}
      <section className="mx-auto max-w-6xl px-4 py-16 relative z-10">
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
        <RegisterModal open={modalOpen} onClose={() => setModalOpen(false)} event={eventData} />
      )}
    </>
  )
}
