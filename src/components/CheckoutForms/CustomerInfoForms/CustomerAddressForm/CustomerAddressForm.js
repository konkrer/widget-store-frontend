import { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {
  Button,
  Form as bootForm,
  Col,
  Row,
  Accordion,
  Alert,
} from 'react-bootstrap';

// local imports
import shedEmpty from '../../../../redux/actions/cart/shedEmpty';
import { CustomerInfoSchema } from '../../../../utils/schemas/CustomerInfoSchema';
import { calculateTax, calculateTotal } from '../../../../utils/moneyFuncts';
import { animateVariant } from '../../../../utils/helpers';
import { asyncAxiosRequest } from '../../../../utils/asyncAxiosRequest';

const CustomerAddressForm = ({
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
}) => {
  const numCartItems = useSelector(state => state.cart.numCartItems);
  const items = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
  const animationTimer = useRef(null);

  // Handle CustomerInfoForm submit.
  //
  // For logged in users: submitting this form will
  // update the user profile or proceed to shipping step
  // depending if the user has the customer info form
  // or the "next" button visible.
  //
  // For non-logged in users: this form will
  // proceed to shipping step.
  const handleSubmit = async values => {
    // shipping var - will be set false or null
    let shippingFalsey;

    // if user is signed in and "update customer info"
    // btn has been clicked from the CustomerInfoForm
    if (token && !formDisabled) {
      // data changing - shipping will be set false
      // this disabes the "shipping" button that goes to step 2.
      shippingFalsey = false;
      // update user profile
      const error = await updateUserProfile(
        values,
        user,
        token,
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
      if (numCartItems === 0) return;
      // if first step is complete can go directly to shipping with next btn
      // except if user is not signed in. Then next btn always updates orderData.
      if (orderData.shipping !== false && token) return goTo2();
      // change so address box updates w/ latest values
      FORM_DATA.current = values;
      // remove any zero quantity items
      dispatch(shedEmpty());
      // get shipping cost with submitted customer address
      getShippingCosts({
        items,
        shippingAddress: orderData.shippingAddress || values,
      });
      // enable the "shipping" button that goes to step 2.
      shippingFalsey = null;
      // animate checkmark then show shipping form
      animationTimer.current = animateVariant(
        setCustomerCheckmark,
        500,
        goTo2,
        [true]
      );
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

  useEffect(() => {
    return () => {
      clearTimeout(animationTimer.current);
    };
  }, []);

  // buttons to show at bottom of customer info form
  const customerSubmitButtons = formik => {
    // if user signed in and customer info form showing
    if (token && !formDisabled)
      // return "update" and "cancel" buttons
      return (
        <div className="text-right mt-1">
          <Button
            type="submit"
            variant="primary"
            disabled={formik.isSubmitting}
            className="rounded-pill mb-2"
          >
            Update Customer Info
          </Button>
          <Button
            variant="secondary"
            className="ml-2 mb-2"
            onClick={() => setFormDisabled(formDisabled => !formDisabled)}
          >
            Cancel
          </Button>
        </div>
      );
    // if shipping address form is closed show "next" button
    else if (shippingFormDisabled)
      return (
        <Button
          type="submit"
          variant="primary"
          disabled={formik.isSubmitting}
          className="form-control rounded-pill mt-0 mt-lg-4 mb-2"
        >
          Next
        </Button>
      );
  };

  return (
    <Formik
      initialValues={FORM_DATA.current}
      validationSchema={CustomerInfoSchema}
      onSubmit={(values, { setSubmitting }) => {
        handleSubmit(values);
        setSubmitting(false);
      }}
    >
      {formik => (
        <Form className="text-left CustomerInfoForm">
          <Accordion activeKey={`${formDisabled ? 0 : 1}`}>
            <Accordion.Collapse eventKey="1">
              <Col>
                <h6 className="font-weight-bold">Customer Info</h6>
                <Row>
                  <Col sm={6}>
                    <bootForm.Group>
                      <bootForm.Label htmlFor="first_name">
                        First Name
                      </bootForm.Label>
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
                    </bootForm.Group>
                  </Col>
                  <Col sm={6}>
                    <bootForm.Group>
                      <bootForm.Label htmlFor="last_name">
                        Last Name
                      </bootForm.Label>
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
                    </bootForm.Group>
                  </Col>
                </Row>
                <Row>
                  <Col sm={6}>
                    <bootForm.Group>
                      <bootForm.Label htmlFor="email">Email</bootForm.Label>
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
                        disabled={formDisabled || token}
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-danger mt-1 text-sm"
                      />
                    </bootForm.Group>
                  </Col>
                  <Col sm={6}>
                    <bootForm.Group>
                      <bootForm.Label htmlFor="phone_number">
                        Phone Number
                      </bootForm.Label>
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
                    </bootForm.Group>
                  </Col>
                </Row>

                <bootForm.Group>
                  <bootForm.Label htmlFor="address">
                    Street Address
                  </bootForm.Label>
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
                </bootForm.Group>
                <Row>
                  <Col sm={6}>
                    <bootForm.Group>
                      <bootForm.Label htmlFor="address_line2">
                        Address Line Two
                      </bootForm.Label>
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
                    </bootForm.Group>
                  </Col>
                  <Col sm={6}>
                    <bootForm.Group>
                      <bootForm.Label htmlFor="city">City</bootForm.Label>
                      <Field
                        type="text"
                        name="city"
                        id="city"
                        className={`form-control form-control-sm ${
                          formik.touched.city &&
                          formik.errors.city &&
                          'is-invalid'
                        }`}
                        disabled={formDisabled}
                        autoComplete="address-level2"
                      />
                      <ErrorMessage
                        name="city"
                        component="div"
                        className="text-danger mt-1 text-sm"
                      />
                    </bootForm.Group>
                  </Col>
                </Row>
                <Row>
                  <Col sm={6}>
                    <bootForm.Group>
                      <bootForm.Label htmlFor="state">State</bootForm.Label>
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
                    </bootForm.Group>
                  </Col>
                  <Col sm={6}>
                    <bootForm.Group>
                      <bootForm.Label htmlFor="postal_code">
                        Postal Code
                      </bootForm.Label>
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
                    </bootForm.Group>
                  </Col>
                </Row>
              </Col>
            </Accordion.Collapse>
            {responseError && <Alert variant="danger">{responseError}</Alert>}
            {customerSubmitButtons(formik)}
          </Accordion>
        </Form>
      )}
    </Formik>
  );
};

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

  // make patch request
  const resp = await asyncAxiosRequest(
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
};

export default CustomerAddressForm;
