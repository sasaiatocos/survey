export interface Survey {
  id: string;
  title: string;
  questions: Question[];
}

export interface Question {
  id: string;
  question: string;
  options: Option[];
}

export interface Option {
  id: string;
  option: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Answer {
  id: string;
  user: User[];
  options: Option[];
}