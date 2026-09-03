import { useState } from "react"
import KeyExchange from "../components/KeyExchange"
import SignatureDemo from "../components/SignatureDemo"
import EncryptionDemo from "../components/EncryptionDemo"
import BenchmarkDashboard from "../components/BenchmarkDashboard"

type Mode = "classical" | "post-quantum" | "hybrid"

type Operation =
  | "key-exchange"
  | "sign-verify"
  | "encrypt-decrypt"
  | "benchmark"

const modeLabels: Record<Mode, string> = {
  classical: "Classical",
  "post-quantum": "Post-Quantum",
  hybrid: "Hybrid",
}

const operationLabels: Record<Operation, string> = {
  "key-exchange": "Key Exchange",
  "sign-verify": "Sign & Verify",
  "encrypt-decrypt": "Encrypt & Decrypt",
  benchmark: "Compare",
}

function Dashboard() {
  const [mode, setMode] = useState<Mode>("post-quantum")
  const [operation, setOperation] =
    useState<Operation>("key-exchange")

  const openLab = () => {
    document
      .getElementById("crypto-lab")
      ?.scrollIntoView({ behavior: "smooth" })
  }

  const selectOperation = (nextOperation: Operation) => {
    setOperation(nextOperation)

    requestAnimationFrame(() => {
      document
        .getElementById("crypto-lab")
        ?.scrollIntoView({ behavior: "smooth" })
    })
  }

  return (
    <main className="appShell">
      <nav className="nav">
        <div className="navInner">
          <button
            className="brand"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >
            <span className="brandMark">
              <span />
              <span />
            </span>

            <span>CipherShift</span>
          </button>

          <div className="navLinks">
            <button
              className={
                operation === "key-exchange" ? "activeNavLink" : ""
              }
              onClick={() => selectOperation("key-exchange")}
            >
              ML-KEM
            </button>

            <button
              className={
                operation === "sign-verify" ? "activeNavLink" : ""
              }
              onClick={() => selectOperation("sign-verify")}
            >
              ML-DSA
            </button>

            <button
              className={
                operation === "encrypt-decrypt" ? "activeNavLink" : ""
              }
              onClick={() => selectOperation("encrypt-decrypt")}
            >
              AES-GCM
            </button>

            <button
              className={
                operation === "benchmark" ? "activeNavLink" : ""
              }
              onClick={() => selectOperation("benchmark")}
            >
              Compare
            </button>
          </div>

          <div className="runtimeBadge">
            <span className="runtimeDot" />
            <span>C · OpenSSL</span>
          </div>
        </div>
      </nav>

      <section className="heroSection">
        <div className="heroContent">
          <div className="heroCopy">
            <div className="heroEyebrow">
              <span />
              POST-QUANTUM MIGRATION LAB
            </div>

            <h1>
              Cryptography built
              <span> for what comes next.</span>
            </h1>

            <p>
              Run quantum-resistant key exchange, digital signatures,
              authenticated encryption, and migration comparisons
              through a live C/OpenSSL cryptographic backend.
            </p>

            <div className="heroActions">
              <button className="primaryCta" onClick={openLab}>
                Open live lab
                <span>↗</span>
              </button>

              <div className="algorithmStack">
                <span>ML-KEM-768</span>
                <span>ML-DSA-65</span>
                <span>AES-256-GCM</span>
              </div>
            </div>
          </div>

          <div className="heroVisual">
            <div className="runtimePanel">
              <div className="runtimePanelHeader">
                <div>
                  <span className="runtimeStatusDot" />
                  <span>LIVE BACKEND</span>
                </div>

                <span>C · OpenSSL</span>
              </div>

              <div className="runtimePanelBody">
                <div className="runtimeIntro">
                  <span>POST-QUANTUM RUNTIME</span>

                  <h3>Cryptographic operations</h3>

                  <p>
                    Native operations executed locally through the
                    CipherShift C backend.
                  </p>
                </div>

                <div className="runtimeList">
                  <div className="runtimeRow">
                    <div>
                      <span className="runtimeIndex">01</span>

                      <div>
                        <strong>ML-KEM-768</strong>
                        <small>Key establishment</small>
                      </div>
                    </div>

                    <span className="readyState">
                      <span />
                      READY
                    </span>
                  </div>

                  <div className="runtimeRow">
                    <div>
                      <span className="runtimeIndex">02</span>

                      <div>
                        <strong>ML-DSA-65</strong>
                        <small>Digital signatures</small>
                      </div>
                    </div>

                    <span className="readyState">
                      <span />
                      READY
                    </span>
                  </div>

                  <div className="runtimeRow">
                    <div>
                      <span className="runtimeIndex">03</span>

                      <div>
                        <strong>AES-256-GCM</strong>
                        <small>Authenticated encryption</small>
                      </div>
                    </div>

                    <span className="readyState">
                      <span />
                      READY
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="trustStrip">
        <div>
          <span>01</span>

          <p>
            <strong>Real execution</strong>
            Live C backend results
          </p>
        </div>

        <div>
          <span>02</span>

          <p>
            <strong>Post-quantum</strong>
            ML-KEM & ML-DSA
          </p>
        </div>

        <div>
          <span>03</span>

          <p>
            <strong>Authenticated</strong>
            AES-256-GCM
          </p>
        </div>

        <div>
          <span>04</span>

          <p>
            <strong>Measured</strong>
            Runtime timing data
          </p>
        </div>
      </section>

      <section className="labSection" id="crypto-lab">
        <div className="sectionIntro">
          <div>
            <span className="sectionKicker">
              INTERACTIVE DEMO
            </span>

            <h2>Live cryptography lab.</h2>

            <p>
              Select a migration mode and run cryptographic
              operations directly against the local backend.
            </p>
          </div>

          <div className="backendState">
            <span className="backendPulse" />

            <div>
              <small>CRYPTOGRAPHIC RUNTIME</small>
              <strong>Ready</strong>
            </div>
          </div>
        </div>

        <div className="labShell">
          <div className="labChrome">
            <div className="windowDots">
              <span />
              <span />
              <span />
            </div>

            <div className="labPath">
              ciphershift
              <span>/</span>
              {modeLabels[mode].toLowerCase()}
              <span>/</span>
              {operationLabels[operation].toLowerCase()}
            </div>

            <div className="liveIndicator">
              <span />
              LIVE
            </div>
          </div>

          <div className="labControls">
            <div className="modeControl">
              <span className="controlLabel">MODE</span>

              <div className="segmentedControl">
                <button
                  className={
                    mode === "classical"
                      ? "selectedControl"
                      : ""
                  }
                  onClick={() => setMode("classical")}
                  aria-pressed={mode === "classical"}
                >
                  Classical
                </button>

                <button
                  className={
                    mode === "post-quantum"
                      ? "selectedControl"
                      : ""
                  }
                  onClick={() => setMode("post-quantum")}
                  aria-pressed={mode === "post-quantum"}
                >
                  Post-Quantum
                </button>

                <button
                  className={
                    mode === "hybrid"
                      ? "selectedControl"
                      : ""
                  }
                  onClick={() => setMode("hybrid")}
                  aria-pressed={mode === "hybrid"}
                >
                  Hybrid
                </button>
              </div>
            </div>

            <div className="operationTabs">
              <button
                className={
                  operation === "key-exchange"
                    ? "selectedOperation"
                    : ""
                }
                onClick={() => setOperation("key-exchange")}
              >
                <span>01</span>
                Key Exchange
              </button>

              <button
                className={
                  operation === "sign-verify"
                    ? "selectedOperation"
                    : ""
                }
                onClick={() => setOperation("sign-verify")}
              >
                <span>02</span>
                Sign & Verify
              </button>

              <button
                className={
                  operation === "encrypt-decrypt"
                    ? "selectedOperation"
                    : ""
                }
                onClick={() =>
                  setOperation("encrypt-decrypt")
                }
              >
                <span>03</span>
                Encrypt & Decrypt
              </button>

              <button
                className={
                  operation === "benchmark"
                    ? "selectedOperation"
                    : ""
                }
                onClick={() => setOperation("benchmark")}
              >
                <span>04</span>
                Compare
              </button>
            </div>
          </div>

          <div className="workspace">
            {operation === "benchmark" ? (
              <BenchmarkDashboard />
            ) : mode === "post-quantum" &&
              operation === "key-exchange" ? (
              <KeyExchange />
            ) : mode === "post-quantum" &&
              operation === "sign-verify" ? (
              <SignatureDemo />
            ) : mode === "post-quantum" &&
              operation === "encrypt-decrypt" ? (
              <EncryptionDemo />
            ) : (
              <div className="emptyState">
                <div className="emptyStateIcon">
                  <span />
                </div>

                <span className="emptyLabel">
                  {modeLabels[mode]} MODE
                </span>

                <h3>
                  This workflow is outside the current release.
                </h3>

                <p>
                  Executable cryptographic demos currently run
                  through CipherShift's Post-Quantum mode.
                  Migration comparison remains available across
                  modes.
                </p>

                <button
                  className="returnButton"
                  onClick={() => setMode("post-quantum")}
                >
                  Switch to Post-Quantum
                  <span>→</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="closingSection">
        <span>POST-QUANTUM READINESS</span>

        <h2>
          See the tradeoffs.
          <br />
          Run the cryptography.
        </h2>

        <p>
          CipherShift turns migration concepts into measurable
          cryptographic operations.
        </p>

        <button onClick={openLab}>
          Return to lab
          <span>↑</span>
        </button>
      </section>

      <footer className="footer">
        <div className="footerBrand">
          <span className="brandMark small">
            <span />
            <span />
          </span>

          CipherShift
        </div>

        <span>TypeScript interface</span>
        <span>C · OpenSSL cryptographic backend</span>
      </footer>
    </main>
  )
}

export default Dashboard