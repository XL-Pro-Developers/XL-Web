import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/footer"
import { MemberCard } from "@/components/member-card"

const members = [
  { name: "Adarsh", role: "Lead", batch: "2025", bio: "Systems + 3D hero experiments." },
  { name: "Chirag", role: "Frontend", batch: "2026", bio: "Animations and docs." },
  { name: "Akshay", role: "Backend", batch: "2025", bio: "APIs, data, and exports." },
  { name: "Anantha", role: "Fullstack", batch: "2026", bio: "Projects and admin flows." },
]

export default function MembersPage() {
  return (
    <main>
      <SiteNav />
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="font-display text-3xl">Members</h1>
        <p className="mt-2 text-sm text-muted-foreground">Browse featured members across batches.</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m) => (
            <MemberCard key={m.name} {...m} />
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
