import { SiteFooter } from "@/components/footer"
import { Hero } from "@/components/hero"

export default function HomePage() {
  return (
    <main className="relative">
      <Hero />
      <section className="relative z-0 mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="glass rounded-2xl p-6 relative z-0">
            <h3 className="font-display text-lg">Events</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Talks, workshops, and hack sessions with a futuristic twist.
            </p>
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-lg">Members</h3>
            <p className="mt-1 text-sm text-muted-foreground">Meet builders across batches, roles, and stacks.</p>
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-lg">Projects</h3>
            <p className="mt-1 text-sm text-muted-foreground">Showcase, collaborate, and publish your best work.</p>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}