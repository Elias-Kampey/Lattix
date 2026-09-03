export interface MlKemResult {
  success: boolean
  algorithm: string

  ciphertext_size: number
  shared_secret_size: number

  keygen_ms: number
  encapsulation_ms: number
  decapsulation_ms: number
}

export interface MlDsaResult {
  success: boolean
  algorithm: string

  signature_size: number

  original_valid: boolean
  tampered_valid: boolean

  keygen_ms: number
  sign_ms: number
  verify_ms: number
}

export interface AesResult {
  success: boolean
  algorithm: string

  plaintext_size: number
  ciphertext_size: number
  tag_size: number

  plaintext_match: boolean
  tamper_rejected: boolean

  encrypt_ms: number
  decrypt_ms: number
}