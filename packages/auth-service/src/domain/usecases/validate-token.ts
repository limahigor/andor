export interface ValidateToken {
  validate: (token: string) => Promise<ValidateResult>;
}

export interface ValidateResult {
  isValid: boolean;
  userId: string;
}