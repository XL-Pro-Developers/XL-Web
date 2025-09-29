export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-8 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} XL Pro Developer Community</p>
        <p>
          <span className="sr-only">Brand colors:</span>
          <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-[var(--c-primary)] mr-1" />
          <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-[var(--c-accent)] mr-1" />
          <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-[var(--c-pink)]" />
        </p>
      </div>
    </footer>
  )
}
