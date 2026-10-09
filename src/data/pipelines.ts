/**
 * Per-project pipeline schematics, derived only from each project's
 * `summary` and `description` in resume.ts. No invented stages.
 *
 * Motifs (how <Schematic> lays the nodes out):
 * - linear: nodes[0] → nodes[1] → … in order.
 * - loop:   linear, plus a return path from the last node back to the first (continuous / iterative).
 * - branch: nodes[0] is a side store that feeds nodes[2]; the main flow is nodes[1] → nodes[2] → …
 * - hub:    nodes[0] is the core; nodes[1..4] (max 4) are spokes connected to it.
 */
export type Motif = 'linear' | 'loop' | 'branch' | 'hub';

export interface Pipeline {
  nodes: string[];
  motif: Motif;
}

export const pipelines: Record<string, Pipeline> = {
  // "hybrid analysis using regex … combined with AST parsing", "base64 noise elimination", "Groups and deduplicates findings", "risk categorization (high, medium, info)"
  EnvScope: {
    motif: 'linear',
    nodes: ['JS bundles', 'Regex + AST', 'Noise filter', 'Dedupe by source', 'Severity report'],
  },
  // "Captures console errors … failed network requests … in real time", "Monitors performance metrics"
  TestPilot: {
    motif: 'loop',
    nodes: ['Live page', 'Console + network', 'Performance API', 'Bug signals'],
  },
  // "live database schema introspection", "layered safeguards", "SQL validation", "strict read-only execution", "explanations alongside SQL"
  AskSQLAI: {
    motif: 'linear',
    nodes: ['Question', 'Schema introspection', 'Gemini', 'Guardrails', 'Read-only exec', 'Result + explanation'],
  },
  // "raw meeting transcripts", "strict JSON schema enforcement", "summaries, decisions, and action items"
  MeetlyAI: {
    motif: 'linear',
    nodes: ['Transcript', 'Gemini', 'JSON schema', 'Summary · actions'],
  },
  // "chunking, embeddings, and vector similarity search", "FAISS", "Gemini constrained strictly to retrieved context"
  SearchlyAI: {
    motif: 'branch',
    nodes: ['Chunks + embeddings', 'Question', 'FAISS search', 'Gemini', 'Grounded answer'],
  },
  // "multiple … sources", "scheduled cron jobs", "semantic deduplication", "batch-based Gemini processing", "single feed API"
  SemanticFeed: {
    motif: 'linear',
    nodes: ['News sources', 'Cron ingest', 'Semantic dedupe', 'Gemini batch', 'Feed API'],
  },
  // "FAISS with Gemini embeddings", "multi-question conversational querying over a single uploaded PDF"
  QueryDoc: {
    motif: 'branch',
    nodes: ['PDF embeddings', 'Question', 'FAISS search', 'Gemini', 'Answer'],
  },
  // "Multi-agent pipeline for medical intake", "Extracts structured clinical data", "Google Search Tool", "SOAP notes with safety checks"; tech: InMemoryRunner
  'AI-Powered SOAP Note Generator': {
    motif: 'hub',
    nodes: ['ADK runner', 'Intake', 'Clinical extraction', 'Guideline search', 'SOAP + safety check'],
  },
  // "Add, edit, and reorder README sections with real-time updates", "Gemini-powered content optimization", "live markdown preview"
  'Readme Creator': {
    motif: 'loop',
    nodes: ['Sections', 'Gemini optimise', 'Live preview'],
  },
  // "Extracts resume text using PyPDF2", "structured JSON", "first-person summary with Gemini", "Flash / Pro"
  'Gemini PDF Analyzer': {
    motif: 'linear',
    nodes: ['Resume PDF', 'PyPDF2 extract', 'Structured JSON', 'Gemini Flash/Pro', 'First-person summary'],
  },
  // "chatbot interface", "ML-based diagnosis … via Python API", "Hospital locator", "authentication using Firebase"
  EasyDiagno: {
    motif: 'hub',
    nodes: ['Flutter app', 'Symptom chatbot', 'ML diagnosis API', 'Hospital locator', 'Firebase auth'],
  },
  // "Real-time messaging + video chat", "Stream API integration", "Screen sharing + image sharing"
  Streamify: {
    motif: 'hub',
    nodes: ['Stream API', 'Messaging', 'Video chat', 'Screen sharing', 'Image sharing'],
  },
};
