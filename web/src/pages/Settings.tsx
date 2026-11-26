import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, Badge, Button, Card, CardHeader, Input, Spinner, Toggle } from "../components/ui";
import { api, ApiError, describeDevice, formatDate, type AutomationStatus, type SessionRow, type User } from "../lib/api";
import { useSession } from "../lib/session";

function ProfileCard({ user }: { user: User }) {
  const qc = useQueryClient();
  const [name, setName] = useState(user.name ?? "");
  const [country, setCountry] = useState(user.country ?? "IN");
  const [timezone, setTimezone] = useState(user.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone);
  const save = useMutation({
    mutationFn: () =>
      api<{ user: User }>("/api/me", {
        method: "PATCH",
        json: { name: name || null, country: country.toUpperCase() || null, timezone: timezone || null },
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["session"] }),
  });
  return (
    <Card>
      <CardHeader title="Profile" description={`Signed in as ${user.email}`} />
      <form
        className="grid gap-4 sm:grid-cols-3"
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} />
        <Input label="Country" value={country} onChange={(e) => setCountry(e.target.value)} maxLength={2} hint="ISO code, e.g. IN" />
        <Input label="Time zone" value={timezone} onChange={(e) => setTimezone(e.target.value)} hint="e.g. Asia/Kolkata" />
        <div className="flex items-center gap-3 sm:col-span-3">
          <Button type="submit" disabled={save.isPending}>
            Save profile
          </Button>
          {save.isSuccess && <span className="text-sm text-success">Saved</span>}
          {save.error && <span className="text-sm text-danger">{save.error instanceof ApiError ? save.error.message : "Save failed"}</span>}
        </div>
      </form>
    </Card>
  );
}

function AutomationCard() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["automation"], queryFn: () => api<AutomationStatus>("/api/me/automation") });
  // Local draft only while the slider is being dragged; otherwise the server value is shown.
  const [draftCap, setDraftCap] = useState<number | null>(null);
  const update = useMutation({
    mutationFn: (patch: Partial<AutomationStatus["settings"]>) => api("/api/me/automation", { method: "PATCH", json: patch }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["automation"] });
      setDraftCap(null);
    },
  });
  if (!q.data)
    return (
      <Card>
        <Spinner />
      </Card>
    );
  const { settings, sending, platformDailyCap } = q.data;
  const cap = draftCap ?? settings.dailyCap;
  const commitCap = () => {
    if (draftCap !== null && draftCap !== settings.dailyCap) update.mutate({ dailyCap: draftCap });
  };
  return (
    <Card>
      <CardHeader
        title="Automation & sending limits"
        description="These guard rails apply to every outbound message, including follow-ups."
        action={settings.paused ? <Badge tone="warning">Paused</Badge> : <Badge tone="success">Active</Badge>}
      />
      <div className="space-y-5">
        <Toggle
          label="Pause all automation"
          description="Stops every queued and future send immediately until you resume."
          checked={settings.paused}
          onChange={(v) => update.mutate({ paused: v })}
          disabled={update.isPending}
        />
        <Toggle
          label="Allow one follow-up"
          description="Send a single polite follow-up after 24 hours only if there is no genuine reply."
          checked={settings.followupsEnabled}
          onChange={(v) => update.mutate({ followupsEnabled: v })}
          disabled={update.isPending}
        />
        <div>
          <label htmlFor="cap" className="block text-sm font-medium">
            Daily message limit: {cap}
          </label>
          <p className="text-sm text-muted">
            Rolling 24 hours. Platform maximum is {platformDailyCap}. Currently used: {sending.sentInWindow}.
          </p>
          <input
            id="cap"
            type="range"
            min={0}
            max={platformDailyCap}
            value={cap}
            onChange={(e) => setDraftCap(Number(e.target.value))}
            onPointerUp={commitCap}
            onKeyUp={commitCap}
            onBlur={commitCap}
            className="mt-2 w-full accent-[var(--jf-brand)]"
          />
        </div>
      </div>
    </Card>
  );
}

function SessionsCard() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["sessions"],
    queryFn: () => api<{ sessions: SessionRow[] }>("/api/me/sessions").then((r) => r.sessions),
  });
  const revokeOthers = useMutation({
    mutationFn: () => api("/api/me/sessions/revoke-others", { method: "POST" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sessions"] }),
  });
  const revoke = useMutation({
    mutationFn: (id: string) => api(`/api/me/sessions/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sessions"] }),
  });
  return (
    <Card>
      <CardHeader
        title="Active sessions"
        description="Devices currently signed in to your account."
        action={
          <Button size="sm" variant="secondary" onClick={() => revokeOthers.mutate()}>
            Sign out other devices
          </Button>
        }
      />
      {q.isLoading && <Spinner />}
      <ul className="divide-y divide-border">
        {q.data?.map((s) => (
          <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
            <div className="min-w-0">
              <p className="truncate font-medium">
                {describeDevice(s.userAgent)} {s.current && <Badge tone="brand">This device</Badge>}
              </p>
              <p className="text-xs text-muted">
                Last active {formatDate(s.lastSeenAt)}
                {s.country ? ` · ${s.country}` : ""}
              </p>
            </div>
            {!s.current && (
              <Button size="sm" variant="ghost" onClick={() => revoke.mutate(s.id)}>
                Revoke
              </Button>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}

function DataCard({ user }: { user: User }) {
  const [confirmEmail, setConfirmEmail] = useState("");
  const del = useMutation({
    mutationFn: () => api("/api/me", { method: "DELETE", json: { confirmEmail } }),
    onSuccess: () => window.location.assign("/"),
  });
  return (
    <Card>
      <CardHeader title="Your data" description="Download everything JobFlow stores about you, or delete your account permanently." />
      <div className="space-y-6">
        <a
          href="/api/me/export"
          className="inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm font-medium hover:bg-surface-2"
        >
          Download my data (JSON)
        </a>
        <div className="rounded-lg border border-danger/40 p-4">
          <p className="font-medium text-danger">Delete account</p>
          <p className="mt-1 text-sm text-muted">Removes your profile, résumés, sessions and settings. This cannot be undone.</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
            <Input
              className="flex-1"
              label="Type your email to confirm"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              placeholder={user.email}
            />
            <Button
              variant="danger"
              disabled={confirmEmail.trim().toLowerCase() !== user.email.toLowerCase() || del.isPending}
              onClick={() => del.mutate()}
            >
              Delete permanently
            </Button>
          </div>
          {del.error && (
            <div className="mt-3">
              <Alert tone="error">{del.error instanceof ApiError ? del.error.message : "Deletion failed"}</Alert>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export function Settings() {
  const { data: user } = useSession();
  if (!user) return <Spinner />;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <ProfileCard user={user} />
      <AutomationCard />
      <SessionsCard />
      <DataCard user={user} />
    </div>
  );
}
