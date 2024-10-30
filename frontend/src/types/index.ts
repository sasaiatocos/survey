export type Survey = {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  expiredAt: string;
}

export type Question = {
  id: number;
  createdAt: string;
  updatedAt: string;
  question: string;
  surveyId: number;
}

export type User = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  password: string;
}