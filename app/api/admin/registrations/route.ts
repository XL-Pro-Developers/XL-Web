import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "../_utils"

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req)
  if (!guard.ok) return guard.res
  const { supabase } = guard

  // Try joining events; fallback to plain list
  const { data, error } = await supabase
    .from("registrations")
    .select("*, event:events(*)")
    .order("created_at", { ascending: false })

  if (error) {
    const { data: fallback, error: err2 } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false })
    if (err2) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ registrations: fallback })
  }

  return NextResponse.json({ registrations: data })
}
