export interface Question {
  id: number;
  area: "환경" | "사회" | "거버넌스";
  topic: string;
  pdca: "P" | "D" | "C" | "A";
  question: string;
  options: string[];
  explanation: string;
  reverseScoring: boolean;
}

export interface Perspective {
  id: string;
  name: string;
  label: string;
  questionIds: number[];
  weakTopicHint: string;
}

export interface Answer {
  selected: string | null; // "가", "나", "다"
  notApplicable: boolean;
  comment: string;
}

export type DiagnosisMode = "full" | "demo";

export interface UserData {
  user: string;
  companyName: string;
  mode: DiagnosisMode;
  startedAt: string;
  answers: Record<number, Answer>;
  status: "in_progress" | "submitted";
  submittedAt: string | null;
}

export interface PerspectiveScore {
  id: string;
  name: string;
  label: string;
  score: number;
  weakTopicHint: string;
}
