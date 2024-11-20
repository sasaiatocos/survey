import { z } from 'zod';

export const optionSchema = z.object({
  text: z.string().min(1, '選択肢は少なくとも一つ入力してください')
});

export const questionSchema = z.object({
  text: z.string().min(1, '質問文は必須項目です'),
  options: z.array(optionSchema).min(2, '質問には少なくとも一つの選択肢が必要です'),
});

export const surveySchema = z.object({
  title: z.string().min(1, 'アンケートタイトルは必須項目です'),
  description: z.string().optional(),
  questions: z.array(questionSchema).min(1, '質問は少なくとも一つ入力してください')
});