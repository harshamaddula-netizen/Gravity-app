export type AssessmentState = 
  | "SUPPORTED"
  | "CONTRADICTED"
  | "MIXED"
  | "INSUFFICIENT_EVIDENCE";

export type StanceType = 
  | "SUPPORTING"
  | "CONTRADICTING"
  | "UNCLEAR";

export interface EvidenceItem {
  title: string;
  source: string;
  url?: string | null;
  passage: string;
  relevance_score: number;
  stance: StanceType;
  published_at?: string | null;
}

export interface EvidenceSummary {
  supporting: number;
  contradicting: number;
  unclear: number;
}

export interface VerifyResponse {
  id: string;
  claim: string;
  assessment: AssessmentState;
  assessment_confidence: number;
  explanation: string;
  summary: EvidenceSummary;
  evidence: EvidenceItem[];
  caveat: string;
  processing_time_ms: number;
  created_at: string;
}

export interface HistoryItem {
  id: string;
  claim: string;
  assessment: AssessmentState;
  assessment_confidence: number;
  explanation: string;
  summary: EvidenceSummary;
  evidence_count: number;
  processing_time_ms: number;
  created_at: string;
}

export interface HistoryListResponse {
  total: number;
  items: HistoryItem[];
}

export interface HealthResponse {
  status: string;
  app_name: string;
  version: string;
  demo_mode: boolean;
  classifier_mode: string;
  retriever_mode: string;
  llm_provider: string;
  total_indexed_documents: number;
}
