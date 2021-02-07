import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {
  FormGroup,
  Row,
  Col,
  Container,
  Modal,
  ModalBody,
  Label,
  Button,
  Alert,
} from 'reactstrap';
import { useHistory, Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// local imports
import { asyncAPIRequest } from '../../hooks/apiHook';
import login from '../../redux/actions/user/login';

const AdminLogin = ({ adminUser, setAdminUser }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [responseError, setResponseError] = useState(null);

  if (adminUser) return <Redirect to="/admin/panel" />;

  // close modal function
  const handleClose = e => {
    return history.goBack();
  };

  const handleSubmit = async values => {
    try {
      const resp = await asyncAPIRequest('/admin/login', 'post', values);
      if (resp.error) setResponseError(resp.error.response.data.message);
      else {
        const { user, token } = resp.data;
        dispatch(login(user, token));
        setAdminUser(true);
      }
    } catch (error) {
      setResponseError('Authentication Error!');
      console.log(error);
    }
  };

  return (
    <Container className="AdminLogin">
      <Row>
        <Col sm="12" md={{ size: 6, offset: 3 }} className="rounded">
          <div>
            <Modal isOpen={true} toggle={handleClose} className="">
              <ModalBody>
                <div className="AdminLogin-form">
                  <h1>Admin Login</h1>
                  <Formik
                    initialValues={{ email: '', password: '' }}
                    validate={formValidation}
                    onSubmit={(values, { setSubmitting }) => {
                      handleSubmit(values);
                      setSubmitting(false);
                    }}
                  >
                    {({ isSubmitting }) => (
                      <Form className="text-left">
                        <FormGroup>
                          <Label htmlFor="email">Email</Label>
                          <Field
                            type="email"
                            name="email"
                            id="email"
                            autoComplete="email"
                            className="form-control"
                          />
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="text-danger mt-1"
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label htmlFor="password">Password</Label>
                          <Field
                            type="password"
                            name="password"
                            id="password"
                            autoComplete="current-password"
                            className="form-control"
                          />
                          <ErrorMessage
                            name="password"
                            component="div"
                            className="text-danger mt-1"
                          />
                        </FormGroup>
                        {responseError && (
                          <Alert color="danger">{responseError}</Alert>
                        )}
                        <Button
                          type="submit"
                          color="primary"
                          disabled={isSubmitting}
                        >
                          Login
                        </Button>
                        <Button color="secondary ml-2" onClick={handleClose}>
                          Cancel
                        </Button>
                      </Form>
                    )}
                  </Formik>
                </div>
              </ModalBody>
            </Modal>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

const formValidation = values => {
  const errors = {};
  if (!values.email) {
    errors.email = 'Email Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }
  if (!values.password) {
    errors.password = 'Password Required';
  } else if (
    !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,55}$/.test(
      values.password
    )
  ) {
    errors.password =
      'Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.';
  }
  return errors;
};

export default AdminLogin;
