import { Link } from "react-router";
import { Logo } from "../components/Logo";
import { ThemeToggle } from "../components/ThemeToggle";
import { Badge, Card } from "../components/ui";
import { IconChart, IconMail, IconSearch, IconShield } from "../components/icons";
import { useSession } from "../lib/session";

const features = [
  {
    icon: <IconSearch />,
    title: "India-first & remote-global discovery",
    body: "One profile, many permitted sources — official APIs and public job feeds, checked on a schedule. No scraping of sites that forbid it.",
  },
  {
    icon: <IconChart />,
    title: "Matches you can understand",
    body: "Every score breaks down into reasons: skills matched, seniority, location, freshness. You stay in control of the ranking.",
  },
  {
    icon: <IconMail />,
    title: "Apply from your own Gmail — with approval",
    body: "Tailored drafts you review and approve. At most one polite follow-up after 24 hours if nobody replies.",
  },
  {
    icon: <IconShield />,
    title: "Respectful by design",
    body: "A hard cap of 20 messages per rolling 24 hours, a pause switch, encrypted tokens, and full data export or deletion.",
  },
];

const steps = [
  "Upload your résumé",
  "Confirm your profile",
  "Review explained matches",
  "Approve tailored applications",
  "Track replies and interviews",
];

export function Landing() {
  const { data: user } = useSession();
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo />
        <nav className="flex items-center gap-2" aria-label="Main">
          <a
            href="https://github.com/aadeharshk/jobflow."
            className="hidden rounded-lg px-3 py-2 text-sm text-muted hover:text-fg sm:inline"
          >
            GitHub
          </a>
          <ThemeToggle />
          <Link
            to={user ? "/app" : "/signin"}
            className="inline-flex h-9 items-center rounded-lg bg-brand px-4 text-sm font-medium text-brand-fg hover:opacity-90"
          >
            {user ? "Open app" : "Sign in"}
          </Link>
        </nav>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-6 pb-16 pt-12 text-center sm:pt-20">
          <Badge tone="brand">Early access · Open source · Built on Cloudflare</Badge>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
            The trustworthy AI copilot for your job search.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            Find the right roles in India and remote worldwide, see exactly why each one fits, and apply with your approval — from your own
            Gmail.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to={user ? "/app" : "/signin"}
              className="inline-flex h-12 items-center rounded-lg bg-brand px-6 font-medium text-brand-fg shadow-sm hover:opacity-90"
            >
              Get started free
            </Link>
            <a
              href="https://github.com/aadeharshk/jobflow.#readme"
              className="inline-flex h-12 items-center rounded-lg border border-border bg-surface px-6 font-medium hover:bg-surface-2"
            >
              Self-host on Cloudflare
            </a>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-16 sm:grid-cols-2" aria-label="Features">
          {features.map((f) => (
            <Card key={f.title}>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft text-brand">{f.icon}</div>
              <h2 className="font-semibold">{f.title}</h2>
              <p className="mt-2 text-sm text-muted">{f.body}</p>
            </Card>
          ))}
        </section>

        <section className="mx-auto max-w-4xl px-6 pb-24" aria-labelledby="how">
          <h2 id="how" className="text-center text-2xl font-semibold">
            How it works
          </h2>
          <ol className="mt-8 grid gap-3 sm:grid-cols-5">
            {steps.map((s, i) => (
              <li key={s} className="rounded-lg border border-border bg-surface p-4 text-sm">
                <span className="mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-brand text-xs font-semibold text-brand-fg">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
          <p className="mt-6 text-center text-xs text-muted">
            JobFlow never auto-submits third-party application forms, never scrapes LinkedIn, and never bypasses CAPTCHAs.
          </p>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-muted sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} JobFlow contributors · Apache-2.0</span>
          <span>Provisional name — branding not final.</span>
        </div>
      </footer>
    </div>
  );
}
