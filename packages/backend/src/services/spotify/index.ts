import {
  SpotifyTrackResponse,
  SpotifySearchResponse,
  SpotifyArtistResponse,
  SpotifyAlbumResponse,
} from './types';
import { LinkType, SearchParameters, Response } from 'musalink-common/types';
import { DeezerTrackExtended } from '../deezer/types';
import { BackendEnv } from '../../env';

const AUTH_URL = 'https://accounts.spotify.com/api/token';
const API_URL = 'https://api.spotify.com/v1/';

let authToken: string | null = null;
let timestamp: number = 0;
let authSource: string | null = null;

interface SpotifyAuthResponse {
  readonly access_token: string;
  readonly token_type: string;
  readonly expires_in: number;
  readonly scope: string;
}

const fetchJson = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const response = await globalThis.fetch(url, init);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return (await response.json()) as T;
};

export const authorize = async (env: BackendEnv): Promise<string> => {
  try {
    const now = Math.floor(Date.now() / 1000);
    const source = `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`;

    if (authToken && timestamp > now && authSource === source) {
      return Promise.resolve(authToken);
    }

    const encodedToken = btoa(source);

    const data = await fetchJson<SpotifyAuthResponse>(AUTH_URL, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encodedToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
      }),
    });

    authToken = `Bearer ${data.access_token}`;
    authSource = source;
    timestamp = now + data.expires_in - 30;

    return Promise.resolve(authToken);
  } catch (e) {
    throw new Error('spotify authentication failed');
  }
};

export const fetch = async (
  id: string,
  type: LinkType,
  env: BackendEnv
): Promise<SpotifyTrackResponse> => {
  try {
    const token = await authorize(env);
    const data = await fetchJson<SpotifyTrackResponse>(`${API_URL}${type}s/${id}`, {
      headers: {
        Authorization: token,
      },
    });

    return Promise.resolve(data);
  } catch (e) {
    throw new Error('Could not fetch track');
  }
};

export const buildSearchQuery = (params: SearchParameters): string =>
  Object.entries(params)
    .reduce((acc: string, [key, value]: [string, string]): string => `${acc} ${key}:"${value}"`, '')
    .trim();

export const search = async <T>(
  params: SearchParameters,
  type: LinkType,
  env: BackendEnv
): Promise<T> => {
  try {
    const token = await authorize(env);
    const searchParams = new URLSearchParams({
      q: buildSearchQuery(params),
      type,
      limit: '1',
    });

    const response = await fetchJson<SpotifySearchResponse<T>>(`${API_URL}search?${searchParams}`, {
      headers: {
        Authorization: token,
      },
    });

    return type === 'track'
      ? response.tracks.items[0]
      : type === 'artist'
      ? response.artists.items[0]
      : type === 'album'
      ? response.albums.items[0]
      : Promise.reject();
  } catch (e) {
    throw new Error('search was unsuccessful');
  }
};

export const searchTrack = (params: SearchParameters, env: BackendEnv) =>
  search<SpotifyTrackResponse>(params, 'track', env);

export const searchArtist = (params: SearchParameters, env: BackendEnv) =>
  search<SpotifyArtistResponse>(params, 'artist', env);

export const searchAlbum = (params: SearchParameters, env: BackendEnv) =>
  search<SpotifyAlbumResponse>(params, 'album', env);

export const getUrl = async (
  data: DeezerTrackExtended,
  type: LinkType,
  env: BackendEnv
): Promise<Response> => {
  if (type === 'track') {
    const res = await searchTrack({
      artist: data.artist.name,
      track: data.title,
      album: data.album.title,
    }, env);
    return {
      urls: [data.link, res.external_urls.spotify],
      artist: data.artist.name,
      cover: data.album.cover_medium,
      title: data.title,
      type,
      album: data.album.title,
      preview: data.preview,
    };
  } else if (type === 'artist') {
    const res = await searchArtist({
      artist: data.name,
    }, env);
    return {
      urls: [data.link, res.external_urls.spotify],
      artist: data.name,
      cover: res.images[1].url,
      title: null,
      type,
      album: null,
      preview: null,
    };
  } else if (type === 'album') {
    const res = await searchAlbum({
      artist: data.artist.name,
      album: data.title,
    }, env);
    return {
      urls: [data.link, res.external_urls.spotify],
      artist: data.artist.name,
      cover: res.images[1].url,
      title: null,
      type,
      album: data.title,
      preview: data.tracks ? data.tracks.data[0].preview : null,
    };
  } else {
    return Promise.reject();
  }
};
