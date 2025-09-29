"use client"

import type React from "react"

import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import useSWR from "swr"
import { AdminNav } from "@/components/admin/admin-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

async function ensureAdmin() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (k) => cookieStore.get(k)?.value } },
  )
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle()
  if (!profile?.is_admin) redirect("/")
}

export default async function Page() {
  await ensureAdmin()
  return (
    <main className="container py-8">
      <AdminNav />
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-pretty">Create Event</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateEventForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-pretty">All Events</CardTitle>
        </CardHeader>
        <CardContent>
          <EventsList />
        </CardContent>
      </Card>
    </main>
  )
}

function CreateEventForm() {
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [date, setDate] = useState("")
  const [price, setPrice] = useState("")
  const [qrUrl, setQrUrl] = useState("") // will be sent as qr_image_url
  const [description, setDescription] = useState("")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, date, qr_image_url: qrUrl, description }),
      })
      if (!res.ok) throw new Error("Failed to create")
      setTitle("")
      setSlug("")
      setDate("")
      setPrice("")
      setQrUrl("")
      setDescription("")
      // Trigger SWR revalidation
      await fetch("/api/admin/events", { method: "GET", cache: "no-store" })
    } catch (err) {
      console.log("[v0] create event error:", (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="date">Date</Label>
        <Input id="date" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input id="price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="qr">QR Image URL</Label>
        <Input id="qr" placeholder="https://..." value={qrUrl} onChange={(e) => setQrUrl(e.target.value)} />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="desc">Description</Label>
        <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="md:col-span-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Creating…" : "Create Event"}
        </Button>
      </div>
    </form>
  )
}

function EventsList() {
  const fetcher = (url: string) => fetch(url).then((r) => r.json())
  // @ts-expect-error - SWR client usage
  const { data, error, isLoading } = useSWR("/api/admin/events", fetcher)
  if (isLoading) return <p className="text-muted-foreground">Loading events…</p>
  if (error) return <p className="text-destructive">Failed to load events.</p>

  return (
    <div className="grid gap-3">
      {data?.events?.map((ev: any) => (
        <div key={ev.id} className="rounded-lg border border-border/60 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{ev.title}</div>
              <div className="text-muted-foreground text-sm">{ev.slug}</div>
            </div>
            <div className="text-sm text-muted-foreground">
              {ev.date ? new Date(ev.date).toLocaleString() : "No date"}
            </div>
          </div>
          {ev.qr_image_url ? (
            <img
              src={ev.qr_image_url || "/placeholder.svg"}
              alt="Payment QR"
              className="mt-3 h-24 w-24 object-contain rounded-md border border-border/60"
            />
          ) : null}
        </div>
      ))}
    </div>
  )
}
