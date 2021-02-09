import { useState, useEffect, useRef } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import * as Yup from 'yup';
import { Button } from 'reactstrap';

// local imports
import { asyncAPIRequest } from '../../../hooks/apiHook';
import ShippingAddressForm from './ShippingAddressForm';
import CustomerAddressForm from './CustomerAddressForm';
import AddressBox from '../AddressBox/AddressBox';
import PaymentOptions from '../../common/PaymentOptions/PaymentOptions';

/**
 * Customer info forms for checkout stage 1.
 *
 */
const CustomerInfoForms = ({
  orderData,
  setOrderData,
  goTo1,
  goTo2,
  getShippingCosts,
  subtotal,
  setCustomerCheckmark,
}) => {
  const { user, token } = useSelector(
    state => ({
      user: state.user.user,
      token: state.user.token,
    }),
    shallowEqual
  );
  // vars for API request to user profile
  const [responseError, setResponseError] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  // flag vars for customer and shipping forms display control, forms reset
  const [formDisabled, setFormDisabled] = useState(false);
  const [shippingFormDisabled, setShippingFormDisabled] = useState(true);
  const [formReset, setFormReset] = useState(false);

  // Note orginal user when page loads
  const userOriginal = useRef(token);
  const defaultAddress = useRef(false);
  const FORM_DATA = useRef(DEFAULT_CUST_FORM_DATA);

  // get user profile data if user is logged in
  useEffect(() => {
    async function getUser() {
      try {
        const resp = await asyncAPIRequest(
          `/users/${user.username}`,
          'get',
          null,
          {
            _token: token,
          }
        );
        if (resp.error) setResponseError(resp.error.response.data.message);
        else {
          // parse relevant data
          const userData = getCustomerDataFromResponse(resp);

          // update default form state to show user info on form
          FORM_DATA.current = {
            ...FORM_DATA.current,
            ...userData,
          };
          // determine if enough info to have a default shipping address
          defaultAddress.current = enoughInfoForDefaultAddress(userData);

          // disable form is sufficient shipping address data is available
          if (defaultAddress.current) setFormDisabled(true);

          setLoadingUser(false);
        }
      } catch (error) {
        console.log(error);
        setResponseError(error.message);
      }
    }
    // only attempt getting user info if user is logged in
    if (token) getUser();
  }, [user, token]);

  // if user logs in or out reset forms and data
  useEffect(() => {
    let reset;
    async function userChangeCheck() {
      if (token !== userOriginal.current) {
        // remove customer data and shipping data.
        setOrderData(orderData => ({
          ...orderData,
          customer: null,
          shipping: false,
          shippingAddress: null,
          tax: null,
        }));
        // set new user token reference
        userOriginal.current = token;
        // reset variables
        defaultAddress.current = false;
        setFormDisabled(false);
        setShippingFormDisabled(true);

        // Forms Reset-
        // Set form data to default if user is not signed in.
        if (token === null) FORM_DATA.current = DEFAULT_CUST_FORM_DATA;
        // reset forms by remounting forms.
        setFormReset(true);
        // reset = await new Promise(res => setTimeout(res, 100));
        // setFormReset(false);
        reset = setTimeout(() => {
          setFormReset(false);
        }, 100);

        goTo1();
      }
    }
    userChangeCheck();

    return () => {
      clearTimeout(reset);
    };
  }, [token, setOrderData, goTo1]);

  // if user is logged in but user profile data has not loaded yet return loading...
  if (token && loadingUser) return <h1>Loading...</h1>;

  const editCustomerInfoButton = (
    <Button
      onClick={() => {
        setShippingFormDisabled(true);
        setFormDisabled(formDisabled => !formDisabled);
      }}
      color="primary"
      className="mb-4"
      size="sm"
      outline
    >
      Edit Customer Info
    </Button>
  );

  const editShipAddressButton = (
    <Button
      onClick={() => {
        setFormDisabled(true);
        setShippingFormDisabled(shippigFormDisabled => !shippigFormDisabled);
      }}
      color="primary"
      className="mb-4"
      size="sm"
      outline
    >
      Edit Shipping Info
    </Button>
  );

  const customerAddressFormProps = {
    orderData,
    setOrderData,
    FORM_DATA,
    shippingFormDisabled,
    user,
    token,
    formDisabled,
    responseError,
    setResponseError,
    defaultAddress,
    setFormDisabled,
    goTo2,
    getShippingCosts,
    subtotal,
    setCustomerCheckmark,
  };

  return (
    <div className="CustomerInfoForms px-1 px-md-4 pt-2 pb-3 bg-light text-dark rounded border">
      {/* If user not logged in show login button */}
      {!user && (
        <div>
          <NavLink
            to="/checkout/login"
            className="btn btn-info btn-sm mb-3 mt-1"
          >
            Login / Create Account
          </NavLink>
          <span className="pl-3">
            <i>- or checkout as guest below</i>
          </span>
        </div>
      )}
      {/* Show address boxes if there was enough info for a default address*/}
      {defaultAddress.current && (
        <div className="d-flex justify-content-around">
          <AddressBox
            title={'Customer Info'}
            customer={FORM_DATA.current}
            button={editCustomerInfoButton}
            className="mx-0"
          />
          <AddressBox
            title={'Shipping Address'}
            customer={orderData.shippingAddress || FORM_DATA.current}
            isShippingAddress="true"
            button={editShipAddressButton}
            className="mx-0"
          />
        </div>
      )}
      {!formReset && (
        <>
          <CustomerAddressForm {...customerAddressFormProps} />
          <ShippingAddressForm
            setOrderData={setOrderData}
            FORM_DATA={FORM_DATA}
            setShippingFormDisabled={setShippingFormDisabled}
            shippingFormDisabled={shippingFormDisabled}
          />
        </>
      )}
      <PaymentOptions />
    </div>
  );
};

const DEFAULT_CUST_FORM_DATA = {
  first_name: '',
  last_name: '',
  email: '',
  address: '',
  address_line2: '',
  city: '',
  state: '',
  postal_code: '',
  phone_number: '',
};

/** Form validation logic */
export const customerInfoSchema = Yup.object({
  first_name: Yup.string()
    .max(55, 'Must be 55 characters or less')
    .required('Required'),
  last_name: Yup.string()
    .max(55, 'Must be 55 characters or less')
    .required('Required'),
  email: Yup.string().email('Invalid email address').required('Required'),
  address: Yup.string()
    .max(255, 'Must be 255 characters or less')
    .min(8, 'Must be 8 charaters or more')
    .required('Required'),
  address_line2: Yup.string().max(255, 'Must be 255 characters or less'),
  city: Yup.string()
    .max(55, 'Must be 255 characters or less')
    .min(2, 'Must be 2 charaters or more')
    .required('Required'),
  state: Yup.string()
    .max(55, 'Must be 255 characters or less')
    .min(2, 'Must be 2 charaters or more')
    .required('Required'),
  postal_code: Yup.string()
    .matches(/^\d{5}(-?\d{4})?$/, 'Must be 5 or 9 digit postal code')
    .required('Required'),
  phone_number: Yup.string().matches(
    /^(?:\+?(\d{1,3})[- .]?)?[(]?(\d{3})(?:(?:\) )?|[-. )]?)(\d{3})[-. ]?(\d{4})$/,
    'Must be valid phone number'
  ),
});

/**
 * Create a userData object with only the relevant properties to the
 * customer info form. Created from the user profile API response object.
 *
 * @param {Object} resp
 *
 * returns: Object
 */

const getCustomerDataFromResponse = resp => {
  const userData = { ...resp.data.user };
  // delete unneccasary properties for customer info form

  delete userData['orders'];
  delete userData['avatar_url'];
  delete userData['username'];
  // change null values to empty string '' value
  Object.entries(userData).forEach(([key, value]) => {
    if (value === null) userData[key] = '';
  });
  return userData;
};

/**
 * @param {Object} userData
 *
 * Determine if there is enough user data on file to have
 * a default shipping address to use.
 */

const enoughInfoForDefaultAddress = userData => {
  return Object.entries(userData).every(([key, value]) => {
    // ignore the keys optional to having a complete shipping address
    if (['address_line2', 'phone_number'].includes(key)) return true;
    // address data is required
    else return !!value;
  });
};

export default CustomerInfoForms;
