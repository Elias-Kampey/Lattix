import { useState } from "react"
import type { MlDsaResult } from "../types/crypto"
import { getMlDsa } from "../services/api"
import ErrorMessage from "./ErrorMessage"

function SignatureDemo() {
  const [result, setResult] = useState<MlDsaResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runSignatureTest = async () => {
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const data = await getMlDsa()
      setResult(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Signature test failed"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signatureDemo">
      <div className="exchangeHeader">
        <div>
          <h2>ML-DSA-65 Digital Signature</h2>
          <p>Post-quantum signing and tamper detection</p>
        </div>

        <button
          onClick={runSignatureTest}
          disabled={loading}
        >
          {loading ? "Running..." : "Run Signature Test"}
        </button>
      </div>

      <div className="encryptionFlow">
        <div className="partyCard">
          <span>STEP 1</span>
          <h3>Key Generation</h3>
          <p>Generate the ML-DSA signing key pair.</p>
        </div>

        <div className="flowArrow">
          <span>→</span>
        </div>

        <div className="partyCard">
          <span>STEP 2</span>
          <h3>Sign</h3>
          <p>Create a post-quantum digital signature.</p>
        </div>

        <div className="flowArrow">
          <span>→</span>
        </div>

        <div className="partyCard">
          <span>STEP 3</span>
          <h3>Verify</h3>
          <p>Verify both original and tampered data.</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {result && (
        <div className="exchangeResult">
          <h3>
            Signature Test {result.success ? "Passed ✓" : "Failed ✕"}
          </h3>

          <div className="metrics">
            <p>
              Original: {result.original_valid ? "Valid ✓" : "Invalid ✕"}
            </p>

            <p>
              Tampered: {!result.tampered_valid ? "Rejected ✓" : "Accepted ✕"}
            </p>

            <p>Signature: {result.signature_size} bytes</p>
            <p>Key Generation: {result.keygen_ms} ms</p>
            <p>Signing: {result.sign_ms} ms</p>
            <p>Verification: {result.verify_ms} ms</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default SignatureDemo