function BenchmarkDashboard() {
  return (
    <div className="benchmarkDashboard">
      <div className="exchangeHeader">
        <div>
          <h2>Cryptographic Comparison</h2>
          <p>Classical vs post-quantum key establishment</p>
        </div>

        <span className="benchmarkNotice">
          Size Comparison
        </span>
      </div>

      <div className="benchmarkComparison">
        <div className="benchmarkCard">
          <span>CLASSICAL</span>
          <h3>X25519</h3>

          <div className="benchmarkMetrics">
            <div>
              <small>Public Key</small>
              <strong>32 B</strong>
            </div>

            <div>
              <small>Key Exchange</small>
              <strong>Classical</strong>
            </div>
          </div>
        </div>

        <div className="benchmarkVs">VS</div>

        <div className="benchmarkCard">
          <span>POST-QUANTUM</span>
          <h3>ML-KEM-768</h3>

          <div className="benchmarkMetrics">
            <div>
              <small>Public Key</small>
              <strong>1184 B</strong>
            </div>

            <div>
              <small>Ciphertext</small>
              <strong>1088 B</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="benchmarkSummary">
        <h3>Migration Tradeoff</h3>

        <p>
          Post-quantum key establishment requires substantially
          larger cryptographic data than classical X25519. Runtime
          measurements shown elsewhere in CipherShift are produced
          directly by the C/OpenSSL backend.
        </p>
      </div>
    </div>
  )
}

export default BenchmarkDashboard