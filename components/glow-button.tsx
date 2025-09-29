"use client"
import { cn } from "@/lib/utils"
import React from "react"

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline"
}

export const GlowButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "primary", ...props }, ref) => {
    const base = "btn-glow rounded-lg px-4 py-2 text-sm font-medium"
    const v = variant === "primary" ? "btn-primary glow-primary" : "btn-outline glow-accent"
    return <button ref={ref} className={cn(base, v, className)} {...props} />
  },
)
GlowButton.displayName = "GlowButton"
