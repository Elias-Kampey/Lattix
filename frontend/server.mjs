import express from "express"
import cors from "cors"
import { execFile } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const app = express()
const PORT = 3001

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const quantumShiftBinary =
  process.platform === "win32"
    ? path.resolve(
        __dirname,
        "../QuantumShift/backend/build/Debug/quantumshift.exe"
      )
    : path.resolve(
        __dirname,
        "../QuantumShift/backend/build/quantumshift"
      )

const allowedOperations = new Set([
  "ml-kem",
  "ml-dsa",
  "aes",
])

app.use(
  cors({
    origin: "http://localhost:5173",
  })
)

app.use(express.json())

app.get("/", (req, res) => {
  res.json({
    success: true,
    service: "CipherShift API",
    endpoints: [
      "/api/ml-kem",
      "/api/ml-dsa",
      "/api/aes",
    ],
  })
})

app.get("/api/:operation", (req, res) => {
  const operation = req.params.operation

  if (!allowedOperations.has(operation)) {
    return res.status(400).json({
      success: false,
      error: "Invalid operation",
    })
  }

  execFile(
    quantumShiftBinary,
    [operation],
    {
      timeout: 10000,
    },
    (error, stdout, stderr) => {
      if (error) {
        console.error("C backend error:")
        console.error(stderr || error.message)

        return res.status(500).json({
          success: false,
          error: "CipherShift backend operation failed",
        })
      }

      try {
        const result = JSON.parse(stdout.trim())
        return res.json(result)
      } catch {
        console.error("Failed to parse C backend JSON.")
        console.error(stdout)
        console.error(stderr)

        return res.status(500).json({
          success: false,
          error: "Invalid backend response",
        })
      }
    }
  )
})

app.listen(PORT, () => {
  console.log(
    `CipherShift API running at http://localhost:${PORT}`
  )
})