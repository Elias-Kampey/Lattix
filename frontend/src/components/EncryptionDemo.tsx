import { useState } from "react"
import type { AesResult } from "../types/crypto"
import { getAes } from "../services/api"
import ErrorMessage from "./ErrorMessage"

function EncryptionDemo() {
  const [result, setResult] = useState<AesResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runEncryptionTest = async () => {
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const data = await getAes()
      setResult(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Encryption test failed"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="encryptionDemo">
      <div className="exchangeHeader">
        <div>
          <h2>AES-256-GCM Encryption</h2>
          <p>Authenticated symmetric encryption and tamper detection</p>
        </div>

        <button
          onClick={runEncryptionTest}
          disabled={loading}
        >
          {loading ? "Running..." : "Run Encryption Test"}
        </button>
      </div>

      <div className="encryptionFlow">
        <div className="partyCard">
          <span>STEP 1</span>
          <h3>Plaintext</h3>
          <p>Prepare data for authenticated encryption.</p>
        </div>

        <div className="flowArrow">
          <span>→</span>
        </div>

        <div className="partyCard">
          <span>STEP 2</span>
          <h3>AES-256-GCM</h3>
          <p>Encrypt and authenticate the plaintext.</p>
        </div>

        <div className="flowArrow">
          <span>→</span>
        </div>

        <div className="partyCard">
          <span>STEP 3</span>
          <h3>Decrypt</h3>
          <p>Recover plaintext and reject tampering.</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {result && (
        <div className="exchangeResult">
          <h3>
            Encryption Test {result.success ? "Passed ✓" : "Failed ✕"}
          </h3>

          <div className="metrics">
            <p>Plaintext: {result.plaintext_size} bytes</p>
            <p>Ciphertext: {result.ciphertext_size} bytes</p>
            <p>Authentication Tag: {result.tag_size} bytes</p>

            <p>
              Plaintext Match:{" "}
              {result.plaintext_match ? "Yes ✓" : "No ✕"}
            </p>

            <p>
              Tamper Test:{" "}
              {result.tamper_rejected ? "Rejected ✓" : "Failed ✕"}
            </p>

            <p>Encryption: {result.encrypt_ms} ms</p>
            <p>Decryption: {result.decrypt_ms} ms</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default EncryptionDemo