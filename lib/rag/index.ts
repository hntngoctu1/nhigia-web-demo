export { loadCorpus, clearCorpusCache } from "./corpus";
export { retrieve, chunksByIds, clearRetrieveCache } from "./retrieve";
export {
  answerChat,
  decideAnswer,
  isFeeOrGuarantee,
  toSources,
  HOTLINE,
  EMAIL,
  SAFETY_REPLY,
} from "./answer";
export { hasXaiKey, xaiConfig, streamGrokReply, completeGrokReply } from "./grok";
export { foldDiacritics, stripBrand } from "./normalize";
export {
  DEST_LABEL,
  detectDestination,
  detectTopic,
  expandQuery,
  isDetailQuestion,
  looksLikeInventedPrice,
  suggestionsFor,
} from "./intent";
export type { Topic, Suggestion, DestinationId } from "./intent";
export { searchOnline, parseDdgLite, publicSourceChips, destOfficialChips } from "./web";
export type { WebSnippet } from "./web";
export type {
  ChatMessage,
  ChatResponse,
  ChatSource,
  ChatCitation,
  ChatSuggestion,
  RagChunk,
  ScoredChunk,
  InstantDecision,
  ChatMode,
} from "./types";
