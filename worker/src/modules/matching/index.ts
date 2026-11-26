import type { Env } from "../../env";
import type { EnrichMatchMessage } from "../../queues/messages";

/**
 * Matching module contract (Phase 5): hard filters → FTS5 lexical → embeddings → optional LLM rubric.
 * Every score must be decomposable into named, user-visible components.
 */
export interface ScoreComponent {
  key: "title" | "skills" | "semantic" | "location" | "freshness" | "salary";
  weight: number;
  score: number; // 0..1
  explanation: string;
}

export interface MatchResult {
  jobId: string;
  userId: string;
  total: number; // 0..100
  excludedBy?: string;
  components: ScoreComponent[];
}

export async function handleEnrichMatch(_env: Env, msg: EnrichMatchMessage): Promise<void> {
  console.info("matching_not_implemented", { jobs: msg.jobIds.length });
}
