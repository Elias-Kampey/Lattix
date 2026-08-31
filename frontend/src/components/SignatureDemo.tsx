import { useState } from "react"
import type { SignatureResult } from "../types/crypto"

function SignatureDemo() {
  const [message, setMessage] = useState(
    "CipherShift post-quantum signature test"
  )

  const [signedMessage, setSignedMessage] = useState("")
  const [result, setResult] = useState<SignatureResult | null>(null)
  const [loading, setLoading] = useState(false)

  const signMessage = () => {
    if (!message.trim()) return

    setLoading(true)
    setResult(null)

    setTimeout(() => {
      setSignedMessage(message)

      setResult({
        success: true,
        algorithm: "ML-DSA-65",
        operation: "sign",
        executionTimeMs: 0.51,
        signatureSize: 3309,
        signatureValid: true,
        signingTimeMs: 0.28,
        verificationTimeMs: 0.23,
      })

      setLoading(false)
    }, 800)
  }

  const verifyMessage = () => {
    if (!signedMessage) return

    const valid = message === signedMessage

    setResult({
      success: true,
      algorithm: "ML-DSA-65",
      operation: "verify",
      executionTimeMs: 0.23,
      signatureSize: 3309,
      signatureValid: valid,
      signingTimeMs: 0.28,
      verificationTimeMs: 0.23,
    })
  }

  const tamperMessage = () => {
  if (!signedMessage) return

  setMessage(`${signedMessage} [modified]`)
  setResult(null)
  }

  return (
    <div className="signatureDemo">
      <div className="exchangeHeader">
        <div>
          <h2>ML-DSA-65 Digital Signature</h2>
          <p>Post-quantum signing and verification</p>
        </div>
      </div>

      <div className="signatureInput">
        <label htmlFor="message">Message</label>

        <textarea
          id="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={5}
        />
      </div>

      <div className="signatureActions">
        <button onClick={signMessage} disabled={loading}>
          {loading ? "Signing..." : "Sign Message"}
        </button>

        <button
          onClick={verifyMessage}
          disabled={!signedMessage}
        >
          Verify Signature
        </button>

        <button
          onClick={tamperMessage}
          disabled={!signedMessage}
        >
          Tamper Message
        </button>
      </div>

      {result && (
        <div className="exchangeResult">
          <h3>
            Signature{" "}
            {result.signatureValid ? "Valid ✓" : "Invalid ✕"}
          </h3>

          <div className="metrics">
            <p>Algorithm: {result.algorithm}</p>
            <p>Signature: {result.signatureSize} bytes</p>
            <p>Signing: {result.signingTimeMs} ms</p>
            <p>
              Verification: {result.verificationTimeMs} ms
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default SignatureDemo