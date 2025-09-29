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
          <CardTitle className="text-pretty">Post Project</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateProjectForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-pretty">All Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectsList />
        </CardContent>
      </Card>
    </main>
  )
}

function CreateProjectForm() {
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [link, setLink] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, link, image_url: imageUrl }),
      })
      if (!res.ok) throw new Error("Failed to create project")
      setTitle("")
      setDescription("")
      setLink("")
      setImageUrl("")
      await fetch("/api/admin/projects", { method: "GET", cache: "no-store" })
    } catch (err) {
      console.log("[v0] create project error:", (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="ptitle">Title</Label>
        <Input id="ptitle" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="plink">Link</Label>
        <Input id="plink" placeholder="https://..." value={link} onChange={(e) => setLink(e.target.value)} />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="pimage">Image URL</Label>
        <Input id="pimage" placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="pdesc">Description</Label>
        <Textarea id="pdesc" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="md:col-span-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Posting…" : "Post Project"}
        </Button>
      </div>
    </form>
  )
}

function ProjectsList() {
  const fetcher = (url: string) => fetch(url).then((r) => r.json())
  // @ts-expect-error - SWR client usage
  const { data, error, isLoading } = useSWR("/api/admin/projects", fetcher)
  if (isLoading) return <p className="text-muted-foreground">Loading projects…</p>
  if (error) return <p className="text-destructive">Failed to load projects.</p>

  return (
    <div className="grid gap-3">
      {data?.projects?.map((p: any) => (
        <div key={p.id} className="rounded-lg border border-border/60 p-4">
          <div className="font-medium">{p.title}</div>
          {p.description ? <p className="mt-2 text-sm text-muted-foreground">{p.description}</p> : null}
          <div className="mt-2 text-xs text-muted-foreground break-all">{p.link || "—"}</div>
          {p.image_url ? (
            <img
              alt={`${p.title} image`}
              src={p.image_url || "/placeholder.svg"}
              className="mt-3 h-24 w-40 rounded-md object-cover border"
            />
          ) : null}
        </div>
      ))}
    </div>
  )
}
