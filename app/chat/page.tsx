import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/footer"
import { ChatUI } from "@/components/chat-ui"

export default function ChatPage() {
  return (
    <main>
      <SiteNav />
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="font-display text-3xl">Chat</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Real-time vibes coming soon. For now, this is a functional UI skeleton.
        </p>
        <div className="mt-6">
          <ChatUI />
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
