import { useState } from "react";

import {
  getMlKem,
  getMlDsa,
  getAes,
} from "../services/api";

import type {
  MlKemResult,
  MlDsaResult,
  AesResult,
} from "../types/crypto";

type Result =
  | MlKemResult
  | MlDsaResult
  | AesResult
  | null;

function Dashboard() {
  const [result, setResult] = useState<Result>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runOperation(
    operation: "ml-kem" | "ml-dsa" | "aes"
  ) {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      if (operation === "ml-kem") {
        const data = await getMlKem();
        setResult(data);
      }

      if (operation === "ml-dsa") {
        const data = await getMlDsa();
        setResult(data);
      }

      if (operation === "aes") {
        const data = await getAes();
        setResult(data);
      }
    } catch (err) {
      console.error(err);
      setError("Backend operation failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="dashboard">
      <header className="header">
        <div>
          <h1>CipherShift</h1>
          <p>Post-Quantum Cryptography Migration Lab</p>
        </div>

        <span className="status">
          System Ready
        </span>
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
          <button
            onClick={() => runOperation("ml-kem")}
            disabled={loading}
          >
            Key Exchange
          </button>

          <button
            onClick={() => runOperation("ml-dsa")}
            disabled={loading}
          >
            Sign & Verify
          </button>

          <button
            onClick={() => runOperation("aes")}
            disabled={loading}
          >
            Encrypt & Decrypt
          </button>

          <button disabled>
            Benchmark
          </button>
        </div>
      </section>

      <section className="workspace">
        <h2>Cryptographic Operation</h2>

        {loading && (
          <p>Running real C/OpenSSL operation...</p>
        )}

        {error && (
          <p>{error}</p>
        )}

        {!loading && !error && !result && (
          <p>Select an operation to begin.</p>
        )}

        {result && (
          <div>
            <h3>{result.algorithm}</h3>

            <pre>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </section>
    </main>
  );
}

export default Dashboard;