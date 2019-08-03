export interface DeezerTrack {
  id: number;
  readable: boolean;
  title: string;
  title_short: string;
  title_version: string;
  link: string;
  duration: number;
  rank: number;
  explicit_lyrics: boolean;
  explicit_content_lyrics: number;
  explicit_content_cover: number;
  preview: string;
  artist: DeezerArtist;
  album: DeezerAlbum;
  type: 'track';
  name: string;
}

interface DeezerArtist {
  id: string;
  name: string;
  link: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  tracklist: string;
  type: 'artist';
}

interface DeezerAlbum {
  id: string;
  title: string;
  cover: string;
  cover_small: string;
  cover_medium: string;
  cover_big: string;
  cover_xl: string;
  tracklist: string;
  type: 'album';
}

export interface DeezerSearchResponse<T> {
  total: number;
  data: T[];
}

export interface DeezerSearchAlbumData {
  id: string;
  title: string;
  link: string;
  cover: string;
  cover_small: string;
  cover_medium: string;
  cover_big: string;
  cover_xl: string;
  genre_id: number;
  nb_tracks: number;
  record_type: string;
  tracklist: string;
  explicit_lyrics: boolean;
  artist: DeezerArtist;
  type: 'album';
}

export interface DeezerSearchArtistData {
  id: string;
  name: string;
  link: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  nb_album: number;
  nb_fan: number;
  radio: boolean;
  tracklist: string;
  type: 'artist';
}

export type DeezerSearchTrackData = DeezerTrack;

export interface DeezerTrackExtended extends DeezerTrack {
  tracks?: {
    data: DeezerTrack[];
  };
}
