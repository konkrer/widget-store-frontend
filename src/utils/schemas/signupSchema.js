import * as Yup from 'yup';

/** Form validation logic for signup form. */
export const SignupSchema = Yup.object({
  username: Yup.string()
    .min(2, 'Min length 2')
    .max(55, 'Max length 55')
    .required('Required'),
  email: Yup.string().email('Invalid email address').required('Required'),
  password: Yup.string()
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{3,55}$/,
      'Needs 1 uppercase letter, 1 lowercase letter, and 1 number'
    )
    .min(8, 'Minimum password length is 8')
    .required('Required'),
});
