"use client"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"

const links = [
	{ href: "/", label: "Home" },
	{ href: "/members", label: "Members" },
	{ href: "/events", label: "Events" },
	{ href: "/projects", label: "Projects" },
	{ href: "/chat", label: "Chat" },
	{ href: "/about", label: "About" },
]

export function SiteNav() {
	const pathname = usePathname()
	const [open, setOpen] = useState(false)
	return (
		<header className="sticky top-0 z-40 w-fit mx-auto border-b border-border bg-background/80 backdrop-blur rounded-full shadow-lg shadow-primary/20">
			<nav className="flex justify-center items-center py-2 px-4">
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
					<span className="font-bold text-lg"></span>
				</Link>
				{/* Hide nav links and menu button */}
				{/* 
				<button
					className="md:hidden rounded-md border px-3 py-2 text-sm hover:bg-muted"
					aria-label="Toggle Menu"
					aria-expanded={open}
					onClick={() => setOpen((v) => !v)}
				>
					Menu
				</button>
				<ul
					className={cn(
						"md:flex md:items-center md:gap-4",
						open ? "mt-3 grid gap-2" : "hidden md:flex",
					)}
				>
					{links.map((l) => {
						const active = pathname === l.href
						return (
							<li key={l.href}>
								<Link
									href={l.href}
									className={cn(
										"rounded-md px-3 py-2 text-sm transition-colors",
										active
											? "border-gradient text-foreground"
											: "text-muted-foreground hover:text-foreground hover:bg-muted",
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
