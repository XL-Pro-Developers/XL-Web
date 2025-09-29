import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/footer"
import { GlassCard } from "@/components/glass-card"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?next=/admin")
  }

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

  if (!profile?.is_admin) {
    redirect("/")
  }

  const [{ count: eventsCount }, { count: registrationsCount }, { count: membersCount }] = await Promise.all([
    supabase.from("events").select("id", { count: "exact", head: true }),
    supabase.from("registrations").select("id", { count: "exact", head: true }),
    supabase.from("members").select("id", { count: "exact", head: true }),
  ])

  return (
    <main>
      <SiteNav />
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="font-display text-3xl">Admin</h1>
        <p className="mt-2 text-sm text-muted-foreground">Quick insights and actions.</p>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <GlassCard>
            <h3 className="font-display">Upcoming Events</h3>
            <p className="text-sm text-muted-foreground">{eventsCount ?? 0} total</p>
          </GlassCard>
          <GlassCard>
            <h3 className="font-display">Registrations</h3>
            <p className="text-sm text-muted-foreground">{registrationsCount ?? 0} total</p>
          </GlassCard>
          <GlassCard>
            <h3 className="font-display">Members</h3>
            <p className="text-sm text-muted-foreground">{membersCount ?? 0} total</p>
          </GlassCard>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
