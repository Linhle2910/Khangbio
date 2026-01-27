
export enum View {
  DASHBOARD = 'DASHBOARD',
  CURRICULUM = 'CURRICULUM',
  EXAM_PRACTICE = 'EXAM_PRACTICE',
  CHAT = 'CHAT',
  BANK = 'BANK',
  REPORTS = 'REPORTS'
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  grade?: 8 | 9;
  topic?: string;
  level?: 'BASIC' | 'GENERAL' | 'ADVANCED';
}

export interface EssayQuestion {
  id: string;
  text: string;
  point: number;
}

export interface EssayExam {
  id: string;
  title: string;
  duration: number;
  questions: EssayQuestion[];
}

export interface EssayGradingResult {
  totalScore: number;
  feedback: {
    questionId: string;
    score: number;
    comment: string;
    suggestedAnswer: string;
  }[];
  overallReview: string;
}

export interface HomeworkGradingResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  detailedFeedback: string;
  suggestedModelAnswer: string;
  terminologyCheck: { term: string; status: 'CORRECT' | 'INCORRECT' | 'MISSING'; note: string }[];
}

export interface BiologyTopic {
  id: string;
  title: string;
  grade: 8 | 9;
  icon: string;
  description: string;
  checklist: string[];
  summary: string;
  lecturePrompt: string;
  category: string;
}

export interface ExamPaper {
  id: string;
  title: string;
  type: 'CHUYEN_10' | 'HSG_9';
  year: string;
  description: string;
  contentUrl?: string;
}

export interface BankItem {
  id: string;
  title: string;
  description?: string;
  type: 'LECTURE' | 'EXAM' | 'QA';
  subType?: 'QUESTION' | 'ANSWER';
  topicId: string;
  grade: 8 | 9;
  source: string;
  dateAdded: string;
  url?: string;
  fileType?: 'FILE' | 'DRIVE' | 'LINK';
}

export interface StudyPlanItem {
  week: number;
  title: string;
  topics: string[];
  exercises: string[];
  reference: string;
}
