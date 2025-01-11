import axios from "axios";
import {
  API,
  SoundSystemUpdates,
  RequestHandler,
} from "@record-collection/server";
import { AlbumId } from "@record-collection/server/src/types/api-contract";

export type Album = {
  /**
   * <albumArtistId1,albumArtistId2>#<albumName>
   */
  id: string;
  /**
   * List of ids of artists who own the entire album. Not just featured on a given song - like the Alison Kraus / Robert Plant album
   */
  albumArtistIds: string[];
  albumName: string;
  tracksIds: string[];
};

export type Artist = {
  id: string;
  artistName: string;
  /**
   * ID suffix increases serially
   * <artistName>#0
   */
};

export type Track = {
  /**
   * <trackName>#>albumId>#<artistId1,artistId2>
   */
  id: string;
  trackName: string;
  albumId: string;
  artistIds: string[];
  duration: number;
};

// TODO: Make this generic so that we can type the currentState field
type OnMpcChangedCallback<MessagePayload> = (
  payload: MessagePayload,
) => void | Promise<void>;

const client = axios.create({ baseURL: process.env.REACT_APP_BACKEND_URL });

type ExtractResponseBody<T extends RequestHandler> = Exclude<
  Parameters<Parameters<T>[1]["send"]>[0],
  Error | undefined
>;

export async function getAlbums() {
  const response = await client.get("/library/albums");
  return response.data as ExtractResponseBody<API["library"]["albums"]["GET"]>;
}

export function playPlayback() {
  return client.post("/player/play");
}

export function pausePlayback() {
  return client.post("/player/pause");
}

export function nextTrack() {
  return client.post("/player/next");
}

export function previousTrack() {
  return client.post("/player/previous");
}

export function addAlbumToQueue(albumId: AlbumId) {
  return client.post(`/player/queue/album`, { albumId });
}

export async function getCurrentQueueState() {
  const response = await client.get("/player/queue");
  return response.data as ExtractResponseBody<API["player"]["getQueue"]["GET"]>;
}

export async function removeItemsFromQueue(songIdsToRemove: number[]) {
  await client.post("/player/queue/remove", {
    songIdsToRemove,
  });
}

class SSEConnection<MessagePayload> {
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

  addMessageHandler = (
    messageHandler: OnMpcChangedCallback<MessagePayload>,
  ) => {
    this.eventSource.addEventListener(
      "message",
      async (event: MessageEvent<string>) => {
        const data = JSON.parse(event.data) as MessagePayload;
        try {
          await messageHandler(data);
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

export const PlayerStateSSEConnection = new SSEConnection<SoundSystemUpdates>(
  process.env.REACT_APP_BACKEND_URL + "/sse/stream",
);
