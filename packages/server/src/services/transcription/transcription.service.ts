import { createReadStream } from "fs";
import { ParsedTranscript, RawTranscript } from "./types";
import path from "path";
import { readdir } from "fs/promises";

// Detects `[HH:MM:SS]` timestamps
const timestampRegex = /\[\d{2}:\d{2}:\d{2}\]/;

class _TranscriptionService {
  private TRANSCRIPT_DIR!: string;

  constructor({ transcriptDir }: { transcriptDir: string }) {
    this.TRANSCRIPT_DIR = transcriptDir;
  }

  async getParsedTranscript(fileName: string): Promise<ParsedTranscript> {
    const rawTranscript = await this.getRawTranscript(fileName);
    return this.mapRawToParsedTranscript(rawTranscript);
  }

  async getTranscriptFileNames() {
    const files = await readdir(this.TRANSCRIPT_DIR);
    return files;
  }

  async getRawTranscript(fileName: string): Promise<RawTranscript> {
    const transcriptReadStream = createReadStream(
      this.getTranscriptPath(fileName),
    );

    return new Promise<RawTranscript>((resolve, reject) => {
      let text = "";
      transcriptReadStream.on("data", (chunk: string) => {
        text += chunk;
      });
      transcriptReadStream.on("end", () => {
        resolve({
          fileName,
          text,
        });
      });
      transcriptReadStream.on("error", (err) => {
        reject(err);
      });
    });
  }

  mapRawToParsedTranscript(rawTranscript: RawTranscript): ParsedTranscript {
    const speakers: ParsedTranscript["speakers"] = {};
    const transcript: ParsedTranscript["transcript"] = [];

    // Looks like ['HH:MM:SS', 'Sarah: Hello World']
    const splitTimestampsAndLines = rawTranscript.text
      .split(/(\[\d{2}:\d{2}:\d{2}\])/)
      .reduce<Array<string>>((acc, curr) => {
        const trimmed = curr.trim();
        if (trimmed) {
          acc.push(trimmed);
        }
        return acc;
      }, []);

    for (let i = 0; i < splitTimestampsAndLines.length; i += 2) {
      const timestamp = splitTimestampsAndLines[i];
      const [speaker, text] = splitTimestampsAndLines[i + 1].split(/:(.*)/s);
      const logContext = { timestamp, speaker, text };
      if (timestamp.match(timestampRegex) === null) {
        console.error(
          "Thought we parsed a timestamp, but its invalid",
          logContext,
        );
        continue;
      }
      if (!speaker || speaker.length > 50) {
        console.error(
          "Speaker either missing or suspiciously long",
          logContext,
        );
        continue;
      }
      if (!text) {
        console.error(
          "Text missing. Will continue, but you should check to see that is expected",
          logContext,
        );
      }

      const speakerId = speaker;

      if (!speakers[speakerId]) {
        speakers[speakerId] = {
          id: speakerId,
          name: speaker,
        };
      }

      transcript.push({
        speakerId,
        text: text.trim(),
        startOffset: this.parseTimestampIntoMs(timestamp),
        endOffset: splitTimestampsAndLines[i + 2]
          ? this.parseTimestampIntoMs(splitTimestampsAndLines[i + 2])
          : -1,
      });
    }

    return {
      fileName: rawTranscript.fileName,
      speakers,
      transcript,
    };
  }

  getTranscriptPath(fileName: string): string {
    return path.join(this.TRANSCRIPT_DIR, fileName);
  }

  /**
   *
   * @param timestamp '[01:24:59]'
   * @returns (1 * 60 * 60 * 1000) + (24 * 60 * 1000) + (59 * 1000) = 5,099,000
   */
  parseTimestampIntoMs(timestamp: string): number {
    const timestampWithoutBrackets = timestamp.slice(1, -1);
    const timestampItems = timestampWithoutBrackets.split(":");
    const [h, m, s] = timestampItems.map((i) => {
      return parseInt(i);
    });
    console.log(timestamp, timestampWithoutBrackets, timestampItems, h, m, s);
    return h * 60 * 60 * 1000 + m * 60 * 1000 + s * 1000;
  }
}

export const transcriptionService = new _TranscriptionService({
  transcriptDir: path.join(process.cwd(), "transcriptions"),
});
