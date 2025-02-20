import { z } from 'zod';

const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'MULTIPLE_CHOICE',
  SINGLE_CHOICE: 'SINGLE_CHOICE',
  OPEN_ENDED: 'OPEN_ENDED',
} as const;

export const optionSchema = z.object({
  text: z.string().min(1, '選択肢は少なくとも一つ入力してください')
});

export const questionSchema = z.object({
  text: z.string().min(1, '質問文は必須項目です'),
  type: z.enum([QUESTION_TYPES.MULTIPLE_CHOICE, QUESTION_TYPES.SINGLE_CHOICE, QUESTION_TYPES.OPEN_ENDED]),
  options: z.array(optionSchema).optional()
}).superRefine((data, ctx) => {
  if (data.type !== QUESTION_TYPES.OPEN_ENDED) {
    if (!data.options || data.options.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '質問には少なくとも一つの選択肢が必要です',
        path: ['options'],
      });
    }
  }
});

export const surveySchema = z.object({
  title: z.string().min(1, 'アンケートタイトルは必須項目です'),
  description: z.string().optional(),
  questions: z.array(questionSchema).min(1, '質問は少なくとも一つ入力してください')
});