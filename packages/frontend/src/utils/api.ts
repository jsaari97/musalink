import { Response } from "musalink-common/types";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchApi = async (url: string): Promise<Response> => {
  try {
    const params = new URLSearchParams({ url });

    const res = await fetch(`${API_URL}?${params.toString()}`);

    if (res.status !== 200) {
      return Promise.reject();
    }

    const data: Response = await res.json();

    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};
