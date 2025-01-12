import axios from "axios";
import { ParsedTranscript } from "@transcription/server";

const client = axios.create({ baseURL: process.env.REACT_APP_BACKEND_URL });

export const getTranscript = async (
  fileName: string,
): Promise<ParsedTranscript> => {
  const response = await client.get<ParsedTranscript>(
    `transcripts/${fileName}`,
  );
  return response.data;
};

export const getTranscriptFileNames = async () => {
  const response = await client.get<string[]>(`transcripts/`);
  return response.data;
};

class SSEConnection {
  private url!: string;
  private eventSource!: EventSource;

  constructor(url: string) {
    this.url = url;
    this.eventSource = new EventSource(this.url);
    this.eventSource.addEventListener("open", () =>
      console.log("event source open", { url: this.url }),
    );
    this.eventSource.addEventListener("error", (e) =>
      console.error("event source error", { url: this.url, e }),
    );
  }

  addMessageHandler = () =>
    // messageHandler: OnMpcChangedCallback<MessagePayload>,
    {
      this.eventSource.addEventListener(
        "message",
        (event: MessageEvent<string>) => {
          const data: unknown = JSON.parse(event.data);
          try {
            console.log("Data from SSE", { data });
          } catch (error) {
            console.error("Error handling SSE message", { error });
          }
        },
      );
    };

  close = () => {
    this.eventSource.close();
  };
}

export const PlayerStateSSEConnection = new SSEConnection(
  process.env.REACT_APP_BACKEND_URL + "/sse/stream",
);
