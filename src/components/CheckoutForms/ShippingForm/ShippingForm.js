import { useRef, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Form as bootForm, Alert } from 'react-bootstrap';

// local imports
import AddressBox from '../AddressBox/AddressBox';
import { calculateTotal } from '../../../utils/moneyFuncts';
import { animateVariant } from '../../../utils/helpers';

/**
 * Shipping method form for checkout stage 2.
 *
 * Form automatically sets orderData.shipping data on shipping option click.
 *
 */
const ShippingForm = ({
  orderData,
  setOrderData,
  goTo1,
  goTo3,
  responseError,
  loadingShipping,
  shippingMethods,
  subtotal,
  setShippingCheckmark,
}) => {
  const animationTimer = useRef(null);

  // set shipping data on composite orderData when choice is made
  const setShippingData = shippingMethod => {
    // get details of shipping choice
    const details = shippingMethods[shippingMethod];

    // calculate new total with chosen shipping cost
    const total = calculateTotal(
      subtotal,
      orderData.customer.state,
      details.cost
    );
    // add to composite order data
    setOrderData(orderData => ({
      ...orderData,
      shipping: {
        shipping_method: shippingMethod,
        details,
      },
      total,
    }));
    // animate shipping button checkmark if shipping cost was just set
    if (!orderData.shipping)
      animationTimer.current = animateVariant(
        setShippingCheckmark,
        500,
        goTo3,
        [true]
      );
    else goTo3();
  };

  const handleSubmit = values => {
    setShippingData(values.shipping_method[0]);
  };

  // clear animation timer on dismount
  useEffect(() => {
    return () => {
      clearTimeout(animationTimer.current);
    };
  }, []);

  return (
    <>
      <AddressBox title={'Customer Info'} customer={orderData.customer} />
      <AddressBox
        title={'Shipping Address'}
        customer={orderData.shippingAddress || orderData.customer}
        isShippingAddress="true"
      />
      <h6 className="text-light shippingHeading">Choose a way to ship</h6>
      <div className="ShippingForm px-4 pt-2 pb-3 bg-light text-dark rounded border">
        {!loadingShipping && (
          <Formik
            initialValues={{
              shipping_method: [null],
            }}
            validationSchema={shippingValidation}
            onSubmit={(values, { setSubmitting }) => {
              handleSubmit(values);
              setSubmitting(false);
            }}
          >
            {formik => (
              <Form className="text-left">
                <bootForm.Group>
                  <bootForm.Label
                    htmlFor="shipping_method"
                    className="text-lg font-italic"
                  >
                    Shipping Options
                  </bootForm.Label>
                  <Field
                    as="select"
                    name="shipping_method"
                    id="shipping_method"
                    className={`form-control form-control-sm ${
                      formik.touched.shipping_method &&
                      formik.errors.shipping_method &&
                      'is-invalid'
                    }`}
                    multiple
                    size={Object.keys(shippingMethods).length}
                    onClick={e => {
                      if (e.target.tagName === 'OPTION')
                        setShippingData(e.target.value);
                    }}
                  >
                    {Object.entries(shippingMethods).map(([key, value]) => (
                      <option value={key} key={key}>
                        ${value.cost} --- {value.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="shipping_method"
                    component="div"
                    className="text-danger mt-1"
                  />
                </bootForm.Group>

                {responseError && (
                  <Alert variant="danger" aria-label={'error'}>
                    {responseError}
                  </Alert>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  disabled={formik.isSubmitting}
                  className="form-control rounded-pill"
                >
                  Next
                </Button>
              </Form>
            )}
          </Formik>
        )}
        <Button variant="secondary" size="sm" className="mt-3" onClick={goTo1}>
          Back to Edit Address
        </Button>
      </div>
    </>
  );
};

/** Validation logic */
const shippingValidation = Yup.object({
  shipping_method: Yup.array().compact().length(1, 'Choose shipping method'),
});

export default ShippingForm;
