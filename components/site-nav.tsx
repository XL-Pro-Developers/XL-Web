"use client"

import Link from "next/link"
import Image from "next/image"
// import { usePathname } from "next/navigation"
// import { useState } from "react"
// import { cn } from "@/lib/utils"

// const links = [
//   { href: "/", label: "Home" },
//   { href: "/members", label: "Members" },
//   { href: "/events", label: "Events" },
//   { href: "/projects", label: "Projects" },
//   { href: "/chat", label: "Chat" },
//   { href: "/about", label: "About" },
// ]

export function SiteNav() {
  // const pathname = usePathname()
  // const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-fit mx-auto bg-transparent backdrop-blur-none rounded-full shadow-lg shadow-primary/20">
      <nav className="flex justify-center items-center py-2 px-4 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="XL Pro Developer Community Home"
        >
          <Image
            src="/xllogo.svg"
            alt="XL Pro Logo"
            width={100}
            height={300}
            className="glow-primary"
          />
          <span className="font-bold text-lg text-white"></span>
        </Link>

        {/*
        <button
          className="md:hidden rounded-md border px-3 py-2 text-sm hover:bg-muted transition"
          aria-label="Toggle Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>

        <ul
          className={cn(
            "md:flex md:items-center md:gap-4 absolute md:static top-full left-0 w-full md:w-auto bg-background/80 md:bg-transparent backdrop-blur-md md:backdrop-blur-none rounded-b-md md:rounded-none p-4 md:p-0 transition-all duration-300",
            open ? "block" : "hidden md:flex"
          )}
        >
          {links.map((l) => {
            const active = pathname === l.href
            return (
              <li key={l.href} className="md:my-0 my-2">
                <Link
                  href={l.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "border-gradient text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {l.label}
                </Link>
              </li>
            )
          })}
        </ul>
        */}
      </nav>
    </header>
  )
}
