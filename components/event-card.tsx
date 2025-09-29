"use client"
import Image from "next/image"
import { GlassCard } from "./glass-card"
import { GlowButton } from "./glow-button"
import { useState } from "react"
import { RegisterModal } from "./register-modal"

export type EventData = {
  slug: string
  title: string
  date?: string
  blurb?: string
  image?: string
  qrCodeUrl?: string
}

export function EventCard({ event }: { event: EventData }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <GlassCard className="p-0 overflow-hidden transition-all hover:glow-primary">
        <div className="relative">
          <Image
            src={event.image || "/placeholder.svg?height=160&width=320&query=event banner"}
            alt={`${event.title} banner`}
            width={800}
            height={400}
            className="h-40 w-full object-cover"
          />
          {event.date && (
            <span className="absolute right-2 top-2 rounded-md bg-black/60 px-2 py-1 text-xs text-white">
              {event.date}
            </span>
          )}
        </div>
        <div className="p-5">
          <h3 className="font-display text-lg">{event.title}</h3>
          {event.blurb && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{event.blurb}</p>}
          <div className="mt-4">
            <GlowButton onClick={() => setOpen(true)}>Register</GlowButton>
          </div>
        </div>
      </GlassCard>
      <RegisterModal open={open} onClose={() => setOpen(false)} event={event} />
    </>
  )
}
