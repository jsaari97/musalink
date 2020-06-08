export type LinkType = 'track' | 'album' | 'artist'

export interface Response {
  cover: string;
  type: LinkType;
  artist: string;
  album: string | null;
  title: string | null;
  preview: string | null;
  urls: string[];
}