import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3001';

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
