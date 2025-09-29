import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "../_utils"

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req)
  if (!guard.ok) return guard.res
  const { supabase } = guard

  const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ projects: data })
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req)
  if (!guard.ok) return guard.res
  const { supabase } = guard

  const body = await req.json().catch(() => ({}))
  const payload = {
    title: body.title ?? null,
    description: body.description ?? null,
    link: body.link ?? null,
    image_url: body.image_url ?? null,
  }
  const { data, error } = await supabase.from("projects").insert(payload).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ project: data }, { status: 201 })
}
