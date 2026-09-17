export type RagChunk = {
  id: string;
  text: string;
  metadata?: Record<string, unknown>;
};

export type ScoredChunk = RagChunk & {
  score: number;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ChatSource = {
  id: string;
  section?: string;
  score: number;
  excerpt: string;
  url?: string;
};

export type ChatCitation = {
  label: string;
  url: string;
};

export type ChatMode = "instant" | "hybrid" | "fallback" | "safety";

export type ChatSuggestion = {
  label: string;
  text: string;
};

export type ChatResponse = {
  reply: string;
  sources: ChatSource[];
  mode?: ChatMode;
  topic?: string;
  suggestions?: ChatSuggestion[];
  citations?: ChatCitation[];
};

export type InstantDecision = {
  kind: "instant" | "safety" | "hybrid" | "fallback";
  reply?: string;
  sources: ChatSource[];
  chunks: ScoredChunk[];
  query: string;
  topic?: string;
  suggestions?: ChatSuggestion[];
  destination?: string | null;
};
