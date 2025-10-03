"use client"

import Link from "next/link"
import Image from "next/image"
import { forwardRef } from "react"

export const SiteNav = forwardRef<HTMLElement>((props, ref) => {
  return (
    <header
      ref={ref}
      className="top-0 z-50 w-full bg-transparent"
    >
      <nav className="flex items-center py-4 px-6 md:px-7 ">
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="XL Pro Developer Community Home"
        >
          <Image
            src="/xllogo.svg"
            alt="XL Pro Logo"
            width={125}
            height={250}
            className="glow-primary glass border-gradient rounded-2xl p-1 "
          />
        </Link>
      </nav>
    </header>
  )
})

SiteNav.displayName = "SiteNav"
