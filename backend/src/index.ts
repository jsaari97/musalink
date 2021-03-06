import * as utils from './utils';
import * as spotify from './services/spotify';
import * as deezer from './services/deezer';
import { Response as MusaResponse } from 'common/lib/types';
import { determineService } from 'common/lib/utils';
import { Request, Response } from 'express';

export const handler = async (req: Request<any, any, any, { url: string }>, res: Response) => {
  try {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');

    const { url } = req.query;
    const id = utils.extractId(url);
    const type = utils.determineLinkType(url);
    const service = determineService(url);

    if (id && type && service) {
      const resolve = (result: MusaResponse) => {
        return res.status(200).type('application/json').send(JSON.stringify(result)).end();
      };

      if (service === 'spotify') {
        const data = await spotify.fetch(id, type);
        const result = await deezer.getUrl(data, type);
        return resolve(result);
      } else if (service === 'deezer') {
        const data = await deezer.fetch(id, type);
        const result = await spotify.getUrl(data, type);
        return resolve(result);
      }
    } else {
      return res.status(400).send().end();
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send().end();
  }
};
