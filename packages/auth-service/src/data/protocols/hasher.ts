export interface Hasher{
  hasher: (value: string) => Promise<string>
}