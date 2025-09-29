"use client"
import { useState } from "react"
import type React from "react"

import { GlassCard } from "./glass-card"

type Message = { id: string; author: string; text: string; at: string }
const demoChannels = [
  { id: "general", name: "general" },
  { id: "events", name: "events" },
  { id: "collab", name: "collab" },
]
const demoMessages: Record<string, Message[]> = {
  general: [
    { id: "1", author: "Ada", text: "Welcome to XL Pro!", at: "09:10" },
    { id: "2", author: "Chirag", text: "Ship mode on 🚀", at: "09:12" },
  ],
  events: [{ id: "3", author: "Akshay", text: "Dev Summit starts next week", at: "10:00" }],
  collab: [{ id: "4", author: "Anantha", text: "Looking for a UI partner", at: "11:05" }],
}

export function ChatUI() {
  const [active, setActive] = useState("general")
  const [text, setText] = useState("")

  function send(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    // For demo, append locally. In real app, push via API/SDK.
    demoMessages[active] = [
      ...demoMessages[active],
      { id: String(Math.random()), author: "You", text, at: new Date().toLocaleTimeString() },
    ]
    setText("")
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[240px_1fr]">
      <GlassCard>
        <h3 className="font-display text-sm">Channels</h3>
        <ul className="mt-3 grid gap-2">
          {demoChannels.map((ch) => (
            <li key={ch.id}>
              <button
                className={`w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted ${active === ch.id ? "border-gradient" : "text-muted-foreground"}`}
                onClick={() => setActive(ch.id)}
              >
                #{ch.name}
              </button>
            </li>
          ))}
        </ul>
      </GlassCard>

      <div className="grid gap-4">
        <GlassCard>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg">#{active}</h3>
            <span className="text-xs text-muted-foreground">online</span>
          </div>
          <div className="mt-4 grid gap-3">
            {demoMessages[active]?.map((m) => (
              <div key={m.id} className="max-w-[80%] rounded-xl bg-muted px-3 py-2">
                <p className="text-xs text-muted-foreground">
                  {m.author} • {m.at}
                </p>
                <p className="text-sm">{m.text}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <form onSubmit={send} className="flex items-center gap-2">
          <input
            className="flex-1 rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--c-primary)]"
            placeholder="Message #channel"
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-label="Type your message"
          />
          <button className="btn-glow btn-primary rounded-md px-3 py-2 glow-primary" type="submit">
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
