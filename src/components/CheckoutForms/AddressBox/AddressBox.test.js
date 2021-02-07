import { render } from '@testing-library/react';

// local
import AddressBox from './AddressBox';
import { TEST_DATA, populateTestDataHook } from '../../../helpers/testConfig';

beforeAll(() => {
  populateTestDataHook(TEST_DATA);
});

test('AddressBox renders', () => {
  render(
    <AddressBox
      title="Test Address"
      customer={TEST_DATA.CustomerInfoFormsValues}
    />
  );
});

test('AddressBox renders title and data', () => {
  const { getByText } = render(
    <AddressBox
      title="Home Address"
      customer={TEST_DATA.CustomerInfoFormsValues}
    />
  );

  const title = getByText(/Home Address/);
  expect(title).toBeInTheDocument();

  const firstName = getByText(/Test/);
  expect(firstName).toBeInTheDocument();
  const lastName = getByText(/User/);
  expect(lastName).toBeInTheDocument();
  const address = getByText(/123 Main St/);
  expect(address).toBeInTheDocument();
  const city = getByText(/Big City/);
  expect(city).toBeInTheDocument();
  const state = getByText(/TX/);
  expect(state).toBeInTheDocument();
  const postal_code = getByText(/39488/);
  expect(postal_code).toBeInTheDocument();

  const email = getByText(/foo@gmail.com/);
  expect(email).toBeInTheDocument();
  const phone_number = getByText(/\(555\) 555-5555/);
  expect(phone_number).toBeInTheDocument();
});

test('AddressBox does not render phone and email on shipping address', () => {
  const { getByText, queryByText } = render(
    <AddressBox
      title="Home Address"
      customer={TEST_DATA.CustomerInfoFormsValues}
      isShippingAddress={true}
    />
  );

  const title = getByText(/Home Address/);
  expect(title).toBeInTheDocument();

  const firstName = getByText(/Test/);
  expect(firstName).toBeInTheDocument();
  const lastName = getByText(/User/);
  expect(lastName).toBeInTheDocument();
  const address = getByText(/123 Main St/);
  expect(address).toBeInTheDocument();
  const city = getByText(/Big City/);
  expect(city).toBeInTheDocument();
  const state = getByText(/TX/);
  expect(state).toBeInTheDocument();
  const postal_code = getByText(/39488/);
  expect(postal_code).toBeInTheDocument();
  const phone_number = queryByText(/\(555\) 555-5555/);
  expect(phone_number).toBeInTheDocument();

  const email = queryByText(/foo@gmail.com/);
  expect(email).not.toBeInTheDocument();
});
