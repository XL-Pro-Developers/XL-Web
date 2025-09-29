import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/footer"
import { GlassCard } from "@/components/glass-card"

const projects = [
  { id: "p1", title: "Neon UI Kit", tags: ["Next.js", "Tailwind"], desc: "A minimal neon-themed UI pack." },
  { id: "p2", title: "Chat Micro-SaaS", tags: ["React", "Realtime"], desc: "A simple chat boilerplate." },
  { id: "p3", title: "3D Hero Scenes", tags: ["r3f"], desc: "Lightweight 3D hero presets." },
]

export default function ProjectsPage() {
  return (
    <main>
      <SiteNav />
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="font-display text-3xl">Projects</h1>
        <p className="mt-2 text-sm text-muted-foreground">Community-built projects and experiments.</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <GlassCard key={p.id} className="transition-all hover:glow-primary">
              <div className="aspect-video w-full rounded-xl bg-gradient-to-br from-[var(--c-primary)]/15 via-[var(--c-accent)]/15 to-[var(--c-pink)]/15" />
              <h3 className="mt-4 font-display">{p.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span key={t} className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
