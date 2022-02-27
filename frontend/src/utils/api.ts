import * as qs from "query-string";
import { Response } from "musalink-common/types";

const { REACT_APP_API_URL: API_URL } = process.env;

export const fetchApi = async (url: string): Promise<Response> => {
  try {
    const params = qs.stringify({ url });

    const res = await fetch(`${API_URL}?${params}`);

    if (res.status !== 200) {
      return Promise.reject();
    }

    const data: Response = await res.json();

    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};
