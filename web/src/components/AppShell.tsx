import { NavLink, Navigate, Outlet, useLocation } from "react-router";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { Spinner, cx } from "./ui";
import { IconFile, IconHome, IconSettings } from "./icons";
import { useSession, useSignOut } from "../lib/session";

const nav = [
  { to: "/app", label: "Overview", icon: <IconHome />, end: true },
  { to: "/app/resumes", label: "Résumés", icon: <IconFile /> },
  { to: "/app/settings", label: "Settings", icon: <IconSettings /> },
];

export function AppShell() {
  const { data: user, isLoading } = useSession();
  const location = useLocation();
  const signOut = useSignOut();
  if (isLoading)
    return (
      <div className="p-10">
        <Spinner />
      </div>
    );
  if (!user) return <Navigate to={`/signin?returnTo=${encodeURIComponent(location.pathname)}`} replace />;

  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-surface focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <aside className="border-b border-border bg-surface md:min-h-screen md:border-b-0 md:border-r">
        <div className="flex items-center justify-between px-5 py-4">
          <Logo to="/app" />
          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </div>
        <nav aria-label="App" className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                cx(
                  "flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm",
                  isActive ? "bg-brand-soft font-medium text-brand" : "text-muted hover:bg-surface-2 hover:text-fg",
                )
              }
            >
              {n.icon}
              {n.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="min-w-0">
        <header className="hidden items-center justify-end gap-3 border-b border-border px-8 py-3 md:flex">
          <ThemeToggle />
          <span className="text-sm text-muted">{user.email}</span>
          <button onClick={signOut} className="rounded-lg px-3 py-1.5 text-sm text-muted hover:bg-surface-2 hover:text-fg">
            Sign out
          </button>
        </header>
        <main id="main" className="mx-auto max-w-5xl px-5 py-8 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
