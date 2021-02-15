import { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3001';

const APIRequest = (url, method, data, params, baseURL = BASE_URL) => {
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const makeRequest = async () => {
      try {
        const resp = await axios({ url, method, data, params, baseURL });
        setResponse(resp.data);
        // console.log(resp.data);
      } catch (error) {
        setError(error);
      }
      setLoading(false);
    };
    makeRequest();
  }, [url, method, data, params, baseURL]);

  return { loading, error, response };
};

export default APIRequest;
