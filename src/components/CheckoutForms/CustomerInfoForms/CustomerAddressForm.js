import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {
  Button,
  FormGroup,
  Label,
  Col,
  Row,
  Collapse,
  Alert,
} from 'reactstrap';

// local imports
import shedEmpty from '../../../redux/actions/cart/shedEmpty';
import { asyncAPIRequest } from '../../../hooks/apiHook';
import { customerInfoSchema } from './CustomerInfoForms';
import { calculateTax, calculateTotal } from '../../../helpers/monies';
import { animateVariant } from '../../../helpers/helpers';

const CustomerAddressForm = ({
  bundle: {
    orderData,
    setOrderData,
    FORM_DATA,
    shippingFormDisabled,
    user,
    formDisabled,
    responseError,
    setResponseError,
    defaultAddress,
    setFormDisabled,
    goTo2,
    getShippingCosts,
    subtotal,
    setCustomerCheckmark,
  },
}) => {
  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();

  // Handle CustomerInfoForm submit.
  //
  // For logged in users: submitting this form will
  // update the user profile or proceed to shipping step
  // depending if user has the customer info form visible
  // or the "next" button visible.
  //
  // For non-logged in users: this form will
  // proceed to shipping step.
  const handleSubmit = async values => {
    // shipping var - will be set false or null
    let shippingFalsey;

    // if user is signed in and "update customer info"
    // btn has been clicked from the CustomerInfoForm
    if (user.token && !formDisabled) {
      // data changing - shipping will be set false
      // disabling the "shipping" button that goes to step 2.
      shippingFalsey = false;
      // update user profile
      const error = await updateUserProfile(
        values,
        user,
        setResponseError,
        defaultAddress,
        setFormDisabled
      );
      if (error) return;
      setFormDisabled(true);
      // change so address box updates w/ latest values
      FORM_DATA.current = values;
    } else {
      // "next" btn has been clicked as the form submit
      if (cart.numCartItems === 0) return;
      // if first step is complete can go directly to shipping with next btn.
      if (orderData.shipping !== false) return goTo2();
      // change so address box updates w/ latest values
      FORM_DATA.current = values;
      // remove any zero quantity items
      dispatch(shedEmpty());
      // get shipping cost with submitted customer address
      getShippingCosts({
        cart,
        shippingAddress: orderData.shippingAddress || values,
      });
      // enable the "shipping" button that goes to step 2.
      shippingFalsey = null;
      // animate checkmark then show shipping form
      animateVariant(setCustomerCheckmark, 500, goTo2, [true]);
    }
    // update orderData
    const tax = calculateTax(subtotal, values.state);
    const total = calculateTotal(subtotal, values.state);
    // add to composite order data
    setOrderData(orderData => ({
      ...orderData,
      customer: { ...values },
      tax,
      total,
      shipping: shippingFalsey,
      shippingAddress: orderData.shippingAddress
        ? { ...orderData.shippingAddress, phone_number: values.phone_number }
        : null,
    }));
  };

  // buttons to show at bottom of customer info form
  const customerSubmitButtons = formik => {
    // if user signed in and customer info form showing
    if (user.token && !formDisabled)
      // return "update" and "cancel" buttons
      return (
        <div className="text-right">
          <Button
            type="submit"
            color="primary"
            disabled={formik.isSubmitting}
            className="rounded-pill"
          >
            Update Customer Info
          </Button>
          <Button
            color="secondary"
            className="ml-2"
            onClick={() => setFormDisabled(formDisabled => !formDisabled)}
          >
            Cancel
          </Button>
        </div>
      );
    // if customer info form closed and shipping address form closed
    else if (shippingFormDisabled)
      // return "Next" button
      return (
        <Button
          type="submit"
          color="primary"
          disabled={formik.isSubmitting}
          className="form-control rounded-pill mt-0 mt-lg-4"
        >
          Next
        </Button>
      );
  };

  return (
    <Formik
      initialValues={FORM_DATA.current}
      validationSchema={customerInfoSchema}
      onSubmit={(values, { setSubmitting }) => {
        handleSubmit(values);
        setSubmitting(false);
      }}
    >
      {formik => (
        <Form className="text-left CustomerInfoForm">
          <Collapse isOpen={!formDisabled}>
            <h6 className="text-info">Customer Info</h6>
            <Row form>
              <Col sm={6}>
                <FormGroup>
                  <Label htmlFor="first_name">First Name</Label>
                  <Field
                    type="text"
                    name="first_name"
                    id="first_name"
                    className={`form-control form-control-sm ${
                      formik.touched.first_name &&
                      formik.errors.first_name &&
                      'is-invalid'
                    }`}
                    disabled={formDisabled}
                    autoComplete="given-name"
                  />
                  <ErrorMessage
                    name="first_name"
                    component="div"
                    className="text-danger mt-1 text-sm"
                  />
                </FormGroup>
              </Col>
              <Col sm={6}>
                <FormGroup>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Field
                    type="text"
                    name="last_name"
                    id="last_name"
                    className={`form-control form-control-sm ${
                      formik.touched.last_name &&
                      formik.errors.last_name &&
                      'is-invalid'
                    }`}
                    disabled={formDisabled}
                    autoComplete="family-name"
                  />
                  <ErrorMessage
                    name="last_name"
                    component="div"
                    className="text-danger mt-1 text-sm"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col sm={6}>
                <FormGroup>
                  <Label htmlFor="email">Email</Label>
                  <Field
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="email"
                    className={`form-control form-control-sm ${
                      formik.touched.email &&
                      formik.errors.email &&
                      'is-invalid'
                    }`}
                    disabled={formDisabled || user.token}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-danger mt-1 text-sm"
                  />
                </FormGroup>
              </Col>
              <Col sm={6}>
                <FormGroup>
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Field
                    type="text"
                    name="phone_number"
                    id="phone_number"
                    autoComplete="tel-national"
                    className={`form-control form-control-sm ${
                      formik.touched.phone_number &&
                      formik.errors.phone_number &&
                      'is-invalid'
                    }`}
                    disabled={formDisabled}
                  />
                  <ErrorMessage
                    name="phone_number"
                    component="div"
                    className="text-danger mt-1 text-sm"
                  />
                </FormGroup>
              </Col>
            </Row>

            <FormGroup>
              <Label htmlFor="address">Street Address</Label>
              <Field
                type="text"
                name="address"
                id="address"
                autoComplete="address-line1"
                className={`form-control form-control-sm ${
                  formik.touched.address &&
                  formik.errors.address &&
                  'is-invalid'
                }`}
                disabled={formDisabled}
              />
              <ErrorMessage
                name="address"
                component="div"
                className="text-danger mt-1 text-sm"
              />
            </FormGroup>
            <Row form>
              <Col sm={6}>
                <FormGroup>
                  <Label htmlFor="address_line2">Address Line Two</Label>
                  <Field
                    type="text"
                    name="address_line2"
                    id="address_line2"
                    className={`form-control form-control-sm ${
                      formik.touched.address_line2 &&
                      formik.errors.address_line2 &&
                      'is-invalid'
                    }`}
                    disabled={formDisabled}
                    autoComplete="address-line2"
                  />
                  <ErrorMessage
                    name="address_line2"
                    component="div"
                    className="text-danger mt-1 text-sm"
                  />
                </FormGroup>
              </Col>
              <Col sm={6}>
                <FormGroup>
                  <Label htmlFor="city">City</Label>
                  <Field
                    type="text"
                    name="city"
                    id="city"
                    className={`form-control form-control-sm ${
                      formik.touched.city && formik.errors.city && 'is-invalid'
                    }`}
                    disabled={formDisabled}
                    autoComplete="address-level2"
                  />
                  <ErrorMessage
                    name="city"
                    component="div"
                    className="text-danger mt-1 text-sm"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col sm={6}>
                <FormGroup>
                  <Label htmlFor="state">State</Label>
                  <Field
                    type="text"
                    name="state"
                    id="state"
                    className={`form-control form-control-sm ${
                      formik.touched.state &&
                      formik.errors.state &&
                      'is-invalid'
                    }`}
                    disabled={formDisabled}
                    autoComplete="address-level1"
                  />
                  <ErrorMessage
                    name="state"
                    component="div"
                    className="text-danger mt-1 text-sm"
                  />
                </FormGroup>
              </Col>
              <Col sm={6}>
                <FormGroup>
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Field
                    type="text"
                    name="postal_code"
                    id="postal_code"
                    className={`form-control form-control-sm ${
                      formik.touched.postal_code &&
                      formik.errors.postal_code &&
                      'is-invalid'
                    }`}
                    disabled={formDisabled}
                    autoComplete="postal-code"
                  />
                  <ErrorMessage
                    name="postal_code"
                    component="div"
                    className="text-danger mt-1 text-sm"
                  />
                </FormGroup>
              </Col>
            </Row>
          </Collapse>
          {responseError && <Alert color="danger">{responseError}</Alert>}
          {customerSubmitButtons(formik)}
        </Form>
      )}
    </Formik>
  );
};

/**
 * Make patch request to update user profile.
 *
 * @param {object} values - form values
 * @param {object} user - user object
 * @param {function} setResponseError - set error for display
 */

const updateUserProfile = async (
  values,
  user,
  setResponseError,
  defaultAddress,
  setFormDisabled
) => {
  const userUpdateData = { ...values };
  // remove email to dis-allow email updating from here
  delete userUpdateData['email'];
  delete userUpdateData['user_id'];

  // remomve empty string values from object
  Object.entries(userUpdateData).forEach(([key, value]) => {
    if (value === '') delete userUpdateData[key];
  });
  try {
    // make patch request
    const resp = await asyncAPIRequest(
      `/users/${user.user.username}`,
      'patch',
      userUpdateData,
      { _token: user.token }
    );
    // if error updating show message and return true
    if (resp.error) {
      setResponseError(resp.error.response.data.message);
      return true;
    } else {
      // determine if enough info to have a default shipping address
      defaultAddress.current = values;

      // disable form if a sufficient shipping address data is available
      if (defaultAddress.current) setFormDisabled(true);
    }
  } catch (error) {
    setResponseError(error.message);
    return true;
  }
};

export default CustomerAddressForm;
