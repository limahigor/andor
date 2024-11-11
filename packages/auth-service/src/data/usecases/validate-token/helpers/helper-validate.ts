import type { ValidateResult } from "../../../../domain/usecases/validate-token"

export const error = (): ValidateResult => ({
  isValid: false,
  userId: ''
})

export const ok = (value: string): ValidateResult => ({
  isValid: true,
  userId: value
})