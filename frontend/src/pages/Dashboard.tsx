function Dashboard() {
  return (
    <main className="dashboard">
      <header className="header">
        <div>
          <h1>CipherShift</h1>
          <p>Post-Quantum Cryptography Migration Lab</p>
        </div>

        <span className="status">System Ready</span>
      </header>

      <section className="panel">
        <h2>Mode</h2>

        <div className="buttonRow">
          <button>Classical</button>
          <button>Post-Quantum</button>
          <button>Hybrid</button>
        </div>
      </section>

      <section className="panel">
        <h2>Operation</h2>

        <div className="buttonRow">
          <button>Key Exchange</button>
          <button>Sign & Verify</button>
          <button>Encrypt & Decrypt</button>
          <button>Benchmark</button>
        </div>
      </section>

      <section className="workspace">
        <h2>Cryptographic Operation</h2>
        <p>Select an operation to begin.</p>
      </section>
    </main>
  )
}

export default Dashboard