"use client"
import { useEffect, useId, useState } from "react"
import type React from "react"

import { GlowButton } from "./glow-button"
import type { EventData } from "./event-card"

type Member = { name: string; email: string }

export function RegisterModal({
  open,
  onClose,
  event,
}: {
  open: boolean
  onClose: () => void
  event: EventData
}) {
  const dialogId = useId()
  const [teamName, setTeamName] = useState("")
  const [teamSize, setTeamSize] = useState<number>(2)
  const [members, setMembers] = useState<Member[]>([
    { name: "", email: "" },
    { name: "", email: "" },
  ])
  const [transactionId, setTransactionId] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState(false)

  useEffect(() => {
    if (!open) return
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
    
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener("keydown", handler)
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) {
      setTeamName("")
      setTeamSize(2)
      setMembers([
        { name: "", email: "" },
        { name: "", email: "" },
      ])
      setTransactionId("")
      setFile(null)
      setError(null)
      setOk(false)
    }
  }, [open])

  useEffect(() => {
    // keep members array in sync with teamSize
    if (teamSize < 2) setTeamSize(2)
    if (teamSize > 4) setTeamSize(4)
    setMembers((prev) => {
      const next = [...prev]
      if (teamSize > next.length) {
        while (next.length < teamSize) next.push({ name: "", email: "" })
      } else if (teamSize < next.length) {
        next.length = teamSize
      }
      return next
    })
  }, [teamSize])

  if (!open) return null

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setOk(false)

    try {
      const form = new FormData()
      form.append("team_name", teamName)
      form.append("team_size", String(teamSize))
      form.append("members", JSON.stringify(members))
      form.append("transaction_id", transactionId)
      form.append("event_title", event.title)
      if (file) form.append("payment_proof", file)

      const res = await fetch(`/api/events/${event.slug}/register`, {
        method: "POST",
        body: form,
      })

      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j?.error || `Request failed with ${res.status}`)
      }

      setOk(true)
      onClose()
    } catch (err: any) {
      setError(err?.message || "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${dialogId}-title`}
      className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/90 backdrop-blur-md px-4 py-8 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="glass w-full max-w-2xl rounded-2xl p-6 md:p-8 border-gradient shadow-2xl relative z-[10000] my-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 id={`${dialogId}-title`} className="font-display text-2xl md:text-3xl font-bold">
              Register for {event.title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Team size 2–4. Provide all member details and payment info.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-2"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Payment QR */}
        <div className="mb-6 p-4 rounded-xl bg-muted/20 border">
          <img
            src={event.qrCodeUrl || "/placeholder.svg?height=200&width=200&query=payment qr code"}
            alt="Payment QR code"
            className="mx-auto h-48 w-48 rounded-lg border-2 object-contain bg-white"
          />
          <p className="mt-3 text-center text-sm font-medium">Scan to pay, then upload proof below</p>
        </div>

        <form className="grid gap-4" onSubmit={submit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium">Team Name</span>
              <input
                required
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="Team Phoenix"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium">Team Size</span>
              <select
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary transition-all"
              >
                <option value={2}>2 Members</option>
                <option value={3}>3 Members</option>
                <option value={4}>4 Members</option>
              </select>
            </label>
          </div>

          <div className="mt-2 grid gap-4">
            <h3 className="text-lg font-semibold">Team Members</h3>
            {members.map((m, idx) => (
              <div key={idx} className="rounded-xl border bg-muted/10 p-4">
                <div className="mb-3 text-sm font-semibold text-primary">Member {idx + 1}</div>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-xs font-medium">Full Name</span>
                    <input
                      required
                      value={m.name}
                      onChange={(e) =>
                        setMembers((prev) => {
                          const next = [...prev]
                          next[idx] = { ...next[idx], name: e.target.value }
                          return next
                        })
                      }
                      className="rounded-lg border bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary transition-all"
                      placeholder="John Doe"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-xs font-medium">Email Address</span>
                    <input
                      required
                      type="email"
                      value={m.email}
                      onChange={(e) =>
                        setMembers((prev) => {
                          const next = [...prev]
                          next[idx] = { ...next[idx], email: e.target.value }
                          return next
                        })
                      }
                      className="rounded-lg border bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary transition-all"
                      placeholder="john@example.com"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium">Transaction ID</span>
              <input
                required
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="TXN123456789"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium">Payment Proof</span>
              <input
                required
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="rounded-lg border bg-background px-4 py-3 outline-none file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90 focus:ring-2 focus:ring-primary transition-all"
              />
            </label>
          </div>

          {error ? (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <div className="mt-4 flex items-center gap-3">
            <GlowButton type="submit" disabled={submitting} className="flex-1">
              {submitting ? "Submitting..." : "Submit Registration"}
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