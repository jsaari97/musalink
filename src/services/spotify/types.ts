export interface SpotifyArtist {
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
  type: 'artist';
  uri: string;
}

export interface SpotifyCopyright {
  text: string;
  type: string;
}

export interface SpotifyTrack {
  artists: SpotifyArtist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
  preview_url: string;
  track_number: number;
  type: 'track';
  uri: string;
}

export interface SpotifyImage {
  height: number;
  url: string;
  width: number;
}

export interface SpotifyTrackResponse {
  album: {
    album_type: string;
    artists: SpotifyArtist[];
    available_markets: string[];
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    images: SpotifyImage[];
    name: string;
    release_date: string;
    release_date_precision: string;
    type: 'album';
    uri: string;
  };
  artists: SpotifyArtist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: {
    isrc: string;
  };
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: 'track';
  uri: string;
}

export interface SpotifyArtistResponse {
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string | null;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  popularity: number;
  type: 'artist';
  uri: string;
}

export interface SpotifyAlbumResponse {
  album_type: string;
  artists: SpotifyArtist[];
  available_markets: string[];
  copyrights: SpotifyCopyright[];
  external_ids: {
    upc: string;
  };
  external_urls: {
    spotify: string;
  };
  genres: string[];
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  popularity: number;
  release_date: string;
  release_date_precision: string;
  tracks: {
    href: string;
    items: SpotifyTrack[];
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
  };
  type: 'album';
  uri: number;
}

export interface SpotifySearchResponse<T> {
  tracks: {
    href: string;
    items: T[];
    limit: number;
    next: null;
    offset: number;
    previous: null;
    total: number;
  };
  artists: {
    href: string;
    items: T[];
    limit: number;
    next: null;
    offset: number;
    previous: null;
    total: number;
  };
  albums: {
    href: string;
    items: T[];
    limit: number;
    next: null;
    offset: number;
    previous: null;
    total: number;
  };
}
