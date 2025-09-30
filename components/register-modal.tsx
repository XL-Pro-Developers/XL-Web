"use client"
import { useEffect, useId, useState } from "react"
import type React from "react"

import { GlowButton } from "./glow-button"
import type { EventData } from "./event-card"
import { Input } from "./ui/input"

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
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setMembers((prev) => {
      if (teamSize > prev.length) {
        // Add new empty members
        return [...prev, ...Array(teamSize - prev.length).fill({ name: "", email: "" })];
      } else if (teamSize < prev.length) {
        // Remove extra members
        return prev.slice(0, teamSize);
      }
      return prev;
    });
  }, [teamSize]);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Your form submission logic here
  }

  if (!open) return null;

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
            {members.map((member, idx) => (
              <div key={idx} className="grid grid-cols-2 gap-2">
                <Input
                  type="text"
                  placeholder={`Member ${idx + 1} Name`}
                  value={member.name}
                  onChange={e => {
                    const updated = [...members];
                    updated[idx].name = e.target.value;
                    setMembers(updated);
                  }}
                  required
                />
                <Input
                  type="email"
                  placeholder={`Member ${idx + 1} Email`}
                  value={member.email}
                  onChange={e => {
                    const updated = [...members];
                    updated[idx].email = e.target.value;
                    setMembers(updated);
                  }}
                  required
                />
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
