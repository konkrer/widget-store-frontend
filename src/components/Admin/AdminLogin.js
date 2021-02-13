import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useHistory, Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LoginSchema } from '../../utils/schemas/loginSchema';
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

// local imports
import { asyncAxiosRequest } from '../../utils/asyncAxiosRequest';
import login from '../../redux/actions/user/login';

/** Admin login modal */
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
    const resp = await asyncAxiosRequest('/admin/login', 'post', values);
    if (resp.error) setResponseError(resp.error.response.data.message);
    else {
      const { user, token } = resp.data;
      dispatch(login(user, token));
      setAdminUser(true);
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
                    validationSchema={LoginSchema}
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
                          <Alert color="danger" aria-label={'error'}>
                            {responseError}
                          </Alert>
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

export default AdminLogin;
