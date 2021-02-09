/** API Helper functions. */

// local imports
import { asyncAPIRequest } from '../hooks/apiHook';

/**
 * updateUserProfile()
 *
 * Make patch request to update a user profile. Used by CustomerAddressForm
 * to allow updating customer address of signed in users.
 *
 * @param {object} values - form values
 * @param {object} user - user object
 * @param {token} token - user token
 * @param {function} setResponseError - state setter for error display
 * @param {any} defaultAddress - Falsey or obj with address components
 * @param {function} setFormDisabled - state setter to hide form after update
 *
 * returns: true if an error happened else undefined
 */

export const updateUserProfile = async (
  values,
  user,
  token,
  setResponseError,
  defaultAddress,
  setFormDisabled
) => {
  const userUpdateData = { ...values };
  // remove email to dis-allow email updating from here
  delete userUpdateData['email'];
  delete userUpdateData['user_id'];

  // remomve key/value pairs having a value of empty string from userUpdateData
  Object.entries(userUpdateData).forEach(([key, value]) => {
    if (value === '') delete userUpdateData[key];
  });

  try {
    // make patch request
    const resp = await asyncAPIRequest(
      `/users/${user.username}`,
      'patch',
      userUpdateData,
      { _token: token }
    );
    if (resp.error) {
      setResponseError(resp.error.response.data.message);
      return true;
    } else {
      defaultAddress.current = values;
      setFormDisabled(true);
    }
  } catch (error) {
    setResponseError(error.message);
    return true;
  }
};
