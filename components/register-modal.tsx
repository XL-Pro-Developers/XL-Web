"use client"

import { useEffect, useId, useState } from "react"
import type React from "react"

import { GlowButton } from "./glow-button"
import type { EventData } from "./event-card"
import { Input } from "./ui/input"

type Member = { name: string; email: string }

interface RegisterModalProps {
  open: boolean
  onClose: () => void
  event: EventData
}

export function RegisterModal({ open, onClose, event }: RegisterModalProps) {
  const dialogId = useId()
  const [teamName, setTeamName] = useState("")
  const [teamSize, setTeamSize] = useState(2)
  const [members, setMembers] = useState<Member[]>([{ name: "", email: "" }, { name: "", email: "" }])
  const [transactionId, setTransactionId] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Close on Escape key
  useEffect(() => {
    if (!open) return
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [open, onClose])

  // Disable background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  // Adjust members array based on team size
  useEffect(() => {
    setMembers(prev => {
      if (teamSize > prev.length) {
        return [...prev, ...Array(teamSize - prev.length).fill({ name: "", email: "" })]
      } else if (teamSize < prev.length) {
        return prev.slice(0, teamSize)
      }
      return prev
    })
  }, [teamSize])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    // TODO: Add your submission logic here
    setTimeout(() => setSubmitting(false), 1000) // example
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="glass border-gradient rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-xl font-bold text-gray-500 hover:text-gray-800"
          aria-label="Close"
          type="button"
        >
          ×
        </button>

        <h2 id={`${dialogId}-title`} className="font-display text-xl">
          Register for {event.title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Team size 2–4. Provide all member details and payment info.
        </p>

        {/* Payment QR */}
        <div className="mt-4 text-center">
          <img
            src={event.qrCodeUrl || "/placeholder.svg?height=200&width=200&query=payment qr code"}
            alt="Payment QR code"
            className="mx-auto h-40 w-40 rounded-md border object-contain"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Scan to pay, then upload proof.
          </p>
        </div>

        <form className="mt-4 grid gap-3" onSubmit={handleSubmit}>
          <label className="grid gap-1">
            <span className="text-sm">Team name</span>
            <input
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Team Phoenix"
              className="rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--c-primary)]"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Team size</span>
            <select
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              className="rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--c-primary)]"
            >
              {[2, 3, 4].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>

          {/* Member inputs */}
          <div className="mt-1 grid gap-3">
            {members.map((member, idx) => (
              <div key={idx} className="grid grid-cols-2 gap-2">
                <Input
                  type="text"
                  placeholder={`Member ${idx + 1} Name`}
                  value={member.name}
                  onChange={(e) => {
                    const updated = [...members]
                    updated[idx].name = e.target.value
                    setMembers(updated)
                  }}
                  required
                />
                <Input
                  type="email"
                  placeholder={`Member ${idx + 1} Email`}
                  value={member.email}
                  onChange={(e) => {
                    const updated = [...members]
                    updated[idx].email = e.target.value
                    setMembers(updated)
                  }}
                  required
                />
              </div>
            ))}
          </div>

          {/* Transaction & File */}
          <label className="grid gap-1">
            <span className="text-sm">Transaction ID</span>
            <input
              required
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Payment reference"
              className="rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--c-primary)]"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Payment proof (image/pdf)</span>
            <input
              type="file"
              accept="image/*,application/pdf"
              required
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="rounded-md border bg-background px-3 py-2 outline-none file:mr-3 file:rounded file:border-0 file:bg-[var(--c-primary)] file:px-3 file:py-1.5 file:text-sm file:text-black focus:ring-2 focus:ring-[var(--c-primary)]"
            />
          </label>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="mt-2 flex items-center gap-2">
            <GlowButton type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </GlowButton>
            <GlowButton type="button" variant="outline" onClick={onClose}>
              Cancel
            </GlowButton>
          </div>
        </form>
      </div>
    </div>
  )
}
