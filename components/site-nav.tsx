"use client"

import Link from "next/link"
import Image from "next/image"
import { forwardRef } from "react"

// Use forwardRef to allow parent to access navbar DOM node
export const SiteNav = forwardRef<HTMLElement>((props, ref) => {
  return (
    <header ref={ref} className="sticky top-0 z-50 w-full bg-transparent">
      <nav className="flex justify-center items-center py-2 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="XL Pro Developer Community Home">
          <Image src="/xllogo.svg" alt="XL Pro Logo" width={100} height={300} className="glow-primary" />
        </Link>
      </nav>
    </header>
  )
})

SiteNav.displayName = "SiteNav"
