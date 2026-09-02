import type {
  KemResult,
  SignResponse,
  VerifyResponse,
  EncryptionResult,
  BenchmarkResult,
} from "../types/crypto"

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080"

export const USE_MOCKS =
  import.meta.env.VITE_USE_MOCKS === "true"

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${API_URL}${path}`, options)
  } catch {
    throw new Error("Unable to connect to CipherShift backend")
  }

  if (!response.ok) {
    let message = `Backend request failed (${response.status})`

    try {
      const data = await response.json()

      if (data.error) {
        message = data.error
      }
    } catch {
      // Backend did not return JSON.
    }

    throw new Error(message)
  }

  try {
    return await response.json()
  } catch {
    throw new Error("Backend returned an invalid response")
  }
}

export async function runKeyExchange(): Promise<KemResult> {
  return request<KemResult>("/kem", {
    method: "POST",
  })
}

export async function signMessage(
  message: string
): Promise<SignResponse> {
  return request<SignResponse>("/sign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  })
}

export async function verifySignature(
  message: string,
  signature: string,
  publicKey: string
): Promise<VerifyResponse> {
  return request<VerifyResponse>("/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      signature,
      publicKey,
    }),
  })
}

export async function encryptMessage(
  message: string
): Promise<EncryptionResult> {
  return request<EncryptionResult>("/encrypt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  })
}

export async function getBenchmarks(): Promise<
  BenchmarkResult[]
> {
  return request<BenchmarkResult[]>("/benchmark", {
    method: "GET",
  })
}

export { API_URL }