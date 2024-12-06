export interface Survey {
  id: number;
  title: string;
  description: string;
  questions: Question[];
}

export interface Question {
  id: number;
  text: string;
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