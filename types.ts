
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

export interface CurriculumTopic {
  id: string;
  grade: 8 | 9;
  title: string;
  mainContent: string; // Nội dung chính (Sườn bài)
  knowledgeSummary: string; // Tóm tắt kiến thức (Cheatsheet)
  detailLink: string; // Link bài học chi tiết
  category?: string;
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

// Added missing ExamPaper interface used in constants.tsx
export interface ExamPaper {
  id: string;
  title: string;
  type: string;
  year: string;
  description: string;
}

// Added missing StudyPlanItem interface used in constants.tsx
export interface StudyPlanItem {
  week: number;
  title: string;
  topics: string[];
  exercises: string[];
  reference: string;
}
