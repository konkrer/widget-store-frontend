import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button, FormGroup, Label, Alert } from 'reactstrap';

// local imports
import { asyncAxiosRequest } from '../../../utils/asyncAxiosRequest';
import { getPathRoot } from '../../../utils/helpers';
import login from '../../../redux/actions/user/login';
import { LoginSchema } from '../../../utils/schemas/loginSchema';

const Login = ({ handleClose }) => {
  const user = useSelector(state => state.user.user);
  const [responseError, setResponseError] = useState(null);
  const [passwordShow, setPasswordShow] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();

  if (user) return <Redirect to={`${getPathRoot(location.pathname)}`} />;

  const handleSubmit = async values => {
    const resp = await asyncAxiosRequest('/login', 'post', values);
    if (resp.error) setResponseError(resp.error.response.data.message);
    else {
      const { user, token } = resp.data;
      dispatch(login(user, token));
    }
  };

  return (
    <div className="LoginForm">
      <h1>Login</h1>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmit(values);
          setSubmitting(false);
        }}
      >
        {formik => (
          <Form className="text-left">
            <FormGroup>
              <Label htmlFor="email1">Email</Label>
              <Field
                type="email"
                name="email"
                id="email1"
                autoComplete="email"
                className={`form-control form-control-sm ${
                  formik.touched.email && formik.errors.email && 'is-invalid'
                }`}
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-danger mt-1 text-sm"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="password1">Password</Label>
              <Button
                className=" ml-1 text-sm py-0 border-0 font-italic"
                color="primary"
                outline
                size="sm"
                onClick={() => setPasswordShow(state => !state)}
              >
                {passwordShow ? 'Hide' : 'Show'} Password
              </Button>
              <Field
                type={passwordShow ? 'text' : 'password'}
                name="password"
                id="password1"
                autoComplete="current-password"
                className={`form-control form-control-sm ${
                  formik.touched.password &&
                  formik.errors.password &&
                  'is-invalid'
                }`}
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-danger mt-1 text-sm"
              />
            </FormGroup>
            {responseError && <Alert color="danger">{responseError}</Alert>}
            <div className="mt-4">
              <Button
                type="submit"
                color="primary"
                disabled={formik.isSubmitting}
              >
                Login
              </Button>
              <Button color="secondary ml-2" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
