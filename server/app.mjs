import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import postsRouter from "./router/posts.mjs";
import authRouter from "./router/auth.mjs";
import { config } from "./config.mjs";
import { connectDB } from "./db/database.mjs";

const app = express();

// For directory path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend files
app.use(express.static(path.join(__dirname, "../client/frontend")));

app.use(express.json());

// API routes
app.use("/post", postsRouter);
app.use("/auth", authRouter);

// 404 fallback
app.use((req, res) => {
  res.sendStatus(404);
});

// Start server after DB connection
connectDB()
  .then(() => {
    app.listen(config.host.port, () => {
      console.log(`Server running http://localhost:${config.host.port}`);
    });
  })
  .catch(console.error);
