import Image from "next/image"
import { GlassCard } from "./glass-card"

export function MemberCard({
  name,
  role,
  batch,
  bio,
}: {
  name: string
  role: string
  batch: string
  bio?: string
}) {
  return (
    <GlassCard className="transition-all hover:glow-accent hover:scale-[1.01]">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-full glow-primary" aria-hidden />
          <Image
            src="/member-avatar-placeholder.jpg"
            alt={`${name} avatar`}
            width={64}
            height={64}
            className="h-16 w-16 rounded-full object-cover"
          />
        </div>
        <div>
          <h4 className="font-display text-lg">{name}</h4>
          <p className="text-sm text-muted-foreground">
            {role} • {batch}
          </p>
        </div>
      </div>
      {bio ? <p className="mt-3 text-sm text-muted-foreground">{bio}</p> : null}
    </GlassCard>
  )
}
