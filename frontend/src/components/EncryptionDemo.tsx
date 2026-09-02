import { useState } from "react"
import type { EncryptionResult } from "../types/crypto"
import {
  encryptMessage as requestEncryptMessage,
  USE_MOCKS,
} from "../services/api"
import ErrorMessage from "./ErrorMessage"

function EncryptionDemo() {
  const [message, setMessage] = useState(
    "CipherShift encryption test"
  )

  const [result, setResult] =
    useState<EncryptionResult | null>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runEncryption = async () => {
    if (!message.trim()) return

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      if (USE_MOCKS) {
        await new Promise((resolve) =>
          setTimeout(resolve, 800)
        )

        setResult({
          success: true,
          algorithm: "AES-256-GCM",
          operation: "encrypt-decrypt",
          ciphertext: "8f2a91c4...encrypted-data",
          decryptedMessage: message,
          messageMatch: true,
          encryptionTimeMs: 0.08,
          decryptionTimeMs: 0.06,
          ciphertextSize: 64,
        })
      } else {
        const data = await requestEncryptMessage(message)
        setResult(data)
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Encryption failed"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="encryptionDemo">
      <div className="exchangeHeader">
        <div>
          <h2>ML-KEM + AES-256-GCM</h2>
          <p>
            Post-quantum key establishment with authenticated
            encryption
          </p>
        </div>
      </div>

      <div className="signatureInput">
        <label htmlFor="encryption-message">
          Plaintext Message
        </label>

        <textarea
          id="encryption-message"
          value={message}
          onChange={(event) =>
            setMessage(event.target.value)
          }
          rows={5}
        />
      </div>

      <div className="signatureActions">
        <button
          onClick={runEncryption}
          disabled={loading}
        >
          {loading
            ? "Encrypting..."
            : "Encrypt & Decrypt"}
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      {result && (
        <>
          <div className="encryptionFlow">
            <div className="partyCard">
              <span>STEP 1</span>
              <h3>ML-KEM-768</h3>
              <p>
                Establish shared cryptographic material.
              </p>
            </div>

            <div className="flowArrow">
              <span>→</span>
            </div>

            <div className="partyCard">
              <span>STEP 2</span>
              <h3>AES-256-GCM</h3>
              <p>Encrypt the plaintext message.</p>
            </div>

            <div className="flowArrow">
              <span>→</span>
            </div>

            <div className="partyCard">
              <span>STEP 3</span>
              <h3>Decrypt</h3>
              <p>
                Recover and authenticate the message.
              </p>
            </div>
          </div>

          <div className="exchangeResult">
            <h3>
              Original Message Match{" "}
              {result.messageMatch ? "✓" : "✕"}
            </h3>

            <div className="metrics">
              <p>
                Ciphertext: {result.ciphertextSize} bytes
              </p>

              <p>
                Encryption: {result.encryptionTimeMs} ms
              </p>

              <p>
                Decryption: {result.decryptionTimeMs} ms
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default EncryptionDemo