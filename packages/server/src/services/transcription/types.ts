export type RawTranscript = {
  fileName: string;
  text: string;
};
export type SpeakerId = string;
export type Speaker = {
  id: SpeakerId;
  name: string;
};
export type ParsedTranscriptItem = {
  speaker: Speaker;
};
export type ParsedTranscript = {
  fileName: string;
  transcript: Array<{
    speakerId: SpeakerId;
    text: string;
    /**
     * milliseconds since beginning of transcript
     */
    startOffset: number;
    /**
     * milliseconds since beginning of transcript
     */
    endOffset: number;
  }>;
  speakers: Record<SpeakerId, Speaker>;
};
