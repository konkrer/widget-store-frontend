import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useHistory, Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LoginSchema } from '../../utils/schemas/loginSchema';
import { Modal, Button, Alert, Form as bootForm } from 'react-bootstrap';

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
    <Modal show={true} onHide={handleClose}>
      <Modal.Body>
        <div className="AdminLogin-form p-5">
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
                <bootForm.Group>
                  <bootForm.Label htmlFor="email">Email</bootForm.Label>
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
                </bootForm.Group>
                <bootForm.Group>
                  <bootForm.Label htmlFor="password">Password</bootForm.Label>
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
                </bootForm.Group>
                {responseError && (
                  <Alert variant="danger" aria-label={'error'}>
                    {responseError}
                  </Alert>
                )}
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  Login
                </Button>
                <Button variant="secondary ml-2" onClick={handleClose}>
                  Cancel
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AdminLogin;
