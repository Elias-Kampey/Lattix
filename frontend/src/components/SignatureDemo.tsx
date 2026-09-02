import { useState } from "react"
import type {
  SignatureResult,
  SignResponse,
} from "../types/crypto"
import {
  signMessage as requestSignMessage,
  verifySignature as requestVerifySignature,
  USE_MOCKS,
} from "../services/api"
import ErrorMessage from "./ErrorMessage"

function SignatureDemo() {
  const [message, setMessage] = useState(
    "CipherShift post-quantum signature test"
  )

  const [signatureData, setSignatureData] =
    useState<SignResponse | null>(null)

  const [signedMessage, setSignedMessage] = useState("")
  const [result, setResult] = useState<SignatureResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const signMessage = async () => {
    if (!message.trim()) return

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      if (USE_MOCKS) {
        await new Promise((resolve) =>
          setTimeout(resolve, 800)
        )

        setSignedMessage(message)

        setSignatureData({
          success: true,
          algorithm: "ML-DSA-65",
          signature: "mock-signature",
          publicKey: "mock-public-key",
          signatureSize: 3309,
          signingTimeMs: 0.28,
        })

        setResult({
          success: true,
          algorithm: "ML-DSA-65",
          operation: "sign",
          executionTimeMs: 0.28,
          signatureSize: 3309,
          signatureValid: true,
          signingTimeMs: 0.28,
          verificationTimeMs: 0,
        })
      } else {
        const data = await requestSignMessage(message)

        setSignedMessage(message)
        setSignatureData(data)

        setResult({
          success: data.success,
          algorithm: data.algorithm,
          operation: "sign",
          signatureSize: data.signatureSize,
          signatureValid: true,
          signingTimeMs: data.signingTimeMs,
          verificationTimeMs: 0,
        })
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Signing failed"
      )
    } finally {
      setLoading(false)
    }
  }

  const verifyMessage = async () => {
    if (!signedMessage || !signatureData) return

    setLoading(true)
    setError(null)

    try {
      if (USE_MOCKS) {
        const valid = message === signedMessage

        setResult({
          success: true,
          algorithm: "ML-DSA-65",
          operation: "verify",
          executionTimeMs: 0.23,
          signatureSize: signatureData.signatureSize,
          signatureValid: valid,
          signingTimeMs: signatureData.signingTimeMs,
          verificationTimeMs: 0.23,
        })
      } else {
        const data = await requestVerifySignature(
          message,
          signatureData.signature,
          signatureData.publicKey
        )

        setResult({
          success: data.success,
          algorithm: data.algorithm,
          operation: "verify",
          signatureSize: signatureData.signatureSize,
          signatureValid: data.signatureValid,
          signingTimeMs: signatureData.signingTimeMs,
          verificationTimeMs: data.verificationTimeMs,
        })
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Verification failed"
      )
    } finally {
      setLoading(false)
    }
  }

  const tamperMessage = () => {
    if (!signedMessage) return

    setMessage(`${signedMessage} [modified]`)
    setResult(null)
    setError(null)
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
        <button
          onClick={signMessage}
          disabled={loading}
        >
          {loading ? "Signing..." : "Sign Message"}
        </button>

        <button
          onClick={verifyMessage}
          disabled={!signedMessage || loading}
        >
          {loading ? "Verifying..." : "Verify Signature"}
        </button>

        <button
          onClick={tamperMessage}
          disabled={!signedMessage || loading}
        >
          Tamper Message
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

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