import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { AdminNav } from "@/components/admin/admin-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RegistrationsList } from "@/components/admin/registrations-client"

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
