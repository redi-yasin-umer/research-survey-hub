export type QuestionType = 'multiple_choice' | 'likert' | 'open_ended' | 'dropdown' | 'checkbox';

export interface QuestionOption {
  id: string;
  label: string;
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
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  answers: Record<string, string | string[]>;
  submittedAt: string;
  respondentId?: string;
}
