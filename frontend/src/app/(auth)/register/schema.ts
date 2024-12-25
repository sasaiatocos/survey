import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(6, '名前は6文字以上である必要があります'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(6, 'パスワードは6文字以上である必要があります'),
});