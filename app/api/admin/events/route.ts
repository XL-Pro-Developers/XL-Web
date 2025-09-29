import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "../_utils"

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req)
  if (!guard.ok) return guard.res
  const { supabase } = guard

  const { data, error } = await supabase.from("events").select("*").order("date", { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ events: data })
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req)
  if (!guard.ok) return guard.res
  const { supabase } = guard

  const body = await req.json().catch(() => ({}))
  const payload = {
    title: body.title ?? null,
    slug: body.slug ?? null,
    description: body.description ?? null,
    date: body.date ?? null,
    qr_image_url: body.qr_image_url ?? null,
  }

  const { data, error } = await supabase.from("events").insert(payload).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ event: data }, { status: 201 })
}
