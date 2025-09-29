"use client"

import type React from "react"

import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import useSWR from "swr"
import { AdminNav } from "@/components/admin/admin-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
          <CardTitle className="text-pretty">Add Member</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateMemberForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-pretty">Members</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Client boundary */}
          <MembersList />
        </CardContent>
      </Card>
    </main>
  )
}

// Client component
function MembersList() {
  const fetcher = (url: string) => fetch(url).then((r) => r.json())
  // @ts-expect-error - Next.js SWR allowed in client boundary here
  const { data, error, isLoading } = useSWR("/api/admin/members", fetcher)

  if (isLoading) return <p className="text-muted-foreground">Loading members…</p>
  if (error) return <p className="text-destructive">Failed to load members.</p>

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left">
          <tr className="border-b border-border/60">
            <th className="py-2 pr-4">Name</th>
            <th className="py-2 pr-4">Email</th>
            <th className="py-2 pr-4">Role</th>
          </tr>
        </thead>
        <tbody>
          {data?.members?.map((m: any) => (
            <tr key={m.id} className="border-b border-border/40">
              <td className="py-2 pr-4">{m.full_name || m.username || "—"}</td>
              <td className="py-2 pr-4">{m.email || m.user_email || "—"}</td>
              <td className="py-2 pr-4">{m.is_admin ? "Admin" : "Member"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// New client form to create member rows
function CreateMemberForm() {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [contact, setContact] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/admin/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          role,
          contact_email: contact,
          avatar_url: avatarUrl,
        }),
      })
      if (!res.ok) throw new Error("Failed to create member")
      setName("")
      setRole("")
      setContact("")
      setAvatarUrl("")
      // trigger revalidation
      await fetch("/api/admin/members", { method: "GET", cache: "no-store" })
    } catch (err) {
      console.log("[v0] create member error:", (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="mname" className="text-sm">
          Name
        </label>
        <input
          id="mname"
          className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="mrole" className="text-sm">
          Details / Role
        </label>
        <input
          id="mrole"
          className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="mcontact" className="text-sm">
          Contact Email
        </label>
        <input
          id="mcontact"
          type="email"
          className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="mavatar" className="text-sm">
          Image URL
        </label>
        <input
          id="mavatar"
          className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
          placeholder="https://..."
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
        />
      </div>
      <div className="md:col-span-2">
        <button type="submit" disabled={loading} className="rounded-md border px-3 py-2 text-sm">
          {loading ? "Adding…" : "Add Member"}
        </button>
      </div>
    </form>
  )
}
