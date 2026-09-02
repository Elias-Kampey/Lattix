import { useState } from "react"
import type { MlKemResult } from "../types/crypto"
import { getMlKem } from "../services/api"
import ErrorMessage from "./ErrorMessage"

function KeyExchange() {
  const [result, setResult] = useState<MlKemResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runKeyExchange = async () => {
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const data = await getMlKem()
      setResult(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Key exchange failed"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="keyExchange">
      <div className="exchangeHeader">
        <div>
          <h2>ML-KEM-768 Key Exchange</h2>
          <p>Post-quantum shared-secret establishment</p>
        </div>

        <button onClick={runKeyExchange} disabled={loading}>
          {loading ? "Running..." : "Run Key Exchange"}
        </button>
      </div>

      <div className="exchangeFlow">
        <div className="partyCard">
          <span>ALICE</span>
          <h3>Key Generation</h3>
          <p>Generates ML-KEM public and private keys.</p>
        </div>

        <div className="flowArrow">
          <span>Public Key →</span>
        </div>

        <div className="partyCard">
          <span>BOB</span>
          <h3>Encapsulation</h3>
          <p>Creates ciphertext and shared secret.</p>
        </div>

        <div className="flowArrow">
          <span>← Ciphertext</span>
        </div>

        <div className="partyCard">
          <span>ALICE</span>
          <h3>Decapsulation</h3>
          <p>Recovers the same shared secret.</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {result && (
        <div className="exchangeResult">
          <h3>
            Key Exchange {result.success ? "Successful ✓" : "Failed ✕"}
          </h3>

          <div className="metrics">
            <p>Ciphertext: {result.ciphertext_size} bytes</p>
            <p>Shared Secret: {result.shared_secret_size} bytes</p>
            <p>Key Generation: {result.keygen_ms} ms</p>
            <p>Encapsulation: {result.encapsulation_ms} ms</p>
            <p>Decapsulation: {result.decapsulation_ms} ms</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default KeyExchange