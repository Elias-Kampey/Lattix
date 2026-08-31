import { useState } from "react"
import KeyExchange from "../components/KeyExchange"

type Mode = "classical" | "post-quantum" | "hybrid"

type Operation =
  | "key-exchange"
  | "sign-verify"
  | "encrypt-decrypt"
  | "benchmark"

function Dashboard() {
  const [mode, setMode] = useState<Mode>("post-quantum")
  const [operation, setOperation] =
    useState<Operation>("key-exchange")

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
          <button
            className={mode === "classical" ? "activeButton" : ""}
            onClick={() => setMode("classical")}
          >
            Classical
          </button>

          <button
            className={mode === "post-quantum" ? "activeButton" : ""}
            onClick={() => setMode("post-quantum")}
          >
            Post-Quantum
          </button>

          <button
            className={mode === "hybrid" ? "activeButton" : ""}
            onClick={() => setMode("hybrid")}
          >
            Hybrid
          </button>
        </div>
      </section>

      <section className="panel">
        <h2>Operation</h2>

        <div className="buttonRow">
          <button
            className={
              operation === "key-exchange" ? "activeButton" : ""
            }
            onClick={() => setOperation("key-exchange")}
          >
            Key Exchange
          </button>

          <button
            className={
              operation === "sign-verify" ? "activeButton" : ""
            }
            onClick={() => setOperation("sign-verify")}
          >
            Sign & Verify
          </button>

          <button
            className={
              operation === "encrypt-decrypt" ? "activeButton" : ""
            }
            onClick={() => setOperation("encrypt-decrypt")}
          >
            Encrypt & Decrypt
          </button>

          <button
            className={
              operation === "benchmark" ? "activeButton" : ""
            }
            onClick={() => setOperation("benchmark")}
          >
            Benchmark
          </button>
        </div>
      </section>

      <section className="workspace">
        {mode === "post-quantum" &&
        operation === "key-exchange" ? (
          <KeyExchange />
        ) : (
          <div>
            <h2>Cryptographic Operation</h2>
            <p>
              {mode} / {operation} is not implemented yet.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}

export default Dashboard