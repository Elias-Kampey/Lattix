export interface CryptoResult {
  success: boolean
  algorithm: string
  operation: string
  executionTimeMs?: number
  error?: string
}