import { MusicService, LinkType } from '../types';

export const determineService = (url: string): MusicService | undefined =>
  url.match(/open\.spotify/)
    ? MusicService.spotify
    : url.match(/deezer\.com/)
    ? MusicService.deezer
    : undefined;

export const determineLinkType = (url: string): LinkType | undefined =>
  url.match(/\/track\//)
    ? LinkType.track
    : url.match(/\/album\//)
    ? LinkType.album
    : url.match(/\/artist\//)
    ? LinkType.artist
    : undefined;

export const extractId = (url: string): string | undefined => {
  const match = url.match(/(track|album|artist)\/(.*?)(\?|$)/);
  return match ? match[2] : undefined;
};
