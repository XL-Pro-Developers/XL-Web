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
          {/* <p className="text-xs text-muted-foreground">
            Tip: We respect reduced motion. Heavy animations are toned down automatically.
          </p> */}
        </div>
        <div className="relative">
          <div className="absolute inset-0 -z-10 blur-3xl" aria-hidden>
            <div
              className="h-full w-full rounded-full"
              style={{ background: "radial-gradient(closest-side, rgba(0,209,255,0.15), transparent 60%)" }}
            />
          </div>
          <div className="glass rounded-2xl p-6 border-gradient">
            
            <div className="mt-4 space-y-2">
              {/* Animated event video */}
              <video
                src="https://uomobeznhbvlzengqqxl.supabase.co/storage/v1/object/public/website%20stuff/WhatsApp%20Video%202025-09-30%20at%2019.14.20_3485c314.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full rounded-lg mb-2 object-cover aspect-video animate-pulse" // You can replace animate-pulse with your own animation
                poster="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80"
              />
              <h3 className="font-display text-lg">Codeathon 2.0</h3>
              <p className="text-sm text-muted-foreground">
                Join us for a weekend of coding, collaboration, and fun! Open to all skill levels.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
