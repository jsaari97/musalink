import * as qs from "query-string";

export const parseQueryParams = (): string => {
  const query = qs.parse(window.location.search);

  if (query.q && typeof query.q === "string") {
    return query.q;
  }

  return "";
};

export const pruneQueryParams = (url: string): string => {
  // Check if string has query params
  const filtered = url.match(/.+?(\?)/);

  return filtered ? filtered[0].substr(0, filtered[0].length - 1) : url;
};
