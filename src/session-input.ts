// The subset of the JSON Claude Code pipes to the status line command.
export interface SessionInput {
  model?: { display_name?: string };
  effort?: { level?: string };
  context_window?: { used_percentage?: number | null };
  prompt_cache?: { ttl?: string; expires_at?: number | null };
}
