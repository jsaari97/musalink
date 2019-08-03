import * as utils from './utils';
import * as spotify from './services/spotify';
import * as deezer from './services/deezer';
import { MusicService } from './types';
import { Request, Response } from 'express';

export const handler = async (req: Request, res: Response) => {
  try {
    // tslint:disable:no-expression-statement
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');
    const { url } = req.query;
    const id = utils.extractId(url);
    const type = utils.determineLinkType(url);
    const service = utils.determineService(url);

    if (id && type && service) {
      if (service === MusicService.spotify) {
        const data = await spotify.fetch(id, type);
        const result = await deezer.getUrl(data, type);
        return res
          .status(200)
          .type('application/json')
          .send(JSON.stringify(result))
          .end();
      } else if (service === MusicService.deezer) {
        const data = await deezer.fetch(id, type);
        const result = await spotify.getUrl(data, type);
        return res
          .status(200)
          .type('application/json')
          .send(JSON.stringify(result))
          .end();
      }
    } else {
      return res
        .status(400)
        .send()
        .end();
    }
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.log(e);
    return res
      .status(400)
      .send()
      .end();
  }
};
