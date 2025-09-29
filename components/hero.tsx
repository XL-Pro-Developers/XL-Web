import Link from "next/link"
import { GlowButton } from "./glow-button"

export function Hero() {
  return (
    <section className="hero-bg relative">
      {/* remove local matrix; now provided globally from layout */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-16 md:grid-cols-2 md:py-24">
        <div className="flex flex-col justify-center gap-6">
          <h1 className="font-display text-pretty text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Build. Learn. Ship.
            <br />
            Join the XL Pro Developer Community
          </h1>
          <p className="text-pretty text-base text-muted-foreground md:text-lg">
            A futuristic, minimal community for developers. Events, projects, chat, and more—designed for speed and
            clarity.
          </p>
          <div className="flex items-center gap-3">
            <Link href="/events">
              <GlowButton>Explore Events</GlowButton>
            </Link>
            <Link href="/members">
              <GlowButton variant="outline">Meet Members</GlowButton>
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            Tip: We respect reduced motion. Heavy animations are toned down automatically.
          </p>
        </div>
        <div className="relative">
          <div className="absolute inset-0 -z-10 blur-3xl" aria-hidden>
            <div
              className="h-full w-full rounded-full"
              style={{ background: "radial-gradient(closest-side, rgba(0,209,255,0.15), transparent 60%)" }}
            />
          </div>
          <div className="glass rounded-2xl p-6 border-gradient">
            <div className="aspect-video w-full rounded-xl bg-gradient-to-br from-[var(--c-primary)]/20 via-[var(--c-accent)]/20 to-[var(--c-pink)]/20" />
            <div className="mt-4 space-y-2">
              <h3 className="font-display text-lg">Next Event: Dev Summit</h3>
              <p className="text-sm text-muted-foreground">
                Talks, workshops, and collaborative hacking. Limited seats.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
