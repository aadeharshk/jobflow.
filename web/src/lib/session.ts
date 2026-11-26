import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type User } from "./api";

export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: () => api<{ user: User | null }>("/api/auth/session").then((r) => r.user),
    staleTime: 60_000,
  });
}

export function useSignOut() {
  const qc = useQueryClient();
  return async () => {
    await api("/api/auth/logout", { method: "POST" });
    qc.clear();
    window.location.assign("/");
  };
}
