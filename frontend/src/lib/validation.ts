import { z } from 'zod'

export const emailSchema = z.string().email('유효한 이메일을 입력하세요')

export const phoneSchema = z
  .string()
  .regex(/^\d{3}-\d{3,4}-\d{4}$/, '형식: 010-1234-5678')

export const passwordSchema = z
  .string()
  .min(8, '최소 8자 이상 입력하세요')
  .regex(/[A-Z]/, '최소 1개의 대문자를 포함하세요')
  .regex(/[a-z]/, '최소 1개의 소문자를 포함하세요')
  .regex(/[0-9]/, '최소 1개의 숫자를 포함하세요')

export const workOrderSchema = z.object({
  title: z.string().min(5, '제목은 최소 5자 이상이어야 합니다'),
  description: z.string().min(10, '설명은 최소 10자 이상이어야 합니다'),
  category: z.string().min(1, '카테고리를 선택하세요'),
  priority: z.enum(['low', 'normal', 'high', 'urgent']),
})

export const vendorSchema = z.object({
  name: z.string().min(2, '업체명을 입력하세요'),
  phone: phoneSchema,
  category: z.string().min(1, '카테고리를 선택하세요'),
  email: emailSchema.optional(),
  address: z.string().optional(),
})

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, '비밀번호를 입력하세요'),
})

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(2, '이름을 입력하세요'),
})
