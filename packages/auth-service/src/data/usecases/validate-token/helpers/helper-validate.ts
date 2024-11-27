import type { ValidateResult } from "../../../../domain/usecases/validate-token"

export interface TokenResult{
  id: string
  iat: number
}

export const error = (): ValidateResult => ({
  isValid: false,
  userId: ''
})

export const ok = (value: string): ValidateResult => ({
  isValid: true,
  userId: value
})