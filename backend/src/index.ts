import * as utils from './utils';
import * as spotify from './services/spotify';
import * as deezer from './services/deezer';
import { MusicService, MusaResponse } from './types';
import { Request, Response } from 'express';

export const handler = async (
  req: Request<any, any, any, { url: string }>,
  res: Response
) => {
  try {
    // tslint:disable:no-expression-statement
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');
    const { url } = req.query;
    const id = utils.extractId(url);
    const type = utils.determineLinkType(url);
    const service = utils.determineService(url);

    if (id && type && service) {
      const resolve = (result: MusaResponse) => {
        return res
          .status(200)
          .type('application/json')
          .send(JSON.stringify(result))
          .end();
      };

      if (service === MusicService.spotify) {
        const data = await spotify.fetch(id, type);
        const result = await deezer.getUrl(data, type);
        return resolve(result);
      } else if (service === MusicService.deezer) {
        const data = await deezer.fetch(id, type);
        const result = await spotify.getUrl(data, type);
        return resolve(result);
      }
    } else {
      return res.status(400).send().end();
    }
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.log(error);
    return res.status(400).send().end();
  }
};
