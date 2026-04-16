export type QuestionType = 'multiple_choice' | 'likert' | 'open_ended' | 'dropdown' | 'checkbox' | 'ism_pairwise' | 'ahp_pairwise';

export interface QuestionOption {
  id: string;
  label: string;
}

export interface PairwiseFactor {
  id: string;
  label: string;
  category?: string;
}

export interface PairwisePair {
  factorA: string; // factor id
  factorB: string; // factor id
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  options?: QuestionOption[];
  likertScale?: 5 | 7;
  section?: string;
  // ISM & AHP pairwise fields
  factors?: PairwiseFactor[];
  pairs?: PairwisePair[]; // if empty, auto-generate all combinations
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  questions: Question[];
  isPublic: boolean;
  isAnonymous: boolean;
  createdAt: string;
  status: 'draft' | 'active' | 'closed';
  responseCount: number;
  /** When true, the respondent identity form (university header + identity fields) is shown above the questions. */
  collectIdentity?: boolean;
}

export interface RespondentIdentity {
  fullName: string;
  organization: string;
  position: string;
  email: string;
  phone: string;
  yearsExperience: string;
  notes: string;
}

// ISM answer: record of "factorA_factorB" -> "→" | "←" | "↔" | "×"
// AHP answer: record of "factorA_factorB" -> number (-9 to 9, negative = B preferred)
export interface SurveyResponse {
  id: string;
  surveyId: string;
  answers: Record<string, string | string[] | Record<string, string | number>>;
  submittedAt: string;
  respondentId?: string;
  identity?: RespondentIdentity;
}
