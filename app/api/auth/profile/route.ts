import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function POST(req: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => req.cookies.get(name)?.value,
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Determine if this user should be admin:
  // 1) If ADMIN_EMAILS contains their email
  // 2) Or if there are currently zero admins (bootstrap first admin)
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)

  let grantAdmin = !!(user.email && adminEmails.includes(user.email.toLowerCase()))

  // Check if any admin exists
  if (!grantAdmin) {
    const { count } = await supabase
      .from("profiles")
      .select("is_admin", { count: "exact", head: true })
      .eq("is_admin", true)
    if ((count || 0) === 0) {
      grantAdmin = true
    }
  }

  // Check existing profile to preserve existing is_admin if set
  const { data: existing } = await supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle()

  const is_admin = existing?.is_admin ?? grantAdmin

  const full_name = (user.user_metadata && (user.user_metadata.full_name || user.user_metadata.name)) || null

  const row = {
    id: user.id,
    email: user.email,
    full_name,
    last_login_at: new Date().toISOString(),
    is_admin,
  }

  const { error } = await supabase.from("profiles").upsert(row, { onConflict: "id" })
  if (error) {
    return NextResponse.json({ error: "Profile upsert failed" }, { status: 500 })
  }

  return NextResponse.json({ ok: true, is_admin })
}
