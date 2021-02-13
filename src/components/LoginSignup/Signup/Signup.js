import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button, FormGroup, Label, Alert, FormText } from 'reactstrap';

// local imports
import { asyncAxiosRequest } from '../../../utils/asyncAxiosRequest';
import { getPathRoot } from '../../../utils/helpers';
import login from '../../../redux/actions/user/login';
import { SignupSchema } from '../../../utils/schemas/signupSchema';

const Signup = ({ handleClose }) => {
  const user = useSelector(state => state.user.user);
  const [responseError, setResponseError] = useState(null);
  const [passwordShow, setPasswordShow] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();

  if (user) return <Redirect to={`${getPathRoot(location.pathname)}`} />;

  const handleSubmit = async values => {
    const resp = await asyncAxiosRequest('/users', 'post', values);
    if (resp.error) {
      setResponseError(resp.error.response.data.message);
    } else {
      const { user, token } = resp.data;
      dispatch(login(user, token));
      return <Redirect to={`${getPathRoot(location.pathname)}`} />;
    }
  };

  return (
    <div className="SignupForm">
      <h1>Signup</h1>
      <Formik
        initialValues={{ username: '', email: '', password: '' }}
        validationSchema={SignupSchema}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmit(values);
          setSubmitting(false);
        }}
      >
        {formik => (
          <Form className="text-left">
            <FormGroup>
              <Label htmlFor="username">Username</Label>
              <Field
                type="text"
                name="username"
                id="username"
                autoComplete="username"
                className={`form-control form-control-sm ${
                  formik.touched.username &&
                  formik.errors.username &&
                  'is-invalid'
                }`}
              />
              <ErrorMessage
                name="username"
                component="div"
                className="text-danger mt-1 text-sm"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="email2">Email</Label>
              <Field
                type="email"
                name="email"
                id="email2"
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
              <Label htmlFor="password2">Password</Label>
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
                id="password2"
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
                className="text-danger text-sm"
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
            </FormGroup>
            {responseError && <Alert color="danger">{responseError}</Alert>}
            <div className="mt-4">
              <Button
                type="submit"
                color="primary"
                disabled={formik.isSubmitting}
              >
                Signup
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

export default Signup;
