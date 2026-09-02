import { useEffect, useState } from "react"
import type { BenchmarkResult } from "../types/crypto"
import {
  getBenchmarks,
  USE_MOCKS,
} from "../services/api"
import ErrorMessage from "./ErrorMessage"

const mockBenchmarkData: BenchmarkResult[] = [
  {
    algorithm: "X25519",
    category: "classical",
    publicKeySize: 32,
    ciphertextSize: 32,
    keyGenerationTimeMs: 0.04,
    operationTimeMs: 0.03,
  },
  {
    algorithm: "ML-KEM-768",
    category: "post-quantum",
    publicKeySize: 1184,
    ciphertextSize: 1088,
    keyGenerationTimeMs: 0.15,
    operationTimeMs: 0.12,
  },
]

function BenchmarkDashboard() {
  const [benchmarkData, setBenchmarkData] =
    useState<BenchmarkResult[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadBenchmarks = async () => {
      setLoading(true)
      setError(null)

      try {
        if (USE_MOCKS) {
          await new Promise((resolve) =>
            setTimeout(resolve, 500)
          )

          setBenchmarkData(mockBenchmarkData)
        } else {
          const data = await getBenchmarks()
          setBenchmarkData(data)
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load benchmarks"
        )
      } finally {
        setLoading(false)
      }
    }

    loadBenchmarks()
  }, [])

  if (loading) {
    return (
      <div className="benchmarkDashboard">
        <div className="exchangeHeader">
          <div>
            <h2>Cryptographic Benchmark</h2>
            <p>Loading benchmark results...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="benchmarkDashboard">
        <div className="exchangeHeader">
          <div>
            <h2>Cryptographic Benchmark</h2>
            <p>Classical vs post-quantum key establishment</p>
          </div>
        </div>

        <ErrorMessage message={error} />
      </div>
    )
  }

  const classical = benchmarkData.find(
    (item) => item.category === "classical"
  )

  const postQuantum = benchmarkData.find(
    (item) => item.category === "post-quantum"
  )

  if (!classical || !postQuantum) {
    return (
      <ErrorMessage message="Benchmark data is incomplete" />
    )
  }

  return (
    <div className="benchmarkDashboard">
      <div className="exchangeHeader">
        <div>
          <h2>Cryptographic Benchmark</h2>
          <p>Classical vs post-quantum key establishment</p>
        </div>

        {USE_MOCKS && (
          <span className="benchmarkNotice">
            Demo Data
          </span>
        )}
      </div>

      <div className="benchmarkComparison">
        <div className="benchmarkCard">
          <span>CLASSICAL</span>
          <h3>{classical.algorithm}</h3>

          <div className="benchmarkMetrics">
            <div>
              <small>Public Key</small>
              <strong>{classical.publicKeySize} B</strong>
            </div>

            <div>
              <small>Exchange Output</small>
              <strong>{classical.ciphertextSize} B</strong>
            </div>

            <div>
              <small>Key Generation</small>
              <strong>
                {classical.keyGenerationTimeMs} ms
              </strong>
            </div>

            <div>
              <small>Operation</small>
              <strong>
                {classical.operationTimeMs} ms
              </strong>
            </div>
          </div>
        </div>

        <div className="benchmarkVs">VS</div>

        <div className="benchmarkCard">
          <span>POST-QUANTUM</span>
          <h3>{postQuantum.algorithm}</h3>

          <div className="benchmarkMetrics">
            <div>
              <small>Public Key</small>
              <strong>{postQuantum.publicKeySize} B</strong>
            </div>

            <div>
              <small>Ciphertext</small>
              <strong>{postQuantum.ciphertextSize} B</strong>
            </div>

            <div>
              <small>Key Generation</small>
              <strong>
                {postQuantum.keyGenerationTimeMs} ms
              </strong>
            </div>

            <div>
              <small>Operation</small>
              <strong>
                {postQuantum.operationTimeMs} ms
              </strong>
            </div>
          </div>
        </div>
      </div>

      <div className="benchmarkSummary">
        <h3>Migration Tradeoff</h3>
        <p>
          ML-KEM-768 uses substantially larger public keys and
          exchange data than X25519. Real execution measurements
          will be supplied by the C backend.
        </p>
      </div>
    </div>
  )
}

export default BenchmarkDashboard