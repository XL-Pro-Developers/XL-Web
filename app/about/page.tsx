import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/footer"

export default function AboutPage() {
  return (
    <main>
      <SiteNav />
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-display text-3xl">About</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We’re a developer community focused on learning by building. Futuristic minimal design, accessible UX, and
          real collaboration.
        </p>
        <ul className="mt-6 grid gap-3">
          <li className="glass rounded-xl p-4">Values: openness, shipping, craft</li>
          <li className="glass rounded-xl p-4">Activities: events, projects, mentorship</li>
          <li className="glass rounded-xl p-4">Join us: say hi in Chat and attend an Event</li>
        </ul>
      </section>
      <SiteFooter />
    </main>
  )
}
