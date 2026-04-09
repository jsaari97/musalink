export const parseQueryParams = (): string => {
  const query = new URLSearchParams(window.location.search);
  const q = query.get("q");

  if (q) {
    return q;
  }

  return "";
};

export const pruneQueryParams = (url: string): string => {
  const queryStart = url.indexOf("?");
  return queryStart >= 0 ? url.slice(0, queryStart) : url;
};
