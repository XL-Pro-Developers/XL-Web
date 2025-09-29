import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import useSWR from "swr"
import { AdminNav } from "@/components/admin/admin-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

async function ensureAdmin() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (k) => cookieStore.get(k)?.value } },
  )
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle()
  if (!profile?.is_admin) redirect("/")
}

export default async function Page() {
  await ensureAdmin()
  return (
    <main className="container py-8">
      <AdminNav />
      <Card>
        <CardHeader>
          <CardTitle className="text-pretty">Event Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          <RegistrationsList />
        </CardContent>
      </Card>
    </main>
  )
}

function RegistrationsList() {
  const fetcher = (url: string) => fetch(url).then((r) => r.json())
  // @ts-expect-error - SWR client usage
  const { data, error, isLoading } = useSWR("/api/admin/registrations", fetcher)
  if (isLoading) return <p className="text-muted-foreground">Loading registrations…</p>
  if (error) return <p className="text-destructive">Failed to load registrations.</p>

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left">
          <tr className="border-b border-border/60">
            <th className="py-2 pr-4">Event</th>
            <th className="py-2 pr-4">Team</th>
            <th className="py-2 pr-4">Members</th>
            <th className="py-2 pr-4">Transaction</th>
            <th className="py-2 pr-4">Proof</th>
            <th className="py-2 pr-4">When</th>
          </tr>
        </thead>
        <tbody>
          {data?.registrations?.map((r: any) => (
            <tr key={r.id} className="border-b border-border/40 align-top">
              <td className="py-2 pr-4">{r.event?.title || r.event_title || "—"}</td>
              <td className="py-2 pr-4">{r.team_name || "—"}</td>
              <td className="py-2 pr-4">
                <div className="text-muted-foreground">
                  {(r.members || r.team_members || []).map((m: any, i: number) => (
                    <div key={i}>
                      {m.name || m.full_name || "Member"} {m.email ? `• ${m.email}` : ""}
                    </div>
                  ))}
                </div>
              </td>
              <td className="py-2 pr-4">{r.transaction_id || "—"}</td>
              <td className="py-2 pr-4">
                {r.payment_proof_path ? (
                  <img
                    src={r.payment_proof_path || "/placeholder.svg"}
                    alt="Payment proof"
                    className="h-20 w-20 object-contain rounded-md border border-border/60"
                  />
                ) : (
                  "—"
                )}
              </td>
              <td className="py-2 pr-4">{r.created_at ? new Date(r.created_at).toLocaleString() : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
