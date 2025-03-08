import * as zod from 'zod'

export const SignInSchema = zod.object({
  email: zod.string().email({
    message: 'Endereço de e-mail inválido',
  }),
  password: zod.string().min(8, {
    message: 'A senha deve ter pelo menos 8 caracteres',
  }),
})

export type SignInSchemaType = zod.infer<typeof SignInSchema>

export const SignUpSchema = zod.object({
  name: zod.string().min(5, {
    message: 'O nome deve ter pelo menos 5 caracteres',
  }),
  email: zod.string().email({
    message: 'Endereço de e-mail inválido',
  }),
  password: zod.string().min(8, {
    message: 'A senha deve ter pelo menos 8 caracteres',
  }),
})

export type SignUpSchemaType = zod.infer<typeof SignUpSchema>