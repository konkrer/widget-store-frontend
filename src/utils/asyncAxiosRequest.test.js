import { asyncAxiosRequest } from './asyncAxiosRequest';

// bad mock but creates an error ultimately
jest.mock('axios', () => ({
  axios: () => {
    throw new Error();
  },
}));

test('returns error in obj if error', async () => {
  const resp = await asyncAxiosRequest('/stuff', 'get');

  expect(resp).toHaveProperty('error');
});
