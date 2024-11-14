export interface Survey {
  id: string;
  title: string;
  questions: Question[];
}

export interface Question {
  id: string;
  questionText: string;
  options: Option[];
}

export interface Option {
  id: string;
  option: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Answer {
  id: string;
  user: User[];
  options: Option[];
}