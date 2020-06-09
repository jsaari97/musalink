import { LinkType } from 'common/types';

export const determineLinkType = (url: string): LinkType | undefined =>
  url.match(/\/track\//)
    ? 'track'
    : url.match(/\/album\//)
    ? 'album'
    : url.match(/\/artist\//)
    ? 'artist'
    : undefined;

export const extractId = (url: string): string | undefined => {
  const match = url.match(/(track|album|artist)\/(.*?)(\?|$)/);
  return match ? match[2] : undefined;
};
