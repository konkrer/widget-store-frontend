import { useState, useEffect, useRef } from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

// local imports
import { asyncAxiosRequest } from '../../../utils/asyncAxiosRequest';
import ShippingAddressForm from './ShippingAddressForm/ShippingAddressForm';
import CustomerAddressForm from './CustomerAddressForm/CustomerAddressForm';
import AddressBox from '../AddressBox/AddressBox';
import PaymentOptions from '../../common/PaymentOptions/PaymentOptions';
import resetCart from '../../../redux/actions/cart/resetCart';

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
  const dispatch = useDispatch();
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
      const resp = await asyncAxiosRequest(
        `/users/${user.username}`,
        'get',
        null,
        {
          _token: token,
        }
      );
      if (resp.error) {
        setResponseError(resp.error.response.data.message);
        setLoadingUser(false);
      } else {
        // parse relevant data
        const userData = getCustomerDataFromResponse(resp);

        // update default form state to show user info on form
        FORM_DATA.current = {
          ...FORM_DATA.current,
          ...userData,
        };
        // determine if enough info to have a default shipping address
        defaultAddress.current = enoughInfoForDefaultAddress(userData);

        // hide form is sufficient shipping address data is available
        if (defaultAddress.current) {
          setFormDisabled(true);
        }

        setLoadingUser(false);
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
        setOrderData(
          /* istanbul ignore next */
          orderData => ({
            ...orderData,
            customer: null,
            shipping: false,
            shippingAddress: null,
            tax: null,
          })
        );
        // set new user token reference
        userOriginal.current = token;
        // reset variables
        defaultAddress.current = false;
        setFormDisabled(false);
        setShippingFormDisabled(true);

        // Forms Reset-
        // if user is not signed in set form data to default and clear cart.
        if (token === null) {
          FORM_DATA.current = DEFAULT_CUST_FORM_DATA;
          dispatch(resetCart());
        }
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
  }, [token, setOrderData, goTo1, dispatch]);

  // if user is logged in but user profile data has not loaded yet return loading...
  if (token && loadingUser) return <h1>Loading...</h1>;

  const editCustomerInfoButton = (
    <Button
      onClick={() => {
        setShippingFormDisabled(true);
        setFormDisabled(formDisabled => !formDisabled);
      }}
      variant="outline-primary"
      className="mb-4"
      size="sm"
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
      variant="outline-primary"
      className="mb-4"
      size="sm"
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
            Login / Signup
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
