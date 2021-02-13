import * as Yup from 'yup';

/** Form validation logic */
export const CustomerInfoSchema = Yup.object({
  first_name: Yup.string()
    .max(55, 'Must be 55 characters or less')
    .required('Required'),
  last_name: Yup.string()
    .max(55, 'Must be 55 characters or less')
    .required('Required'),
  email: Yup.string().email('Invalid email address').required('Required'),
  address: Yup.string()
    .max(255, 'Must be 255 characters or less')
    .min(8, 'Must be 8 charaters or more')
    .required('Required'),
  address_line2: Yup.string().max(255, 'Must be 255 characters or less'),
  city: Yup.string()
    .max(55, 'Must be 255 characters or less')
    .min(2, 'Must be 2 charaters or more')
    .required('Required'),
  state: Yup.string()
    .max(55, 'Must be 255 characters or less')
    .min(2, 'Must be 2 charaters or more')
    .required('Required'),
  postal_code: Yup.string()
    .matches(/^\d{5}(-?\d{4})?$/, 'Must be 5 or 9 digit postal code')
    .required('Required'),
  phone_number: Yup.string().matches(
    /^(?:\+?(\d{1,3})[- .]?)?[(]?(\d{3})(?:(?:\) )?|[-. )]?)(\d{3})[-. ]?(\d{4})$/,
    'Must be valid phone number'
  ),
});
