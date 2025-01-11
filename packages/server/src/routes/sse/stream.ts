import { Request, Response } from "express";

export function handleGetStream(req: Request, res: Response) {
  // Set headers for SSE connection
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.on("close", () => {
    // subscription.unsubscribe();
  });
}
