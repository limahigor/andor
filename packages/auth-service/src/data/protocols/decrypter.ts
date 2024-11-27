import type { TokenResult } from "../usecases/validate-token/helpers/helper-validate";

export interface Decrypter {
  decrypt: (ciphertext: string) => Promise<TokenResult>
}