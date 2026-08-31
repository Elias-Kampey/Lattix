import { useState } from "react"
import type { KemResult } from "../types/crypto"

function KeyExchange() {
  const [result, setResult] = useState<KemResult | null>(null)
  const [loading, setLoading] = useState(false)

  const runKeyExchange = () => {
    setLoading(true)
    setResult(null)

    // Temporary mock result.
    // This will later be replaced with MK's C backend API.
    setTimeout(() => {
      setResult({
        success: true,
        algorithm: "ML-KEM-768",
        operation: "key-exchange",
        executionTimeMs: 0.42,
        publicKeySize: 1184,
        ciphertextSize: 1088,
        sharedSecretMatch: true,
        keyGenerationTimeMs: 0.15,
        encapsulationTimeMs: 0.12,
        decapsulationTimeMs: 0.15,
      })

      setLoading(false)
    }, 1000)
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

      {result && (
        <div className="exchangeResult">
          <h3>
            Shared Secret Match{" "}
            {result.sharedSecretMatch ? "✓" : "✕"}
          </h3>

          <div className="metrics">
            <p>Public Key: {result.publicKeySize} bytes</p>
            <p>Ciphertext: {result.ciphertextSize} bytes</p>
            <p>Key Generation: {result.keyGenerationTimeMs} ms</p>
            <p>Encapsulation: {result.encapsulationTimeMs} ms</p>
            <p>Decapsulation: {result.decapsulationTimeMs} ms</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default KeyExchange