const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function getMlKem() {
  const response = await fetch(`${API_URL}/api/ml-kem`);

  if (!response.ok) {
    throw new Error("ML-KEM request failed");
  }

  return response.json();
}

export async function getMlDsa() {
  const response = await fetch(`${API_URL}/api/ml-dsa`);

  if (!response.ok) {
    throw new Error("ML-DSA request failed");
  }

  return response.json();
}

export async function getAes() {
  const response = await fetch(`${API_URL}/api/aes`);

  if (!response.ok) {
    throw new Error("AES request failed");
  }

  return response.json();
}

export { API_URL };