import * as Yup from 'yup';

/** Form validation logic for loging in. */
export const LoginSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Required'),
  password: Yup.string()
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{3,55}$/,
      'Needs 1 uppercase letter, 1 lowercase letter, and 1 number'
    )
    .min(8, 'Minimum password length is 8')
    .required('Required'),
});
