import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button, FormGroup, Label, Alert, FormText } from 'reactstrap';

// local imports
import { asyncAPIRequest } from '../../../hooks/apiHook';
import { getPathRoot } from '../../../helpers/helpers';
import login from '../../../redux/actions/user/login';

const Signup = ({ handleClose }) => {
  const user = useSelector(state => state.user.user);
  const [responseError, setResponseError] = useState(null);
  const dispatch = useDispatch();
  const location = useLocation();

  if (user) return <Redirect to={`${getPathRoot(location.pathname)}`} />;

  const handleSubmit = async values => {
    try {
      const resp = await asyncAPIRequest('/users', 'post', values);
      if (resp.error) {
        setResponseError(resp.error.response.data.message);
      } else {
        const { user, token } = resp.data;
        dispatch(login(user, token));
        return <Redirect to={`${getPathRoot(location.pathname)}`} />;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="SignupForm">
      <h1>Signup</h1>
      <Formik
        initialValues={{ username: '', email: '', password: '' }}
        validate={signupValidation}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmit(values);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="text-left">
            <FormGroup>
              <Label htmlFor="username">Username</Label>
              <Field
                type="text"
                name="username"
                id="username"
                autoComplete="username"
                className="form-control"
              />
              <ErrorMessage
                name="username"
                component="div"
                className="text-danger mt-1"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="email2">Email</Label>
              <Field
                type="email"
                name="email"
                id="email2"
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
              <Label htmlFor="password2">Password</Label>
              <Field
                type="password"
                name="password"
                id="password2"
                autoComplete="current-password"
                className="form-control"
              />
              <FormText>
                <ul className="pl-3">
                  <li>Minimum length 8 characters</li>
                  <li>
                    Required 1 uppercase letter, 1 lowercase letter, and 1
                    number
                  </li>
                </ul>
              </FormText>
              <ErrorMessage
                name="password"
                component="div"
                className="text-danger mt-1"
              />
            </FormGroup>
            {responseError && <Alert color="danger">{responseError}</Alert>}
            <Button type="submit" color="primary" disabled={isSubmitting}>
              Signup
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

/** Validation logic */
const signupValidation = values => {
  const errors = {};
  if (!values.username) {
    errors.username = 'Username Required';
  } else if (!/^[^   ]{2,55}$/.test(values.username)) {
    errors.username = 'Username must be between 2 and 55 characters';
  }
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
      'Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 lowercase letter, and 1 number';
  }
  return errors;
};

export default Signup;
