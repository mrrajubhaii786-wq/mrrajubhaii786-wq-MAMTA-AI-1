import express from "express";
import { runAICycle } from "../src/brain/TaskScheduler";

const app = express();
const PORT = process.env.QUEUE_SERVER_PORT || 5001;

app.use(express.json());

app.get("/run-ai", async (req, res) => {
  console.log("📡 [QueueServer] Received manual run-ai trigger request");
  const result = await runAICycle();
  res.json({
    status: "AI Cycle Triggered",
    result
  });
});

app.listen(PORT, () => {
  console.log(`🚀 [QueueServer] Running on port ${PORT}`);
});
