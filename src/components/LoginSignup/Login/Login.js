import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button, FormGroup, Label, Alert } from 'reactstrap';

// local imports
import { asyncAPIRequest } from '../../../hooks/apiHook';
import { getPathRoot } from '../../../helpers/helpers';
import login from '../../../redux/actions/user/login';

const Login = ({ handleClose }) => {
  const user = useSelector(state => state.user.user);
  const [responseError, setResponseError] = useState(null);
  const dispatch = useDispatch();
  const location = useLocation();

  if (user) return <Redirect to={`${getPathRoot(location.pathname)}`} />;

  const handleSubmit = async values => {
    try {
      const resp = await asyncAPIRequest('/login', 'post', values);
      if (resp.error) setResponseError(resp.error.response.data.message);
      else {
        const { user, token } = resp.data;
        dispatch(login(user, token));
      }
    } catch (error) {
      setResponseError('Authentication Error!');
      console.log(error);
    }
  };

  return (
    <div className="LoginForm">
      <h1>Login</h1>
      <Formik
        initialValues={{ email: '', password: '' }}
        validate={values => {
          const errors = {};
          if (!values.email) {
            errors.email = 'Email Required';
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
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
        }}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmit(values);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="text-left">
            <FormGroup>
              <Label htmlFor="email1">Email</Label>
              <Field
                type="email"
                name="email"
                id="email1"
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
              <Label htmlFor="password1">Password</Label>
              <Field
                type="password"
                name="password"
                id="password1"
                autoComplete="current-password"
                className="form-control"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-danger mt-1"
              />
            </FormGroup>
            {responseError && <Alert color="danger">{responseError}</Alert>}
            <Button type="submit" color="primary" disabled={isSubmitting}>
              Login
            </Button>
            <Button color="secondary ml-2" onClick={handleClose}>
              Cancel
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
