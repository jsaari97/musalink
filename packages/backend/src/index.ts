import * as utils from './utils';
import * as spotify from './services/spotify';
import * as deezer from './services/deezer';
import { Response as MusaResponse } from 'musalink-common/types';
import { determineService } from 'musalink-common/utils';
import { BackendEnv } from './env';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const emptyResponse = (status: number): Response =>
  new Response(null, {
    status,
    headers: CORS_HEADERS,
  });

const jsonResponse = (status: number, body: MusaResponse): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/json',
    },
  });

export default {
  async fetch(request: Request, env: BackendEnv): Promise<Response> {
    try {
      if (request.method === 'OPTIONS') {
        return emptyResponse(204);
      }

      if (request.method !== 'GET') {
        return emptyResponse(405);
      }

      const requestUrl = new URL(request.url);
      const url = requestUrl.searchParams.get('url');

      if (!url) {
        return emptyResponse(400);
      }

      const id = utils.extractId(url);
      const type = utils.determineLinkType(url);
      const service = determineService(url);

      if (!(id && type && service)) {
        return emptyResponse(400);
      }

      if (service === 'spotify') {
        const data = await spotify.fetch(id, type, env);
        const result = await deezer.getUrl(data, type);
        return jsonResponse(200, result);
      }

      if (service === 'deezer') {
        const data = await deezer.fetch(id, type);
        const result = await spotify.getUrl(data, type, env);
        return jsonResponse(200, result);
      }

      return emptyResponse(400);
    } catch (error) {
      console.error(error);
      return emptyResponse(400);
    }
  },
};
