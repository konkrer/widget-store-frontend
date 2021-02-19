import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button, Form as bootForm, Col, Row, Accordion } from 'react-bootstrap';

// local imports
import { CustomerInfoSchema } from '../../../../utils/schemas/CustomerInfoSchema';

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
      validationSchema={CustomerInfoSchema}
      onSubmit={(values, { setSubmitting }) => {
        handleSubmitShipping(values);
        setSubmitting(false);
      }}
    >
      {formik => (
        <Form className="text-left ShippingAddressForm">
          <Accordion activeKey={`${shippingFormDisabled ? 0 : 1}`}>
            <Accordion.Collapse eventKey="1">
              <Col>
                <h6 className="font-weight-bold">Shipping Address</h6>
                <Row>
                  <Col sm={6}>
                    <bootForm.Group>
                      <bootForm.Label htmlFor="first_name_shipping">
                        First Name
                      </bootForm.Label>
                      <Field
                        type="text"
                        name="first_name"
                        id="first_name_shipping"
                        className={`form-control form-control-sm ${
                          formik.touched.first_name &&
                          formik.errors.first_name &&
                          'is-invalid'
                        }`}
                        disabled={shippingFormDisabled}
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
                      <bootForm.Label htmlFor="last_name_shipping">
                        Last Name
                      </bootForm.Label>
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
                    </bootForm.Group>
                  </Col>
                </Row>

                <bootForm.Group>
                  <bootForm.Label htmlFor="address_shipping">
                    Street Address
                  </bootForm.Label>
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
                </bootForm.Group>
                <Row>
                  <Col sm={6}>
                    <bootForm.Group>
                      <bootForm.Label htmlFor="address_line2_shipping">
                        Address Line Two
                      </bootForm.Label>
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
                    </bootForm.Group>
                  </Col>
                  <Col sm={6}>
                    <bootForm.Group>
                      <bootForm.Label htmlFor="city_shipping">
                        City
                      </bootForm.Label>
                      <Field
                        type="text"
                        name="city"
                        id="city_shipping"
                        className={`form-control form-control-sm ${
                          formik.touched.city &&
                          formik.errors.city &&
                          'is-invalid'
                        }`}
                        disabled={shippingFormDisabled}
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
                      <bootForm.Label htmlFor="state_shipping">
                        State
                      </bootForm.Label>
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
                    </bootForm.Group>
                  </Col>
                  <Col sm={6}>
                    <bootForm.Group>
                      <bootForm.Label htmlFor="postal_code_shipping">
                        Postal Code
                      </bootForm.Label>
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
                    </bootForm.Group>
                  </Col>
                </Row>

                <div className="text-right">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={formik.isSubmitting}
                    className="rounded-pill"
                  >
                    Update Shipping Address
                  </Button>
                  <Button
                    variant="secondary"
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
              </Col>
            </Accordion.Collapse>
          </Accordion>
        </Form>
      )}
    </Formik>
  );
};

export default ShippingForm;
