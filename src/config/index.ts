import { config } from 'dotenv';

// tslint:disable:no-expression-statement
config();

export const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  BUCKET_NAME
} = process.env;
