import type { BenchmarkResult } from "../types/crypto"

const benchmarkData: BenchmarkResult[] = [
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
  const classical = benchmarkData[0]
  const postQuantum = benchmarkData[1]

  return (
    <div className="benchmarkDashboard">
      <div className="exchangeHeader">
        <div>
          <h2>Cryptographic Benchmark</h2>
          <p>Classical vs post-quantum key establishment</p>
        </div>

        <span className="benchmarkNotice">
          Demo Data
        </span>
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
              <strong>{classical.keyGenerationTimeMs} ms</strong>
            </div>

            <div>
              <small>Operation</small>
              <strong>{classical.operationTimeMs} ms</strong>
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
              <strong>{postQuantum.keyGenerationTimeMs} ms</strong>
            </div>

            <div>
              <small>Operation</small>
              <strong>{postQuantum.operationTimeMs} ms</strong>
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