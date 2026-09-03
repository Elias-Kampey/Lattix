import express from "express"
import cors from "cors"
import { execFile } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"
import fs from "node:fs"

const app = express()
const PORT = 3001

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const lattixBinary =
  process.platform === "win32"
    ? path.resolve(
        __dirname,
        "../c/build/Debug/lattix.exe"
      )
    : path.resolve(
        __dirname,
        "../c/build/lattix"
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

app.get("/", (_req, res) => {
  res.json({
    success: true,
    service: "Lattix API",
    runtime: "C / OpenSSL",
    backendReady: fs.existsSync(lattixBinary),
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

  if (!fs.existsSync(lattixBinary)) {
    console.error(
      `Lattix binary not found: ${lattixBinary}`
    )

    return res.status(500).json({
      success: false,
      error: "Lattix C backend is not built",
    })
  }

  execFile(
    lattixBinary,
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
          error: "Lattix backend operation failed",
        })
      }

      try {
        const result = JSON.parse(stdout.trim())
        return res.json(result)
      } catch {
        console.error("Failed to parse C backend JSON.")
        console.error("stdout:")
        console.error(stdout)
        console.error("stderr:")
        console.error(stderr)

        return res.status(500).json({
          success: false,
          error: "Invalid backend response",
        })
      }
    }
  )
})

const server = app.listen(PORT, "127.0.0.1", () => {
  console.log(
    `Lattix API running at http://localhost:${PORT}`
  )

  console.log(
    `C backend: ${
      fs.existsSync(lattixBinary) ? "ready" : "not found"
    }`
  )

  console.log(`Binary: ${lattixBinary}`)
})

server.on("error", (error) => {
  console.error("API server error:")
  console.error(error)
})