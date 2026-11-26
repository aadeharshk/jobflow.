import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, Button, Card, CardHeader, EmptyState, Spinner } from "../components/ui";
import { IconFile, IconUpload } from "../components/icons";
import { api, ApiError, formatBytes, formatDate, type Resume } from "../lib/api";

const MAX_BYTES = 5 * 1024 * 1024;

export function Resumes() {
  const qc = useQueryClient();
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const list = useQuery({ queryKey: ["resumes"], queryFn: () => api<{ resumes: Resume[] }>("/api/files/resumes").then((r) => r.resumes) });

  const upload = useMutation({
    mutationFn: (file: File) => {
      const form = new FormData();
      form.append("file", file);
      return api<{ resume: Resume }>("/api/files/resumes", { method: "POST", body: form });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["resumes"] }),
    onError: (err) => setError(err instanceof ApiError ? err.message : "Upload failed"),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api(`/api/files/resumes/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["resumes"] }),
  });

  function onPick(file: File | undefined) {
    setError(null);
    if (!file) return;
    if (file.type && file.type !== "application/pdf") return setError("Please choose a PDF file.");
    if (file.size > MAX_BYTES) return setError("Résumé must be 5 MB or smaller.");
    upload.mutate(file);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Résumés</h1>
        <p className="mt-1 text-sm text-muted">
          Stored privately in your account. Only you can download them. Deleting your account removes them permanently.
        </p>
      </div>
      <Card>
        <CardHeader
          title="Your files"
          description="PDF only, up to 5 MB, maximum 10 files."
          action={
            <>
              <input
                ref={input}
                type="file"
                accept="application/pdf,.pdf"
                className="sr-only"
                aria-label="Choose résumé PDF"
                onChange={(e) => {
                  onPick(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
              <Button onClick={() => input.current?.click()} disabled={upload.isPending}>
                <IconUpload /> {upload.isPending ? "Uploading…" : "Upload PDF"}
              </Button>
            </>
          }
        />
        {error && (
          <div className="mb-4">
            <Alert tone="error">{error}</Alert>
          </div>
        )}
        {list.isLoading && <Spinner />}
        {list.data && list.data.length === 0 && (
          <EmptyState
            icon={<IconFile />}
            title="No résumé yet"
            action={
              <Button variant="secondary" onClick={() => input.current?.click()}>
                Upload your first résumé
              </Button>
            }
          >
            Your résumé is the starting point for your career profile and for tailored applications.
          </EmptyState>
        )}
        {list.data && list.data.length > 0 && (
          <ul className="divide-y divide-border">
            {list.data.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="text-brand">
                    <IconFile />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{r.filename}</p>
                    <p className="text-xs text-muted">
                      {formatBytes(r.sizeBytes)} · uploaded {formatDate(r.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`/api/files/resumes/${r.id}/download`}
                    className="inline-flex h-8 items-center rounded-lg border border-border px-3 text-sm hover:bg-surface-2"
                  >
                    Download
                  </a>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (confirm(`Delete ${r.filename}?`)) remove.mutate(r.id);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
