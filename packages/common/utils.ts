import { MusicService } from "./types";

export const determineService = (url: string): MusicService | null =>
  url.match(/open\.spotify/)
    ? "spotify"
    : url.match(/deezer\.com/)
    ? "deezer"
    : null;
