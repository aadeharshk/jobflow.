import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Badge, Card, CardHeader, EmptyState } from "../components/ui";
import { IconChart, IconCheck, IconMail, IconSearch } from "../components/icons";
import { api, type AutomationStatus, type Resume } from "../lib/api";
import { useSession } from "../lib/session";

function Step({
  done,
  title,
  body,
  action,
  comingIn,
}: {
  done?: boolean;
  title: string;
  body: string;
  action?: React.ReactNode;
  comingIn?: string;
}) {
  return (
    <li className="flex items-start gap-4 py-4">
      <span
        className={
          done
            ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-brand-fg"
            : "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-muted"
        }
        aria-hidden
      >
        {done ? <IconCheck /> : null}
      </span>
      <div className="flex-1">
        <p className="font-medium">
          {title} {done && <span className="sr-only">(done)</span>}
        </p>
        <p className="text-sm text-muted">{body}</p>
      </div>
      {comingIn ? <Badge>{comingIn}</Badge> : action}
    </li>
  );
}

export function Dashboard() {
  const { data: user } = useSession();
  const resumes = useQuery({
    queryKey: ["resumes"],
    queryFn: () => api<{ resumes: Resume[] }>("/api/files/resumes").then((r) => r.resumes),
  });
  const automation = useQuery({ queryKey: ["automation"], queryFn: () => api<AutomationStatus>("/api/me/automation") });
  const hasResume = (resumes.data?.length ?? 0) > 0;
  const firstName = user?.name?.split(" ")[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{firstName ? `Welcome, ${firstName}` : "Welcome"}</h1>
        <p className="mt-1 text-sm text-muted">
          Set up your profile once. JobFlow will do the searching — you stay in control of every application.
        </p>
      </div>

      <Card>
        <CardHeader title="Get started" description="Your setup checklist. Items marked with a phase are on the public roadmap." />
        <ol className="divide-y divide-border">
          <Step done title="Create your account" body="Signed in with minimal permissions (name and email only)." />
          <Step
            done={hasResume}
            title="Upload your résumé"
            body="PDF up to 5 MB, stored privately in your account."
            action={
              <Link to="/app/resumes" className="text-sm font-medium text-brand hover:underline">
                {hasResume ? "Manage" : "Upload"}
              </Link>
            }
          />
          <Step
            title="Confirm your career profile"
            body="We'll extract skills, roles and preferences from your résumé for you to review."
            comingIn="Phase 4"
          />
          <Step
            title="Review explained job matches"
            body="India-first and remote-global roles, each with a transparent score breakdown."
            comingIn="Phase 5"
          />
          <Step
            title="Connect Gmail to send approved applications"
            body="Send-only permission, requested only when you need it. Replies can be logged manually."
            comingIn="Phase 6"
          />
        </ol>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-muted">Messages sent (rolling 24h)</p>
          <p className="mt-2 text-3xl font-semibold">
            {automation.data ? `${automation.data.sending.sentInWindow} / ${automation.data.sending.dailyCap}` : "—"}
          </p>
          <p className="mt-1 text-xs text-muted">
            {automation.data?.sending.paused
              ? "Automation paused"
              : `Hard platform limit: ${automation.data?.platformDailyCap ?? 20} per 24 hours`}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Résumés on file</p>
          <p className="mt-2 text-3xl font-semibold">{resumes.data ? resumes.data.length : "—"}</p>
          <p className="mt-1 text-xs text-muted">Private R2 storage</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Applications</p>
          <p className="mt-2 text-3xl font-semibold">0</p>
          <p className="mt-1 text-xs text-muted">Pipeline tracking arrives in Phase 6</p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <EmptyState icon={<IconSearch />} title="No matches yet">
          Job discovery is being built next. When it ships, new roles from permitted sources appear here with a clear explanation of why
          they fit.
        </EmptyState>
        <EmptyState icon={<IconMail />} title="No applications yet">
          You'll approve every application before it is sent. JobFlow sends at most one follow-up, and only if nobody replied within 24
          hours.
        </EmptyState>
      </div>
      <p className="flex items-center gap-2 text-xs text-muted">
        <IconChart /> No fake metrics: every number on this page comes from your real account data.
      </p>
    </div>
  );
}
