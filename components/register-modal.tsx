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
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
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
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div className="glass w-full max-w-lg rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <h2 id={`${dialogId}-title`} className="font-display text-xl">
          Register for {event.title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Team size 2–4. Provide all member details and payment info.
        </p>

        {/* Payment QR (if provided via event) */}
        <div className="mt-4">
          <img
            src={event.qrCodeUrl || "/placeholder.svg?height=200&width=200&query=payment qr code"}
            alt="Payment QR code"
            className="mx-auto h-40 w-40 rounded-md border object-contain"
          />
          <p className="mt-2 text-center text-xs text-muted-foreground">Scan to pay, then upload proof.</p>
        </div>

        <form className="mt-4 grid gap-3" onSubmit={submit}>
          <label className="grid gap-1">
            <span className="text-sm">Team name</span>
            <input
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--c-primary)]"
              placeholder="Team Phoenix"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Team size</span>
            <select
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              className="rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--c-primary)]"
            >
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </select>
          </label>

          <div className="mt-1 grid gap-3">
            {members.map((m, idx) => (
              <div key={idx} className="rounded-md border p-3">
                <div className="mb-2 text-sm font-medium">Member {idx + 1}</div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="grid gap-1">
                    <span className="text-xs">Name</span>
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
                      className="rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--c-primary)]"
                      placeholder="Full name"
                    />
                  </label>
                  <label className="grid gap-1">
                    <span className="text-xs">Email</span>
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
                      className="rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--c-primary)]"
                      placeholder="you@example.com"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>

          <label className="grid gap-1">
            <span className="text-sm">Transaction ID</span>
            <input
              required
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--c-primary)]"
              placeholder="Payment reference"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Payment proof (image/pdf)</span>
            <input
              required
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="rounded-md border bg-background px-3 py-2 outline-none file:mr-3 file:rounded file:border-0 file:bg-[var(--c-primary)] file:px-3 file:py-1.5 file:text-sm file:text-black focus:ring-2 focus:ring-[var(--c-primary)]"
            />
          </label>

          {error ? <p className="text-sm text-red-500">{error}</p> : null}

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
