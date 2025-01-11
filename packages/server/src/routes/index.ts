import { Router } from "express";
import { sseRouter } from "./sse";
import { transcriptionService } from "../services/transcription/transcription.service";

const router = Router();

router.use("/sse", sseRouter);

router.get("/transcription/:transcriptFileName", async (req, res) => {
  const transcription = await transcriptionService.getParsedTranscript(
    req.params.transcriptFileName,
  );
  res.send(transcription);
});

export default router;
