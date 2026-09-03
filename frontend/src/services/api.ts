import type {
  MlKemResult,
  MlDsaResult,
  AesResult,
} from "../types/crypto"

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001"

async function request<T>(path: string): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${API_URL}${path}`)
  } catch {
    throw new Error("Unable to connect to Lattix backend")
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

export function getMlKem(): Promise<MlKemResult> {
  return request<MlKemResult>("/api/ml-kem")
}

export function getMlDsa(): Promise<MlDsaResult> {
  return request<MlDsaResult>("/api/ml-dsa")
}

export function getAes(): Promise<AesResult> {
  return request<AesResult>("/api/aes")
}

export { API_URL }