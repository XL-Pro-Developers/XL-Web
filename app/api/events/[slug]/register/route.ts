import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  try {
    const supabase = await createClient()
    const form = await req.formData()

    const slug = params.slug
    const team_name = String(form.get("team_name") || "")
    const team_size = Number(form.get("team_size") || 0)
    const membersRaw = String(form.get("members") || "[]")
    const transaction_id = String(form.get("transaction_id") || "")
    const event_title = String(form.get("event_title") || "")
    const file = form.get("payment_proof") as File | null

    if (!team_name || !transaction_id || ![2, 3, 4].includes(team_size)) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 })
    }

    let members: Array<{ name: string; email: string }> = []
    try {
      members = JSON.parse(membersRaw)
    } catch {
      return NextResponse.json({ error: "Invalid members JSON" }, { status: 400 })
    }

    if (members.length !== team_size) {
      return NextResponse.json({ error: "Members count does not match team size" }, { status: 400 })
    }

    // Optional: encode file to base64 data URL (prototype storage)
    let payment_proof_path: string | null = null
    if (file) {
      const buf = Buffer.from(await file.arrayBuffer())
      const base64 = buf.toString("base64")
      const mime = file.type || "application/octet-stream"
      payment_proof_path = `data:${mime};base64,${base64}`
    }

    // Ensure an event exists for this slug; upsert minimal if needed
    let eventId: string | null = null
    const { data: existingEvent, error: findErr } = await supabase.from("events").select("id").eq("slug", slug).single()

    if (findErr || !existingEvent) {
      const { data: inserted, error: insertErr } = await supabase
        .from("events")
        .insert([{ slug, title: event_title || slug }])
        .select("id")
        .single()
      if (insertErr) {
        return NextResponse.json({ error: insertErr.message }, { status: 400 })
      }
      eventId = inserted.id
    } else {
      eventId = existingEvent.id
    }

    const { error: regErr } = await supabase.from("registrations").insert([
      {
        event_id: eventId,
        team_name,
        team_size,
        members,
        transaction_id,
        payment_proof_path,
      },
    ])

    if (regErr) {
      return NextResponse.json({ error: regErr.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 })
  }
}
