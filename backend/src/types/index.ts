export enum MusicService {
  spotify = 'spotify',
  deezer = 'deezer'
}

export enum LinkType {
  track = 'track',
  album = 'album',
  artist = 'artist'
}

export interface SearchParameters {
  track?: string;
  album?: string;
  artist?: string;
}

export interface MusaResponse {
  cover: string;
  type: LinkType;
  artist: string;
  album: string | null;
  title: string | null;
  preview: string | null;
  urls: string[];
}
