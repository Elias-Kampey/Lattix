function BenchmarkDashboard() {
  return (
    <div className="benchmarkDashboard">
      <div className="operationHeader">
        <div>
          <span className="operationEyebrow">
            MIGRATION COMPARISON
          </span>

          <h2>Classical vs post-quantum.</h2>

          <p>
            See how the data footprint changes when moving from
            classical X25519 key exchange to ML-KEM-768.
          </p>
        </div>

        <span className="benchmarkNotice">
          SIZE COMPARISON
        </span>
      </div>

      <div className="comparisonHero">
        <div className="comparisonSide classicalSide">
          <span className="comparisonType">
            CLASSICAL
          </span>

          <h3>X25519</h3>

          <div className="bigMetric">
            <strong>32</strong>
            <span>B</span>
          </div>

          <p>Public key</p>

          <div className="sizeBar classicalBar">
            <span />
          </div>

          <div className="comparisonDetails">
            <div>
              <small>Public Key</small>
              <strong>32 B</strong>
            </div>

            <div>
              <small>Shared Secret</small>
              <strong>32 B</strong>
            </div>
          </div>
        </div>

        <div className="comparisonCenter">
          <span>VS</span>

          <div className="migrationArrow">
            <span />
            <strong>→</strong>
          </div>

          <small>MIGRATION</small>
        </div>

        <div className="comparisonSide quantumSide">
          <span className="comparisonType">
            POST-QUANTUM
          </span>

          <h3>ML-KEM-768</h3>

          <div className="bigMetric">
            <strong>1184</strong>
            <span>B</span>
          </div>

          <p>Public key</p>

          <div className="sizeBar quantumBar">
            <span />
          </div>

          <div className="comparisonDetails">
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

      <div className="tradeoffPanel">
        <div className="tradeoffIndex">01</div>

        <div>
          <span>THE TRADEOFF</span>

          <h3>
            Larger data. Quantum-resistant security.
          </h3>

          <p>
            ML-KEM-768 requires a substantially larger
            cryptographic footprint than classical X25519.
            Runtime measurements elsewhere in Lattix are
            produced directly by the live C/OpenSSL backend.
          </p>
        </div>
      </div>
    </div>
  )
}

export default BenchmarkDashboard