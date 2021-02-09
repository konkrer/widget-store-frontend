import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button, FormGroup, Label, Col, Row, Collapse } from 'reactstrap';

// local imports
import { customerInfoSchema } from './CustomerInfoForms';

const ShippingForm = ({
  setOrderData,
  FORM_DATA,
  setShippingFormDisabled,
  shippingFormDisabled,
}) => {
  // handle update shipping address
  const handleSubmitShipping = values => {
    setOrderData(orderData => ({
      ...orderData,
      shippingAddress: {
        ...values,
        phone_number:
          orderData.customer?.phone_number || FORM_DATA.current.phone_number,
      },
      shipping: false,
    }));
    setShippingFormDisabled(true);
  };

  return (
    <Formik
      initialValues={FORM_DATA.current}
      validationSchema={customerInfoSchema}
      onSubmit={(values, { setSubmitting }) => {
        handleSubmitShipping(values);
        setSubmitting(false);
      }}
    >
      {formik => (
        <Form className="text-left ShippingAddressForm">
          <Collapse isOpen={!shippingFormDisabled}>
            <h6 className="font-weight-bold">Shipping Address</h6>
            <Row form>
              <Col sm={6}>
                <FormGroup>
                  <Label htmlFor="first_name_shipping">First Name</Label>
                  <Field
                    type="text"
                    name="first_name"
                    id="first_name_shipping"
                    className={`form-control form-control-sm ${
                      formik.touched.first_name_shipping &&
                      formik.errors.first_name_shipping &&
                      'is-invalid'
                    }`}
                    disabled={shippingFormDisabled}
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
                  <Label htmlFor="last_name_shipping">Last Name</Label>
                  <Field
                    type="text"
                    name="last_name"
                    id="last_name_shipping"
                    className={`form-control form-control-sm ${
                      formik.touched.last_name &&
                      formik.errors.last_name &&
                      'is-invalid'
                    }`}
                    disabled={shippingFormDisabled}
                  />
                  <ErrorMessage
                    name="last_name_shipping"
                    component="div"
                    className="text-danger mt-1 text-sm"
                  />
                </FormGroup>
              </Col>
            </Row>

            <FormGroup>
              <Label htmlFor="address_shipping">Street Address</Label>
              <Field
                type="text"
                name="address"
                id="address_shipping"
                className={`form-control form-control-sm ${
                  formik.touched.address &&
                  formik.errors.address &&
                  'is-invalid'
                }`}
                disabled={shippingFormDisabled}
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
                  <Label htmlFor="address_line2_shipping">
                    Address Line Two
                  </Label>
                  <Field
                    type="text"
                    name="address_line2"
                    id="address_line2_shipping"
                    className={`form-control form-control-sm ${
                      formik.touched.address_line2 &&
                      formik.errors.address_line2 &&
                      'is-invalid'
                    }`}
                    disabled={shippingFormDisabled}
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
                  <Label htmlFor="city_shipping">City</Label>
                  <Field
                    type="text"
                    name="city"
                    id="city_shipping"
                    className={`form-control form-control-sm ${
                      formik.touched.city && formik.errors.city && 'is-invalid'
                    }`}
                    disabled={shippingFormDisabled}
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
                  <Label htmlFor="state_shipping">State</Label>
                  <Field
                    type="text"
                    name="state"
                    id="state_shipping"
                    className={`form-control form-control-sm ${
                      formik.touched.state &&
                      formik.errors.state &&
                      'is-invalid'
                    }`}
                    disabled={shippingFormDisabled}
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
                  <Label htmlFor="postal_code_shipping">Postal Code</Label>
                  <Field
                    type="text"
                    name="postal_code"
                    id="postal_code_shipping"
                    className={`form-control form-control-sm ${
                      formik.touched.postal_code &&
                      formik.errors.postal_code &&
                      'is-invalid'
                    }`}
                    disabled={shippingFormDisabled}
                  />
                  <ErrorMessage
                    name="postal_code"
                    component="div"
                    className="text-danger mt-1 text-sm"
                  />
                </FormGroup>
              </Col>
            </Row>

            <div className="text-right">
              <Button
                type="submit"
                color="primary"
                disabled={formik.isSubmitting}
                className="rounded-pill"
              >
                Update Shipping Address
              </Button>
              <Button
                color="secondary"
                className="ml-2"
                onClick={() =>
                  setShippingFormDisabled(
                    shippigFormDisabled => !shippigFormDisabled
                  )
                }
              >
                Cancel
              </Button>
            </div>
          </Collapse>
        </Form>
      )}
    </Formik>
  );
};

export default ShippingForm;
