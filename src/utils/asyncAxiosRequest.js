import axios from 'axios';

const BASE_URL = process.env.BACKEND_URL || 'http://localhost:3002';

export const asyncAxiosRequest = async (
  url,
  method,
  data,
  params,
  baseURL = BASE_URL
) => {
  try {
    const resp = await axios({ url, method, data, params, baseURL });
    // console.log(resp);
    return resp;
  } catch (error) {
    return { error };
  }
};
