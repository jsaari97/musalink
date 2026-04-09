import { SearchParameters, LinkType, Response } from 'musalink-common/types';
import {
  DeezerSearchResponse,
  DeezerSearchTrackData,
  DeezerSearchArtistData,
  DeezerSearchAlbumData,
  DeezerTrack,
  DeezerTrackExtended,
} from './types';
import { SpotifyTrackResponse } from '../spotify/types';

const API_URL = 'https://api.deezer.com/';

const fetchJson = async <T>(url: string): Promise<T> => {
  const response = await globalThis.fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return (await response.json()) as T;
};

export const fetch = async (id: string, type: LinkType): Promise<DeezerTrack> => {
  try {
    const data = await fetchJson<DeezerTrackExtended>(`${API_URL}${type}/${id}`);

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
    const searchParams = new URLSearchParams({
      q: buildSearchQuery(params),
      limit: '1',
    });

    const response = await fetchJson<DeezerSearchResponse<T>>(
      `${API_URL}search/${type}?${searchParams}`
    );

    return response.total ? response.data[0] : Promise.reject();
  } catch (e) {
    throw new Error('search was unsuccessful');
  }
};

export const searchTrack = (params: SearchParameters) =>
  search<DeezerSearchTrackData>(params, 'track');

export const searchArtist = (params: SearchParameters) =>
  search<DeezerSearchArtistData>(params, 'artist');

export const searchAlbum = (params: SearchParameters) =>
  search<DeezerSearchAlbumData>(params, 'album');

export const getUrl = async (data: SpotifyTrackResponse, type: LinkType): Promise<Response> => {
  if (type === 'artist') {
    const res = await searchArtist({
      artist: data.name,
    });
    return {
      urls: [res.link, data.external_urls.spotify],
      artist: res.name,
      cover: res.picture_medium,
      title: null,
      type,
      album: null,
      preview: null,
    };
  } else if (type === 'track') {
    const res = await searchTrack({
      artist: data.artists[0].name,
      album: data.album.name,
      track: data.name,
    });

    return {
      urls: [res.link, data.external_urls.spotify],
      artist: res.artist.name,
      cover: res.album.cover_medium,
      title: res.title,
      type,
      album: res.album.title,
      preview: res.preview,
    };
  } else if (type === 'album') {
    const res = await searchAlbum({
      artist: data.artists[0].name,
      album: data.name,
    });
    return {
      urls: [res.link, data.external_urls.spotify],
      artist: res.artist.name,
      cover: res.cover_medium,
      title: null,
      type,
      album: res.title,
      preview: null,
    };
  } else {
    return Promise.reject();
  }
};
