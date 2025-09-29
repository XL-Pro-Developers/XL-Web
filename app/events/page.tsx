import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/footer"
import { EventCard, type EventData } from "@/components/event-card"
import { createClient } from "@/lib/supabase/server"

export default async function EventsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("events")
    .select("slug,title,date,description,qr_image_url")
    .order("date", { ascending: true })

  const events: EventData[] =
    (data || []).map((ev: any) => ({
      slug: ev.slug || String(ev.slug || ""),
      title: ev.title || "Untitled",
      date: ev.date ? new Date(ev.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : undefined,
      blurb: ev.description || "",
      // image column does not exist on events; keep undefined so EventCard can use a placeholder
      image: undefined,
      qrCodeUrl: ev.qr_image_url || undefined,
    })) ?? []

  return (
    <main>
      <SiteNav />
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="font-display text-3xl">Events</h1>
        <p className="mt-2 text-sm text-muted-foreground">Register for upcoming sessions.</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.length > 0 ? (
            events.map((e) => <EventCard key={e.slug} event={e} />)
          ) : (
            <p className="text-muted-foreground">No events yet. Check back soon.</p>
          )}
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
