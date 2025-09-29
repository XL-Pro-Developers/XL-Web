import { cn } from "@/lib/utils"
import type React from "react"

export function GlassCard({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <div className={cn("glass rounded-2xl p-5 shadow-border", className)}>{children}</div>
}
