import type {
  SignResponse,
  VerifyResponse,
} from "../types/crypto"

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080"

export async function signMessage(
  message: string
): Promise<SignResponse> {
  const response = await fetch(`${API_URL}/sign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  })

  if (!response.ok) {
    throw new Error("Failed to sign message")
  }

  return response.json()
}

export async function verifySignature(
  message: string,
  signature: string,
  publicKey: string
): Promise<VerifyResponse> {
  const response = await fetch(`${API_URL}/verify`, {
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

  if (!response.ok) {
    throw new Error("Failed to verify signature")
  }

  return response.json()
}

export { API_URL }