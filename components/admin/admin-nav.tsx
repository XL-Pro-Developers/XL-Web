"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const links = [
  { href: "/admin/members", label: "Members" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/registrations", label: "Registrations" },
]

export function AdminNav() {
  const pathname = usePathname()
  return (
    <nav className="flex items-center gap-3 border-b border-border/60 pb-3 mb-6">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={cn(
            "text-sm px-3 py-2 rounded-md transition-colors",
            pathname === l.href
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
          )}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  )
}
