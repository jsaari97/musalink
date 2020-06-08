import axios from 'axios';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from 'config';
import {
  SpotifyTrackResponse,
  SpotifySearchResponse,
  SpotifyArtistResponse,
  SpotifyAlbumResponse,
} from './types';
import { LinkType, SearchParameters, Response } from 'common/types';
import * as qs from 'query-string';
import { DeezerTrackExtended } from 'services/deezer/types';

const AUTH_URL = 'https://accounts.spotify.com/api/token';
const API_URL = 'https://api.spotify.com/v1/';

let authToken: string | null = null;
let timestamp: number = 0;

interface SpotifyAuthResponse {
  readonly access_token: string;
  readonly token_type: string;
  readonly expires_in: number;
  readonly scope: string;
}

export const authorize = async (): Promise<string | undefined> => {
  try {
    if (authToken && timestamp > Math.floor(new Date().getTime() / 1000)) {
      return Promise.resolve(authToken);
    }

    const token = `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`;
    const encodedToken = Buffer.from(token).toString('base64');

    const { data } = await axios.post<SpotifyAuthResponse>(
      AUTH_URL,
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${encodedToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    authToken = `Bearer ${data.access_token}`;

    const tempDate = new Date();
    tempDate.setHours(tempDate.getHours() + 1);
    timestamp = Math.floor(tempDate.getTime() / 1000);

    return Promise.resolve(authToken);
  } catch (e) {
    throw new Error('spotify authentication failed');
  }
};

export const fetch = async (id: string, type: LinkType): Promise<SpotifyTrackResponse> => {
  try {
    const token = await authorize();
    const { data } = await axios.get<SpotifyTrackResponse>(`${API_URL}${type}s/${id}`, {
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

export const search = async <T>(params: SearchParameters, type: LinkType): Promise<T> => {
  try {
    const token = await authorize();
    const { data: response } = await axios.get<SpotifySearchResponse<T>>(
      `${API_URL}search?${qs.stringify({
        q: buildSearchQuery(params),
        type,
        limit: 1,
      })}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

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

export const searchTrack = (params: SearchParameters) =>
  search<SpotifyTrackResponse>(params, 'track');

export const searchArtist = (params: SearchParameters) =>
  search<SpotifyArtistResponse>(params, 'artist');

export const searchAlbum = (params: SearchParameters) =>
  search<SpotifyAlbumResponse>(params, 'album');

export const getUrl = async (data: DeezerTrackExtended, type: LinkType): Promise<Response> => {
  if (type === 'track') {
    const res = await searchTrack({
      artist: data.artist.name,
      track: data.title,
      album: data.album.title,
    });
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
    });
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
    });
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
