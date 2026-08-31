export interface CryptoResult {
  success: boolean
  algorithm: string
  operation: string
  executionTimeMs?: number
  error?: string
}

export interface KemResult extends CryptoResult {
  publicKeySize: number
  ciphertextSize: number
  sharedSecretMatch: boolean
  keyGenerationTimeMs: number
  encapsulationTimeMs: number
  decapsulationTimeMs: number
}

export interface SignatureResult extends CryptoResult {
  signatureSize: number
  signatureValid: boolean
  signingTimeMs: number
  verificationTimeMs: number
}

export interface SignResponse {
  success: boolean
  algorithm: string
  signature: string
  publicKey: string
  signatureSize: number
  signingTimeMs: number
  error?: string
}

export interface VerifyResponse {
  success: boolean
  algorithm: string
  signatureValid: boolean
  verificationTimeMs: number
  error?: string
}