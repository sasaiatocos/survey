export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  OPEN_ENDED = 'OPEN_ENDED',
}

export interface Survey {
  id: number;
  title: string;
  description: string;
  questions: Question[];
}

export interface Question {
  id: number;
  text: string;
  type: QuestionType;
  options: Option[];
}

export interface Option {
  id: number;
  text: string;
  responseCount: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Answer {
  id: number;
  user: User[];
  options: Option[];
}