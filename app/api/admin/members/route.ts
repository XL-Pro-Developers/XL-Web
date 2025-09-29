import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "../_utils"

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req)
  if (!guard.ok) return guard.res
  const { supabase } = guard

  // Try profiles joined to auth.users-like shape; fall back to members table if present
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) {
    // Attempt fallback to members
    const { data: members, error: err2 } = await supabase
      .from("members")
      .select("*")
      .order("created_at", { ascending: false })
    if (err2) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ members })
  }
  return NextResponse.json({ members: profiles })
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req)
  if (!guard.ok) return guard.res
  const { supabase } = guard

  const body = await req.json().catch(() => ({}))
  const payload = {
    name: body.name ?? null,
    role: body.role ?? null, // can be used as "details"
    contact_email: body.contact_email ?? null,
    avatar_url: body.avatar_url ?? null,
  }

  const { data, error } = await supabase.from("members").insert(payload).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ member: data }, { status: 201 })
}
